"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Profile = { userId: number; email: string; role: string };

export default function PerfilPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch('/api/auth/profile');
        setProfile(data);
      } catch (e: any) {
        setError('Debes iniciar sesión para ver tu perfil.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-4">Mi perfil</h1>
      {loading && <p>Cargando...</p>}
      {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
      {profile && (
        <div className="border rounded p-4 bg-white">
          <p><span className="font-medium">Email:</span> {profile.email}</p>
          <p><span className="font-medium">Rol:</span> {profile.role}</p>
          <div className="mt-4 flex gap-3">
            <a href="/auth/send-verification" className="px-3 py-2 border rounded text-sm">Verificar email</a>
            <a href="/auth/forgot" className="px-3 py-2 border rounded text-sm">Cambiar contraseña</a>
          </div>
        </div>
      )}
    </section>
  );
}

