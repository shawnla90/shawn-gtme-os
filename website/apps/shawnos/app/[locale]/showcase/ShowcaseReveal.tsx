'use client'

import { MotionReveal, ScrollRevealSection as SRS, SectionHeadline as SH } from '@shawnos/shared/components'
import { PageHero as PH } from '../../components/PageHero'

export function ShowcaseReveal({ children }: { children: React.ReactNode }) {
  return <MotionReveal variant="fadeIn">{children}</MotionReveal>
}

export { SRS as ScrollRevealSection, PH as PageHero, SH as SectionHeadline }
