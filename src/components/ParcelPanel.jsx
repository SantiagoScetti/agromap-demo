import { useCallback, useEffect, useRef, useState } from 'react'
import {
  profitColors,
  formatUSD,
  formatTn,
  formatDate,
  formatNumber,
} from '../data/mockData'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { X } from './Icons'

function Stat({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-agro-border bg-agro-card-soft px-3 py-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-agro-muted">
        {label}
      </div>
      <div className={`mt-0.5 text-sm font-bold ${accent ?? 'text-agro-text'}`}>{value}</div>
    </div>
  )
}

/* Contenido del panel (compartido entre desktop y mobile) */
function PanelInner({ parcel, onClose, headerHandlers, showGrip }) {
  const rentable = parcel.rentable
  const statusColor = rentable ? profitColors.rentable : profitColors.desvio
  const desv = parcel.desviacionPct

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      {/* Zona de drag (grip + header) en mobile. touch-none solo acá para que
          el gesto de arrastre no haga scroll, pero el contenido sí pueda scrollear. */}
      <div
        {...headerHandlers}
        className={showGrip ? 'cursor-grab touch-none active:cursor-grabbing' : ''}
      >
        {showGrip && (
          <div className="flex justify-center pt-2.5">
            <span className="h-1.5 w-12 rounded-full bg-agro-border" />
          </div>
        )}
        <div className="flex items-start justify-between gap-3 border-b border-agro-border p-4 sm:p-5">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-lg ring-1 ring-agro-border"
              style={{ backgroundColor: `${parcel.crop.color}22` }}
            >
              {parcel.crop.emoji}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold leading-tight text-agro-text">
                {parcel.name}
              </h2>
              <p className="text-xs font-medium text-agro-muted">
                {parcel.crop.label} · {formatNumber(parcel.hectareas)} ha
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Cerrar panel"
            className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg border border-agro-border bg-agro-card-soft text-agro-muted transition-colors hover:border-agro-danger/50 hover:text-agro-danger"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Contenido scrollable (pan-y permite scroll táctil; safe-area abajo
          para que la última tarjeta no quede tapada en mobile) */}
      <div
        className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-5"
        style={{ touchAction: 'pan-y', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.5rem)' }}
      >
        <div
          className="flex items-center justify-between rounded-xl border px-3 py-2.5"
          style={{ borderColor: `${statusColor}55`, backgroundColor: `${statusColor}14` }}
        >
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusColor }} />
            <span className="text-sm font-bold" style={{ color: statusColor }}>
              {rentable ? 'Rentable' : 'Con desvío'}
            </span>
          </div>
          <span className="text-xs font-semibold" style={{ color: statusColor }}>
            {desv > 0 ? '+' : ''}
            {formatNumber(desv)}% vs objetivo
          </span>
        </div>

        <div className="rounded-2xl border border-agro-border bg-agro-card-soft p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-agro-muted">
            Rentabilidad estimada
          </div>
          <div
            className="mt-1 text-3xl font-extrabold tracking-tight"
            style={{ color: parcel.rentabilidad >= 0 ? profitColors.rentable : profitColors.desvio }}
          >
            {formatUSD(parcel.rentabilidad)}
          </div>
          <div className="mt-1 text-xs text-agro-muted">
            {formatUSD(parcel.rentabilidadHa)} / ha · objetivo {formatUSD(parcel.objetivo)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <Stat label="Hectáreas" value={`${formatNumber(parcel.hectareas)} ha`} />
          <Stat label="Cultivo actual" value={parcel.crop.label} />
          <Stat label="Costo por ha" value={formatUSD(parcel.costoHa)} accent="text-agro-warning" />
          <Stat
            label="Rinde proyectado"
            value={parcel.rindeTnHa > 0 ? `${formatNumber(parcel.rindeTnHa)} tn/ha` : '—'}
          />
          <Stat
            label="Ingreso estimado"
            value={formatUSD(parcel.ingresoTotal)}
            accent="text-agro-accent"
          />
          <Stat label="Costo total" value={formatUSD(parcel.costoTotal)} accent="text-agro-warning" />
          <Stat label="Fecha de siembra" value={formatDate(parcel.siembra)} />
          <Stat label="Cosecha estimada" value={formatDate(parcel.cosecha)} />
        </div>

        {parcel.rindeTotal > 0 && (
          <div className="rounded-xl border border-agro-border bg-agro-card-soft px-3 py-2.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-agro-muted">
              Producción total proyectada
            </div>
            <div className="mt-0.5 text-sm font-bold text-agro-text">
              {formatTn(parcel.rindeTotal)}
            </div>
          </div>
        )}

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-agro-muted">Avance de la campaña</span>
            <span className="font-bold text-agro-text">{parcel.progreso}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-agro-card-soft ring-1 ring-agro-border">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${parcel.progreso}%`,
                background:
                  parcel.progreso >= 100
                    ? 'linear-gradient(90deg,#00b85f,#00e676)'
                    : 'linear-gradient(90deg,#00b85f,#19c37d)',
              }}
            />
          </div>
          <div className="mt-1.5 text-[11px] text-agro-muted">
            {parcel.progreso >= 100
              ? '✓ Campaña finalizada / cosechada'
              : parcel.cultivo === 'barbecho'
                ? 'Lote en barbecho — sin campaña activa'
                : 'Campaña en curso'}
          </div>
        </div>
      </div>
    </div>
  )
}

