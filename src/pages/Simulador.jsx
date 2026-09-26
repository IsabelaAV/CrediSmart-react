import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BarraBusqueda from "../components/BarraBusqueda.jsx";
import EstadoVacio from "../components/EstadoVacio.jsx";
import { useCreditos } from "../hooks/useCreditos.js";
import { formatearCOP, formatearCompacto, simularCredito } from "../utils/finanzas.js";
import "./Simulador.css";

function limitar(valor, minimo, maximo) {
  return Math.min(Math.max(valor, minimo), maximo);
}

function pasoDelMonto(credito) {
  return credito.montoMax > 100000000 ? 5000000 : 500000;
}

function Simulador() {
  const { state } = useLocation();
  const { creditos, cargando, error } = useCreditos();

  const [busqueda, setBusqueda] = useState("");
  const [creditoId, setCreditoId] = useState(null);
  const [monto, setMonto] = useState(null);
  const [plazo, setPlazo] = useState(null);

  if (cargando) {
    return (
      <section className="seccion container">
        <div className="estado-carga">
          <div className="estado-carga__spinner" />
          <p>Cargando simulador...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="seccion container">
        <div className="alerta alerta--error" role="alert">
          <span aria-hidden="true">⚠️</span>
          <p>No pudimos cargar el simulador. Verifica tu conexión e intenta de nuevo.</p>
        </div>
      </section>
    );
  }

  if (creditos.length === 0) return null;

  const creditoInicial = creditos.find((c) => c.id === state?.creditoId) ?? creditos[0];
  const idActivo = creditoId ?? creditoInicial.id;
  const creditoActivo = creditos.find((c) => c.id === idActivo) ?? creditos[0];

  const montoActivo =
    monto ?? Math.round((creditoActivo.montoMin + creditoActivo.montoMax) / 2);
  const plazoActivo =
    plazo ?? Math.round((creditoActivo.plazoMin + creditoActivo.plazoMax) / 12) * 6;

  const seleccionarCredito = (credito) => {
    setCreditoId(credito.id);
    setMonto(limitar(montoActivo, credito.montoMin, credito.montoMax));
    setPlazo(limitar(plazoActivo, credito.plazoMin, credito.plazoMax));
  };

  const resultadosBusqueda = creditos.filter((credito) =>
    credito.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  const { cuota, totalPagado, totalIntereses, tasaMensual } = simularCredito(
    montoActivo,
    creditoActivo.tasaEA,
    plazoActivo
  );

  const porcentajeIntereses = totalPagado > 0 ? (totalIntereses / totalPagado) * 100 : 0;

  return (
    <section className="seccion container">
      <div className="encabezado-pagina">
        <span className="chip">Simulador</span>
        <h1>Calcula tu crédito antes de solicitarlo</h1>
        <p className="subtitulo">
          Elige el producto, mueve los controles y observa cómo cambia tu cuota. Los valores son
          informativos y no constituyen una aprobación.
        </p>
      </div>

      <div className="simulador">
        <div className="simulador__panel tarjeta">
          <BarraBusqueda
            valor={busqueda}
            onCambiar={setBusqueda}
            etiqueta="Buscar crédito para simular"
            placeholder="Busca el crédito que quieres simular..."
          />

          {resultadosBusqueda.length > 0 ? (
            <ul className="simulador__opciones">
              {resultadosBusqueda.map((credito) => (
                <li key={credito.id}>
                  <button
                    type="button"
                    className={`opcion-credito ${
                      credito.id === idActivo ? "opcion-credito--activa" : ""
                    }`}
                    onClick={() => seleccionarCredito(credito)}
                  >
                    <span className="opcion-credito__icono" aria-hidden="true">
                      {credito.icono}
                    </span>
                    <span className="opcion-credito__texto">
                      <strong>{credito.nombre}</strong>
                      <small>{credito.tasaEA}% E.A.</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <EstadoVacio
              titulo="No hay créditos disponibles"
              mensaje={`Ningún producto coincide con "${busqueda}".`}
              onLimpiar={() => setBusqueda("")}
            />
          )}

          <div className="simulador__control">
            <div className="simulador__control-cabecera">
              <label htmlFor="monto">Monto solicitado</label>
              <strong>{formatearCOP(montoActivo)}</strong>
            </div>
            <input
              id="monto"
              type="range"
              className="slider"
              min={creditoActivo.montoMin}
              max={creditoActivo.montoMax}
              step={pasoDelMonto(creditoActivo)}
              value={montoActivo}
              onChange={(evento) => setMonto(Number(evento.target.value))}
            />
            <div className="simulador__limites">
              <span>{formatearCompacto(creditoActivo.montoMin)}</span>
              <span>{formatearCompacto(creditoActivo.montoMax)}</span>
            </div>
          </div>

          <div className="simulador__control">
            <div className="simulador__control-cabecera">
              <label htmlFor="plazo">Plazo</label>
              <strong>{plazoActivo} meses</strong>
            </div>
            <input
              id="plazo"
              type="range"
              className="slider"
              min={creditoActivo.plazoMin}
              max={creditoActivo.plazoMax}
              step={6}
              value={plazoActivo}
              onChange={(evento) => setPlazo(Number(evento.target.value))}
            />
            <div className="simulador__limites">
              <span>{creditoActivo.plazoMin} meses</span>
              <span>{creditoActivo.plazoMax} meses</span>
            </div>
          </div>

          <p className="simulador__nota">
            <span className="chip chip--mint">Tasa aplicada</span> {creditoActivo.tasaEA}% E.A. (
            {tasaMensual.toFixed(2)}% mensual vencida). Incluye seguro de vida deudor.
          </p>
        </div>

        <aside className="resultado">
          <div className="resultado__cabecera">
            <span>Cuota mensual estimada</span>
            <span className="chip chip--oscuro">{creditoActivo.nombre}</span>
          </div>

          <p className="resultado__cuota">{formatearCOP(cuota)}</p>

          <div className="resultado__grid">
            <div>
              <span>Tasa de interés</span>
              <strong>{creditoActivo.tasaEA}%</strong>
              <small>Efectiva anual</small>
            </div>
            <div>
              <span>Total a pagar</span>
              <strong>{formatearCOP(totalPagado)}</strong>
              <small>{plazoActivo} cuotas</small>
            </div>
            <div>
              <span>Costo del crédito</span>
              <strong>{formatearCOP(totalIntereses)}</strong>
              <small>Intereses + seguros</small>
            </div>
            <div>
              <span>Monto solicitado</span>
              <strong>{formatearCOP(montoActivo)}</strong>
              <small>Capital</small>
            </div>
          </div>

          <div className="resultado__barra" aria-hidden="true">
            <div className="resultado__barra-capital" style={{ width: `${100 - porcentajeIntereses}%` }} />
          </div>
          <p className="resultado__leyenda">
            {(100 - porcentajeIntereses).toFixed(0)}% capital · {porcentajeIntereses.toFixed(0)}%
            intereses
          </p>

          <Link
            to="/solicitud"
            state={{ creditoId: creditoActivo.id, monto: montoActivo, plazo: plazoActivo }}
            className="boton boton--claro boton--bloque"
          >
            Solicitar este crédito
          </Link>
          <p className="resultado__disclaimer">
            Simulación referencial. La tasa final depende del estudio de crédito y de tu perfil de
            riesgo.
          </p>
        </aside>
      </div>
    </section>
  );
}

export default Simulador;
