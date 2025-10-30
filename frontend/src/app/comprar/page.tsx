"use client";
import { useState } from 'react';
import axios from 'axios';

type Resultado = {
  mensaje: string;
  boleta: any;
  comprobante: any;
};

export default function Comprar() {
  const [form, setForm] = useState({ dni: '', producto: '', cantidad: 1, precioUnitario: 50 });
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3001/api';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'cantidad' || name === 'precioUnitario' ? Number(value) : value,
    }));
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultado(null);
    try {
      const { data } = await axios.post(`${API_BASE}/compras`, form, { withCredentials: true });
      setResultado(data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al registrar la compra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Compra con DNI (Pasarela ficticia)</h1>

      <form onSubmit={enviar} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-2">
        <input name="dni" placeholder="DNI" value={form.dni} onChange={handleChange} className="border p-2 w-full" required />
        <input name="producto" placeholder="Producto" value={form.producto} onChange={handleChange} className="border p-2 w-full" required />
        <input name="cantidad" type="number" min={1} placeholder="Cantidad" value={form.cantidad} onChange={handleChange} className="border p-2 w-full" required />
        <input name="precioUnitario" type="number" min={0} step={0.01} placeholder="Precio Unitario" value={form.precioUnitario} onChange={handleChange} className="border p-2 w-full" required />

        <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
          {loading ? 'Procesando…' : 'Comprar'}
        </button>
        {error && <div className="text-red-700 text-sm mt-2">{error}</div>}
      </form>

      {resultado && (
        <div className="mt-6 grid md:grid-cols-2 gap-4 w-full max-w-3xl">
          <div className="bg-green-100 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Boleta Generada</h2>
            <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(resultado.boleta, null, 2)}</pre>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Comprobante de Pago (Simulado)</h2>
            <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(resultado.comprobante, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

