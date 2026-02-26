'use client'

import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

interface StaggerItemProps {
  children: ReactNode
  style?: CSSProperties
  className?: string
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

export function StaggerItem({ children, style, className }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants} style={style} className={className}>
      {children}
    </motion.div>
  )
}
