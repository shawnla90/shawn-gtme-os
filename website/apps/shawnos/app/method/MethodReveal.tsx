'use client'

import { MotionReveal, StaggerContainer, StaggerItem } from '../components/motion'

export function MethodReveal({ children, variant, delay }: { children: React.ReactNode; variant?: 'fadeUp' | 'fadeIn' | 'scale'; delay?: number }) {
  return <MotionReveal variant={variant} delay={delay}>{children}</MotionReveal>
}

export function CardStagger({ children }: { children: React.ReactNode }) {
  return <StaggerContainer stagger={0.08}>{children}</StaggerContainer>
}

export function CardItem({ children }: { children: React.ReactNode }) {
  return <StaggerItem>{children}</StaggerItem>
}
