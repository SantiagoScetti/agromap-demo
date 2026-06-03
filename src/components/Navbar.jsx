import { useTheme } from '../theme/ThemeContext'
import { Layers, BarChart, Sun, Moon } from './Icons'

const NAV_ITEMS = [
  { id: 'map', label: 'Mapa de Parcelas', short: 'Mapa', Icon: Layers },
  { id: 'dashboard', label: 'Dashboard', short: 'Datos', Icon: BarChart },
]

function ThemeToggle() {
  const { isDark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      className="group relative grid h-9 w-9 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-xl border border-agro-border bg-agro-card text-agro-muted transition-colors duration-200 hover:border-agro-accent/50 hover:text-agro-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agro-accent/60 sm:h-10 sm:w-10"
    >
      <span
        className={`absolute transition-all duration-300 ${
          isDark ? 'translate-y-0 rotate-0 opacity-100' : '-translate-y-6 rotate-90 opacity-0'
        }`}
      >
        <Moon size={18} />
      </span>
      <span
        className={`absolute transition-all duration-300 ${
          isDark ? 'translate-y-6 -rotate-90 opacity-0' : 'translate-y-0 rotate-0 opacity-100'
        }`}
      >
        <Sun size={18} />
      </span>
    </button>
  )
}

export default function Navbar({ view, onChange }) {
  return (
    <header className="relative z-[1200] border-b border-agro-border bg-agro-bg/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center justify-between gap-2 px-2.5 sm:h-16 sm:gap-3 sm:px-5">
        {/* Logo */}
        <button
          onClick={() => onChange('map')}
          className="flex min-w-0 shrink cursor-pointer items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-agro-accent/60"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-agro-card text-lg shadow-card ring-1 ring-agro-border sm:h-10 sm:w-10 sm:text-xl">
            🌾
          </span>
          <span className="flex flex-col items-start leading-none">
            <span className="text-base font-bold tracking-tight text-agro-text sm:text-lg">
              Agro<span className="text-agro-accent">Map</span>
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-agro-muted sm:block">
              Gestión agropecuaria
            </span>
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {/* Navegación */}
          <nav className="flex items-center gap-1 rounded-2xl bg-agro-card p-1 ring-1 ring-agro-border">
            {NAV_ITEMS.map(({ id, label, short, Icon }) => {
              const active = view === id
              return (
                <button
                  key={id}
                  onClick={() => onChange(id)}
                  aria-pressed={active}
                  aria-label={label}
                  className={[
                    'flex cursor-pointer items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-semibold transition-all duration-200 sm:gap-2 sm:px-4',
                    active
                      ? 'bg-agro-accent text-agro-bg shadow-glow'
                      : 'text-agro-muted hover:bg-agro-card-soft hover:text-agro-text',
                  ].join(' ')}
                >
                  <Icon size={18} />
                  {/* < 360px: solo ícono · 360–640px: etiqueta corta · ≥640px: completa */}
                  <span className="hidden min-[360px]:inline sm:hidden">{short}</span>
                  <span className="hidden sm:inline">{label}</span>
                </button>
              )
            })}
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
