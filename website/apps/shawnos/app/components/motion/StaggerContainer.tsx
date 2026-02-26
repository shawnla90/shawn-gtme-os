'use client'

import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

interface StaggerContainerProps {
  children: ReactNode
  stagger?: number
  delay?: number
  once?: boolean
  style?: CSSProperties
  className?: string
}

export function StaggerContainer({
  children,
  stagger = 0.08,
  delay = 0,
  once = true,
  style,
  className,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  )
}
