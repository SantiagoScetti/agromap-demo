/**
 * AgroMap · Mock data
 * -------------------------------------------------------------
 * Datos simulados de un campo agropecuario en Corrientes, Argentina.
 * No hay backend: todo se computa en memoria a partir de estas constantes.
 *
 * Convención de coordenadas: Leaflet usa [lat, lng]. Los polígonos están
 * dibujados sobre un campo real al sureste de la ciudad de Corrientes.
 */

// ---------------------------------------------------------------------------
// Catálogo de cultivos: color en el mapa + precio de referencia (USD / tn)
// ---------------------------------------------------------------------------
export const cropCatalog = {
  soja: { label: 'Soja', color: '#19c37d', priceTn: 340, emoji: '🌱' },
  maiz: { label: 'Maíz', color: '#ffd23f', priceTn: 195, emoji: '🌽' },
  girasol: { label: 'Girasol', color: '#ff8c42', priceTn: 410, emoji: '🌻' },
  trigo: { label: 'Trigo', color: '#4cc9f0', priceTn: 240, emoji: '🌾' },
  barbecho: { label: 'Sin cultivo', color: '#8a99a8', priceTn: 0, emoji: '🟫' },
}

// Colores del modo "Ver por rentabilidad"
export const profitColors = {
  rentable: '#00e676',
  desvio: '#ff5252',
}

// Centro y zoom del mapa (sureste de Corrientes capital)
export const mapCenter = [-27.52, -58.7]
export const mapZoom = 14

