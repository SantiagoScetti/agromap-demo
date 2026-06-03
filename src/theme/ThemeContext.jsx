import { createContext, useContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'

const STORAGE_KEY = 'agromap-theme'

// Paleta para SVG de Recharts (no se puede usar `var()` directo en algunos props)
const CHART_COLORS = {
  dark: {
    grid: '#1b3328',
    axis: '#7d93a3',
    text: '#e6f1ea',
    muted: '#7d93a3',
    tooltipBg: '#0d1a14',
    tooltipBorder: '#1b3328',
    accent: '#00e676',
    warning: '#ffb020',
    danger: '#ff5252',
    bg: '#060a0f',
  },
  light: {
    grid: '#dce5d6',
    axis: '#4a5b52',
    text: '#1a1a1a',
    muted: '#4a5b52',
    tooltipBg: '#ffffff',
    tooltipBorder: '#dce5d6',
    accent: '#2e7d32',
    warning: '#b7791f',
    danger: '#d32f2f',
    bg: '#f7f9f4',
  },
}

// Valor por defecto seguro (evita crashes si un consumer se renderiza sin
// provider, p. ej. durante un hot-reload). En uso real el provider lo reemplaza.
const DEFAULT_VALUE = {
  theme: 'dark',
  isDark: true,
  toggle: () => {},
  chart: CHART_COLORS.dark,
}

const ThemeContext = createContext(DEFAULT_VALUE)

function getInitialTheme() {
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('light')) {
    return 'light'
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* ignore */
  }
  return 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)
  const animTimer = useRef(null)

  // Aplica la clase al <html> y persiste
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('light', theme === 'light')
    root.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  useEffect(() => () => clearTimeout(animTimer.current), [])

  const toggle = useCallback(() => {
    const root = document.documentElement
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!reduce) {
      root.classList.add('theme-anim')
      clearTimeout(animTimer.current)
      animTimer.current = setTimeout(() => root.classList.remove('theme-anim'), 350)
    }
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      toggle,
      chart: CHART_COLORS[theme],
    }),
    [theme, toggle],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
