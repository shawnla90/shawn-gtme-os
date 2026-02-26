'use client'

import { MotionReveal } from '../../components/motion'

export function ArticleReveal({ children }: { children: React.ReactNode }) {
  return (
    <MotionReveal variant="fadeIn" duration={0.6}>
      {children}
    </MotionReveal>
  )
}
