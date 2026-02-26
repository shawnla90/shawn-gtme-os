'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef, useCallback, type CSSProperties, type ReactNode } from 'react'

interface MagneticHoverProps {
  children: ReactNode
  strength?: number
  style?: CSSProperties
  className?: string
}

export function MagneticHover({
  children,
  strength = 0.3,
  style,
  className,
}: MagneticHoverProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      x.set((e.clientX - cx) * strength)
      y.set((e.clientY - cy) * strength)
    },
    [x, y, strength],
  )

  const handleLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, display: 'inline-block', ...style }}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  )
}
