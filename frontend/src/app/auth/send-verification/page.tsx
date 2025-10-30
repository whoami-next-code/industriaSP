"use client";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function SendVerificationPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await apiFetch('/api/auth/send-verification', { method: 'POST' });
      setMessage('Hemos enviado un correo de verificación (si tu email no estaba verificado).');
    } catch (err: any) {
      setError('No se pudo enviar la verificación. ¿Estás autenticado?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-sm px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-4">Verificación de email</h1>
      <p className="text-sm text-zinc-600 mb-3">Pulsa el botón para enviar el correo de verificación.</p>
      <button onClick={send} disabled={loading} className="inline-flex items-center justify-center rounded-md bg-black text-white px-3 py-2 text-sm disabled:opacity-50">
        {loading ? 'Enviando...' : 'Enviar verificación'}
      </button>
      {message && <div className="text-sm text-emerald-700 mt-3">{message}</div>}
      {error && <div className="text-sm text-red-600 mt-3">{error}</div>}
    </section>
  );
}

