# Accesibilidad (WCAG 2.1 AA)

Objetivo: que tanto el sitio público como el panel de administración sean utilizables por teclado, lectores de pantalla y usuarios con visión reducida.

Checklist aplicado:
- Saltar al contenido principal mediante skip-link.
- Roles y etiquetas ARIA en las zonas de navegación y banner.
- Foco visible con :focus-visible en elementos interactivos.
- Texto con contraste adecuado (AA) respecto al fondo.
- Labels y descripciones en formularios.
- Orden de tabulación lógico y predecible.

Buenas prácticas:
- Evitar usar sólo color para transmitir información.
- Comunicar estados y errores con texto y atributos ARIA.
- Respetar semántica HTML (main, nav, header, footer, section, h1..h6).
- Probar navegación por teclado regularmente.

Validación:
- Lighthouse Accessibility ≥ 90.
- Axe DevTools sin violaciones críticas.
