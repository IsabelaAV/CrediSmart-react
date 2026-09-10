// Funciones puras de formato y de cálculo financiero.
// Al estar separadas de los componentes se pueden reutilizar en cualquier página.

const formateadorCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/** Devuelve un número como moneda colombiana: 1500000 -> "$ 1.500.000" */
export function formatearCOP(valor) {
  if (!Number.isFinite(valor)) return "$ 0";
  return formateadorCOP.format(Math.round(valor));
}

/** Versión compacta para las etiquetas de los sliders: 50000000 -> "$50 M" */
export function formatearCompacto(valor) {
  if (valor >= 1000000) return `$${(valor / 1000000).toFixed(0)} M`;
  return `$${(valor / 1000).toFixed(0)} mil`;
}

/**
 * Convierte una tasa efectiva anual a su equivalente mensual vencida.
 * i_mensual = (1 + i_anual)^(1/12) - 1
 */
export function tasaMensual(tasaEA) {
  return Math.pow(1 + tasaEA / 100, 1 / 12) - 1;
}

/**
 * Cuota fija de un crédito de amortización francesa:
 *          i * (1 + i)^n
 * C = P * -----------------
 *         (1 + i)^n  -  1
 * donde P = monto, i = tasa mensual y n = número de cuotas.
 */
export function calcularCuotaMensual(monto, tasaEA, plazoMeses) {
  const i = tasaMensual(tasaEA);
  if (!monto || !plazoMeses) return 0;
  if (i === 0) return monto / plazoMeses;
  const factor = Math.pow(1 + i, plazoMeses);
  return (monto * (i * factor)) / (factor - 1);
}

/** Resumen completo de la simulación: cuota, total pagado e intereses. */
export function simularCredito(monto, tasaEA, plazoMeses) {
  const cuota = calcularCuotaMensual(monto, tasaEA, plazoMeses);
  const totalPagado = cuota * plazoMeses;
  return {
    cuota,
    totalPagado,
    totalIntereses: totalPagado - monto,
    tasaMensual: tasaMensual(tasaEA) * 100,
  };
}
