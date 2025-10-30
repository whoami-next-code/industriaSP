"use client";
import React from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { useCartUI } from "@/components/cart/CartUIContext";

export default function CartSidebar() {
  const { items, total, removeItem, setQuantity } = useCart();
  const { open, closeCart } = useCartUI();

  // Panel flotante con transición accesible
  return (
    <div aria-hidden={!open} aria-label="Carrito lateral" className="pointer-events-none">
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-200 ${open ? "opacity-50" : "opacity-0"} bg-black pointer-events-auto ${open ? "" : "hidden"}`}
        aria-hidden="true"
        onClick={closeCart}
      />
      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-full sm:w-[380px] bg-white border-l shadow-xl transform transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"} pointer-events-auto`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Mi Carrito</h2>
          <button onClick={closeCart} aria-label="Cerrar carrito" className="rounded border px-3 py-1 text-sm">Cerrar</button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-56px-88px)]">
          {items.length === 0 && <div className="text-sm text-zinc-600">Tu carrito está vacío.</div>}
          {items.map(it => (
            <div key={`${it.productId}`} className="border rounded p-3 flex items-center justify-between bg-white">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-zinc-600">${Number(it.price).toFixed(2)} x {it.quantity}</div>
              </div>
              <div className="flex items-center gap-3">
                <input type="number" min={1} value={it.quantity} onChange={e => setQuantity(it.productId, Number(e.target.value) || 1)} className="w-16 border rounded px-2 py-1" aria-label={`Cantidad ${it.name}`} />
                <button onClick={() => removeItem(it.productId)} className="text-sm text-red-700">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <span>Total</span>
            <span className="font-semibold">${total.toFixed(2)}</span>
          </div>
          <Link href="/ventas" className="w-full inline-flex items-center justify-center rounded-md bg-black text-white px-3 py-2 text-sm">Ir a pagar</Link>
        </div>
      </aside>
    </div>
  );
}

