"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { API_URL } from "@/lib/api";

type Product = { id: number; name: string; description?: string; price: number; category?: string; imageUrl?: string; thumbnailUrl?: string };

export default function Catalogo() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<{ id?: number; name?: string }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    fetch(`${API_URL}/api/productos?${params.toString()}`)
      .then(r => r.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        // Filtrar entradas inválidas sin id ni nombre para evitar warnings de keys
        setProducts(arr.filter(p => typeof p.id === 'number' || typeof p.name === 'string'));
      })
      .catch(() => setProducts([]));
  }, [q, category]);

  useEffect(() => {
    fetch(`${API_URL}/api/categorias`)
      .then(r => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data.filter(c => typeof c.id === 'number' || typeof c.name === 'string'));
        }
      })
      .catch(() => setCategories([]));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-4">Catálogo</h1>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input className="border rounded px-3 py-2 w-full sm:w-80" placeholder="Buscar" value={q} onChange={e=>setQ(e.target.value)} />
        <select className="border rounded px-3 py-2 w-full sm:w-60" value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map((c, idx) => (
            <option key={(c.id ?? c.name ?? idx).toString()} value={c.name ?? ''}>{c.name ?? 'Sin nombre'}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, idx) => (
          <div key={(p.id ?? p.name ?? idx).toString()} className="border rounded-lg p-4 bg-white hover:shadow-sm transition">
            <Link href={`/catalogo/${p.id}`} className="block">
              <div className="aspect-video rounded bg-zinc-100 mb-3 overflow-hidden flex items-center justify-center">
                {(() => {
                  const img = p.thumbnailUrl || p.imageUrl;
                  if (!img) {
                    return (
                      <div className="text-zinc-400 text-center">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs">Sin imagen</span>
                      </div>
                    );
                  }
                  const src = img.startsWith('http') ? img : `${API_URL}${img}`;
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { 
                        console.warn(`Error cargando imagen para producto ${p.name}:`, src);
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="text-zinc-400 text-center">
                              <svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                              </svg>
                              <span class="text-xs">Imagen no disponible</span>
                            </div>
                          `;
                        }
                      }}
                    />
                  );
                })()}
              </div>
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-sm text-zinc-600 line-clamp-2">{p.description}</p>
              <div className="mt-2 font-semibold">${p.price}</div>
            </Link>
            <div className="mt-3 flex gap-2">
              <AddToCartButton productId={p.id} name={p.name} price={p.price} variant="primary" label="Comprar ahora" />
              <Link href={`/cotizacion?productId=${p.id}&name=${encodeURIComponent(p.name)}`} className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm" aria-label={`Cotizar ${p.name}`}>
                Cotizar producto
              </Link>
              <Link
                href={`/contacto?productId=${p.id}&productName=${encodeURIComponent(p.name)}`}
                className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm"
                aria-label={`Contactar vendedor sobre ${p.name}`}
              >
                Contactar vendedor
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

