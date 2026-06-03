import { useEffect, useState } from 'react'

/**
 * Hook reactivo para media queries (ej: '(min-width: 768px)').
 */
export function useMediaQuery(query) {
  const get = () =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false

  const [matches, setMatches] = useState(get)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
