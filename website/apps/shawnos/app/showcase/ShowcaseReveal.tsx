'use client'

import { MotionReveal, ScrollRevealSection as SRS } from '../components/motion'
import { PageHero as PH } from '../components/PageHero'
import { SectionHeadline as SH } from '../components/SectionHeadline'

export function ShowcaseReveal({ children }: { children: React.ReactNode }) {
  return <MotionReveal variant="fadeIn">{children}</MotionReveal>
}

export { SRS as ScrollRevealSection, PH as PageHero, SH as SectionHeadline }
