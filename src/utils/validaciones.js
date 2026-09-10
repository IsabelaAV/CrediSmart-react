import { calcularCuotaMensual } from "./finanzas.js";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const REGEX_SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

/**
 * Revisa todo el formulario y devuelve un objeto { campo: mensaje }.
 * Si el objeto está vacío, el formulario es válido.
 * Al ser una función pura se puede llamar en cada tecla para validar en tiempo real.
 */
export function validarSolicitud(datos, credito) {
  const errores = {};

  // --- Datos personales ---
  if (!datos.nombre.trim()) {
    errores.nombre = "El nombre es obligatorio.";
  } else if (datos.nombre.trim().length < 5) {
    errores.nombre = "Escribe tu nombre completo (mínimo 5 caracteres).";
  } else if (!REGEX_SOLO_LETRAS.test(datos.nombre.trim())) {
    errores.nombre = "El nombre solo puede contener letras.";
  }

  if (!datos.cedula.trim()) {
    errores.cedula = "La cédula es obligatoria.";
  } else if (!/^\d{6,10}$/.test(datos.cedula.trim())) {
    errores.cedula = "La cédula debe tener entre 6 y 10 dígitos, sin puntos.";
  }

  if (!datos.email.trim()) {
    errores.email = "El correo es obligatorio.";
  } else if (!REGEX_EMAIL.test(datos.email.trim())) {
    errores.email = "Escribe un correo válido, por ejemplo nombre@correo.com.";
  }

  if (!datos.telefono.trim()) {
    errores.telefono = "El teléfono es obligatorio.";
  } else if (!/^3\d{9}$/.test(datos.telefono.trim())) {
    errores.telefono = "Debe ser un celular colombiano de 10 dígitos que empiece por 3.";
  }

  // --- Datos del crédito ---
  if (!datos.creditoId) {
    errores.creditoId = "Selecciona el tipo de crédito.";
  }

  const monto = Number(datos.monto);
  if (!datos.monto) {
    errores.monto = "Indica el monto que necesitas.";
  } else if (Number.isNaN(monto) || monto <= 0) {
    errores.monto = "El monto debe ser un número mayor que cero.";
  } else if (credito && monto < credito.montoMin) {
    errores.monto = `El monto mínimo de este crédito es $${credito.montoMin.toLocaleString("es-CO")}.`;
  } else if (credito && monto > credito.montoMax) {
    errores.monto = `El monto máximo de este crédito es $${credito.montoMax.toLocaleString("es-CO")}.`;
  }

  if (!datos.plazo) {
    errores.plazo = "Selecciona el plazo en meses.";
  }

  if (!datos.destino.trim()) {
    errores.destino = "Cuéntanos en qué usarás el dinero.";
  } else if (datos.destino.trim().length < 15) {
    errores.destino = "Describe el destino con al menos 15 caracteres.";
  }

  // --- Datos laborales ---
  if (!datos.empresa.trim()) errores.empresa = "Indica dónde trabajas.";
  if (!datos.cargo.trim()) errores.cargo = "Indica tu cargo actual.";

  const ingresos = Number(datos.ingresos);
  if (!datos.ingresos) {
    errores.ingresos = "Los ingresos mensuales son obligatorios.";
  } else if (Number.isNaN(ingresos) || ingresos < 1300000) {
    errores.ingresos = "Los ingresos deben ser de al menos $1.300.000.";
  } else if (credito && datos.plazo && monto > 0) {
    // Regla de capacidad de pago: la cuota no puede superar el 40% de los ingresos.
    const cuota = calcularCuotaMensual(monto, credito.tasaEA, Number(datos.plazo));
    if (cuota > ingresos * 0.4) {
      errores.ingresos =
        "La cuota supera el 40% de tus ingresos. Reduce el monto o amplía el plazo.";
    }
  }

  if (!datos.aceptaTerminos) {
    errores.aceptaTerminos = "Debes autorizar el tratamiento de datos para continuar.";
  }

  return errores;
}
