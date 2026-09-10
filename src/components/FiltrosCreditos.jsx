import { categorias, ordenamientos, rangosMonto } from "../data/creditsData.js";
import "./FiltrosCreditos.css";

/**
 * Panel de filtros del catálogo.
 * Es un componente controlado: no guarda estado propio, solo muestra los valores
 * que recibe y avisa al padre cuando el usuario cambia alguno.
 */
function FiltrosCreditos({ filtros, onCambiarFiltro, onLimpiar, hayFiltrosActivos }) {
  const { categoria, rango, orden } = filtros;

  return (
    <div className="filtros">
      <div className="campo">
        <label className="campo__etiqueta" htmlFor="filtro-categoria">
          Categoría
        </label>
        <select
          id="filtro-categoria"
          className="campo__control"
          value={categoria}
          onChange={(evento) => onCambiarFiltro("categoria", evento.target.value)}
        >
          {categorias.map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="campo">
        <label className="campo__etiqueta" htmlFor="filtro-rango">
          Rango de monto
        </label>
        <select
          id="filtro-rango"
          className="campo__control"
          value={rango}
          onChange={(evento) => onCambiarFiltro("rango", evento.target.value)}
        >
          {rangosMonto.map((opcion) => (
            <option key={opcion.id} value={opcion.id}>
              {opcion.etiqueta}
            </option>
          ))}
        </select>
      </div>

      <div className="campo">
        <label className="campo__etiqueta" htmlFor="filtro-orden">
          Ordenar por
        </label>
        <select
          id="filtro-orden"
          className="campo__control"
          value={orden}
          onChange={(evento) => onCambiarFiltro("orden", evento.target.value)}
        >
          {ordenamientos.map((opcion) => (
            <option key={opcion.id} value={opcion.id}>
              {opcion.etiqueta}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="boton boton--secundario filtros__limpiar"
        onClick={onLimpiar}
        disabled={!hayFiltrosActivos}
      >
        Limpiar filtros
      </button>
    </div>
  );
}

export default FiltrosCreditos;
