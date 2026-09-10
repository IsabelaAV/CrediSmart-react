import "./EstadoVacio.css";

/** Mensaje que se muestra cuando ningún crédito coincide con los filtros. */
function EstadoVacio({
  titulo = "No hay créditos disponibles",
  mensaje = "Ningún producto coincide con los filtros que aplicaste.",
  onLimpiar,
}) {
  return (
    <div className="estado-vacio">
      <span className="estado-vacio__icono" aria-hidden="true">
        🔎
      </span>
      <h3>{titulo}</h3>
      <p className="texto-muted">{mensaje}</p>
      {onLimpiar && (
        <button type="button" className="boton boton--secundario" onClick={onLimpiar}>
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

export default EstadoVacio;
