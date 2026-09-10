# CreditSmart · Aplicación web dinámica con React

**Estudiante:** Isabela A. V.
**Curso:** Ingeniería Web I — IU Digital
**Actividad:** S30 · EA2 — Desarrollo de aplicación web dinámica con React

---

## Descripción del proyecto

CreditSmart es la versión dinámica en React del sitio estático de la actividad anterior. Es una
fintech ficticia colombiana donde una persona puede **comparar líneas de crédito, simular su cuota
mensual y radicar una solicitud** sin salir del navegador.

Todo el contenido sale de un archivo de datos (`src/data/creditsData.js`), no está escrito en el
HTML: las tarjetas, los filtros, las opciones de los selects y hasta los productos del footer se
generan recorriendo ese array.

### Qué se puede hacer

| Página | Ruta | Funcionalidad |
| --- | --- | --- |
| Inicio | `/` | Hero con métricas calculadas desde los datos, ventajas, créditos destacados (`.filter()` + `.sort()`) y pasos del proceso. |
| Catálogo | `/catalogo` | Búsqueda en tiempo real (ignora tildes y mayúsculas), filtro por categoría, filtro por rango de monto, ordenamiento por tasa/monto/plazo, botón *Limpiar filtros* y mensaje "No hay créditos disponibles". |
| Simulador | `/simulador` | Selector de crédito con buscador, sliders de monto y plazo limitados a cada producto y cálculo de cuota, total a pagar e intereses que se actualiza al instante. |
| Solicitar crédito | `/solicitud` | Formulario 100% controlado con validaciones mientras se escribe, resumen en vivo de la cuota, envío que agrega la solicitud a un array en memoria, mensaje de éxito y limpieza automática. |

### Detalles de implementación que vale la pena mirar

- **Cálculo de la cuota** (`src/utils/finanzas.js`): se usa la fórmula de amortización francesa
  `C = P · i(1+i)^n / ((1+i)^n − 1)`, con la tasa efectiva anual del crédito convertida a mensual
  (`i = (1 + EA)^(1/12) − 1`). El formato de moneda se hace con `Intl.NumberFormat("es-CO")`.
- **Validaciones** (`src/utils/validaciones.js`): una función pura recibe el formulario y devuelve
  un objeto de errores; como se ejecuta en cada render, los mensajes aparecen en tiempo real.
  Incluye una regla de capacidad de pago: la cuota no puede superar el 40 % de los ingresos.
- **Comunicación entre páginas**: al pulsar *Simular* o *Solicitar* en una tarjeta se navega con
  `state` de React Router, así el crédito (y el monto/plazo simulado) llegan preseleccionados.

## Tecnologías utilizadas

- **React 19** (componentes funcionales y hooks: `useState`)
- **React Router 7** (`BrowserRouter`, `Routes`, `Route`, `NavLink`, `Link`, `useLocation`)
- **Vite 8** como bundler y servidor de desarrollo
- **CSS3 propio** (variables CSS, Grid, Flexbox, `clamp()`, diseño responsive) — sin frameworks
- **Oxlint** para el análisis estático
- **JavaScript ES6+** (`.map()`, `.filter()`, `.sort()`, desestructuración, spread, módulos)

> Sobre el diseño: siguiendo la retroalimentación del docente, antes de programar revisé
> interfaces de fintechs que ya resuelven este problema (Nu, Nequi, Lulo Bank, Wise). De ahí salen
> las decisiones visuales: fondo claro con tarjetas amplias, un único color de marca más un acento
> verde, la cuota mostrada como número grande sobre panel oscuro, sliders en lugar de campos
> numéricos y validaciones que acompañan al usuario en vez de castigarlo al enviar.

## Estructura del proyecto

```
CrediSmart-react/
├── docs/capturas/          # Imágenes usadas en este README
├── public/
├── src/
│   ├── components/         # Componentes reutilizables (uno por archivo)
│   │   ├── BarraBusqueda.jsx
│   │   ├── CampoFormulario.jsx
│   │   ├── CreditCard.jsx
│   │   ├── EstadoVacio.jsx
│   │   ├── FiltrosCreditos.jsx
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx
│   ├── data/
│   │   └── creditsData.js  # Array de productos, rangos y categorías
│   ├── pages/              # Una página por ruta
│   │   ├── Inicio.jsx
│   │   ├── Catalogo.jsx
│   │   ├── Simulador.jsx
│   │   ├── Solicitud.jsx
│   │   └── NoEncontrada.jsx
│   ├── utils/
│   │   ├── finanzas.js     # Formato COP y cálculo de cuota
│   │   └── validaciones.js # Reglas del formulario
│   ├── App.jsx             # Rutas y estado de las solicitudes
│   ├── main.jsx            # Punto de entrada + BrowserRouter
│   └── index.css           # Sistema de diseño (tokens y primitivas)
├── index.html
├── package.json
└── vite.config.js
```

Cada componente tiene su propio archivo `.css` al lado, con estilos con nombres tipo BEM.

## Instrucciones de instalación

Requisitos: **Node.js 18 o superior** y npm.

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd CrediSmart-react

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor de desarrollo
npm run dev
```

La aplicación queda disponible en <http://localhost:5173>.

Otros comandos:

```bash
npm run build     # Compila para producción en dist/
npm run preview   # Sirve la versión compilada
npm run lint      # Revisa el código con Oxlint
```

## Capturas de pantalla

### Inicio
![Página de inicio de CreditSmart](docs/capturas/inicio.png)

### Catálogo con búsqueda y filtros
![Catálogo de créditos con buscador y filtros](docs/capturas/catalogo.png)

### Simulador de crédito
![Simulador con sliders y cuota mensual](docs/capturas/simulador.png)

### Formulario de solicitud
![Formulario de solicitud con resumen en vivo](docs/capturas/solicitud.png)

## Créditos y referencias

- [Documentación oficial de React](https://react.dev) — hooks y componentes.
- [Documentación de React Router](https://reactrouter.com) — `BrowserRouter`, `NavLink` y
  navegación con `state`.
- [MDN Web Docs](https://developer.mozilla.org) — `Intl.NumberFormat`, `String.normalize()` y
  métodos de arrays.
- Fórmula de amortización francesa: material de clase de matemática financiera.