/* Bottom sheet draggable (mobile) */
function BottomSheet({ parcel, onClose }) {
  const [offset, setOffset] = useState(0)
  const [entered, setEntered] = useState(false)
  const [closing, setClosing] = useState(false)
  const drag = useRef({ active: false, startY: 0, lastY: 0, lastT: 0, v: 0 })

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const close = useCallback(() => {
    setClosing(true)
    setTimeout(onClose, 280)
  }, [onClose])

  const onPointerDown = (e) => {
    drag.current = {
      active: true,
      startY: e.clientY,
      lastY: e.clientY,
      lastT: performance.now(),
      v: 0,
    }
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId)
    } catch {
      /* algunos navegadores lanzan si el pointer ya no está activo */
    }
  }
  const onPointerMove = (e) => {
    if (!drag.current.active) return
    const dy = Math.max(0, e.clientY - drag.current.startY)
    const now = performance.now()
    const dt = Math.max(1, now - drag.current.lastT)
    drag.current.v = (e.clientY - drag.current.lastY) / dt
    drag.current.lastY = e.clientY
    drag.current.lastT = now
    setOffset(dy)
  }
  const onPointerUp = () => {
    if (!drag.current.active) return
    drag.current.active = false
    if (offset > 120 || drag.current.v > 0.6) close()
    else setOffset(0)
  }

  const dragging = drag.current.active
  const translateY = closing || !entered ? '100%' : `${offset}px`
  const progress = Math.min(1, offset / 400)

  return (
    <>
      <div
        className="absolute inset-0 z-[999] bg-black/55"
        style={{ opacity: closing ? 0 : 1 - progress * 0.8, transition: 'opacity 280ms ease' }}
        onClick={close}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-label={`Detalle de ${parcel.name}`}
        className="absolute inset-x-0 bottom-0 z-[1000] flex max-h-[88%] flex-col rounded-t-3xl border-t border-agro-border bg-agro-card shadow-card"
        style={{
          transform: `translateY(${translateY})`,
          transition: dragging ? 'none' : 'transform 360ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <PanelInner
          parcel={parcel}
          onClose={close}
          showGrip
          headerHandlers={{ onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp }}
        />
      </aside>
    </>
  )
}

export default function ParcelPanel({ parcel, onClose }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  if (!parcel) return null

  if (isDesktop) {
    return (
      <aside className="absolute bottom-4 right-4 top-4 z-[1000] flex w-[370px] flex-col overflow-hidden rounded-2xl border border-agro-border bg-agro-card shadow-card animate-rise">
        <PanelInner parcel={parcel} onClose={onClose} />
      </aside>
    )
  }

  return <BottomSheet parcel={parcel} onClose={onClose} />
}
