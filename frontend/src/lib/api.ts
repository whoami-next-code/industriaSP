export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function getToken() {
  if (typeof window === 'undefined') return null;
  // Prioriza localStorage pero permite sesión temporal si el usuario eligió no recordar.
  return localStorage.getItem('token') ?? sessionStorage.getItem('token');
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Requiere autenticación previa; si no hay token, redirige al login con mensaje y parámetro next
export function requireAuthOrRedirect(nextUrl?: string) {
  const token = getToken();
  if (!token && typeof window !== 'undefined') {
    const msg = encodeURIComponent('Debes iniciar sesión para continuar');
    const next = encodeURIComponent(nextUrl ?? (window.location.pathname + window.location.search));
    window.location.assign(`/auth/login?msg=${msg}&next=${next}`);
    return null;
  }
  return token;
}

// Versión de apiFetch que falla temprano si no hay token y necesita autenticación
export async function apiFetchAuth(path: string, options: RequestInit = {}) {
  // No pasar rutas de API como "next"; debemos regresar al lugar actual del usuario.
  const token = requireAuthOrRedirect();
  if (!token) throw new Error('no_auth');
  return apiFetch(path, options);
}

