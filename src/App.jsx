import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Inicio from "./pages/Inicio.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import Simulador from "./pages/Simulador.jsx";
import Solicitud from "./pages/Solicitud.jsx";
import NoEncontrada from "./pages/NoEncontrada.jsx";

function App() {
  // Las solicitudes viven en el estado de App (solo en memoria, como pide la guía)
  // para que la página de solicitud pueda agregarlas y mostrarlas en el historial.
  const [solicitudes, setSolicitudes] = useState([]);

  const agregarSolicitud = (solicitud) => {
    setSolicitudes((anteriores) => [solicitud, ...anteriores]);
  };

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/simulador" element={<Simulador />} />
          <Route
            path="/solicitud"
            element={<Solicitud solicitudes={solicitudes} onAgregarSolicitud={agregarSolicitud} />}
          />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
