import { getCampaignAlert, formatNumber, formatUSD } from '../data/mockData'
import { AlertTriangle, CheckCircle } from './Icons'

/**
 * Alerta de campaña:
 *  - rojo si algún lote ACTIVO tiene desvío > 10% sobre el objetivo
 *  - verde si todo está en orden
 */
export default function AlertCard() {
  const alert = getCampaignAlert()

  if (alert.status === 'desvio') {
    const p = alert.parcel
    return (
      <div className="relative overflow-hidden rounded-2xl border border-agro-danger/40 bg-agro-danger/10 p-4 shadow-card sm:p-5">
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-agro-danger/20 blur-2xl" />
        <div className="relative flex items-start gap-3 sm:gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-agro-danger/15 text-agro-danger ring-1 ring-agro-danger/40">
            <AlertTriangle size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-agro-text">Alerta de campaña</h3>
              <span className="rounded-full bg-agro-danger/15 px-2 py-0.5 text-[11px] font-bold text-agro-danger ring-1 ring-agro-danger/30">
                Desvío {formatNumber(p.desviacionPct)}%
              </span>
            </div>
            <p className="mt-1 text-sm text-agro-text/90">
              <span className="font-semibold">{p.name}</span> ({p.crop.label}) está{' '}
              <span className="font-bold text-agro-danger">
                {formatNumber(Math.abs(p.desviacionPct))}% por debajo
              </span>{' '}
              del objetivo de rentabilidad. Rentabilidad estimada {formatUSD(p.rentabilidad)} vs.
              objetivo {formatUSD(p.objetivo)}.
            </p>
            <p className="mt-1.5 text-xs text-agro-muted">
              Revisá costos de insumos y condiciones del lote para corregir la brecha.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-agro-accent/40 bg-agro-accent/10 p-4 shadow-card sm:p-5">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-agro-accent/20 blur-2xl" />
      <div className="relative flex items-start gap-3 sm:gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-agro-accent/15 text-agro-accent ring-1 ring-agro-accent/40">
          <CheckCircle size={22} />
        </span>
        <div>
          <h3 className="text-base font-bold text-agro-text">Campaña en curso sin desvíos</h3>
          <p className="mt-1 text-sm text-agro-muted">
            Todos los lotes activos cumplen el objetivo de rentabilidad de la campaña.
          </p>
        </div>
      </div>
    </div>
  )
}
