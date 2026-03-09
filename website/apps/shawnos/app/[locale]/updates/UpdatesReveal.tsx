'use client'

import { MotionReveal, StaggerContainer, StaggerItem, ScrollRevealSection, SectionHeadline } from '@shawnos/shared/components'

export { PageHero } from '../../components/PageHero'
export { ScrollRevealSection }
export { SectionHeadline }

export function RevealSection({ children, delay }: { children: React.ReactNode; delay?: number }) {
  return <MotionReveal delay={delay}>{children}</MotionReveal>
}

export function StatsStagger({ children }: { children: React.ReactNode }) {
  return (
    <StaggerContainer stagger={0.1} style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
      {children}
    </StaggerContainer>
  )
}

export function StatItem({ children }: { children: React.ReactNode }) {
  return <StaggerItem>{children}</StaggerItem>
}
