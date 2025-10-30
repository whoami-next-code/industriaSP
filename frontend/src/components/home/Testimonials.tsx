"use client";
import { useEffect, useState } from "react";

type Testimonial = { name: string; role?: string; message: string };

const DEFAULTS: Testimonial[] = [
  {
    name: "María P.",
    role: "Gerente de producción",
    message:
      "Los hornos de Industrias SP superaron nuestras expectativas en rendimiento y confiabilidad.",
  },
  {
    name: "Carlos R.",
    role: "Jefe de planta",
    message:
      "Excelente soporte técnico. La instalación y mantenimiento fueron rápidos y claros.",
  },
];

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>(DEFAULTS);

  // Ejemplo de carga diferida simulada desde un endpoint futuro
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Aquí podrías consultar un backend real; dejamos por defecto los testimonios locales.
        // const res = await fetch("/api/testimonios", { next: { revalidate: 300 } });
        // if (res.ok) setItems(await res.json());
      } catch {
        /* noop */
      }
      if (!cancelled) {
        // mantener DEFAULTS
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!items.length) return null;

  return (
    <section aria-label="Testimonios" className="mt-12">
      <h2 className="text-xl font-semibold mb-4">Clientes satisfechos</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((t, i) => (
          <figure key={i} className="border rounded p-4 bg-white">
            <blockquote className="text-sm text-zinc-700">“{t.message}”</blockquote>
            <figcaption className="mt-3 text-sm text-zinc-600">
              <span className="font-medium">{t.name}</span>
              {t.role ? ` — ${t.role}` : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}