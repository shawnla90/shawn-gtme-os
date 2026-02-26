'use client'

import { motion, type Variants } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

const presets: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
}

interface MotionRevealProps {
  children: ReactNode
  variant?: keyof typeof presets
  delay?: number
  duration?: number
  once?: boolean
  style?: CSSProperties
  className?: string
}

export function MotionReveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.5,
  once = true,
  style,
  className,
}: MotionRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1 }}
      variants={presets[variant]}
      transition={{ duration, delay, ease: 'easeOut' }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  )
}
