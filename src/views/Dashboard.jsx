import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  parcels,
  monthlyProjection,
  getTotals,
  getCropDistribution,
  getNextHarvest,
  profitColors,
  formatUSD,
  formatUSDShort,
  formatNumber,
  formatTn,
} from '../data/mockData'
import { useTheme } from '../theme/ThemeContext'
import { useInView } from '../hooks/useInView'
import KPICard from '../components/KPICard'
import AlertCard from '../components/AlertCard'
import RankingTable from '../components/RankingTable'
import RealVsProjectedChart from '../components/RealVsProjectedChart'
import Reveal from '../components/Reveal'
import { Sprout, Coins, Package, TrendingUp, Clock } from '../components/Icons'

const totals = getTotals()
const cropDist = getCropDistribution()

// Etiqueta de % centrada sobre la banda del donut
const RADIAN = Math.PI / 180
function renderDonutLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.06) return null // omite tajadas muy chicas para no saturar
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text
      x={x}
      y={y}
      fill="#0a140d"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={800}
      style={{ pointerEvents: 'none' }}
    >
      {`${Math.round(percent * 100)}%`}
    </text>
  )
}
const barData = parcels.map((p) => ({
  name: p.name.replace('Lote ', ''),
  costo: p.costoTotal,
  ingreso: p.ingresoTotal,
}))

