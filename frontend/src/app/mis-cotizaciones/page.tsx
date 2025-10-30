"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import QuotesView from "@/components/QuotesView";

export default function MisCotizacionesPage() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || undefined;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Mis cotizaciones</h1>
        <Link href="/mis-pedidos" className="underline text-blue-700">Ver mis pedidos</Link>
      </div>
      <QuotesView email={emailParam} />
    </div>
  );
}
