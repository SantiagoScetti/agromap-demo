import { useCountUp } from '../hooks/useCountUp'

/**
 * Tarjeta de KPI con número animado (count-up) y elevación al hover.
 * props:
 *  - Icon: componente SVG
 *  - label, sub
 *  - countTo + format(+decimals): valor numérico animado desde 0
 *  - value: alternativa string (sin animación)
 *  - accent: 'accent' | 'warning' | 'danger' | 'muted'
 */
const ACCENTS = {
  accent: { text: 'text-agro-accent', ring: 'ring-agro-accent/30', glow: 'bg-agro-accent/10' },
  warning: { text: 'text-agro-warning', ring: 'ring-agro-warning/30', glow: 'bg-agro-warning/10' },
  danger: { text: 'text-agro-danger', ring: 'ring-agro-danger/30', glow: 'bg-agro-danger/10' },
  muted: { text: 'text-agro-text', ring: 'ring-agro-border', glow: 'bg-agro-accent/5' },
}

export default function KPICard({
  Icon,
  label,
  value,
  countTo,
  format = (n) => n,
  decimals = 0,
  sub,
  accent = 'accent',
}) {
  const a = ACCENTS[accent] ?? ACCENTS.accent
  const animated = useCountUp(countTo ?? 0, {
    duration: 1200,
    start: countTo != null,
    decimals,
  })
  const display = countTo != null ? format(animated) : value

  return (
    <div className="group relative cursor-default overflow-hidden rounded-2xl border border-agro-border bg-agro-card p-5 shadow-card transition-all duration-200 will-change-transform hover:-translate-y-1 hover:scale-[1.02] hover:border-agro-accent/40 hover:shadow-glow">
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl ${a.glow}`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-agro-muted">
          {label}
        </span>
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-agro-card-soft ring-1 ${a.ring} ${a.text}`}
        >
          {Icon && <Icon size={18} />}
        </span>
      </div>

      <div className="relative mt-3">
        <div className={`text-2xl font-bold tracking-tight tabular-nums sm:text-[1.7rem] ${a.text}`}>
          {display}
        </div>
        {sub && <div className="mt-1 text-xs text-agro-muted">{sub}</div>}
      </div>
    </div>
  )
}
