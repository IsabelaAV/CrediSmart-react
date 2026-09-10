import { Link } from "react-router-dom";

function NoEncontrada() {
  return (
    <section className="seccion container" style={{ textAlign: "center" }}>
      <h1>404</h1>
      <p className="subtitulo" style={{ margin: "0.75rem auto 2rem" }}>
        La página que buscas no existe o fue movida.
      </p>
      <Link to="/" className="boton boton--primario">
        Volver al inicio
      </Link>
    </section>
  );
}

export default NoEncontrada;
