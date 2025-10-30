import Link from "next/link";
import Image from "next/image";
import Testimonials from "@/components/home/Testimonials";
import { HomeAuthPanel } from "@/components/auth/HomeAuthPanel";
import { API_URL } from "@/lib/api";
import { homeContent } from "@/lib/homeContent";

export const metadata = {
  title: "Industrias SP – Equipos industriales para alimentación",
  description: "Hornos, cocinas y equipos industriales confiables y eficientes. Cotiza y descubre nuestro catálogo.",
  openGraph: {
    title: "Industrias SP",
    description: "Soluciones industriales para la industria alimentaria.",
    url: "/",
    type: "website",
  },
};

// Componente cliente incluido desde el Server Component

type Product = { id: number; name: string; description?: string; price: number; imageUrl?: string; category?: string };

async function getData(): Promise<{ featured: Product[]; categories: string[] }> {
  try {
    const res = await fetch(`${API_URL}/api/productos`, { next: { revalidate: 60 } });
    if (!res.ok) return { featured: [], categories: [] };
    const all: Product[] = await res.json();
    const featured = all.slice(0, 6);
    const categories = Array.from(new Set(all.map(p => p.category).filter(Boolean))) as string[];
    return { featured, categories };
  } catch {
    return { featured: [], categories: [] };
  }
}

export default async function Home() {
  const { featured, categories } = await getData();
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <a href="#principal" className="sr-only focus:not-sr-only focus:block focus:mb-4">Saltar al contenido principal</a>
      {/* Hero */}
      <header className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-zinc-50 to-white">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="h-full w-full opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-200 via-white to-white" />
        </div>
        <div className="relative p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{homeContent.hero.title}</h1>
          <p className="text-zinc-700 max-w-2xl">{homeContent.hero.subtitle}</p>
          <nav aria-label="Acciones principales" className="mt-5">
            <ul className="flex flex-col sm:flex-row gap-3">
              <li>
                <Link href="/catalogo" className="inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm">{homeContent.cta.viewCatalog}</Link>
              </li>
              <li>
                <Link href="/cotizacion" className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm">{homeContent.cta.requestQuote}</Link>
              </li>
              <li>
                <Link href="/mis-cotizaciones" className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm">Ver mis cotizaciones</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Acceso: muestra login/registro si no autenticado; si autenticado muestra resumen */}
      <HomeAuthPanel />

      {/* Beneficios */}
      <div className="grid gap-4 sm:grid-cols-3 mt-8" aria-label="Beneficios principales">
        {homeContent.benefits.map((b) => (
          <div key={b.title} className="border rounded p-4 bg-white">
            <div className="font-semibold mb-1">{b.title}</div>
            <div className="text-sm text-zinc-600">{b.description}</div>
          </div>
        ))}
      </div>

      {/* Enlaces rápidos a categorías */}
      {categories.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-3">Explora por categoría</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Link key={cat} href={`/catalogo?category=${encodeURIComponent(cat)}`} className="inline-flex items-center justify-center rounded-full border px-3 py-1 text-sm bg-white">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Productos destacados */}
      <h2 id="principal" className="text-xl font-semibold mt-10 mb-4">Productos destacados</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((p) => (
          <Link key={p.id} href={`/catalogo/${p.id}`} className="border rounded-lg p-4 bg-white flex flex-col hover:shadow-sm transition" aria-label={`Ver detalles de ${p.name}`}>
            <div className="relative aspect-video rounded bg-zinc-100 mb-3 overflow-hidden">
              {p.imageUrl ? (
                <Image src={p.imageUrl} alt={p.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
              ) : (
                <Image src="/next.svg" alt="Producto sin imagen" fill sizes="100vw" className="object-contain p-8" />
              )}
            </div>
            <h3 className="font-medium">{p.name}</h3>
            <p className="text-sm text-zinc-600 mb-2 line-clamp-2">{p.description}</p>
            <span className="mt-auto inline-flex items-center justify-center rounded-md bg-black text-white px-3 py-2 text-sm">Ver detalles</span>
          </Link>
        ))}
        {featured.length === 0 && (
          <div className="text-zinc-600">No hay productos disponibles por ahora.</div>
        )}
      </div>

      {/* Servicios */}
      <div className="grid gap-4 sm:grid-cols-3 mt-10" aria-label="Servicios">
        <Link href="/mantenimiento" className="border rounded p-4 bg-white hover:shadow-sm transition">
          <div className="font-semibold mb-1">Mantenimiento</div>
          <div className="text-sm text-zinc-600">Solicita mantenimiento preventivo o correctivo.</div>
        </Link>
        <Link href="/cotizacion" className="border rounded p-4 bg-white hover:shadow-sm transition">
          <div className="font-semibold mb-1">Cotizaciones</div>
          <div className="text-sm text-zinc-600">Cuéntanos tus necesidades y te cotizamos.</div>
        </Link>
        <Link href="/ventas" className="border rounded p-4 bg-white hover:shadow-sm transition">
          <div className="font-semibold mb-1">Mi Carrito</div>
          <div className="text-sm text-zinc-600">Añade productos, valida el pedido y procede al pago.</div>
        </Link>
      </div>

      {/* Testimonios (carga diferida) */}
      <Testimonials />
    </section>
  );
}