// ---------------------------------------------------------------------------
// Parcelas (datos base). Los campos económicos derivados se calculan abajo.
//
// dataReal       → seguimiento mensual ya ocurrido (línea continua del gráfico)
// dataProyectada → estimación desde "HOY" al cierre de campaña (línea punteada)
//   El primer punto de dataProyectada repite el último de dataReal para que
//   ambos tramos se conecten visualmente en la marca "HOY".
// ---------------------------------------------------------------------------
const baseParcels = [
  {
    id: 'norte',
    name: 'Lote Norte',
    cultivo: 'soja',
    hectareas: 142,
    costoHa: 268, // USD / ha
    rindeTnHa: 3.9, // tn / ha (rendimiento proyectado a inicio de campaña)
    rindeRealTnHa: 4.0, // tn / ha medido/estimado a la fecha
    objetivoHa: 980, // margen objetivo de la campaña (USD / ha)
    siembra: '2025-12-01',
    cosecha: '2026-06-25',
    progreso: 90, // % de avance de la campaña actual
    coordinates: [
      [-27.5005, -58.7065],
      [-27.5005, -58.6935],
      [-27.5135, -58.6935],
      [-27.5135, -58.7065],
    ],
    dataReal: [
      { mes: 'Dic', ingreso: 150000, rendimiento: 3.4 },
      { mes: 'Ene', ingreso: 160000, rendimiento: 3.6 },
      { mes: 'Feb', ingreso: 169000, rendimiento: 3.7 },
      { mes: 'Mar', ingreso: 178000, rendimiento: 3.85 },
      { mes: 'Abr', ingreso: 185000, rendimiento: 3.95 },
      { mes: 'May', ingreso: 189000, rendimiento: 4.0 },
    ],
    dataProyectada: [
      { mes: 'May', ingreso: 189000, rendimiento: 4.0 },
      { mes: 'Jun', ingreso: 193000, rendimiento: 4.05 },
    ],
  },
  {
    id: 'sur',
    name: 'Lote Sur',
    cultivo: 'maiz',
    hectareas: 168,
    costoHa: 245,
    rindeTnHa: 4.1,
    rindeRealTnHa: 3.42,
    objetivoHa: 700, // objetivo exigente → genera desvío >10% (alerta de campaña)
    siembra: '2026-01-15',
    cosecha: '2026-07-20',
    progreso: 76,
    coordinates: [
      [-27.5265, -58.7065],
      [-27.5265, -58.6935],
      [-27.5395, -58.6935],
      [-27.5395, -58.7065],
    ],
    dataReal: [
      { mes: 'Ene', ingreso: 130000, rendimiento: 4.0 },
      { mes: 'Feb', ingreso: 126000, rendimiento: 3.9 },
      { mes: 'Mar', ingreso: 120000, rendimiento: 3.75 },
      { mes: 'Abr', ingreso: 115000, rendimiento: 3.6 },
      { mes: 'May', ingreso: 112000, rendimiento: 3.5 },
      { mes: 'Jun', ingreso: 110000, rendimiento: 3.42 },
    ],
    dataProyectada: [
      { mes: 'Jun', ingreso: 110000, rendimiento: 3.42 },
      { mes: 'Jul', ingreso: 108000, rendimiento: 3.38 },
    ],
  },
  {
    id: 'este',
    name: 'Lote Este',
    cultivo: 'girasol',
    hectareas: 96,
    costoHa: 232,
    rindeTnHa: 2.7,
    rindeRealTnHa: 2.85,
    objetivoHa: 700,
    siembra: '2025-11-10',
    cosecha: '2026-04-15',
    progreso: 100,
    coordinates: [
      [-27.5135, -58.6935],
      [-27.5135, -58.6805],
      [-27.5265, -58.6805],
      [-27.5265, -58.6935],
    ],
    dataReal: [
      { mes: 'Nov', ingreso: 92000, rendimiento: 2.4 },
      { mes: 'Dic', ingreso: 98000, rendimiento: 2.55 },
      { mes: 'Ene', ingreso: 104000, rendimiento: 2.68 },
      { mes: 'Feb', ingreso: 106000, rendimiento: 2.78 },
    ],
    dataProyectada: [
      { mes: 'Feb', ingreso: 106000, rendimiento: 2.78 },
      { mes: 'Mar', ingreso: 108000, rendimiento: 2.82 },
      { mes: 'Abr', ingreso: 109000, rendimiento: 2.85 },
    ],
  },
  {
    id: 'oeste',
    name: 'Lote Oeste',
    cultivo: 'trigo',
    hectareas: 124,
    costoHa: 205,
    rindeTnHa: 3.1,
    rindeRealTnHa: 3.02,
    objetivoHa: 520,
    siembra: '2025-06-15',
    cosecha: '2025-12-05',
    progreso: 100,
    coordinates: [
      [-27.5135, -58.7195],
      [-27.5135, -58.7065],
      [-27.5265, -58.7065],
      [-27.5265, -58.7195],
    ],
    dataReal: [
      { mes: 'Jun', ingreso: 78000, rendimiento: 2.7 },
      { mes: 'Jul', ingreso: 82000, rendimiento: 2.85 },
      { mes: 'Ago', ingreso: 86000, rendimiento: 2.95 },
      { mes: 'Sep', ingreso: 89000, rendimiento: 3.02 },
    ],
    dataProyectada: [
      { mes: 'Sep', ingreso: 89000, rendimiento: 3.02 },
      { mes: 'Oct', ingreso: 90500, rendimiento: 3.06 },
      { mes: 'Nov', ingreso: 91500, rendimiento: 3.08 },
      { mes: 'Dic', ingreso: 92256, rendimiento: 3.1 },
    ],
  },
  {
    id: 'central',
    name: 'Lote Central',
    cultivo: 'barbecho',
    hectareas: 88,
    costoHa: 95, // mantenimiento / barbecho
    rindeTnHa: 0,
    rindeRealTnHa: 0,
    objetivoHa: 0,
    siembra: null,
    cosecha: null,
    progreso: 0,
    coordinates: [
      [-27.5135, -58.7065],
      [-27.5135, -58.6935],
      [-27.5265, -58.6935],
      [-27.5265, -58.7065],
    ],
    dataReal: [],
    dataProyectada: [],
  },
]

/**
 * Enriquece cada parcela con sus métricas económicas derivadas.
 *  - ingresoTotal  = precio cultivo × rinde × hectáreas
 *  - costoTotal    = costo/ha × hectáreas
 *  - rentabilidad  = ingreso − costo (USD estimados)
 *  - objetivo      = margen objetivo × hectáreas
 *  - desviacionPct = qué tan lejos está la rentabilidad del objetivo
 *  - rindeDiffPct  = rinde real vs. proyectado (%)
 *  - status        = 'rentable' (cumple objetivo) | 'desvio' (por debajo)
 */
