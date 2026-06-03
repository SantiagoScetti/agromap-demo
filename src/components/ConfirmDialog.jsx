import { AlertTriangle } from './Icons'

/**
 * Modal de confirmación (para acciones destructivas / irreversibles).
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Volver',
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className="animate-rise relative w-full max-w-sm rounded-2xl border border-agro-border bg-agro-card p-5 shadow-card"
      >
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-agro-danger/15 text-agro-danger ring-1 ring-agro-danger/30">
            <AlertTriangle size={20} />
          </span>
          <div>
            <h3 className="text-base font-bold text-agro-text">{title}</h3>
            <p className="mt-1 text-sm text-agro-muted">{message}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="cursor-pointer rounded-xl border border-agro-border bg-agro-card-soft px-4 py-2 text-sm font-semibold text-agro-text transition-colors hover:border-agro-accent/40"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer rounded-xl bg-agro-danger px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
