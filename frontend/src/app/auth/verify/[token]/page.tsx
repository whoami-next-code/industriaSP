"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function VerifyEmailTokenPage() {
  const params = useParams();
  const router = useRouter();
  const token = String(params?.token || "");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      setLoading(true);
      setMessage(null);
      setError(null);
      try {
        await apiFetch('/api/auth/verify', {
          method: 'POST',
          body: JSON.stringify({ token })
        });
        setMessage('Tu email ha sido verificado correctamente.');
        setTimeout(() => router.push('/perfil'), 1200);
      } catch (err: any) {
        setError('El enlace de verificación no es válido o ha expirado.');
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [token, router]);

  return (
    <section className="mx-auto max-w-sm px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-4">Verificar email</h1>
      {loading && <p>Verificando...</p>}
      {message && <div className="text-sm text-emerald-700">{message}</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
    </section>
  );
}

