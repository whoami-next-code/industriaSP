export const homeContent = {
  hero: {
    title: "Industrias SP",
    subtitle:
      "Fabricación de hornos, cocinas y equipos industriales para la industria alimentaria. Soluciones confiables y eficientes para tu negocio.",
  },
  cta: {
    viewCatalog: "Ver catálogo",
    requestQuote: "Solicitar cotización",
  },
  benefits: [
    { title: "Calidad industrial", description: "Equipos diseñados para alto rendimiento y durabilidad." },
    { title: "Soporte técnico", description: "Acompañamiento en instalación, mantenimiento y repuestos." },
    { title: "Entrega confiable", description: "Gestión de pedidos y seguimiento puntual." },
  ],
} as const;

export type HomeContent = typeof homeContent;