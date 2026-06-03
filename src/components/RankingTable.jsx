import { getRanking, profitColors, formatNumber } from '../data/mockData'
import { Trophy } from './Icons'

const ranking = getRanking()

function DiffBadge({ diff }) {
  if (diff == null) return <span className="text-agro-muted">—</span>
  const positive = diff >= 0
  const color = positive ? profitColors.rentable : profitColors.desvio
  return (
    <span className="font-bold tabular-nums" style={{ color }}>
      {positive ? '+' : ''}
      {formatNumber(diff)}%
    </span>
  )
}

export default function RankingTable() {
  return (
    <div className="rounded-2xl border border-agro-border bg-agro-card p-4 shadow-card sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-agro-card-soft text-agro-warning ring-1 ring-agro-warning/30">
          <Trophy size={16} />
        </span>
        <div>
          <h3 className="text-sm font-bold text-agro-text sm:text-base">Ranking de lotes</h3>
          <p className="text-xs text-agro-muted">Ordenados por rentabilidad por hectárea</p>
        </div>
      </div>

      <div className="-mx-1 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-agro-border text-left text-xs uppercase tracking-wider text-agro-muted">
              <th className="px-3 py-2 font-semibold">#</th>
              <th className="px-3 py-2 font-semibold">Lote</th>
              <th className="px-3 py-2 font-semibold">Cultivo</th>
              <th className="px-3 py-2 text-right font-semibold">Rinde real</th>
              <th className="px-3 py-2 text-right font-semibold">Rinde proj</th>
              <th className="px-3 py-2 text-right font-semibold">Dif. %</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((p, i) => (
              <tr
                key={p.id}
                className="border-b border-agro-border-soft transition-colors hover:bg-agro-card-soft"
              >
                <td className="px-3 py-3">
                  <span
                    className={[
                      'grid h-6 w-6 place-items-center rounded-md text-xs font-bold',
                      i === 0
                        ? 'bg-agro-warning/15 text-agro-warning ring-1 ring-agro-warning/30'
                        : 'bg-agro-card-soft text-agro-muted ring-1 ring-agro-border',
                    ].join(' ')}
                  >
                    {i + 1}
                  </span>
                </td>
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
                  {p.rindeRealTnHa > 0 ? `${formatNumber(p.rindeRealTnHa)} tn/ha` : '—'}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-agro-muted">
                  {p.rindeTnHa > 0 ? `${formatNumber(p.rindeTnHa)} tn/ha` : '—'}
                </td>
                <td className="px-3 py-3 text-right">
                  <DiffBadge diff={p.rindeDiffPct} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
