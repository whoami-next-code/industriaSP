"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useCart, CartItem } from "@/components/cart/CartContext";
import { apiFetch } from "@/lib/api";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  thumbnailUrl?: string;
};

type Props = {
  onValidate?: (ok: boolean) => void;
  onRemoveFeedback?: (name: string) => void;
  onQuantityFeedback?: (name: string) => void;
  onSelectionChange?: (ids: number[]) => void;
};

export default function CartView({ onValidate, onRemoveFeedback, onQuantityFeedback, onSelectionChange }: Props) {
  const { items, total, removeItem, setQuantity, isHydrated } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errors, setErrors] = useState<Record<number, string>>({});

  console.log('CartView: Received items from context:', items);
  console.log('CartView: Total from context:', total);
  console.log('CartView: isHydrated:', isHydrated);

  // Selección por defecto: todos los ítems
  useEffect(() => {
    if (!isHydrated) return;
    const allIds = items.map(i => i.productId);
    setSelectedIds(allIds);
    // Notificar al padre la selección inicial para que el resumen
    // muestre correctamente la cantidad y el total seleccionado.
    if (onSelectionChange) onSelectionChange(allIds);
  }, [items, isHydrated]);

  // Cargar info de productos (imagenes y stock)
  useEffect(() => {
    async function load() {
      setLoadingProducts(true);
      try {
        const data = await apiFetch('/api/productos');
        setProducts(Array.isArray(data) ? data : []);
      } finally {
        setLoadingProducts(false);
      }
    }
    load();
  }, []);

  const prodMap = useMemo(() => new Map(products.map(p => [p.id, p])), [products]);

  // Validación de stock para ítems seleccionados
  useEffect(() => {
    const errs: Record<number, string> = {};
    for (const it of items) {
      if (!selectedIds.includes(it.productId)) continue;
      const p = prodMap.get(it.productId);
      const stock = Number(p?.stock ?? 0);
      if (stock <= 0) errs[it.productId] = "Sin stock disponible";
      else if (it.quantity > stock) errs[it.productId] = `Stock insuficiente (stock: ${stock})`;
    }
    setErrors(errs);
    if (onValidate) onValidate(Object.keys(errs).length === 0);
  }, [items, selectedIds, prodMap, onValidate]);

  const selectedItems = useMemo(() => items.filter(i => selectedIds.includes(i.productId)), [items, selectedIds]);
  const selectedTotal = useMemo(() => selectedItems.reduce((s, i) => s + i.price * i.quantity, 0), [selectedItems]);

  function toggleSelectAll() {
    if (selectedIds.length === items.length) setSelectedIds([]);
    else setSelectedIds(items.map(i => i.productId));
    if (onSelectionChange) onSelectionChange(selectedIds.length === items.length ? [] : items.map(i => i.productId));
  }

  function toggleItem(id: number) {
    setSelectedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      if (onSelectionChange) onSelectionChange(next);
      return next;
    });
  }

  function handleQtyChange(it: CartItem, q: number) {
    const qty = q < 1 ? 1 : q;
    setQuantity(it.productId, qty);
    if (onQuantityFeedback) onQuantityFeedback(it.name);
  }

  function handleRemove(it: CartItem) {
    removeItem(it.productId);
    if (onRemoveFeedback) onRemoveFeedback(it.name);
  }

  // Evitar parpadeo/mismatch durante la hidratación
  if (!isHydrated) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Carrito</h2>
        </div>
        <div className="text-sm text-zinc-600">Cargando carrito…</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Carrito</h2>
        <button onClick={toggleSelectAll} className="text-sm underline">
          {selectedIds.length === items.length ? "Deseleccionar todo" : "Seleccionar todo"}
        </button>
      </div>

      {items.length === 0 && (
        <div className="text-sm text-zinc-600">Tu carrito está vacío.</div>
      )}

      <ul className="divide-y">
        {items.map((it) => {
          const p = prodMap.get(it.productId);
          const stock = Number(p?.stock ?? 0);
          const err = errors[it.productId];
          const imgSrc = p?.thumbnailUrl || p?.imageUrl || "/brand/placeholder.svg";
          return (
            <li key={it.productId} className={`flex items-center gap-3 py-4 ${selectedIds.includes(it.productId) ? "bg-emerald-50" : ""}`}>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={selectedIds.includes(it.productId)} onChange={() => toggleItem(it.productId)} />
                <span className="sr-only">Seleccionar {it.name}</span>
              </label>
              <div className="w-16 h-16 relative rounded overflow-hidden border bg-white flex-shrink-0">
                <Image src={imgSrc} alt={it.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{it.name}</div>
                <div className="text-sm text-zinc-600">Precio: ${Number(it.price).toFixed(2)} {loadingProducts ? "•" : p ? `• Stock: ${stock}` : ""}</div>
                {err && <div className="text-xs text-red-600">{err}</div>}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={it.quantity}
                  onChange={e => handleQtyChange(it, Number(e.target.value) || 1)}
                  className="w-20 border rounded px-2 py-1"
                  aria-label={`Cantidad de ${it.name}`}
                />
                <button onClick={() => handleRemove(it)} className="text-sm text-red-700 hover:underline">Eliminar</button>
              </div>
            </li>
          );
        })}
      </ul>

      {items.length > 0 && (
        <div className="border rounded p-4 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-zinc-700">Total del carrito: <span className="font-semibold">${total.toFixed(2)}</span></div>
            <div className="text-sm text-zinc-700">Total seleccionado: <span className="font-semibold">${selectedTotal.toFixed(2)}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
