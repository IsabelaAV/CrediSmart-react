import { useState } from "react";
import { useLocation } from "react-router-dom";
import CampoFormulario from "../components/CampoFormulario.jsx";
import { creditos } from "../data/creditsData.js";
import { formatearCOP, simularCredito } from "../utils/finanzas.js";
import { validarSolicitud } from "../utils/validaciones.js";
import "./Solicitud.css";

const FORMULARIO_VACIO = {
  nombre: "",
  cedula: "",
  email: "",
  telefono: "",
  creditoId: "",
  monto: "",
  plazo: "",
  destino: "",
  empresa: "",
  cargo: "",
  ingresos: "",
  aceptaTerminos: false,
};

/** Plazos disponibles (de 12 en 12 meses) dentro de los límites del crédito elegido. */
function plazosDisponibles(credito) {
  if (!credito) return [12, 24, 36, 48, 60];
  const opciones = [];
  for (let meses = 12; meses <= credito.plazoMax; meses += 12) {
    if (meses >= credito.plazoMin) opciones.push(meses);
  }
  return opciones;
}

function Solicitud({ solicitudes, onAgregarSolicitud }) {
  const { state } = useLocation();

  // Si el usuario viene del simulador, el formulario arranca con esos valores.
  const valoresIniciales = {
    ...FORMULARIO_VACIO,
    creditoId: state?.creditoId ? String(state.creditoId) : "",
    monto: state?.monto ? String(state.monto) : "",
    plazo: state?.plazo ? String(state.plazo) : "",
  };

  const [formulario, setFormulario] = useState(valoresIniciales);
  const [tocados, setTocados] = useState({});
  const [mensajeExito, setMensajeExito] = useState("");

  const creditoSeleccionado = creditos.find(
    (credito) => credito.id === Number(formulario.creditoId)
  );

  // Se valida en cada render, así los mensajes aparecen mientras el usuario escribe.
  const errores = validarSolicitud(formulario, creditoSeleccionado);
  const formularioValido = Object.keys(errores).length === 0;

  // Solo mostramos el error si el campo ya fue tocado o si se intentó enviar.
  const errorDe = (campo) => (tocados[campo] ? errores[campo] : undefined);

  const cambiarCampo = (campo, valor) => {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
    setMensajeExito("");
  };

  const marcarTocado = (campo) => {
    setTocados((anteriores) => ({ ...anteriores, [campo]: true }));
  };

  const limpiarFormulario = () => {
    setFormulario(FORMULARIO_VACIO);
    setTocados({});
    setMensajeExito("");
  };

  // Resumen en vivo: se recalcula al cambiar crédito, monto o plazo.
  const monto = Number(formulario.monto) || 0;
  const plazo = Number(formulario.plazo) || 0;
  const hayResumen = Boolean(creditoSeleccionado) && monto > 0 && plazo > 0;
  const resumen = hayResumen
    ? simularCredito(monto, creditoSeleccionado.tasaEA, plazo)
    : { cuota: 0, totalPagado: 0, totalIntereses: 0 };

  const manejarEnvio = (evento) => {
    evento.preventDefault(); // evita que el navegador recargue la página

    if (!formularioValido) {
      // Marcamos todos los campos como tocados para mostrar todos los errores.
      const todos = Object.keys(FORMULARIO_VACIO).reduce(
        (acumulado, campo) => ({ ...acumulado, [campo]: true }),
        {}
      );
      setTocados(todos);
      return;
    }

    const nuevaSolicitud = {
      id: Date.now(),
      radicado: `CS-${Date.now().toString().slice(-6)}`,
      nombre: formulario.nombre.trim(),
      email: formulario.email.trim(),
      credito: creditoSeleccionado.nombre,
      monto,
      plazo,
      cuota: resumen.cuota,
      fecha: new Date().toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };

    onAgregarSolicitud(nuevaSolicitud);
    setFormulario(FORMULARIO_VACIO);
    setTocados({});
    setMensajeExito(
      `¡Listo, ${nuevaSolicitud.nombre}! Radicamos tu solicitud ${nuevaSolicitud.radicado}. Te escribiremos a ${nuevaSolicitud.email}.`
    );
  };

  return (
    <section className="seccion container">
      <div className="encabezado-pagina">
        <span className="chip">Solicitud</span>
        <h1>Solicita tu crédito en línea</h1>
        <p className="subtitulo">
          Diligencia el formulario y revisa el resumen antes de enviarlo. Validamos los datos
          mientras escribes.
        </p>
      </div>

      {mensajeExito && (
        <div className="alerta alerta--exito" role="status">
          <span aria-hidden="true">✅</span>
          <p>{mensajeExito}</p>
        </div>
      )}

      <div className="solicitud">
        <form className="solicitud__form tarjeta" onSubmit={manejarEnvio} noValidate>
          <fieldset className="bloque">
            <legend>Datos personales</legend>
            <div className="bloque__grid">
              <CampoFormulario
                id="nombre"
                etiqueta="Nombre completo"
                placeholder="Ej. Juana Pérez Gómez"
                valor={formulario.nombre}
                onCambiar={cambiarCampo}
                onBlur={marcarTocado}
                error={errorDe("nombre")}
              />
              <CampoFormulario
                id="cedula"
                etiqueta="Número de cédula"
                placeholder="Ej. 1020304050"
                valor={formulario.cedula}
                onCambiar={cambiarCampo}
                onBlur={marcarTocado}
                error={errorDe("cedula")}
                ayuda="Solo números, sin puntos ni espacios."
              />
              <CampoFormulario
                id="email"
                etiqueta="Correo electrónico"
                tipo="email"
                placeholder="correo@ejemplo.com"
                valor={formulario.email}
                onCambiar={cambiarCampo}
                onBlur={marcarTocado}
                error={errorDe("email")}
              />
              <CampoFormulario
                id="telefono"
                etiqueta="Celular de contacto"
                tipo="tel"
                placeholder="Ej. 3001234567"
                valor={formulario.telefono}
                onCambiar={cambiarCampo}
                onBlur={marcarTocado}
                error={errorDe("telefono")}
              />
            </div>
          </fieldset>

          <fieldset className="bloque">
            <legend>Datos del crédito</legend>
            <div className="bloque__grid">
              <CampoFormulario
                id="creditoId"
                etiqueta="Tipo de crédito"
                tipo="select"
                valor={formulario.creditoId}
                onCambiar={cambiarCampo}
                onBlur={marcarTocado}
                error={errorDe("creditoId")}
              >
                <option value="">Selecciona una opción</option>
                {creditos.map((credito) => (
                  <option key={credito.id} value={credito.id}>
                    {credito.nombre} · {credito.tasaEA}% E.A.
                  </option>
                ))}
              </CampoFormulario>

              <CampoFormulario
                id="monto"
                etiqueta="Monto solicitado (COP)"
                tipo="number"
                placeholder="Ej. 10000000"
                valor={formulario.monto}
                onCambiar={cambiarCampo}
                onBlur={marcarTocado}
                error={errorDe("monto")}
                ayuda={
                  creditoSeleccionado
                    ? `Entre ${formatearCOP(creditoSeleccionado.montoMin)} y ${formatearCOP(
                        creditoSeleccionado.montoMax
                      )}.`
                    : "Primero elige el tipo de crédito."
                }
              />

              <CampoFormulario
                id="plazo"
                etiqueta="Plazo (meses)"
                tipo="select"
                valor={formulario.plazo}
                onCambiar={cambiarCampo}
                onBlur={marcarTocado}
                error={errorDe("plazo")}
              >
                <option value="">Selecciona el plazo</option>
                {plazosDisponibles(creditoSeleccionado).map((meses) => (
                  <option key={meses} value={meses}>
                    {meses} meses
                  </option>
                ))}
              </CampoFormulario>

              <div className="bloque__ancho-completo">
                <CampoFormulario
                  id="destino"
                  etiqueta="Destino del crédito"
                  tipo="textarea"
                  placeholder="Describe brevemente en qué vas a utilizar el dinero..."
                  valor={formulario.destino}
                  onCambiar={cambiarCampo}
                  onBlur={marcarTocado}
                  error={errorDe("destino")}
                  ayuda={`${formulario.destino.trim().length}/15 caracteres mínimos.`}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="bloque">
            <legend>Datos laborales</legend>
            <div className="bloque__grid bloque__grid--tres">
              <CampoFormulario
                id="empresa"
                etiqueta="Empresa donde trabajas"
                placeholder="Nombre de la empresa"
                valor={formulario.empresa}
                onCambiar={cambiarCampo}
                onBlur={marcarTocado}
                error={errorDe("empresa")}
              />
              <CampoFormulario
                id="cargo"
                etiqueta="Cargo"
                placeholder="Cargo actual"
                valor={formulario.cargo}
                onCambiar={cambiarCampo}
                onBlur={marcarTocado}
                error={errorDe("cargo")}
              />
              <CampoFormulario
                id="ingresos"
                etiqueta="Ingresos mensuales (COP)"
                tipo="number"
                placeholder="Ej. 3500000"
                valor={formulario.ingresos}
                onCambiar={cambiarCampo}
                onBlur={marcarTocado}
                error={errorDe("ingresos")}
              />
            </div>
          </fieldset>

          <label className="terminos">
            <input
              type="checkbox"
              name="aceptaTerminos"
              checked={formulario.aceptaTerminos}
              onChange={(evento) => {
                cambiarCampo("aceptaTerminos", evento.target.checked);
                marcarTocado("aceptaTerminos");
              }}
            />
            <span>
              Autorizo el tratamiento de mis datos personales para el estudio de esta solicitud.
            </span>
          </label>
          {errorDe("aceptaTerminos") && <p className="campo__error">{errorDe("aceptaTerminos")}</p>}

          <div className="solicitud__acciones">
            <button type="button" className="boton boton--secundario" onClick={limpiarFormulario}>
              Limpiar formulario
            </button>
            <button type="submit" className="boton boton--primario" disabled={!formularioValido}>
              Enviar solicitud
            </button>
          </div>
          {!formularioValido && (
            <p className="solicitud__pendientes">
              Completa los campos pendientes para habilitar el envío.
            </p>
          )}
        </form>

        <aside className="solicitud__lateral">
          <div className="resumen">
            <h3>Resumen de tu solicitud</h3>
            {hayResumen ? (
              <>
                <p className="resumen__credito">{creditoSeleccionado.nombre}</p>
                <p className="resumen__cuota">{formatearCOP(resumen.cuota)}</p>
                <p className="resumen__etiqueta">Cuota mensual estimada</p>
                <ul className="resumen__lista">
                  <li>
                    <span>Monto</span>
                    <strong>{formatearCOP(monto)}</strong>
                  </li>
                  <li>
                    <span>Plazo</span>
                    <strong>{plazo} meses</strong>
                  </li>
                  <li>
                    <span>Tasa</span>
                    <strong>{creditoSeleccionado.tasaEA}% E.A.</strong>
                  </li>
                  <li>
                    <span>Total a pagar</span>
                    <strong>{formatearCOP(resumen.totalPagado)}</strong>
                  </li>
                  <li>
                    <span>Intereses</span>
                    <strong>{formatearCOP(resumen.totalIntereses)}</strong>
                  </li>
                </ul>
              </>
            ) : (
              <p className="texto-muted">
                Elige el tipo de crédito, el monto y el plazo para ver tu cuota mensual estimada.
              </p>
            )}
          </div>

          <div className="historial">
            <h3>Solicitudes enviadas ({solicitudes.length})</h3>
            {solicitudes.length === 0 ? (
              <p className="texto-muted">
                Todavía no has enviado solicitudes en esta sesión. Las que envíes aparecerán aquí.
              </p>
            ) : (
              <ul>
                {solicitudes.map((solicitud) => (
                  <li key={solicitud.id} className="historial__item">
                    <div>
                      <strong>{solicitud.radicado}</strong>
                      <span className="texto-muted"> · {solicitud.fecha}</span>
                    </div>
                    <p className="texto-muted">
                      {solicitud.credito} — {formatearCOP(solicitud.monto)} a {solicitud.plazo}{" "}
                      meses
                    </p>
                    <p className="historial__cuota">
                      Cuota: {formatearCOP(solicitud.cuota)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Solicitud;
