import { useInView } from '../hooks/useInView'

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Anima la entrada de su contenido al aparecer en el viewport
 * (fade + leve translateY). Respeta prefers-reduced-motion.
 */
export default function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const [ref, inView] = useInView()
  const show = reduced || inView

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'none' : 'translateY(16px)',
        transition: reduced
          ? 'none'
          : `opacity 600ms ease ${delay}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  )
}
