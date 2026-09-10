/**
 * Campo de formulario controlado y reutilizable.
 * Sirve para input, textarea y select según la prop `tipo` / `children`,
 * y pinta el mensaje de error solo cuando el campo ya fue tocado.
 */
function CampoFormulario({
  id,
  etiqueta,
  tipo = "text",
  valor,
  onCambiar,
  onBlur,
  error,
  ayuda,
  placeholder,
  children,
}) {
  const hayError = Boolean(error);
  const clases = `campo__control ${hayError ? "campo__control--error" : ""}`;

  const propiedadesComunes = {
    id,
    name: id,
    value: valor,
    onChange: (evento) => onCambiar(id, evento.target.value),
    onBlur: () => onBlur(id),
    className: clases,
    "aria-invalid": hayError,
    "aria-describedby": hayError ? `${id}-error` : undefined,
  };

  return (
    <div className="campo">
      <label className="campo__etiqueta" htmlFor={id}>
        {etiqueta}
      </label>

      {tipo === "select" && <select {...propiedadesComunes}>{children}</select>}
      {tipo === "textarea" && <textarea {...propiedadesComunes} rows={4} placeholder={placeholder} />}
      {tipo !== "select" && tipo !== "textarea" && (
        <input {...propiedadesComunes} type={tipo} placeholder={placeholder} />
      )}

      {hayError ? (
        <p className="campo__error" id={`${id}-error`}>
          {error}
        </p>
      ) : (
        ayuda && <p className="campo__ayuda">{ayuda}</p>
      )}
    </div>
  );
}

export default CampoFormulario;
