import { useState, useEffect } from "react";
import { getCreditos, seedCreditos } from "../services/creditosService";
import { creditos as datosSemilla } from "../data/creditsData";

let promesaSiembra = null;

function asegurarSiembra() {
  if (!promesaSiembra) {
    promesaSiembra = seedCreditos(datosSemilla).catch((err) => {
      promesaSiembra = null;
      throw err;
    });
  }
  return promesaSiembra;
}

export function useCreditos() {
  const [creditos, setCreditos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      try {
        setCargando(true);
        setError(null);
        await asegurarSiembra();
        const datos = await getCreditos();
        if (!cancelado) setCreditos(datos);
      } catch (err) {
        if (!cancelado) setError(err.message || "Error al cargar los créditos");
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargar();
    return () => {
      cancelado = true;
    };
  }, []);

  return { creditos, cargando, error };
}
