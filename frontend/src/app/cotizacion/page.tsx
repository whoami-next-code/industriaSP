"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetchAuth, requireAuthOrRedirect, getToken } from "@/lib/api";

export default function Cotizacion() {
  const params = useSearchParams();
  const productIdParam = params?.get('productId');
  const productNameParam = params?.get('name');
  const preselectedId = productIdParam ? Number(productIdParam) : null;
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [lastEmail, setLastEmail] = useState<string>("");
  const [qty, setQty] = useState<number>(1);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setOk(null);
    // Verificar sesión antes de permitir enviar
    const token = requireAuthOrRedirect();
    if (!token) {
      setLoading(false);
      return;
    }
    const form = new FormData(e.currentTarget);
    const items = preselectedId ? [{ productId: preselectedId, quantity: qty }] : [{ productId: 1, quantity: 1 }];
    const payload = {
      customerName: String(form.get('name') || ''),
      customerEmail: String(form.get('email') || ''),
      customerPhone: String(form.get('phone') || ''),
      items,
      notes: String(form.get('message') || ''),
    };
    try {
      const data = await apiFetchAuth('/api/cotizaciones', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setOk('Solicitud enviada correctamente.');
      setCreatedId(data?.id ?? null);
      setLastEmail(payload.customerEmail);
      (e.currentTarget as HTMLFormElement).reset();
    } catch {
      setOk('No se pudo enviar la solicitud.');
    } finally {
      setLoading(false);
    }
  }

  // Redirigir automáticamente si no hay sesión al entrar en la página
  useEffect(() => {
    const token = getToken();
    if (!token) {
      // Redirige manteniendo los parámetros actuales (productId, name), para no perder el contexto.
      requireAuthOrRedirect();
    }
  }, []);

  const subtitle = useMemo(() => {
    if (preselectedId) {
      return `Estás cotizando: ${productNameParam ?? `Producto #${preselectedId}`}`;
    }
    return 'Completa el formulario para solicitar una cotización.';
  }, [preselectedId, productNameParam]);

  return (
    <section className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-1">Solicitar cotización</h1>
      <p className="text-sm text-zinc-600 mb-4">{subtitle}</p>
      <form onSubmit={submit} className="space-y-4">
        <input name="name" required placeholder="Nombre" className="w-full border rounded px-3 py-2" />
        <input name="email" required type="email" placeholder="Email" className="w-full border rounded px-3 py-2" />
        <input name="phone" placeholder="Teléfono" className="w-full border rounded px-3 py-2" />
        {preselectedId && (
          <div className="flex items-center gap-2">
            <label className="text-sm">Cantidad</label>
            <input type="number" min={1} value={qty} onChange={e=>setQty(Number(e.target.value) || 1)} className="w-24 border rounded px-3 py-2" />
          </div>
        )}
        <textarea name="message" placeholder="Detalle de la solicitud" className="w-full border rounded px-3 py-2" rows={5} />
        <button disabled={loading} className="inline-flex items-center justify-center rounded-md bg-black text-white px-3 py-2 text-sm disabled:opacity-50">{loading ? 'Enviando...' : 'Enviar'}</button>
        {ok && (
          <div className="text-sm text-zinc-700">
            {ok}
            {createdId && (
              <span className="ml-2">
                Ver estado: <a className="underline" href={`/cotizacion/${createdId}`}>#{createdId}</a>
              </span>
            )}
            {lastEmail && (
              <span className="ml-2">
                <a className="underline" href={`/mis-cotizaciones?email=${encodeURIComponent(lastEmail)}`}>Ver todas mis cotizaciones</a>
              </span>
            )}
          </div>
        )}
      </form>
    </section>
  );
}

