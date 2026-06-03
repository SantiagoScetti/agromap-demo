import { CheckCircle, AlertTriangle, X } from './Icons'

/**
 * Toast transitorio (auto-dismiss lo maneja quien lo renderiza).
 * tone: 'success' | 'danger'
 */
export default function Toast({ message, onClose, tone = 'success' }) {
  const Icon = tone === 'danger' ? AlertTriangle : CheckCircle
  const accent = tone === 'danger' ? 'text-agro-danger' : 'text-agro-accent'
  const ring = tone === 'danger' ? 'border-agro-danger/40' : 'border-agro-accent/40'

  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-[2000] flex justify-center px-4 sm:top-20">
      <div
        className={`animate-rise pointer-events-auto flex items-center gap-2.5 rounded-2xl border ${ring} bg-agro-card/95 px-4 py-3 shadow-glow backdrop-blur`}
      >
        <span className={accent}>
          <Icon size={18} />
        </span>
        <span className="text-sm font-semibold text-agro-text">{message}</span>
        <button
          onClick={onClose}
          aria-label="Cerrar aviso"
          className="ml-1 cursor-pointer text-agro-muted transition-colors hover:text-agro-text"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
