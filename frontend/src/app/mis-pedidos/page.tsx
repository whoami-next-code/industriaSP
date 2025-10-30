"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import QuotesView from "@/components/QuotesView";

function computeTotal(o: { total?: any; items?: Array<{ price?: any; quantity?: any }> }) {
  const coerced = Number(o?.total);
  if (Number.isFinite(coerced)) return coerced;
  const sum = (o.items ?? []).reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);
  return sum;
}

function formatMoney(n: number) {
  try {
    return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } catch {
    return (Math.round(n * 100) / 100).toFixed(2);
  }
}

type OrderItem = { productId: number; name: string; price: number; quantity: number };
type Order = {
  id: number;
  userId?: number;
  items: OrderItem[];
  total: number;
  status: "PENDIENTE" | "PAGADO" | "ENVIADO" | "CANCELADO";
  shippingAddress?: string;
  createdAt: string | Date;
};

type QuoteItem = { productId: number; quantity: number };
type Quote = {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: QuoteItem[];
  status: "PENDIENTE" | "EN_PROCESO" | "ENVIADA" | "CERRADA" | "RECHAZADA";
  notes?: string;
  createdAt: string | Date;
};
type Product = { id: number; name: string; price: number };

function statusBadgeClass(status: Quote["status"]) {
  switch (status) {
    case 'PENDIENTE':
      return { bg: 'bg-amber-50', border: 'border-amber-200' };
    case 'EN_PROCESO':
      return { bg: 'bg-blue-50', border: 'border-blue-200' };
    case 'ENVIADA':
      return { bg: 'bg-emerald-50', border: 'border-emerald-200' };
    case 'CERRADA':
      return { bg: 'bg-zinc-100', border: 'border-zinc-200' };
    case 'RECHAZADA':
      return { bg: 'bg-red-50', border: 'border-red-200' };
    default:
      return { bg: 'bg-zinc-100', border: 'border-zinc-200' };
  }
}

