import { Link } from "react-router-dom";
import { formatearCOP } from "../utils/finanzas.js";
import "./CreditCard.css";

/**
 * Tarjeta reutilizable de un producto crediticio.
 * Recibe el objeto del crédito por props y lo desestructura para leerlo más fácil.
 * `mostrarRequisitos` permite reutilizar la misma tarjeta en el inicio (versión corta)
 * y en el catálogo (versión completa).
 */
function CreditCard({ credito, mostrarRequisitos = false }) {
  const { id, nombre, categoria, icono, tasaEA, montoMin, montoMax, plazoMax, descripcion, requisitos } =
    credito;

  return (
    <article className="credit-card">
      <header className="credit-card__cabecera">
        <span className="credit-card__icono" aria-hidden="true">
          {icono}
        </span>
        <span className="chip">{categoria}</span>
      </header>

      <h3 className="credit-card__titulo">{nombre}</h3>
      <p className="credit-card__descripcion">{descripcion}</p>

      <dl className="credit-card__datos">
        <div>
          <dt>Tasa E.A.</dt>
          <dd className="credit-card__tasa">{tasaEA}%</dd>
        </div>
        <div>
          <dt>Plazo máximo</dt>
          <dd>{plazoMax} meses</dd>
        </div>
        <div className="credit-card__rango">
          <dt>Monto</dt>
          <dd>
            {formatearCOP(montoMin)} — {formatearCOP(montoMax)}
          </dd>
        </div>
      </dl>

      {mostrarRequisitos && (
        <div className="credit-card__requisitos">
          <p className="credit-card__requisitos-titulo">Requisitos</p>
          <ul>
            {requisitos.map((requisito) => (
              <li key={requisito}>{requisito}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="credit-card__acciones">
        <Link to="/simulador" state={{ creditoId: id }} className="boton boton--secundario">
          Simular
        </Link>
        <Link to="/solicitud" state={{ creditoId: id }} className="boton boton--primario">
          Solicitar
        </Link>
      </div>
    </article>
  );
}

export default CreditCard;
