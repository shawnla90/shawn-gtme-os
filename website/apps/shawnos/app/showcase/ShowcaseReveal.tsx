'use client'

import { MotionReveal } from '../components/motion'

export function ShowcaseReveal({ children }: { children: React.ReactNode }) {
  return <MotionReveal variant="fadeIn">{children}</MotionReveal>
}
