"use client";
import React from "react";
import { useCart } from "@/components/cart/CartContext";
import { useCartUI } from "@/components/cart/CartUIContext";
import { useToast } from "@/components/ui/Toaster";

type Props = {
  productId: number;
  name: string;
  price: number;
  quantity?: number;
  variant?: "primary" | "outline";
  redirectToCart?: boolean; // deprecated: ahora usamos sidebar + toast
  label?: string;
};

export default function AddToCartButton({ productId, name, price, quantity = 1, variant = "primary", redirectToCart = false, label }: Props) {
  const { addItem } = useCart();
  const { openCart } = useCartUI();
  const { show } = useToast();

  function handleClick() {
    addItem({ productId, name, price, quantity });
    // Confirmación visual y apertura del sidebar, sin interrumpir navegación
    show(`Se añadió "${name}" al carrito`);
    openCart();
  }

  const className =
    variant === "primary"
      ? "inline-flex items-center justify-center rounded-md bg-black text-white px-3 py-2 text-sm"
      : "inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm";

  return (
    <button onClick={handleClick} className={className} aria-label={`${label ? label : 'Agregar al carrito'} ${name}`}>
      {label ?? 'Agregar al carrito'}
    </button>
  );
}
