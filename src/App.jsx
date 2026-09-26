import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Inicio from "./pages/Inicio.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import Simulador from "./pages/Simulador.jsx";
import Solicitud from "./pages/Solicitud.jsx";
import MisSolicitudes from "./pages/MisSolicitudes.jsx";
import NoEncontrada from "./pages/NoEncontrada.jsx";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/simulador" element={<Simulador />} />
          <Route path="/solicitud" element={<Solicitud />} />
          <Route path="/mis-solicitudes" element={<MisSolicitudes />} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
