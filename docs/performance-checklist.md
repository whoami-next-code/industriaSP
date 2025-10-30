# Performance y tiempos de carga

Objetivo: mantener una experiencia rápida en ambos proyectos.

Acciones aplicadas / planificadas:
- next/image para imágenes con tamaños responsivos.
- Revalidación de datos en páginas de catálogo y detalle.
- Code splitting automático por rutas en Next.js (App Router).
- Evitar JS global innecesario del template admin (Oculux).
- Lazy-loading de componentes pesados (ej. testimonios).
- Preload automático de fuentes mediante next/font.

Métricas a observar:
- LCP (Largest Contentful Paint) < 2.5s.
- CLS (Cumulative Layout Shift) ≈ 0.
- TBT (Total Blocking Time) bajo en interacción inicial.
- Time to First Byte (TTFB) estable.

Herramientas:
- Lighthouse (Chrome DevTools).
- WebPageTest para escenarios de red lenta.
- Next.js Bundle Analyzer cuando sea necesario.
