import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { activeCrops, getRealVsProjected, cropCatalog, formatUSD, formatNumber } from '../data/mockData'
import { useTheme } from '../theme/ThemeContext'
import { useInView } from '../hooks/useInView'

const METRICS = [
  { id: 'ingreso', label: 'Ingresos' },
  { id: 'rendimiento', label: 'Rendimiento' },
]

export default function RealVsProjectedChart() {
  const { chart } = useTheme()
  const [cropKey, setCropKey] = useState('soja')
  const [metric, setMetric] = useState('ingreso')
  const [ref, inView] = useInView()

  const color = cropCatalog[cropKey]?.color ?? chart.accent
  const { rows, hoyMes } = getRealVsProjected(cropKey, metric)
  const isMoney = metric === 'ingreso'

  const fmtValue = (v) => (isMoney ? formatUSD(v) : `${formatNumber(v)} tn/ha`)
  const fmtAxis = (v) => (isMoney ? `${Math.round(v / 1000)}k` : formatNumber(v))

  const ChartTip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    const point = payload.find((p) => p.value != null)
    if (!point) return null
    const isReal = point.dataKey === 'real'
    return (
      <div
        className="rounded-xl px-3 py-2 text-xs shadow-card"
        style={{ background: chart.tooltipBg, border: `1px solid ${chart.tooltipBorder}` }}
      >
        <div className="font-bold" style={{ color: chart.text }}>
          {label}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-3 rounded-full"
            style={{
              background: isReal ? color : 'transparent',
              border: isReal ? 'none' : `2px dashed ${color}`,
            }}
          />
          <span style={{ color: chart.muted }}>{isReal ? 'Real' : 'Proyectado'}:</span>
          <span className="font-bold" style={{ color: chart.text }}>
            {fmtValue(point.value)}
          </span>
        </div>
      </div>
    )
  }

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
              Real vs. proyectado por cultivo
            </h3>
            <p className="text-xs text-agro-muted">
              Línea continua = datos reales · punteada = proyección a futuro
            </p>
          </div>
          {/* Toggle de métrica */}
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
            <LineChart data={rows} margin={{ top: 14, right: 12, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
              <XAxis
                dataKey="mes"
                stroke={chart.axis}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: chart.grid }}
              />
              <YAxis
                stroke={chart.axis}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={fmtAxis}
                width={40}
              />
              <Tooltip content={<ChartTip />} cursor={{ stroke: color, strokeOpacity: 0.25 }} />
              {hoyMes && (
                <ReferenceLine
                  x={hoyMes}
                  stroke={chart.muted}
                  strokeDasharray="4 4"
                  label={{
                    value: 'HOY',
                    position: 'top',
                    fill: chart.text,
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
              )}
              {/* Real: línea continua y gruesa */}
              <Line
                type="monotone"
                dataKey="real"
                stroke={color}
                strokeWidth={3.5}
                dot={{ r: 3, fill: color, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: color, stroke: chart.bg, strokeWidth: 2 }}
                connectNulls={false}
                isAnimationActive
                animationDuration={900}
              />
              {/* Proyección: punteada, mismo color */}
              <Line
                type="monotone"
                dataKey="proj"
                stroke={color}
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={{ r: 3, fill: chart.bg, stroke: color, strokeWidth: 2 }}
                activeDot={{ r: 6, fill: color, stroke: chart.bg, strokeWidth: 2 }}
                connectNulls={false}
                isAnimationActive
                animationDuration={900}
                animationBegin={300}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Leyenda manual (continua vs punteada) */}
      <div className="mt-2 flex items-center justify-center gap-5 text-xs text-agro-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-[3px] w-6 rounded-full" style={{ background: color }} />
          Real
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-0 w-6"
            style={{ borderTop: `2px dashed ${color}` }}
          />
          Proyectado
        </span>
      </div>
    </div>
  )
}
