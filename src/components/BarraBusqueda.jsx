import "./BarraBusqueda.css";

/**
 * Input de búsqueda controlado.
 * El valor y el manejador vienen del componente padre (patrón "lifting state up"),
 * así la búsqueda se actualiza en tiempo real mientras se escribe.
 */
function BarraBusqueda({ valor, onCambiar, placeholder = "Buscar...", etiqueta = "Buscar" }) {
  return (
    <div className="busqueda">
      <label className="sr-only" htmlFor="input-busqueda">
        {etiqueta}
      </label>
      <span className="busqueda__icono" aria-hidden="true">
        🔍
      </span>
      <input
        id="input-busqueda"
        type="search"
        className="busqueda__input"
        value={valor}
        placeholder={placeholder}
        onChange={(evento) => onCambiar(evento.target.value)}
      />
      {valor && (
        <button type="button" className="busqueda__limpiar" onClick={() => onCambiar("")}>
          Limpiar
        </button>
      )}
    </div>
  );
}

export default BarraBusqueda;
