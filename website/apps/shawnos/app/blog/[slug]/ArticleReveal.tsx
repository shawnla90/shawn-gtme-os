'use client'

import { MotionReveal } from '@shawnos/shared/components'

export function ArticleReveal({ children }: { children: React.ReactNode }) {
  return (
    <MotionReveal variant="fadeIn" duration={0.6}>
      {children}
    </MotionReveal>
  )
}

export function HeaderReveal({ children }: { children: React.ReactNode }) {
  return (
    <MotionReveal variant="fadeUp" duration={0.5}>
      {children}
    </MotionReveal>
  )
}
