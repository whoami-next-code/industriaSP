import { API_URL } from "@/lib/api";
import Link from "next/link";
import AddToCartButton from "@/components/cart/AddToCartButton";

type Product = { id: number; name: string; description?: string; price: number; category?: string; imageUrl?: string; thumbnailUrl?: string; stock?: number };

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/api/productos/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <Link href="/catalogo" className="text-sm underline">Volver al catálogo</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="aspect-video rounded bg-zinc-100 mb-3 overflow-hidden">
            {(() => {
              const img = product.imageUrl || product.thumbnailUrl;
              if (!img) return null;
              const src = img.startsWith('http') ? img : `${API_URL}${img}`;
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = '/window.svg'; }}
                />
              );
            })()}
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          {product.category && (
            <div className="text-sm text-zinc-600">Categoría: {product.category}</div>
          )}
          <div className="text-xl font-semibold">${product.price}</div>
          {typeof product.stock === 'number' && (
            <div className="text-sm">Stock: {product.stock}</div>
          )}
          <p className="text-zinc-700 whitespace-pre-line">{product.description}</p>
          <div className="flex gap-3 pt-2">
            <AddToCartButton productId={product.id} name={product.name} price={product.price} label="Comprar ahora" />
            <Link href={`/cotizacion?productId=${product.id}&name=${encodeURIComponent(product.name)}`} className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm">Cotizar producto</Link>
          </div>
          <div>
            <Link href="/catalogo" className="text-sm underline">Volver al catálogo</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
