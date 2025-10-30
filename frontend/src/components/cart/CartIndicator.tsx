"use client";

import Link from "next/link";
import { useCart } from "./CartContext";
import { useCartUI } from "./CartUIContext";

/**
 * CartIndicator
 * Muestra enlace a /ventas (Mi Carrito) con un badge del total de ítems en el carrito.
 * Accesible: incluye aria-label con el conteo y texto escondido para lectores.
 */
export function CartIndicator({ className = "" }: { className?: string }) {
  const { items } = useCart();
  const count = items.reduce((acc, it) => acc + it.quantity, 0);
  const { openCart } = useCartUI();

  const label = `Mi Carrito${count > 0 ? `, ${count} ${count === 1 ? "artículo" : "artículos"} en el carrito` : ""}`;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={label}
      className={`relative inline-flex items-center ${className}`}
    >
      <span className="hover:underline">Mi Carrito</span>
      {count > 0 && (
        <span
          aria-hidden="true"
          className="ml-1 inline-flex items-center justify-center rounded-full bg-emerald-600 text-white text-xs w-5 h-5"
        >
          {count}
        </span>
      )}
      <span className="sr-only">{count} {count === 1 ? "artículo" : "artículos"} en el carrito</span>
    </button>
  );
}
