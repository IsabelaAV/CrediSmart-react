import { useState } from "react";
import BarraBusqueda from "../components/BarraBusqueda.jsx";
import CreditCard from "../components/CreditCard.jsx";
import EstadoVacio from "../components/EstadoVacio.jsx";
import FiltrosCreditos from "../components/FiltrosCreditos.jsx";
import { useCreditos } from "../hooks/useCreditos.js";
import { rangosMonto } from "../data/creditsData.js";
import "./Catalogo.css";

const FILTROS_INICIALES = { categoria: "Todas", rango: "todos", orden: "tasa-asc" };

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function Catalogo() {
  const { creditos, cargando, error } = useCreditos();
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);

  const categorias = ["Todas", ...new Set(creditos.map((c) => c.categoria))];

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

  if (cargando) {
    return (
      <section className="seccion container">
        <div className="estado-carga">
          <div className="estado-carga__spinner" />
          <p>Cargando catálogo de créditos...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="seccion container">
        <div className="alerta alerta--error" role="alert">
          <span aria-hidden="true">⚠️</span>
          <p>No pudimos cargar el catálogo. Verifica tu conexión e intenta de nuevo.</p>
        </div>
      </section>
    );
  }

  const rangoSeleccionado = rangosMonto.find((rango) => rango.id === filtros.rango);
  const textoBuscado = normalizar(busqueda.trim());

  const resultados = creditos
    .filter((credito) => {
      const coincideTexto =
        textoBuscado === "" ||
        normalizar(credito.nombre).includes(textoBuscado) ||
        normalizar(credito.categoria).includes(textoBuscado) ||
        normalizar(credito.descripcion).includes(textoBuscado);

      const coincideCategoria =
        filtros.categoria === "Todas" || credito.categoria === filtros.categoria;

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
          categorias={categorias}
        />
      </div>

      <p className="catalogo__conteo">
        {resultados.length === 1
          ? "1 crédito encontrado"
          : `${resultados.length} créditos encontrados`}
        {busqueda && <span> para "{busqueda}"</span>}
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
