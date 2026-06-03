# 🌾 AgroMap

Prototipo funcional de una plataforma SaaS de **gestión agropecuaria**. Mapea
parcelas reales sobre imagen satelital, calcula rentabilidad por lote y resume
la campaña en un dashboard con gráficos. Sin backend: todos los datos son
_mock data_ en memoria.

> Demo pensada para un hackathon universitario. Establecimiento de ejemplo en
> Corrientes, Argentina (5 lotes · 618 ha).

## ✨ Funcionalidades

- **Modo claro / oscuro** con toggle en la navbar, persistencia en `localStorage`
  y transición animada (300 ms). Sin parpadeo al cargar.
- **Mapa satelital** (ESRI World Imagery, sin API key) con 5 parcelas dibujadas
  como polígonos.
- Color por **cultivo** (soja, maíz, girasol, trigo, barbecho) o toggle a vista
  por **rentabilidad** (verde = rentable / rojo = con desvío).
- **Edición de parcelas** sobre el mapa con _leaflet-geoman_: mover vértices,
  agregar vértices, mover el lote completo y rotarlo, con _Guardar_ / _Cancelar_.
- **Panel de detalle** por lote: hectáreas, fechas, costo/ha, rinde proyectado,
  rentabilidad estimada y avance de campaña. En mobile es un **bottom sheet
  draggable** (se cierra arrastrando o tocando el fondo).
- **Dashboard** con:
  - Alerta de campaña (rojo si un lote activo supera 10% de desvío, verde si no).
  - 5 KPIs con números **animados** (count-up) y elevación al hover.
  - Línea (ingresos vs. costos · 12 meses), barras agrupadas, donut.
  - **Real vs. proyectado por cultivo**: una sola línea continua (real) +
    punteada (proyección) con marca vertical "HOY", selector de cultivo y
    toggle Ingresos / Rendimiento.
  - Ranking de lotes (rinde real vs. proyectado, diferencia %) y tabla resumen.
  - Gráficos que aparecen al entrar en viewport y tooltips adaptados al tema.
- 100% responsive (mobile / tablet / desktop), respeta `prefers-reduced-motion`.

## 🧱 Stack

React + Vite · react-leaflet + leaflet · **leaflet-geoman** · Recharts ·
Tailwind CSS v4.

## 🚀 Cómo correrlo

Las dependencias ya están declaradas en `package.json`. Desde esta carpeta:

```bash
npm install
npm run dev
```

Abrí la URL que imprime Vite (por defecto http://localhost:5173).

> Si partís de un proyecto Vite vacío, los paquetes necesarios son:
> `npm install react-leaflet leaflet recharts tailwindcss @tailwindcss/vite @geoman-io/leaflet-geoman-free`

### Build de producción

```bash
npm run build
npm run preview
```

## 📁 Estructura

```
src/
├── App.jsx                 # ThemeProvider + layout + cambio de vista
├── main.jsx                # Entry point (importa leaflet.css)
├── index.css               # Tailwind v4 + tema claro/oscuro (tokens @theme)
├── data/mockData.js        # 5 parcelas, métricas derivadas, real/proyectado
├── theme/ThemeContext.jsx  # Estado de tema + colores de charts
├── hooks/
│   ├── useCountUp.js       # Animación de números
│   ├── useInView.js        # IntersectionObserver (reveal)
│   └── useMediaQuery.js    # Breakpoints reactivos
├── views/
│   ├── MapView.jsx         # Mapa + toggle + leyenda + edición (geoman)
│   └── Dashboard.jsx       # KPIs + gráficos + tablas
└── components/
    ├── Navbar.jsx          # Logo + nav + toggle de tema
    ├── ParcelPanel.jsx     # Panel lateral (desktop) / bottom sheet (mobile)
    ├── KPICard.jsx         # KPI con count-up
    ├── AlertCard.jsx       # Alerta de campaña
    ├── RankingTable.jsx    # Ranking de lotes
    ├── RealVsProjectedChart.jsx
    ├── Reveal.jsx          # Animación de entrada al viewport
    └── Icons.jsx           # Íconos SVG (estilo Lucide)
```

## 🎨 Tema

Definido CSS-first en `src/index.css` (`@theme`). `tailwind.config.js` se incluye
como referencia / compatibilidad con un pipeline v3. Paleta: fondo `#060a0f`,
cards `#0d1a14`, acento verde `#00e676`.

---

Todos los valores económicos son simulados y se calculan en
`src/data/mockData.js`.