function enrich(p) {
  const crop = cropCatalog[p.cultivo]
  const ingresoHa = crop.priceTn * p.rindeTnHa
  const ingresoTotal = Math.round(ingresoHa * p.hectareas)
  const costoTotal = Math.round(p.costoHa * p.hectareas)
  const rentabilidad = ingresoTotal - costoTotal
  const objetivo = Math.round(p.objetivoHa * p.hectareas)
  const rindeTotal = Math.round(p.rindeTnHa * p.hectareas * 10) / 10
  const rentable = rentabilidad > 0 && rentabilidad >= objetivo
  const desviacionPct =
    objetivo !== 0
      ? Math.round(((rentabilidad - objetivo) / Math.abs(objetivo)) * 1000) / 10
      : rentabilidad < 0
        ? -100
        : 0
  const rindeDiffPct =
    p.rindeTnHa > 0
      ? Math.round(((p.rindeRealTnHa - p.rindeTnHa) / p.rindeTnHa) * 1000) / 10
      : null

  return {
    ...p,
    crop,
    precioTn: crop.priceTn,
    ingresoHa: Math.round(ingresoHa),
    ingresoTotal,
    costoTotal,
    rentabilidad,
    rentabilidadHa: Math.round(rentabilidad / p.hectareas),
    objetivo,
    rindeTotal,
    rentable,
    desviacionPct,
    rindeDiffPct,
    status: rentable ? 'rentable' : 'desvio',
  }
}

export const parcels = baseParcels.map(enrich)

// Mapa cultivo → parcela (cada cultivo activo corresponde a un lote)
export const parcelByCrop = parcels.reduce((acc, p) => {
  if (p.cultivo !== 'barbecho') acc[p.cultivo] = p
  return acc
}, {})

// Cultivos activos (para el selector del gráfico real vs. proyectado)
export const activeCrops = parcels
  .filter((p) => p.cultivo !== 'barbecho')
  .map((p) => ({ key: p.cultivo, label: p.crop.label, color: p.crop.color }))

// ---------------------------------------------------------------------------
// Proyección mensual (12 meses) — ingresos vs. costos estimados (USD)
// Picos coherentes con las cosechas: trigo (dic), girasol (feb–abr),
// soja + maíz (jun–jul).
// ---------------------------------------------------------------------------
export const monthlyProjection = [
  { mes: 'Jul', ingresos: 12000, costos: 6000 },
  { mes: 'Ago', ingresos: 8000, costos: 4000 },
  { mes: 'Sep', ingresos: 6000, costos: 14000 },
  { mes: 'Oct', ingresos: 9000, costos: 9000 },
  { mes: 'Nov', ingresos: 14000, costos: 18000 },
  { mes: 'Dic', ingresos: 78000, costos: 11000 },
  { mes: 'Ene', ingresos: 22000, costos: 22000 },
  { mes: 'Feb', ingresos: 64000, costos: 9000 },
  { mes: 'Mar', ingresos: 41000, costos: 8000 },
  { mes: 'Abr', ingresos: 95000, costos: 7000 },
  { mes: 'May', ingresos: 38000, costos: 12000 },
  { mes: 'Jun', ingresos: 134000, costos: 15000 },
]

// ---------------------------------------------------------------------------
// Totales agregados (para los KPI del Dashboard)
// ---------------------------------------------------------------------------
export function getTotals() {
  const totalHa = parcels.reduce((a, p) => a + p.hectareas, 0)
  const totalCosto = parcels.reduce((a, p) => a + p.costoTotal, 0)
  const totalIngreso = parcels.reduce((a, p) => a + p.ingresoTotal, 0)
  const totalRindeTn = parcels.reduce((a, p) => a + p.rindeTotal, 0)
  const totalRentabilidad = parcels.reduce((a, p) => a + p.rentabilidad, 0)
  return {
    totalHa,
    totalCosto,
    totalIngreso,
    totalRindeTn: Math.round(totalRindeTn * 10) / 10,
    totalRentabilidad,
    costoPromedioHa: Math.round(totalCosto / totalHa),
    lotesRentables: parcels.filter((p) => p.rentable).length,
    lotesDesvio: parcels.filter((p) => !p.rentable).length,
  }
}

