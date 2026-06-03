/**
 * AgroMap · Mock data
 * -------------------------------------------------------------
 * Datos simulados de un campo agropecuario en Corrientes, Argentina.
 * No hay backend: todo se computa en memoria a partir de estas constantes.
 *
 * Convención de coordenadas: Leaflet usa [lat, lng]. Los polígonos están
 * dibujados sobre un campo real al sureste de la ciudad de Corrientes.
 */

export const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

// Mes actual de la campaña (la demo está ambientada en junio de 2026).
// Divide el tramo "real" (sólido) del "proyectado" (punteado) en los gráficos.
export const HOY_MES = 5 // Jun

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
// Parcelas (datos base). Los campos derivados se calculan más abajo.
//
// rindeTnHa     → rinde objetivo / plan a inicio de campaña (tn/ha)
// rindeRealTnHa → rinde esperado HOY según cómo viene el cultivo (tn/ha)
// escenario     → factores y probabilidades para las 3 proyecciones a cosecha
//   opt/pes     → multiplican el rinde esperado para el techo / piso
//   priceHi/Lo  → variación de precio en cada escenario
//   probs       → probabilidad (%) de cada escenario (suman 100)
// ---------------------------------------------------------------------------
const baseParcels = [
  {
    id: 'norte',
    name: 'Lote Norte',
    cultivo: 'soja',
    hectareas: 142,
    costoHa: 268,
    rindeTnHa: 3.9,
    rindeRealTnHa: 4.0,
    objetivoHa: 980,
    siembra: '2026-03-05',
    cosecha: '2026-09-20',
    progreso: 45,
    escenario: { opt: 1.12, pes: 0.85, priceHi: 1.1, priceLo: 0.92, probs: { base: 55, opt: 30, pes: 15 } },
    coordinates: [
      [-27.5005, -58.7065],
      [-27.5005, -58.6935],
      [-27.5135, -58.6935],
      [-27.5135, -58.7065],
    ],
  },
  {
    id: 'sur',
    name: 'Lote Sur',
    cultivo: 'maiz',
    hectareas: 168,
    costoHa: 245,
    rindeTnHa: 4.1,
    rindeRealTnHa: 3.42, // viene por debajo del plan (falta de lluvias)
    objetivoHa: 700, // objetivo exigente → desvío >10% (alerta de campaña)
    siembra: '2026-02-10',
    cosecha: '2026-08-25',
    progreso: 58,
    escenario: { opt: 1.1, pes: 0.78, priceHi: 1.06, priceLo: 0.86, probs: { base: 40, opt: 12, pes: 48 } },
    coordinates: [
      [-27.5265, -58.7065],
      [-27.5265, -58.6935],
      [-27.5395, -58.6935],
      [-27.5395, -58.7065],
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
    siembra: '2026-01-12',
    cosecha: '2026-07-15',
    progreso: 77,
    escenario: { opt: 1.13, pes: 0.88, priceHi: 1.09, priceLo: 0.93, probs: { base: 58, opt: 27, pes: 15 } },
    coordinates: [
      [-27.5135, -58.6935],
      [-27.5135, -58.6805],
      [-27.5265, -58.6805],
      [-27.5265, -58.6935],
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
    siembra: '2026-05-08',
    cosecha: '2026-11-20',
    progreso: 13,
    escenario: { opt: 1.1, pes: 0.84, priceHi: 1.07, priceLo: 0.9, probs: { base: 50, opt: 22, pes: 28 } },
    coordinates: [
      [-27.5135, -58.7195],
      [-27.5135, -58.7065],
      [-27.5265, -58.7065],
      [-27.5265, -58.7195],
    ],
  },
  {
    id: 'central',
    name: 'Lote Central',
    cultivo: 'barbecho',
    hectareas: 88,
    costoHa: 95,
    rindeTnHa: 0,
    rindeRealTnHa: 0,
    objetivoHa: 0,
    siembra: null,
    cosecha: null,
    progreso: 0,
    escenario: null,
    coordinates: [
      [-27.5135, -58.7065],
      [-27.5135, -58.6935],
      [-27.5265, -58.6935],
      [-27.5265, -58.7065],
    ],
  },
]

const monthIndex = (iso) => (iso ? Number(iso.split('-')[1]) - 1 : null)

/**
 * Enriquece cada parcela con sus métricas económicas derivadas.
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
    p.rindeTnHa > 0 ? Math.round(((p.rindeRealTnHa - p.rindeTnHa) / p.rindeTnHa) * 1000) / 10 : null

  return {
    ...p,
    crop,
    precioTn: crop.priceTn,
    siembraMes: monthIndex(p.siembra),
    cosechaMes: monthIndex(p.cosecha),
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

// Cultivos activos (para el selector del gráfico de proyección)
export const activeCrops = parcels
  .filter((p) => p.cultivo !== 'barbecho')
  .map((p) => ({ key: p.cultivo, label: p.crop.label, color: p.crop.color }))

// ---------------------------------------------------------------------------
// Proyección mensual del establecimiento (Ene–Dic) — ingresos vs. costos (USD)
// Costos altos al sembrar (inversión); ingresos al cosechar cada cultivo.
// ---------------------------------------------------------------------------
export const monthlyProjection = [
  { mes: 'Ene', ingresos: 4000, costos: 16000 }, // siembra girasol
  { mes: 'Feb', ingresos: 3000, costos: 19000 }, // siembra maíz
  { mes: 'Mar', ingresos: 3000, costos: 18000 }, // siembra soja
  { mes: 'Abr', ingresos: 5000, costos: 12000 },
  { mes: 'May', ingresos: 6000, costos: 17000 }, // siembra trigo
  { mes: 'Jun', ingresos: 8000, costos: 11000 },
  { mes: 'Jul', ingresos: 95000, costos: 7000 }, // cosecha girasol
  { mes: 'Ago', ingresos: 120000, costos: 6000 }, // cosecha maíz
  { mes: 'Sep', ingresos: 140000, costos: 6000 }, // cosecha soja
  { mes: 'Oct', ingresos: 30000, costos: 5000 },
  { mes: 'Nov', ingresos: 92000, costos: 8000 }, // cosecha trigo
  { mes: 'Dic', ingresos: 12000, costos: 6000 },
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
// ---------------------------------------------------------------------------
export function getCampaignAlert(threshold = -10) {
  const active = parcels.filter((p) => p.cultivo !== 'barbecho')
  const worst = active.reduce((min, p) => (p.desviacionPct < min.desviacionPct ? p : min), active[0])
  if (worst && worst.desviacionPct < threshold) return { status: 'desvio', parcel: worst }
  return { status: 'ok' }
}

// ---------------------------------------------------------------------------
// Ranking de lotes por rentabilidad / ha
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
// PROYECCIÓN POR CULTIVO (Ene–Dic) con 3 escenarios.
//
// Modelo agronómico simple e interpretable:
//  - El rinde (tn/ha) CRECE desde la siembra (0) hasta la cosecha (rinde final),
//    siguiendo una curva de crecimiento suave (smoothstep).
//  - Hasta HOY es dato real (línea continua). Desde HOY se abre en 3 escenarios
//    (base / optimista / pesimista) que llegan a su rinde final en la cosecha.
//  - Ingreso = rinde × hectáreas × precio. En los escenarios también varía el
//    precio (mejor/peor), por eso la banda de ingresos es más amplia.
//
// Devuelve filas { mes, real, base, rango:[piso, techo] } para la métrica pedida
// ('ingreso' | 'rendimiento') + los meses clave y las probabilidades.
// ---------------------------------------------------------------------------
const smoothstep = (x) => {
  const t = Math.min(1, Math.max(0, x))
  return t * t * (3 - 2 * t)
}

export function getProjection(cropKey, metric = 'ingreso') {
  const p = parcelByCrop[cropKey]
  if (!p || p.siembraMes == null) {
    return { rows: [], siembraMes: null, hoyMes: HOY_MES, cosechaMes: null, escenarios: null, finales: null }
  }

  const { siembraMes, cosechaMes, hectareas, precioTn } = p
  const span = Math.max(1, cosechaMes - siembraMes)
  const isMoney = metric === 'ingreso'

  const progAt = (m) => smoothstep((m - siembraMes) / span)
  const eHoy = progAt(HOY_MES)

  // Rinde final de cada escenario (tn/ha)
  const finalBase = p.rindeRealTnHa
  const finalOpt = Math.round(finalBase * p.escenario.opt * 100) / 100
  const finalPes = Math.round(finalBase * p.escenario.pes * 100) / 100
  const rindeHoy = finalBase * eHoy

  // factor de avance de la divergencia entre HOY y cosecha (0 en HOY, 1 en cosecha)
  const fanAt = (m) => {
    const e = progAt(m)
    return eHoy >= 1 ? 1 : Math.min(1, Math.max(0, (e - eHoy) / (1 - eHoy)))
  }

  const yieldScenario = (finalY, m) => rindeHoy + (finalY - rindeHoy) * fanAt(m)
  const priceMult = (target, m) => 1 + (target - 1) * fanAt(m)

  const toMoney = (yieldHa, pMult) => Math.round(yieldHa * hectareas * precioTn * pMult)
  const toYield = (yieldHa) => Math.round(yieldHa * 100) / 100

  const rows = MONTHS.map((mes, m) => {
    const row = { mes, real: null, base: null, rango: null }
    if (m < siembraMes || m > cosechaMes) return row

    if (m <= HOY_MES) {
      const y = finalBase * progAt(m)
      row.real = isMoney ? toMoney(y, 1) : toYield(y)
    }
    if (m >= HOY_MES) {
      const yb = yieldScenario(finalBase, m)
      const yo = yieldScenario(finalOpt, m)
      const yp = yieldScenario(finalPes, m)
      if (isMoney) {
        row.base = toMoney(yb, 1)
        row.rango = [toMoney(yp, priceMult(p.escenario.priceLo, m)), toMoney(yo, priceMult(p.escenario.priceHi, m))]
      } else {
        row.base = toYield(yb)
        row.rango = [toYield(yp), toYield(yo)]
      }
      if (m === HOY_MES) row.real = isMoney ? toMoney(rindeHoy, 1) : toYield(rindeHoy)
    }
    return row
  })

  const finalesYield = { base: finalBase, opt: finalOpt, pes: finalPes }
  const finales = isMoney
    ? {
        base: toMoney(finalBase, 1),
        opt: toMoney(finalOpt, p.escenario.priceHi),
        pes: toMoney(finalPes, p.escenario.priceLo),
      }
    : finalesYield

  return {
    rows,
    siembraMes,
    hoyMes: HOY_MES,
    cosechaMes,
    escenarios: p.escenario.probs, // { base, opt, pes } en %
    finales,
  }
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
