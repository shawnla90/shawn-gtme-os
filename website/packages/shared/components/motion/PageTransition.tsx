'use client'

import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  style?: CSSProperties
  className?: string
}

export function PageTransition({ children, style, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  )
}
