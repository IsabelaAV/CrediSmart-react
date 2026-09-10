import { Link } from "react-router-dom";
import { creditos } from "../data/creditsData.js";
import "./Footer.css";

const enlacesCompania = ["Sobre nosotros", "Tasas y tarifas", "Preguntas frecuentes", "Trabaja con nosotros"];
const redes = ["f", "ig", "X", "in"];

function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__contenido">
        <div className="footer__marca">
          <Link to="/" className="footer__logo">
            Credit<span>Smart</span>
          </Link>
          <p className="footer__descripcion">
            Financiera digital vigilada por la Superintendencia Financiera. Crédito responsable,
            aprobación en minutos y sin filas.
          </p>
          <ul className="footer__redes">
            {redes.map((red) => (
              <li key={red}>{red}</li>
            ))}
          </ul>
        </div>

        <div className="footer__columna">
          <h4>Productos</h4>
          <ul>
            {creditos.map((credito) => (
              <li key={credito.id}>{credito.nombre}</li>
            ))}
          </ul>
        </div>

        <div className="footer__columna">
          <h4>Compañía</h4>
          <ul>
            {enlacesCompania.map((enlace) => (
              <li key={enlace}>{enlace}</li>
            ))}
          </ul>
        </div>

        <div className="footer__columna">
          <h4>Contacto</h4>
          <ul>
            <li>Línea nacional: 01 8000 123 456</li>
            <li>Bogotá: (601) 742 1000</li>
            <li>hola@creditsmart.co</li>
          </ul>
        </div>
      </div>

      <div className="container footer__legal">
        <p>© {anio} CreditSmart · FinTech Solutions S.A.S. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
