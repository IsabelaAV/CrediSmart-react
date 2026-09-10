import { Link } from "react-router-dom";
import CreditCard from "../components/CreditCard.jsx";
import { creditos } from "../data/creditsData.js";
import { formatearCOP } from "../utils/finanzas.js";
import "./Inicio.css";

const ventajas = [
  {
    id: "digital",
    icono: "📱",
    titulo: "100% digital",
    texto: "Solicita tu crédito desde el celular, sin filas ni papeleo físico.",
  },
  {
    id: "tasas",
    icono: "📊",
    titulo: "Tasas transparentes",
    texto: "Ves la tasa y el costo total antes de firmar. Cero costos ocultos.",
  },
  {
    id: "rapido",
    icono: "⚡",
    titulo: "Respuesta en minutos",
    texto: "Estudiamos tu solicitud de forma automática y te avisamos el mismo día.",
  },
  {
    id: "seguro",
    icono: "🔒",
    titulo: "Datos protegidos",
    texto: "Ciframos tu información y estamos vigilados por la Superintendencia Financiera.",
  },
];

const pasos = [
  { id: 1, titulo: "Explora el catálogo", texto: "Compara nuestras líneas de crédito y sus tasas." },
  { id: 2, titulo: "Simula tu cuota", texto: "Ajusta monto y plazo hasta encontrar la cuota ideal." },
  { id: 3, titulo: "Diligencia el formulario", texto: "Completa tus datos personales y laborales." },
  { id: 4, titulo: "Recibe el desembolso", texto: "Aprobado el crédito, el dinero llega a tu cuenta." },
];

function Inicio() {
  // Solo los créditos marcados como destacados, ordenados de la tasa más baja a la más alta.
  const destacados = creditos
    .filter((credito) => credito.destacado)
    .sort((a, b) => a.tasaEA - b.tasaEA);

  // La tasa mínima y el monto máximo se calculan a partir de los datos, no se escriben a mano.
  const tasaMinima = Math.min(...creditos.map((credito) => credito.tasaEA));
  const montoMaximo = Math.max(...creditos.map((credito) => credito.montoMax));

  return (
    <>
      <section className="hero">
        <div className="container hero__contenido">
          <div className="hero__texto">
            <span className="chip chip--oscuro">Vigilada por la Superintendencia Financiera</span>
            <h1>
              Tu futuro financiero empieza con <span>decisiones inteligentes</span>
            </h1>
            <p>
              Compara {creditos.length} líneas de crédito, simula tu cuota real y solicita en línea.
              Sin letra menuda y sin visitas a una oficina.
            </p>
            <div className="hero__acciones">
              <Link to="/catalogo" className="boton boton--claro">
                Ver catálogo
              </Link>
              <Link to="/simulador" className="boton boton--fantasma">
                Simular mi crédito
              </Link>
            </div>
          </div>

          <ul className="hero__metricas">
            <li>
              <strong>{tasaMinima}%</strong>
              <span>Tasa E.A. desde</span>
            </li>
            <li>
              <strong>{formatearCOP(montoMaximo)}</strong>
              <span>Monto máximo</span>
            </li>
            <li>
              <strong>240</strong>
              <span>Meses de plazo máximo</span>
            </li>
            <li>
              <strong>24 h</strong>
              <span>Desembolso promedio</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="seccion container">
        <div className="encabezado-pagina">
          <h2>¿Por qué elegir CreditSmart?</h2>
          <p className="subtitulo">
            Somos una fintech colombiana: menos trámites, más claridad sobre lo que vas a pagar.
          </p>
        </div>

        <div className="ventajas">
          {ventajas.map((ventaja) => (
            <article key={ventaja.id} className="ventaja">
              <span className="ventaja__icono" aria-hidden="true">
                {ventaja.icono}
              </span>
              <h3>{ventaja.titulo}</h3>
              <p className="texto-muted">{ventaja.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="seccion seccion--gris">
        <div className="container">
          <div className="encabezado-pagina">
            <h2>Créditos destacados</h2>
            <p className="subtitulo">
              Estos son los productos con mejor tasa del portafolio. Puedes verlos todos en el catálogo.
            </p>
          </div>

          <div className="grid grid--creditos">
            {destacados.map((credito) => (
              <CreditCard key={credito.id} credito={credito} />
            ))}
          </div>

          <div className="inicio__ver-todos">
            <Link to="/catalogo" className="boton boton--secundario">
              Ver los {creditos.length} productos
            </Link>
          </div>
        </div>
      </section>

      <section className="seccion container">
        <div className="encabezado-pagina">
          <h2>¿Cómo solicitar tu crédito?</h2>
          <p className="subtitulo">Cuatro pasos, todos en línea.</p>
        </div>

        <ol className="pasos">
          {pasos.map((paso) => (
            <li key={paso.id} className="paso">
              <span className="paso__numero">{paso.id}</span>
              <h3>{paso.titulo}</h3>
              <p className="texto-muted">{paso.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container">
        <div className="cta">
          <div>
            <h2>¿Listo para dar el siguiente paso?</h2>
            <p>Encuentra la línea de crédito perfecta para ti hoy mismo.</p>
          </div>
          <Link to="/solicitud" className="boton boton--claro">
            Solicitar crédito ahora
          </Link>
        </div>
      </section>
    </>
  );
}

export default Inicio;
