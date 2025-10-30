"use client";
import { FormEvent, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(true);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: String(form.get('email') || ''),
          password: String(form.get('password') || ''),
        })
      });
      const storage = remember ? window.localStorage : window.sessionStorage;
      storage.setItem('token', data.access_token);
      const next = params?.get('next');
      router.push(next || '/');
    } catch (err: any) {
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-sm px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
      {params?.get('msg') && (
        <div className="p-2 bg-amber-100 text-amber-800 rounded mb-3 text-sm">{params.get('msg')}</div>
      )}
      <form onSubmit={submit} className="space-y-3">
        <input name="email" type="email" placeholder="Email" required className="w-full border rounded px-3 py-2" />
        <input name="password" type="password" placeholder="Contraseña" required className="w-full border rounded px-3 py-2" />
        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} />
            Recordar sesión
          </label>
          <a href="/auth/forgot" className="text-emerald-700 hover:underline">¿Olvidaste tu contraseña?</a>
        </div>
        <button disabled={loading} className="inline-flex items-center justify-center rounded-md bg-black text-white px-3 py-2 text-sm disabled:opacity-50">{loading ? 'Ingresando...' : 'Ingresar'}</button>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="text-sm text-zinc-600">¿No tienes cuenta? <a href="/auth/register" className="text-emerald-700 hover:underline">Regístrate</a></div>
        <div className="pt-2 border-t mt-4">
          <p className="text-sm text-zinc-600 mb-2">Inicio de sesión con redes sociales (próximamente)</p>
          <div className="flex gap-2">
            <button type="button" disabled className="px-3 py-2 border rounded text-sm">Google</button>
            <button type="button" disabled className="px-3 py-2 border rounded text-sm">Microsoft</button>
          </div>
        </div>
      </form>
    </section>
  );
}

