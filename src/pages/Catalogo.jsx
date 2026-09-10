import { useState } from "react";
import BarraBusqueda from "../components/BarraBusqueda.jsx";
import CreditCard from "../components/CreditCard.jsx";
import EstadoVacio from "../components/EstadoVacio.jsx";
import FiltrosCreditos from "../components/FiltrosCreditos.jsx";
import { creditos, rangosMonto } from "../data/creditsData.js";
import "./Catalogo.css";

const FILTROS_INICIALES = { categoria: "Todas", rango: "todos", orden: "tasa-asc" };

/**
 * Quita tildes y pasa a minúsculas para que "credito" también encuentre "crédito".
 * normalize("NFD") separa la letra de su acento y el rango de caracteres
 * combinantes (U+0300 a U+036F) elimina esos acentos sueltos.
 */
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function Catalogo() {
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);

  const cambiarFiltro = (campo, valor) => {
    setFiltros((anteriores) => ({ ...anteriores, [campo]: valor }));
  };

  const limpiarTodo = () => {
    setBusqueda("");
    setFiltros(FILTROS_INICIALES);
  };

  const hayFiltrosActivos =
    busqueda !== "" ||
    filtros.categoria !== FILTROS_INICIALES.categoria ||
    filtros.rango !== FILTROS_INICIALES.rango ||
    filtros.orden !== FILTROS_INICIALES.orden;

  const rangoSeleccionado = rangosMonto.find((rango) => rango.id === filtros.rango);
  const textoBuscado = normalizar(busqueda.trim());

  // Encadenamos .filter() y .sort() sobre una copia del array original.
  // Se recalcula en cada render, por eso la búsqueda responde mientras se escribe.
  const resultados = creditos
    .filter((credito) => {
      const coincideTexto =
        textoBuscado === "" ||
        normalizar(credito.nombre).includes(textoBuscado) ||
        normalizar(credito.categoria).includes(textoBuscado) ||
        normalizar(credito.descripcion).includes(textoBuscado);

      const coincideCategoria =
        filtros.categoria === "Todas" || credito.categoria === filtros.categoria;

      // El crédito entra si su rango de montos se cruza con el rango elegido.
      const coincideMonto =
        credito.montoMin <= rangoSeleccionado.max && credito.montoMax >= rangoSeleccionado.min;

      return coincideTexto && coincideCategoria && coincideMonto;
    })
    .sort((a, b) => {
      if (filtros.orden === "tasa-asc") return a.tasaEA - b.tasaEA;
      if (filtros.orden === "tasa-desc") return b.tasaEA - a.tasaEA;
      if (filtros.orden === "monto-desc") return b.montoMax - a.montoMax;
      return b.plazoMax - a.plazoMax;
    });

  return (
    <section className="seccion container">
      <div className="encabezado-pagina">
        <span className="chip">Catálogo</span>
        <h1>Impulsa tus proyectos con CreditSmart</h1>
        <p className="subtitulo">
          Busca por nombre o categoría, filtra por monto y ordena por tasa para comparar todas
          nuestras líneas de crédito.
        </p>
      </div>

      <div className="catalogo__controles">
        <BarraBusqueda
          valor={busqueda}
          onCambiar={setBusqueda}
          etiqueta="Buscar crédito"
          placeholder="Busca por nombre, categoría o palabra clave..."
        />
        <FiltrosCreditos
          filtros={filtros}
          onCambiarFiltro={cambiarFiltro}
          onLimpiar={limpiarTodo}
          hayFiltrosActivos={hayFiltrosActivos}
        />
      </div>

      <p className="catalogo__conteo">
        {resultados.length === 1
          ? "1 crédito encontrado"
          : `${resultados.length} créditos encontrados`}
        {busqueda && <span> para “{busqueda}”</span>}
      </p>

      {resultados.length > 0 ? (
        <div className="grid grid--creditos">
          {resultados.map((credito) => (
            <CreditCard key={credito.id} credito={credito} mostrarRequisitos />
          ))}
        </div>
      ) : (
        <EstadoVacio
          mensaje="No hay créditos disponibles con esos criterios. Prueba con otra palabra o amplía el rango de monto."
          onLimpiar={limpiarTodo}
        />
      )}
    </section>
  );
}

export default Catalogo;
