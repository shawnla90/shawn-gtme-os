'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from 'react'

interface ParallaxSectionProps {
  children: ReactNode
  strength?: number
  style?: CSSProperties
  className?: string
}

export function ParallaxSection({
  children,
  strength = 0.02,
  style,
  className,
}: ParallaxSectionProps) {
  const [canHover, setCanHover] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 100, damping: 30 })
  const springY = useSpring(y, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover)')
    setCanHover(mq.matches)
    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      if (!canHover) return
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      x.set((e.clientX - cx) * strength)
      y.set((e.clientY - cy) * strength)
    },
    [canHover, x, y, strength],
  )

  const handleLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.section
      style={{ x: springX, y: springY, ...style }}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.section>
  )
}
