"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Quote = {
  id: number;
  customerName: string;
  customerEmail: string;
  status: "PENDIENTE" | "EN_PROCESO" | "ENVIADA" | "CERRADA" | string;
  createdAt: string;
  items: { productId: number; quantity: number }[];
  notes?: string;
};

const STEPS = ["PENDIENTE","EN_PROCESO","ENVIADA","CERRADA"] as const;

export default function QuoteStatusPage() {
  const params = useParams();
  const id = Number(params?.id ?? 0);
  const [item, setItem] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/api/cotizaciones/${id}`)
      .then(r => r.json())
      .then(setItem)
      .catch((e) => setError(e?.message ?? 'Error cargando la cotización'))
      .finally(() => setLoading(false));
  }, [id]);

  const currentIndex = item ? STEPS.indexOf(item.status as any) : -1;

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/" className="text-sm underline">Volver</Link>
      <h1 className="text-2xl font-bold mb-2">Estado de cotización #{id}</h1>
      {error && <div className="p-2 bg-red-100 text-red-700 rounded mb-3">{error}</div>}
      {loading ? (
        <div>Cargando...</div>
      ) : item ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${i <= currentIndex ? 'bg-green-600 text-white' : 'bg-zinc-200 text-zinc-700'}`}>{i+1}</div>
                {i < STEPS.length - 1 && (
                  <div className={`w-16 h-0.5 ${i < currentIndex ? 'bg-green-600' : 'bg-zinc-200'}`}></div>
                )}
              </div>
            ))}
          </div>
          <ul className="text-sm text-zinc-700 flex gap-6">
            {STEPS.map((s, i) => (
              <li key={s} className={i === currentIndex ? 'font-semibold text-green-700' : ''}>{s}</li>
            ))}
          </ul>
          <div className="border rounded p-4">
            <div className="text-sm">Cliente: <strong>{item.customerName}</strong> ({item.customerEmail})</div>
            <div className="text-sm">Fecha: {new Date(item.createdAt).toLocaleString()}</div>
            {item.notes && <div className="text-sm mt-2">Notas: {item.notes}</div>}
            <div className="mt-3">
              <div className="text-sm font-medium mb-1">Items solicitados</div>
              <ul className="text-sm list-disc pl-5">
                {(item.items ?? []).map((it, idx) => (
                  <li key={idx}>Producto #{it.productId} — Cantidad: {it.quantity}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div>No se encontró la cotización.</div>
      )}
    </section>
  );
}
