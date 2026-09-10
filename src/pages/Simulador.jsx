import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BarraBusqueda from "../components/BarraBusqueda.jsx";
import EstadoVacio from "../components/EstadoVacio.jsx";
import { creditos } from "../data/creditsData.js";
import { formatearCOP, formatearCompacto, simularCredito } from "../utils/finanzas.js";
import "./Simulador.css";

/** Mantiene un valor dentro de los límites del crédito elegido. */
function limitar(valor, minimo, maximo) {
  return Math.min(Math.max(valor, minimo), maximo);
}

/** Redondea el monto al múltiplo de paso más cercano para que el slider se sienta natural. */
function pasoDelMonto(credito) {
  return credito.montoMax > 100000000 ? 5000000 : 500000;
}

function Simulador() {
  const { state } = useLocation();

  // Si el usuario llegó desde una tarjeta ("Simular"), ese crédito viene preseleccionado.
  const creditoInicial = creditos.find((credito) => credito.id === state?.creditoId) ?? creditos[0];

  const [busqueda, setBusqueda] = useState("");
  const [creditoId, setCreditoId] = useState(creditoInicial.id);
  const [monto, setMonto] = useState(
    Math.round((creditoInicial.montoMin + creditoInicial.montoMax) / 2)
  );
  // El plazo inicial se redondea a un múltiplo de 6 para que coincida con el paso del slider.
  const [plazo, setPlazo] = useState(
    Math.round((creditoInicial.plazoMin + creditoInicial.plazoMax) / 12) * 6
  );

  const creditoActivo = creditos.find((credito) => credito.id === creditoId);

  // Al cambiar de crédito ajustamos monto y plazo a los límites del nuevo producto.
  const seleccionarCredito = (credito) => {
    setCreditoId(credito.id);
    setMonto((montoActual) => limitar(montoActual, credito.montoMin, credito.montoMax));
    setPlazo((plazoActual) => limitar(plazoActual, credito.plazoMin, credito.plazoMax));
  };

  const resultadosBusqueda = creditos.filter((credito) =>
    credito.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  // El resumen se recalcula en cada render: mover un slider actualiza la cuota al instante.
  const { cuota, totalPagado, totalIntereses, tasaMensual } = simularCredito(
    monto,
    creditoActivo.tasaEA,
    plazo
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
                      credito.id === creditoId ? "opcion-credito--activa" : ""
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
              mensaje={`Ningún producto coincide con “${busqueda}”.`}
              onLimpiar={() => setBusqueda("")}
            />
          )}

          <div className="simulador__control">
            <div className="simulador__control-cabecera">
              <label htmlFor="monto">Monto solicitado</label>
              <strong>{formatearCOP(monto)}</strong>
            </div>
            <input
              id="monto"
              type="range"
              className="slider"
              min={creditoActivo.montoMin}
              max={creditoActivo.montoMax}
              step={pasoDelMonto(creditoActivo)}
              value={monto}
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
              <strong>{plazo} meses</strong>
            </div>
            <input
              id="plazo"
              type="range"
              className="slider"
              min={creditoActivo.plazoMin}
              max={creditoActivo.plazoMax}
              step={6}
              value={plazo}
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
              <small>{plazo} cuotas</small>
            </div>
            <div>
              <span>Costo del crédito</span>
              <strong>{formatearCOP(totalIntereses)}</strong>
              <small>Intereses + seguros</small>
            </div>
            <div>
              <span>Monto solicitado</span>
              <strong>{formatearCOP(monto)}</strong>
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
            state={{ creditoId: creditoActivo.id, monto, plazo }}
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
