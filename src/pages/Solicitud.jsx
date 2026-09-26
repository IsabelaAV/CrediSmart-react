import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CampoFormulario from "../components/CampoFormulario.jsx";
import { useCreditos } from "../hooks/useCreditos.js";
import { formatearCOP, simularCredito } from "../utils/finanzas.js";
import { validarSolicitud } from "../utils/validaciones.js";
import { guardarSolicitud } from "../services/solicitudesService.js";
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

function plazosDisponibles(credito) {
  if (!credito) return [12, 24, 36, 48, 60];
  const opciones = [];
  for (let meses = 12; meses <= credito.plazoMax; meses += 12) {
    if (meses >= credito.plazoMin) opciones.push(meses);
  }
  return opciones;
}

function Solicitud() {
  const { state } = useLocation();
  const { creditos, cargando: cargandoCreditos, error: errorCreditos } = useCreditos();

  const valoresIniciales = {
    ...FORMULARIO_VACIO,
    creditoId: state?.creditoId ? String(state.creditoId) : "",
    monto: state?.monto ? String(state.monto) : "",
    plazo: state?.plazo ? String(state.plazo) : "",
  };

  const [formulario, setFormulario] = useState(valoresIniciales);
  const [tocados, setTocados] = useState({});
  const [mensajeExito, setMensajeExito] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState("");

  const creditoSeleccionado = creditos.find(
    (credito) => credito.id === formulario.creditoId
  );

  const errores = validarSolicitud(formulario, creditoSeleccionado);
  const formularioValido = Object.keys(errores).length === 0;

  const errorDe = (campo) => (tocados[campo] ? errores[campo] : undefined);

  const cambiarCampo = (campo, valor) => {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
    setMensajeExito("");
    setErrorGuardar("");
  };

  const marcarTocado = (campo) => {
    setTocados((anteriores) => ({ ...anteriores, [campo]: true }));
  };

  const limpiarFormulario = () => {
    setFormulario(FORMULARIO_VACIO);
    setTocados({});
    setMensajeExito("");
    setErrorGuardar("");
  };

  const monto = Number(formulario.monto) || 0;
  const plazo = Number(formulario.plazo) || 0;
  const hayResumen = Boolean(creditoSeleccionado) && monto > 0 && plazo > 0;
  const resumen = hayResumen
    ? simularCredito(monto, creditoSeleccionado.tasaEA, plazo)
    : { cuota: 0, totalPagado: 0, totalIntereses: 0 };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    if (!formularioValido) {
      const todos = Object.keys(FORMULARIO_VACIO).reduce(
        (acumulado, campo) => ({ ...acumulado, [campo]: true }),
        {}
      );
      setTocados(todos);
      return;
    }

    setGuardando(true);
    setErrorGuardar("");

    try {
      const nuevaSolicitud = {
        radicado: `CS-${Date.now().toString().slice(-6)}`,
        nombre: formulario.nombre.trim(),
        email: formulario.email.trim(),
        cedula: formulario.cedula.trim(),
        telefono: formulario.telefono.trim(),
        credito: creditoSeleccionado.nombre,
        monto,
        plazo,
        cuota: resumen.cuota,
        destino: formulario.destino.trim(),
        empresa: formulario.empresa.trim(),
        cargo: formulario.cargo.trim(),
        ingresos: Number(formulario.ingresos),
        fecha: new Date().toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      };

      await guardarSolicitud(nuevaSolicitud);
      setFormulario(FORMULARIO_VACIO);
      setTocados({});
      setMensajeExito(
        `¡Listo, ${nuevaSolicitud.nombre}! Radicamos tu solicitud ${nuevaSolicitud.radicado}. Te escribiremos a ${nuevaSolicitud.email}.`
      );
    } catch {
      setErrorGuardar(
        "No pudimos guardar tu solicitud. Verifica tu conexión a internet e intenta de nuevo."
      );
    } finally {
      setGuardando(false);
    }
  };

  if (cargandoCreditos) {
    return (
      <section className="seccion container">
        <div className="estado-carga">
          <div className="estado-carga__spinner" />
          <p>Cargando formulario de solicitud...</p>
        </div>
      </section>
    );
  }

  if (errorCreditos) {
    return (
      <section className="seccion container">
        <div className="alerta alerta--error" role="alert">
          <span aria-hidden="true">⚠️</span>
          <p>No pudimos cargar los tipos de crédito. Verifica tu conexión e intenta de nuevo.</p>
        </div>
      </section>
    );
  }

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
          <div>
            <p>{mensajeExito}</p>
            <Link to="/mis-solicitudes" className="alerta__enlace">
              Ver mis solicitudes →
            </Link>
          </div>
        </div>
      )}

      {errorGuardar && (
        <div className="alerta alerta--error" role="alert">
          <span aria-hidden="true">⚠️</span>
          <p>{errorGuardar}</p>
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
            <button
              type="submit"
              className="boton boton--primario"
              disabled={!formularioValido || guardando}
            >
              {guardando ? "Guardando..." : "Enviar solicitud"}
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
        </aside>
      </div>
    </section>
  );
}

export default Solicitud;
