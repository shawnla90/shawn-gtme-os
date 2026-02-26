'use client'

import type { CSSProperties, ReactNode } from 'react'
import { MotionReveal } from './MotionReveal'

interface ScrollRevealSectionProps {
  children: ReactNode
  background?: string
  className?: string
  style?: CSSProperties
  variant?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale'
  delay?: number
}

export function ScrollRevealSection({
  children,
  background = 'var(--canvas)',
  className,
  style,
  variant = 'fadeUp',
  delay = 0,
}: ScrollRevealSectionProps) {
  return (
    <section
      className={`full-bleed section-pad ${className ?? ''}`}
      style={{ background, ...style }}
    >
      <MotionReveal variant={variant} delay={delay}>
        <div className="inner-container">{children}</div>
      </MotionReveal>
    </section>
  )
}
