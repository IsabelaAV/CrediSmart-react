// Fuente única de datos de los productos crediticios de CreditSmart

export const creditos = [
  {
    id: 1,
    nombre: "Crédito de Libre Inversión",
    categoria: "Personal",
    icono: "💸",
    tasaEA: 14.5,
    montoMin: 1000000,
    montoMax: 50000000,
    plazoMin: 6,
    plazoMax: 60,
    destacado: true,
    descripcion:
      "El dinero llega a tu cuenta y tú decides en qué usarlo: viajes, estudios, deudas o ese proyecto que tienes pendiente.",
    requisitos: [
      "Ser mayor de 18 años",
      "Cédula de ciudadanía vigente",
      "Certificación laboral o extractos de los últimos 3 meses",
    ],
    beneficios: ["Desembolso en 24 horas", "Sin destinación específica", "Abonos a capital sin penalidad"],
  },
  {
    id: 2,
    nombre: "Crédito de Vehículo",
    categoria: "Movilidad",
    icono: "🚗",
    tasaEA: 11.2,
    montoMin: 5000000,
    montoMax: 120000000,
    plazoMin: 12,
    plazoMax: 72,
    destacado: true,
    descripcion:
      "Financia hasta el 90% del valor de tu carro o moto, nuevo o usado, con cuotas fijas durante toda la vida del crédito.",
    requisitos: [
      "Cotización del vehículo o factura proforma",
      "Ingresos desde 2 SMLV",
      "Antigüedad laboral mínima de 6 meses",
    ],
    beneficios: ["Financiación hasta del 90%", "Cuota fija mensual", "Seguro todo riesgo opcional"],
  },
  {
    id: 3,
    nombre: "Crédito de Vivienda",
    categoria: "Vivienda",
    icono: "🏠",
    tasaEA: 8.9,
    montoMin: 30000000,
    montoMax: 300000000,
    plazoMin: 60,
    plazoMax: 240,
    destacado: true,
    descripcion:
      "La tasa más baja del portafolio para comprar vivienda nueva o usada, con plazos de hasta 20 años.",
    requisitos: [
      "Avalúo comercial del inmueble",
      "Promesa de compraventa firmada",
      "Cuota inicial mínima del 20%",
    ],
    beneficios: ["Tasa desde 8.9% E.A.", "Plazo hasta 240 meses", "Acompañamiento jurídico incluido"],
  },
  {
    id: 4,
    nombre: "Crédito Educativo",
    categoria: "Educación",
    icono: "🎓",
    tasaEA: 7.5,
    montoMin: 500000,
    montoMax: 20000000,
    plazoMin: 6,
    plazoMax: 36,
    destacado: false,
    descripcion:
      "Pagamos tu matrícula directamente a la institución para que solo te preocupes por estudiar.",
    requisitos: ["Orden de matrícula vigente", "Codeudor con ingresos demostrables", "Ser estudiante activo"],
    beneficios: ["La tasa más baja del mercado", "Pago directo a la universidad", "Periodo de gracia de 6 meses"],
  },
  {
    id: 5,
    nombre: "Crédito Empresarial",
    categoria: "Empresa",
    icono: "🏢",
    tasaEA: 12.0,
    montoMin: 10000000,
    montoMax: 200000000,
    plazoMin: 12,
    plazoMax: 84,
    destacado: false,
    descripcion:
      "Capital de trabajo o inversión en activos fijos para que tu empresa crezca sin frenar su operación.",
    requisitos: [
      "Cámara de Comercio con más de 1 año",
      "Estados financieros de los 2 últimos años",
      "RUT actualizado",
    ],
    beneficios: ["Asesor empresarial asignado", "Plazo hasta 84 meses", "Cupo rotativo tras 12 cuotas"],
  },
  {
    id: 6,
    nombre: "Microcrédito Emprendedor",
    categoria: "Empresa",
    icono: "🌱",
    tasaEA: 15.0,
    montoMin: 1000000,
    montoMax: 15000000,
    plazoMin: 6,
    plazoMax: 24,
    destacado: false,
    descripcion:
      "Para negocios pequeños que necesitan inventario o herramientas. Aprobación con historial crediticio corto.",
    requisitos: ["Negocio en funcionamiento por más de 6 meses", "Registro fotográfico del negocio", "Cédula vigente"],
    beneficios: ["Aprobación sin historial extenso", "Visita de un asesor a tu negocio", "Renovación automática"],
  },
];

// Rangos de monto que alimentan el filtro del catálogo.
export const rangosMonto = [
  { id: "todos", etiqueta: "Cualquier monto", min: 0, max: Infinity },
  { id: "bajo", etiqueta: "Hasta $20 millones", min: 0, max: 20000000 },
  { id: "medio", etiqueta: "$20 a $100 millones", min: 20000000, max: 100000000 },
  { id: "alto", etiqueta: "Más de $100 millones", min: 100000000, max: Infinity },
];

// Las categorías se derivan del array para no repetir información.
export const categorias = ["Todas", ...new Set(creditos.map((credito) => credito.categoria))];

export const ordenamientos = [
  { id: "tasa-asc", etiqueta: "Tasa: menor a mayor" },
  { id: "tasa-desc", etiqueta: "Tasa: mayor a menor" },
  { id: "monto-desc", etiqueta: "Monto máximo: mayor a menor" },
  { id: "plazo-desc", etiqueta: "Plazo: mayor a menor" },
];
