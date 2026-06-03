import { useEffect, useRef, useState } from 'react'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// easeOutCubic
const easeOut = (t) => 1 - Math.pow(1 - t, 3)

/**
 * Anima un número desde 0 hasta `target`.
 * @param {number} target  valor final
 * @param {object} opts    { duration = 1200, start = true, decimals = 0 }
 * @returns número actual (animado)
 */
export function useCountUp(target, { duration = 1200, start = true, decimals = 0 } = {}) {
  const [value, setValue] = useState(start && !prefersReduced() ? 0 : target)
  const raf = useRef(null)
  const startedAt = useRef(null)

  useEffect(() => {
    if (!start) return
    if (prefersReduced()) {
      setValue(target)
      return
    }

    startedAt.current = null
    const from = 0
    const tick = (now) => {
      if (startedAt.current === null) startedAt.current = now
      const elapsed = now - startedAt.current
      const t = Math.min(1, elapsed / duration)
      const eased = easeOut(t)
      const current = from + (target - from) * eased
      const factor = Math.pow(10, decimals)
      setValue(Math.round(current * factor) / factor)
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration, start, decimals])

  return value
}
