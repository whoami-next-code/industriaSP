"use client";
import React, { useState, useEffect } from "react";

export default function ContactoPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [productoId, setProductoId] = useState<number | undefined>(undefined);
  const [productoNombre, setProductoNombre] = useState<string>("");
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get("productId");
    const pname = params.get("productName");
    if (pid) setProductoId(Number(pid));
    if (pname) setProductoNombre(pname);
  }, []);

  const validar = () => {
    if (!nombre.trim()) return "El nombre es obligatorio";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Correo inválido";
    if (!mensaje.trim()) return "Por favor escribe un mensaje";
    return null;
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validar();
    if (v) {
      setError(v);
      return;
    }
    setEnviando(true);
    try {
      const res = await fetch("http://localhost:3001/api/contactos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, telefono, mensaje, productoId }),
      });
      if (!res.ok) throw new Error("No se pudo enviar el formulario");
      setExito("Tu solicitud fue enviada. Te contactaremos pronto.");
      setNombre("");
      setEmail("");
      setTelefono("");
      setMensaje("");
    } catch (err: any) {
      setError(err.message || "Error inesperado");
    } finally {
      setEnviando(false);
    }
  };

  const whatsappHref = () => {
    const txt = encodeURIComponent(
      `Hola, quiero más información${productoNombre ? ` sobre: ${productoNombre}` : ""}. Mis datos: ${nombre}, ${email}${telefono ? ", tel: " + telefono : ""}.`,
    );
    return `https://wa.me/?text=${txt}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Contacto con vendedor</h1>
      {productoNombre && (
        <div className="mb-4 p-3 rounded bg-gray-100 text-sm">
          Producto de interés: <strong>{productoNombre}</strong>
        </div>
      )}
      {error && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      {exito && <div className="mb-3 p-2 bg-green-100 text-green-700 rounded">{exito}</div>}
      <form onSubmit={enviar} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="mt-1 w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Correo</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Teléfono (opcional)</label>
          <input value={telefono} onChange={(e) => setTelefono(e.target.value)} className="mt-1 w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Mensaje</label>
          <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={4} className="mt-1 w-full border rounded p-2" />
        </div>
        <div className="flex gap-3">
          <button disabled={enviando} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
            {enviando ? "Enviando..." : "Enviar"}
          </button>
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-green-600 text-white rounded">
            WhatsApp
          </a>
          <a href={`mailto:ventas@empresa.com?subject=${encodeURIComponent("Consulta de producto")}&body=${encodeURIComponent(mensaje)}`} className="px-4 py-2 bg-gray-700 text-white rounded">
            Correo
          </a>
        </div>
      </form>
    </div>
  );
}

