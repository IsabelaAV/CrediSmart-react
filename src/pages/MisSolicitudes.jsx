import { useState, useEffect } from "react";
import { obtenerSolicitudes, obtenerSolicitudesPorEmail } from "../services/solicitudesService.js";
import { formatearCOP } from "../utils/finanzas.js";
import "./MisSolicitudes.css";

function MisSolicitudes() {
  const [email, setEmail] = useState("");
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtroCredito, setFiltroCredito] = useState("Todos");

  async function cargarTodas() {
    setCargando(true);
    setError(null);
    try {
      const datos = await obtenerSolicitudes();
      setSolicitudes(datos);
    } catch {
      setError("No pudimos cargar las solicitudes. Verifica tu conexión a internet e intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarTodas();
  }, []);

  async function buscarPorEmail(evento) {
    evento.preventDefault();
    setFiltroCredito("Todos");

    if (!email.trim()) {
      cargarTodas();
      return;
    }

    setCargando(true);
    setError(null);
    try {
      const datos = await obtenerSolicitudesPorEmail(email.trim());
      setSolicitudes(datos);
    } catch {
      setError("Error al buscar solicitudes. Verifica tu conexión e intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  function limpiarBusqueda() {
    setEmail("");
    setFiltroCredito("Todos");
    cargarTodas();
  }

  const tiposCredito = ["Todos", ...new Set(solicitudes.map((s) => s.credito))];

  const solicitudesFiltradas =
    filtroCredito === "Todos"
      ? solicitudes
      : solicitudes.filter((s) => s.credito === filtroCredito);

  return (
    <section className="seccion container">
      <div className="encabezado-pagina">
        <span className="chip">Consulta</span>
        <h1>Mis solicitudes</h1>
        <p className="subtitulo">
          Consulta las solicitudes de crédito guardadas. Filtra por correo electrónico o tipo de
          crédito.
        </p>
      </div>

      <form className="mis-solicitudes__busqueda tarjeta" onSubmit={buscarPorEmail}>
        <div className="mis-solicitudes__campo">
          <label className="campo__etiqueta" htmlFor="buscar-email">
            Correo electrónico
          </label>
          <input
            id="buscar-email"
            type="email"
            className="campo__control"
            placeholder="Ingresa tu correo para buscar tus solicitudes..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mis-solicitudes__acciones">
          <button type="submit" className="boton boton--primario" disabled={cargando}>
            {cargando ? "Buscando..." : "Buscar por email"}
          </button>
          <button
            type="button"
            className="boton boton--secundario"
            disabled={cargando}
            onClick={limpiarBusqueda}
          >
            Ver todas
          </button>
        </div>
      </form>

      {solicitudes.length > 1 && (
        <div className="mis-solicitudes__filtro-tipo">
          <label className="campo__etiqueta" htmlFor="filtro-tipo">
            Filtrar por tipo de crédito
          </label>
          <select
            id="filtro-tipo"
            className="campo__control"
            value={filtroCredito}
            onChange={(e) => setFiltroCredito(e.target.value)}
          >
            {tiposCredito.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>
      )}

      {cargando && (
        <div className="estado-carga">
          <div className="estado-carga__spinner" />
          <p>Cargando solicitudes...</p>
        </div>
      )}

      {error && (
        <div className="alerta alerta--error" role="alert">
          <span aria-hidden="true">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {!cargando && !error && solicitudes.length === 0 && (
        <div className="mis-solicitudes__vacio tarjeta">
          <span className="mis-solicitudes__vacio-icono" aria-hidden="true">
            📋
          </span>
          <h3>No hay solicitudes</h3>
          <p className="texto-muted">
            {email.trim()
              ? `No encontramos solicitudes para "${email}". Verifica el correo o busca con otro.`
              : "Todavía no hay solicitudes registradas. Crea una desde la página de Solicitar crédito."}
          </p>
        </div>
      )}

      {!cargando && solicitudesFiltradas.length > 0 && (
        <>
          <p className="mis-solicitudes__conteo">
            {solicitudesFiltradas.length === 1
              ? "1 solicitud encontrada"
              : `${solicitudesFiltradas.length} solicitudes encontradas`}
          </p>

          <div className="mis-solicitudes__lista">
            {solicitudesFiltradas.map((sol) => (
              <article key={sol.id} className="solicitud-card tarjeta">
                <div className="solicitud-card__cabecera">
                  <strong className="solicitud-card__radicado">{sol.radicado}</strong>
                  <span className="chip chip--mint">Radicada</span>
                </div>

                <div className="solicitud-card__grid">
                  <div>
                    <span className="solicitud-card__etiqueta">Crédito</span>
                    <strong>{sol.credito}</strong>
                  </div>
                  <div>
                    <span className="solicitud-card__etiqueta">Monto</span>
                    <strong>{formatearCOP(sol.monto)}</strong>
                  </div>
                  <div>
                    <span className="solicitud-card__etiqueta">Plazo</span>
                    <strong>{sol.plazo} meses</strong>
                  </div>
                  <div>
                    <span className="solicitud-card__etiqueta">Cuota mensual</span>
                    <strong className="solicitud-card__cuota">{formatearCOP(sol.cuota)}</strong>
                  </div>
                </div>

                <div className="solicitud-card__pie">
                  <span>
                    {sol.nombre} · {sol.email}
                  </span>
                  <span className="texto-muted">{sol.fecha}</span>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default MisSolicitudes;
