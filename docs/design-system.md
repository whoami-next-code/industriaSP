# Sistema de diseño compartido

Objetivo: mantener consistencia visual entre el sitio público (frontend) y el panel de administración (admin), diferenciando funciones sin perder la identidad de marca.

Tokens principales (implementados como variables CSS y Tailwind):
- Colores: --brand-primary, --brand-secondary, --surface, --surface-card, --text, --text-muted.
- Tipografía: Geist Sans (contenido), Geist Mono (código/etiquetas).
- Espaciado: usar escala Tailwind (2, 4, 6, 8, 10, 12, 16, 20, 24).
- Bordes: radio base 8px en tarjetas y botones.

Directrices:
- Contraste mínimo AA (WCAG 2.1) para texto y controles.
- Botones primarios en brand-secondary sobre fondo claro; botones secundarios con borde.
- Enlaces deben cambiar de estado: hover, focus-visible y active.
- Iconografía y gráficos: optimizar como SVG; usar next/image donde aplique.

Implementación técnica:
- Variables CSS definidas en frontend/src/app/globals.css y admin/src/app/globals.css.
- Tailwind 4 con @theme inline para exponer fuentes/colores.
- Componentes clave: tarjetas de producto, tablas de administración, formularios, modales.
- Accesibilidad integrada: roles ARIA en navegación, skip-link y foco visible.

Estrategia de evolución:
- Mantener este documento como fuente de verdad.
- Registrar cambios de tokens y componentes con fecha y motivo.
