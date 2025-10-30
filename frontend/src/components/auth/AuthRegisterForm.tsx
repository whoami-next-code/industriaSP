"use client";
import { FormEvent, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

function validatePassword(p: string) {
  const rules = [/.{8,}/, /[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/];
  return rules.every(r => r.test(p));
}

export function AuthRegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [terms, setTerms] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') || '');
    const email = String(form.get('email') || '');
    const password = String(form.get('password') || '');
    const confirm = String(form.get('confirm') || '');
    if (!terms) {
      setLoading(false);
      setError('Debes aceptar los términos y condiciones');
      return;
    }
    if (password !== confirm) {
      setLoading(false);
      setError('Las contraseñas no coinciden');
      return;
    }
    if (!validatePassword(password)) {
      setLoading(false);
      setError('La contraseña no cumple los requisitos de seguridad');
      return;
    }
    try {
      const data = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName: name })
      });
      localStorage.setItem('token', data.access_token);
      router.push('/');
    } catch (err: any) {
      setError('No se pudo registrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input name="name" placeholder="Nombre completo" required className="w-full border rounded px-3 py-2" />
      <input name="email" type="email" placeholder="Email" required className="w-full border rounded px-3 py-2" />
      <input name="password" type="password" placeholder="Contraseña" required className="w-full border rounded px-3 py-2" value={pw} onChange={e=>setPw(e.target.value)} />
      <input name="confirm" type="password" placeholder="Confirmar contraseña" required className="w-full border rounded px-3 py-2" value={pw2} onChange={e=>setPw2(e.target.value)} />
      <div className="text-xs text-zinc-600">Requisitos: mínimo 8 caracteres, incluir mayúscula, minúscula, número y símbolo.</div>
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)} />
        Acepto los términos y condiciones
      </label>
      <button disabled={loading} className="inline-flex items-center justify-center rounded-md bg-black text-white px-3 py-2 text-sm disabled:opacity-50">{loading ? 'Creando...' : 'Crear cuenta'}</button>
      {error && <div className="text-sm text-red-600">{error}</div>}
    </form>
  );
}