// Distribución de hectáreas por cultivo (para el donut)
export function getCropDistribution() {
  const map = new Map()
  for (const p of parcels) {
    const prev = map.get(p.cultivo) || 0
    map.set(p.cultivo, prev + p.hectareas)
  }
  return [...map.entries()].map(([cultivo, hectareas]) => ({
    cultivo,
    label: cropCatalog[cultivo].label,
    color: cropCatalog[cultivo].color,
    hectareas,
  }))
}

// ---------------------------------------------------------------------------
// Alerta de campaña: ¿hay algún lote ACTIVO con desvío > 10%?
// (El barbecho se excluye: no tiene campaña activa.)
// ---------------------------------------------------------------------------
export function getCampaignAlert(threshold = -10) {
  const active = parcels.filter((p) => p.cultivo !== 'barbecho')
  const worst = active.reduce(
    (min, p) => (p.desviacionPct < min.desviacionPct ? p : min),
    active[0],
  )
  if (worst && worst.desviacionPct < threshold) {
    return { status: 'desvio', parcel: worst }
  }
  return { status: 'ok' }
}

// ---------------------------------------------------------------------------
// Ranking de lotes por rentabilidad / ha (incluye rinde real vs proyectado)
// ---------------------------------------------------------------------------
export function getRanking() {
  return [...parcels].sort((a, b) => b.rentabilidadHa - a.rentabilidadHa)
}

// ---------------------------------------------------------------------------
// Próxima cosecha relativa a una fecha de referencia (countdown del KPI)
// ---------------------------------------------------------------------------
export function getNextHarvest(refDate = new Date()) {
  const ref = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate())
  const upcoming = parcels
    .filter((p) => p.cosecha)
    .map((p) => {
      const [y, m, d] = p.cosecha.split('-').map(Number)
      const date = new Date(y, m - 1, d)
      const days = Math.round((date - ref) / 86400000)
      return { parcel: p, date, days }
    })
    .filter((x) => x.days >= 0)
    .sort((a, b) => a.days - b.days)
  return upcoming[0] || null
}

// ---------------------------------------------------------------------------
// Serie real + proyectada de un cultivo, lista para el gráfico.
// Devuelve filas { mes, real, proj } para la métrica pedida ('ingreso' | 'rendimiento')
// y el mes que marca "HOY" (frontera entre real y proyección).
// ---------------------------------------------------------------------------
export function getRealVsProjected(cropKey, metric = 'ingreso') {
  const p = parcelByCrop[cropKey]
  if (!p) return { rows: [], hoyMes: null }

  const real = p.dataReal || []
  const proj = p.dataProyectada || []
  const hoyMes = proj.length ? proj[0].mes : real.length ? real[real.length - 1].mes : null

  // Orden de meses: todos los reales + los proyectados (sin repetir la frontera)
  const projExtra = proj.filter((d) => !real.some((r) => r.mes === d.mes))
  const meses = [...real.map((d) => d.mes), ...projExtra.map((d) => d.mes)]

  const rows = meses.map((mes) => {
    const r = real.find((d) => d.mes === mes)
    const j = proj.find((d) => d.mes === mes)
    return {
      mes,
      real: r ? r[metric] : null,
      proj: j ? j[metric] : null,
    }
  })

  return { rows, hoyMes }
}

// ---------------------------------------------------------------------------
// Helpers de formato (es-AR)
// ---------------------------------------------------------------------------
const usdFmt = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 })
const numFmt = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 })

export const formatUSD = (n) => `US$ ${usdFmt.format(Math.round(n))}`
export const formatUSDShort = (n) => {
  const abs = Math.abs(n)
  if (abs >= 1000) return `US$ ${numFmt.format(n / 1000)}k`
  return `US$ ${usdFmt.format(n)}`
}
export const formatNumber = (n) => numFmt.format(n)
export const formatTn = (n) => `${numFmt.format(n)} tn`
export const formatDate = (iso) => {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