function printQuote(q: Quote, products: Product[]) {
  const prodMap = new Map(products.map(p => [p.id, p]));
  const rows = (q.items ?? []).map(it => {
    const p = prodMap.get(it.productId);
    const name = p?.name ?? `Producto #${it.productId}`;
    const price = Number(p?.price) || 0;
    const qty = Number(it.quantity) || 0;
    const subtotal = price * qty;
    return { name, price, qty, subtotal };
  });
  const total = rows.reduce((acc, r) => acc + r.subtotal, 0);

  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Cotización #${q.id}</title>
      <style>
        body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, 'Helvetica Neue', sans-serif; padding: 24px; }
        h1 { margin: 0 0 8px; }
        .muted { color: #6b7280; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
        th { background: #f3f4f6; }
        .total { text-align: right; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>Cotización #${q.id}</h1>
      <div class="muted">Fecha: ${new Date(q.createdAt).toLocaleString()}</div>
      <div class="muted">Cliente: ${q.customerName} (${q.customerEmail})</div>
      <div class="muted">Estado: ${q.status}</div>
      ${q.notes ? `<div class="muted">Notas: ${q.notes}</div>` : ''}
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `<tr><td>${r.name}</td><td>${r.qty}</td><td>$${formatMoney(r.price)}</td><td>$${formatMoney(r.subtotal)}</td></tr>`).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="total">Total</td>
            <td>$${formatMoney(total)}</td>
          </tr>
        </tfoot>
      </table>
      <script>window.print()</script>
    </body>
  </html>`;

  const w = window.open('', '_blank');
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
}

export default function MisPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const hasToken = isClient ? !!localStorage.getItem("token") : false;
  // Nota: mostramos todas las cotizaciones en esta página, por lo que no necesitamos el email del perfil.

  // Mis Cotizaciones
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [qLoading, setQLoading] = useState<boolean>(false);
  const [qError, setQError] = useState<string | null>(null);
  // Vista automática: ordenar y paginar para rendimiento
  const [qSortBy, setQSortBy] = useState<"fecha"|"estado"|"total">("fecha");
  const [qSortDir, setQSortDir] = useState<"asc"|"desc">("desc");
  const [qPage, setQPage] = useState<number>(1);
  const PAGE_SIZE = 20;
  const [products, setProducts] = useState<Product[]>([]);
  const pricesById = useMemo(() => {
    const map: Record<number, number> = {};
    for (const p of products) map[p.id] = Number(p.price) || 0;
    return map;
  }, [products]);

  const quoteTotals = useMemo(() => {
    const out: Record<number, number> = {};
    for (const q of quotes) {
      const total = (q.items ?? []).reduce((acc, it) => acc + (pricesById[it.productId] || 0) * (Number(it.quantity) || 0), 0);
      out[q.id] = total;
    }
    return out;
  }, [quotes, pricesById]);

  const sortedQuotes = useMemo(() => {
    const arr = [...quotes];
    const order = ['PENDIENTE','EN_PROCESO','ENVIADA','CERRADA','RECHAZADA'];
    arr.sort((a,b) => {
      if (qSortBy === 'fecha') {
        const da = new Date(a.createdAt).getTime();
        const db = new Date(b.createdAt).getTime();
        return qSortDir === 'asc' ? da - db : db - da;
      } else if (qSortBy === 'estado') {
        const ia = order.indexOf(a.status);
        const ib = order.indexOf(b.status);
        return qSortDir === 'asc' ? ia - ib : ib - ia;
      } else {
        const ta = quoteTotals[a.id] || 0;
        const tb = quoteTotals[b.id] || 0;
        return qSortDir === 'asc' ? ta - tb : tb - ta;
      }
    });
    return arr;
  }, [quotes, qSortBy, qSortDir, quoteTotals]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(sortedQuotes.length / PAGE_SIZE)), [sortedQuotes]);
  const pageQuotes = useMemo(() => sortedQuotes.slice((qPage - 1) * PAGE_SIZE, qPage * PAGE_SIZE), [sortedQuotes, qPage]);
  useEffect(() => { setQPage(1); }, [qSortBy, qSortDir, quotes.length]);

  useEffect(() => {
    setIsClient(true);
    async function load() {
      if (!hasToken) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiFetch("/api/pedidos/mios", { method: "GET" });
        setOrders(data);
      } catch (e: any) {
        setError(e?.message ?? "Error cargando pedidos");
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasToken]);

  // Ya no cargamos el email del perfil: en Mis pedidos mostraremos todas las cotizaciones.

  // Cargar cotizaciones del usuario autenticado y productos para calcular totales
  useEffect(() => {
    async function loadQuotes() {
      if (!hasToken) return;
      setQLoading(true);
      setQError(null);
      try {
        const profile = await apiFetch('/api/auth/profile');
        const email = profile?.email?.toLowerCase();
        const [allQuotes, prods] = await Promise.all([
          apiFetch('/api/cotizaciones'),
          apiFetch('/api/productos'),
        ]);
        setProducts(Array.isArray(prods) ? prods : []);
        const mine = (Array.isArray(allQuotes) ? allQuotes : []).filter((q: Quote) => q.customerEmail?.toLowerCase() === email);
        setQuotes(mine);
      } catch (e: any) {
        setQError(e?.message ?? 'Error cargando cotizaciones');
      } finally {
        setQLoading(false);
      }
    }
    loadQuotes();
  }, [hasToken]);

  if (!isClient) {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold mb-6">Mis pedidos</h1>
        <p>Cargando...</p>
      </section>
    );
  }

  if (!hasToken) {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold mb-4">Mis pedidos</h1>
        <p className="mb-4">Necesitas iniciar sesión para ver tus pedidos.</p>
        <div className="flex gap-3">
          <Link href="/auth/login" className="px-4 py-2 bg-emerald-600 text-white rounded">Iniciar sesión</Link>
          <Link href="/auth/register" className="px-4 py-2 border rounded">Registrarme</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold mb-6">Mis pedidos</h1>
      <nav aria-label="Secciones" className="mb-6">
        <ul className="flex gap-3 text-sm">
          <li><a href="#pedidos" className="underline">Pedidos</a></li>
          <li><a href="#cotizaciones" className="underline">Cotizaciones</a></li>
        </ul>
      </nav>
      {loading && <p>Cargando pedidos...</p>}
      {error && (
        <div role="alert" className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">
          {error}
        </div>
      )}
      {!loading && !error && orders.length === 0 && (
        <div className="mb-6">
          <p className="mb-2">Aún no tienes pedidos.</p>
          <Link href="/catalogo" className="text-emerald-700 hover:underline">Ir al catálogo</Link>
        </div>
      )}
      <h2 id="pedidos" className="text-xl font-semibold mt-2 mb-3">Pedidos</h2>
      <ul className="space-y-4">
        {orders.map((o) => {
          const date = new Date(o.createdAt);
          return (
            <li key={o.id} className="border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm text-zinc-600">Pedido #{o.id}</p>
                  <p className="text-sm text-zinc-600">{date.toLocaleString()}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded bg-zinc-100 border">{o.status}</span>
              </div>
              <div className="mb-2">
                <p className="font-medium">Total: ${formatMoney(computeTotal(o))}</p>
                {o.shippingAddress && (
                  <p className="text-sm text-zinc-600">Envío: {o.shippingAddress}</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Productos</p>
                <ul className="text-sm list-disc pl-5">
                  {o.items.map((it, idx) => (
                    <li key={`${o.id}-${it.productId}-${idx}`}>{it.name} × {it.quantity} — ${formatMoney(Number(it.price) || 0)}</li>
                  ))}
              </ul>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Sección Mis Cotizaciones (componente compartido) */}
      <h2 id="cotizaciones" className="text-xl font-semibold mt-10 mb-3">Mis cotizaciones</h2>
      <QuotesView />
    </section>
  );
}
