import { useState } from 'react'
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import {
  activeCrops,
  getProjection,
  cropCatalog,
  MONTHS,
  profitColors,
  formatUSD,
  formatUSDShort,
  formatNumber,
} from '../data/mockData'
import { useTheme } from '../theme/ThemeContext'
import { useInView } from '../hooks/useInView'

const METRICS = [
  { id: 'ingreso', label: 'Ingresos' },
  { id: 'rendimiento', label: 'Rendimiento' },
]

export default function RealVsProjectedChart() {
  const { chart } = useTheme()
  const [cropKey, setCropKey] = useState('maiz')
  const [metric, setMetric] = useState('ingreso')
  const [ref, inView] = useInView()

  const color = cropCatalog[cropKey]?.color ?? chart.accent
  const isMoney = metric === 'ingreso'
  const { rows, siembraMes, hoyMes, cosechaMes, escenarios, finales } = getProjection(cropKey, metric)

  const fmt = (v) => (isMoney ? formatUSD(v) : `${formatNumber(v)} tn/ha`)
  const fmtShort = (v) => (isMoney ? formatUSDShort(v) : `${formatNumber(v)} tn/ha`)
  const fmtAxis = (v) => (isMoney ? `${Math.round(v / 1000)}k` : formatNumber(v))

  const mostProb = escenarios
    ? Object.entries(escenarios).sort((a, b) => b[1] - a[1])[0][0]
    : 'base'

  // Tooltip
  const Tip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    const row = payload[0].payload
    return (
      <div
        className="rounded-xl px-3 py-2 text-xs shadow-card"
        style={{ background: chart.tooltipBg, border: `1px solid ${chart.tooltipBorder}` }}
      >
        <div className="mb-1 font-bold" style={{ color: chart.text }}>
          {label}
        </div>
        {row.real != null && (
          <Row color={color} dashed={false} label="Real" value={fmt(row.real)} chart={chart} />
        )}
        {row.base != null && (
          <Row color={color} dashed label="Proyección base" value={fmt(row.base)} chart={chart} />
        )}
        {row.rango && row.base != null && (
          <div className="mt-0.5 text-[11px]" style={{ color: chart.muted }}>
            Escenarios: {fmtShort(row.rango[0])} – {fmtShort(row.rango[1])}
          </div>
        )}
      </div>
    )
  }

  const refLabel = (text, fill) => ({
    value: text,
    position: 'top',
    fill,
    fontSize: 10,
    fontWeight: 700,
  })

  const scenarioCards = [
    { key: 'opt', label: 'Optimista', hint: 'mejores lluvias / precio', color: profitColors.rentable },
    { key: 'base', label: 'Base', hint: 'condiciones actuales', color },
    { key: 'pes', label: 'Pesimista', hint: 'sequía / baja de precio', color: profitColors.desvio },
  ]

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-agro-border bg-agro-card p-4 shadow-card sm:p-5"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(16px)',
        transition: 'opacity 600ms ease, transform 600ms cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* Encabezado + controles */}
      <div className="mb-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-agro-text sm:text-base">
              Proyección de campaña por cultivo
            </h3>
            <p className="text-xs text-agro-muted">
              El cultivo crece de la siembra a la cosecha. Continua = real · punteada = proyección ·
              banda = escenarios
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-agro-card-soft p-1 ring-1 ring-agro-border">
            {METRICS.map((m) => {
              const active = metric === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => setMetric(m.id)}
                  className={[
                    'cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition-all',
                    active ? 'bg-agro-accent text-agro-bg' : 'text-agro-muted hover:text-agro-text',
                  ].join(' ')}
                >
                  {m.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selector de cultivo */}
        <div className="flex flex-wrap gap-1.5">
          {activeCrops.map((c) => {
            const active = cropKey === c.key
            return (
              <button
                key={c.key}
                onClick={() => setCropKey(c.key)}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all"
                style={{
                  borderColor: active ? c.color : 'transparent',
                  backgroundColor: active ? `${c.color}22` : 'var(--color-agro-card-soft)',
                  color: active ? 'var(--color-agro-text)' : 'var(--color-agro-muted)',
                }}
              >
                <span className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: c.color }} />
                {c.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-64 w-full sm:h-72">
        {inView && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={rows} margin={{ top: 16, right: 12, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
              <XAxis
                dataKey="mes"
                stroke={chart.axis}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: chart.grid }}
                interval={0}
                minTickGap={0}
              />
              <YAxis
                stroke={chart.axis}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={fmtAxis}
                width={40}
              />
              <Tooltip content={<Tip />} cursor={{ stroke: color, strokeOpacity: 0.25 }} />

              {/* Banda de escenarios (optimista–pesimista) */}
              <Area
                dataKey="rango"
                stroke="none"
                fill={color}
                fillOpacity={0.16}
                connectNulls={false}
                isAnimationActive
                animationDuration={900}
              />

              {/* Marcas: siembra · hoy · cosecha */}
              {siembraMes != null && (
                <ReferenceLine
                  x={MONTHS[siembraMes]}
                  stroke={chart.muted}
                  strokeDasharray="2 3"
                  label={refLabel('Siembra', chart.muted)}
                />
              )}
              {cosechaMes != null && (
                <ReferenceLine
                  x={MONTHS[cosechaMes]}
                  stroke={chart.warning}
                  strokeDasharray="2 3"
                  label={refLabel('Cosecha', chart.warning)}
                />
              )}
              <ReferenceLine
                x={MONTHS[hoyMes]}
                stroke={chart.text}
                strokeDasharray="4 4"
                label={refLabel('HOY', chart.text)}
              />

              {/* Proyección base (punteada) */}
              <Line
                type="monotone"
                dataKey="base"
                stroke={color}
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={false}
                connectNulls={false}
                isAnimationActive
                animationDuration={900}
                animationBegin={250}
              />
              {/* Real (continua, gruesa) */}
              <Line
                type="monotone"
                dataKey="real"
                stroke={color}
                strokeWidth={3.5}
                dot={{ r: 2.5, fill: color, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: color, stroke: chart.bg, strokeWidth: 2 }}
                connectNulls={false}
                isAnimationActive
                animationDuration={900}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Escenarios a cosecha + probabilidad */}
      {escenarios && finales && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {scenarioCards.map((s) => {
            const isTop = mostProb === s.key
            return (
              <div
                key={s.key}
                className="rounded-xl border px-2.5 py-2 transition-colors"
                style={{
                  borderColor: isTop ? s.color : 'var(--color-agro-border)',
                  backgroundColor: isTop ? `${s.color}14` : 'var(--color-agro-card-soft)',
                }}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-bold" style={{ color: s.color }}>
                    {s.label}
                  </span>
                  <span
                    className="rounded-full px-1.5 text-[10px] font-bold"
                    style={{ color: s.color, backgroundColor: `${s.color}22` }}
                  >
                    {escenarios[s.key]}%
                  </span>
                </div>
                <div className="mt-0.5 text-sm font-bold text-agro-text">{fmtShort(finales[s.key])}</div>
                <div className="text-[10px] text-agro-muted">{s.hint}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Row({ color, dashed, label, value, chart }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-block h-0 w-4"
        style={{ borderTop: `${dashed ? '2px dashed' : '3px solid'} ${color}` }}
      />
      <span style={{ color: chart.muted }}>{label}:</span>
      <span className="font-bold" style={{ color: chart.text }}>
        {value}
      </span>
    </div>
  )
}
