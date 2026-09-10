import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

// Los enlaces se guardan en un array para renderizarlos con .map()
// y no repetir la misma estructura cuatro veces.
const enlaces = [
  { to: "/", texto: "Inicio" },
  { to: "/catalogo", texto: "Catálogo" },
  { to: "/simulador", texto: "Simulador" },
  { to: "/solicitud", texto: "Solicitar crédito" },
];

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className="navbar">
      <div className="container navbar__contenido">
        <NavLink to="/" className="navbar__marca" onClick={cerrarMenu}>
          Credit<span>Smart</span>
        </NavLink>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={menuAbierto}
          aria-label="Abrir menú de navegación"
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar__nav ${menuAbierto ? "navbar__nav--abierto" : ""}`}>
          <ul className="navbar__lista">
            {enlaces.map((enlace) => (
              <li key={enlace.to}>
                <NavLink
                  to={enlace.to}
                  onClick={cerrarMenu}
                  className={({ isActive }) =>
                    `navbar__enlace ${isActive ? "navbar__enlace--activo" : ""}`
                  }
                >
                  {enlace.texto}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