// ---- Tooltip oscuro/claro reutilizable (USD) ----
function ChartTooltip({ active, payload, label }) {
  const { chart } = useTheme()
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-xl px-3 py-2 shadow-card"
      style={{ background: chart.tooltipBg, border: `1px solid ${chart.tooltipBorder}` }}
    >
      {label != null && (
        <div className="mb-1 text-xs font-bold" style={{ color: chart.text }}>
          {label}
        </div>
      )}
      {payload.map((entry) => (
        <div key={entry.dataKey ?? entry.name} className="flex items-center gap-2 text-xs">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color || entry.payload?.color }}
          />
          <span className="capitalize" style={{ color: chart.muted }}>
            {entry.name}:
          </span>
          <span className="font-semibold" style={{ color: chart.text }}>
            {formatUSD(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

/* Card de gráfico: aparece al entrar al viewport y monta el chart ahí (animación de entrada) */
function ChartPanel({ title, subtitle, children, className = '', chartClass = 'h-64 sm:h-72' }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`rounded-2xl border border-agro-border bg-agro-card p-4 shadow-card sm:p-5 ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(16px)',
        transition: 'opacity 600ms ease, transform 600ms cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <div className="mb-3">
        <h3 className="text-sm font-bold text-agro-text sm:text-base">{title}</h3>
        {subtitle && <p className="text-xs text-agro-muted">{subtitle}</p>}
      </div>
      <div className={`${chartClass} w-full`}>{inView ? children : null}</div>
    </div>
  )
}

export default function Dashboard() {
  const { chart } = useTheme()
  const next = getNextHarvest()

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-[1600px] space-y-5 p-3 sm:p-5">
        {/* Encabezado */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight text-agro-text sm:text-2xl">
            Panel de gestión
          </h1>
          <p className="text-sm text-agro-muted">
            Campaña 2025/26 · Establecimiento Corrientes · {totals.lotesRentables} lotes rentables ·{' '}
            {totals.lotesDesvio} con desvío
          </p>
        </div>

        {/* Alerta de campaña */}
        <Reveal>
          <AlertCard />
        </Reveal>

        {/* KPI cards (números animados) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
          <KPICard
            Icon={Sprout}
            label="Hectáreas gestionadas"
            countTo={totals.totalHa}
            format={(n) => `${formatNumber(n)} ha`}
            sub={`${parcels.length} lotes activos`}
            accent="accent"
          />
          <KPICard
            Icon={Coins}
            label="Costo promedio / ha"
            countTo={totals.costoPromedioHa}
            format={formatUSD}
            sub={`Costo total ${formatUSDShort(totals.totalCosto)}`}
            accent="warning"
          />
          <KPICard
            Icon={Package}
            label="Rinde total proyectado"
            countTo={totals.totalRindeTn}
            decimals={1}
            format={formatTn}
            sub="Producción estimada"
            accent="muted"
          />
          <KPICard
            Icon={TrendingUp}
            label="Rentabilidad estimada"
            countTo={totals.totalRentabilidad}
            format={formatUSDShort}
            sub={`Ingresos ${formatUSDShort(totals.totalIngreso)}`}
            accent="accent"
          />
          <KPICard
            Icon={Clock}
            label="Días a próxima cosecha"
            countTo={next ? next.days : null}
            format={(n) => `${Math.round(n)} días`}
            value="—"
            sub={next ? `${next.parcel.name} · ${next.parcel.crop.label}` : 'Sin cosechas próximas'}
            accent="warning"
          />
        </div>

        {/* Línea: ingresos proyectados 12 meses */}
        <ChartPanel
          title="Ingresos proyectados · 12 meses"
          subtitle="Flujo de ingresos vs. costos estimados (USD)"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyProjection} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
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
                tickFormatter={(v) => `${v / 1000}k`}
                width={38}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: chart.accent, strokeOpacity: 0.2 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: chart.muted, paddingTop: 8 }} />
              <Line
                type="monotone"
                dataKey="ingresos"
                name="Ingresos"
                stroke={chart.accent}
                strokeWidth={3}
                dot={{ r: 3, fill: chart.accent, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: chart.accent, stroke: chart.bg, strokeWidth: 2 }}
                animationDuration={1000}
              />
              <Line
                type="monotone"
                dataKey="costos"
                name="Costos"
                stroke={chart.warning}
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
                activeDot={{ r: 5, fill: chart.warning, stroke: chart.bg, strokeWidth: 2 }}
                animationDuration={1000}
                animationBegin={250}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        {/* Barras agrupadas + Donut */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          <ChartPanel
            title="Costo vs. ingreso por lote"
            subtitle="Comparativo económico por parcela (USD)"
            className="lg:col-span-3"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 8, right: 8, left: 4, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
                <XAxis
                  dataKey="name"
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
                  tickFormatter={(v) => `${v / 1000}k`}
                  width={38}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: chart.axis, fillOpacity: 0.08 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: chart.muted, paddingTop: 8 }} />
                <Bar dataKey="costo" name="Costo" fill={chart.warning} radius={[4, 4, 0, 0]} maxBarSize={32} animationDuration={900} />
                <Bar dataKey="ingreso" name="Ingreso" fill={chart.accent} radius={[4, 4, 0, 0]} maxBarSize={32} animationDuration={900} animationBegin={150} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel
            title="Distribución de hectáreas"
            subtitle="Superficie por tipo de cultivo"
            className="lg:col-span-2"
            chartClass="h-64 sm:h-72 flex items-center"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cropDist}
                  dataKey="hectareas"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="80%"
                  paddingAngle={3}
                  stroke={chart.bg}
                  strokeWidth={2}
                  animationDuration={900}
                  label={renderDonutLabel}
                  labelLine={false}
                >
                  {cropDist.map((entry) => (
                    <Cell key={entry.cultivo} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <div
                        className="rounded-xl px-3 py-2 text-xs shadow-card"
                        style={{ background: chart.tooltipBg, border: `1px solid ${chart.tooltipBorder}` }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="font-bold" style={{ color: chart.text }}>
                            {d.label}
                          </span>
                        </div>
                        <div className="mt-0.5" style={{ color: chart.muted }}>
                          {formatNumber(d.hectareas)} ha ·{' '}
                          {Math.round((d.hectareas / totals.totalHa) * 100)}%
                        </div>
                      </div>
                    )
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: chart.muted }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>

        {/* Real vs proyectado por cultivo */}
        <RealVsProjectedChart />

        {/* Ranking de lotes */}
        <Reveal>
          <RankingTable />
        </Reveal>

        {/* Tabla resumen */}
        <Reveal>
          <div className="rounded-2xl border border-agro-border bg-agro-card p-4 shadow-card sm:p-5">
            <div className="mb-3">
              <h3 className="text-sm font-bold text-agro-text sm:text-base">Resumen de parcelas</h3>
              <p className="text-xs text-agro-muted">Detalle económico por lote</p>
            </div>
            <div className="-mx-1 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-agro-border text-left text-xs uppercase tracking-wider text-agro-muted">
                    <th className="px-3 py-2.5 font-semibold">Lote</th>
                    <th className="px-3 py-2.5 font-semibold">Cultivo</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Has</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Costo/ha</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Rinde</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Rentabilidad</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {parcels.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-agro-border-soft transition-colors hover:bg-agro-card-soft"
                    >
                      <td className="px-3 py-3 font-semibold text-agro-text">{p.name}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="h-2.5 w-2.5 rounded-[3px] ring-1 ring-white/20"
                            style={{ backgroundColor: p.crop.color }}
                          />
                          <span className="text-agro-text">{p.crop.label}</span>
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-agro-text">
                        {formatNumber(p.hectareas)}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-agro-warning">
                        {formatUSD(p.costoHa)}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-agro-text">
                        {p.rindeTnHa > 0 ? `${formatNumber(p.rindeTnHa)} tn/ha` : '—'}
                      </td>
                      <td
                        className="px-3 py-3 text-right font-bold tabular-nums"
                        style={{ color: p.rentabilidad >= 0 ? profitColors.rentable : profitColors.desvio }}
                      >
                        {formatUSD(p.rentabilidad)}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                          style={{
                            color: p.rentable ? profitColors.rentable : profitColors.desvio,
                            backgroundColor: `${p.rentable ? profitColors.rentable : profitColors.desvio}1a`,
                          }}
                        >
                          {p.rentable ? '● Rentable' : '● Desvío'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-agro-border text-sm font-bold text-agro-text">
                    <td className="px-3 py-3" colSpan={2}>
                      Total ({parcels.length} lotes)
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatNumber(totals.totalHa)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-agro-warning">
                      {formatUSD(totals.costoPromedioHa)}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatTn(totals.totalRindeTn)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-agro-accent">
                      {formatUSD(totals.totalRentabilidad)}
                    </td>
                    <td className="px-3 py-3" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </Reveal>

        <div className="pb-2 text-center text-xs text-agro-muted">
          🌾 AgroMap · Prototipo demo · Datos simulados — Corrientes, Argentina
        </div>
      </div>
    </div>
  )
}
