import type { Metadata } from "next";
import { IBM_Plex_Sans, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { CartProvider } from "@/components/cart/CartContext";
import { CartUIProvider } from "@/components/cart/CartUIContext";
import CartSidebar from "@/components/cart/CartSidebar";
import { ToastProvider } from "@/components/ui/Toaster";
import { CartIndicator } from "@/components/cart/CartIndicator";

const industrialSans = IBM_Plex_Sans({
  variable: "--font-industrial-sans",
  subsets: ["latin"],
  weight: ["300","400","500","600","700"],
});

const industrialHeading = Roboto_Condensed({
  variable: "--font-industrial-condensed",
  subsets: ["latin"],
  weight: ["300","400","700"],
});

export const metadata: Metadata = {
  title: "Industrias SP",
  description: "Equipos industriales para la industria alimentaria",
  icons: {
    icon: "/brand/kadhavu/images/favicon.png",
    shortcut: "/brand/kadhavu/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${industrialSans.variable} ${industrialHeading.variable} antialiased`}
      >
        <CartProvider>
        <CartUIProvider>
        <ToastProvider>
        {/* Enlace para saltar al contenido principal (accesibilidad) */}
        <a href="#principal" className="sr-only focus:not-sr-only focus:block focus:mb-2">Saltar al contenido principal</a>

        <header className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50" role="banner">
          <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between" aria-label="Navegación principal" role="navigation">
            <Link href="/" className="font-semibold flex items-center gap-2">
              <Image src="/brand/kadhavu/images/logo.png" alt="Industrias SP" width={28} height={28} />
              <span>Industrias SP</span>
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/catalogo">Catálogo</Link>
              <CartIndicator />
              <Link href="/mis-pedidos">Mis pedidos</Link>
              <Link href="/mantenimiento">Mantenimiento</Link>
              <Link href="/contacto">Contacto</Link>
              <span className="text-zinc-300">|</span>
              <Link href="/auth/login">Login</Link>
              <Link href="/auth/register">Registro</Link>
              <Link href="/perfil">Perfil</Link>
            </div>
          </nav>
        </header>
        <main id="principal" className="min-h-[calc(100vh-56px)]" role="main">{children}</main>
        <footer className="border-t py-6 text-center text-sm text-zinc-500" role="contentinfo">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2">
            <Image src="/brand/kadhavu/images/logo-light.png" alt="Industrias SP" width={20} height={20} />
            <span>© {new Date().getFullYear()} Industrias SP</span>
          </div>
        </footer>
        <CartSidebar />
        </ToastProvider>
        </CartUIProvider>
        </CartProvider>
      </body>
    </html>
  );
}
