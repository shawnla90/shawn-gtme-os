'use client'

import { useRef, useEffect, useState } from 'react'

interface AnimateOnScrollProps {
  children: React.ReactNode
  /** Extra inline styles for the wrapper div */
  style?: React.CSSProperties
  /** Additional className for the wrapper div */
  className?: string
}

/**
 * Wraps children in a div that fades in + slides up when it enters the
 * viewport. Uses IntersectionObserver — no animation libraries required.
 * Triggers once; will not re-animate on scroll back.
 */
export function AnimateOnScroll({ children, style, className }: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
