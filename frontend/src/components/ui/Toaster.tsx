"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

type Toast = { id: number; message: string };
type ToastContextValue = {
  show: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    // Autocierre en 2.5s
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500);
  };
  const value = useMemo(() => ({ show }), []);
  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Contenedor visual */}
      <div className="fixed top-4 right-4 z-[80] space-y-2" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="rounded bg-emerald-600 text-white px-3 py-2 text-sm shadow-lg">
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider");
  return ctx;
}

