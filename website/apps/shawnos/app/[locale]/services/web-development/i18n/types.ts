export type Locale = 'en' | 'he' | 'es'

export interface TransformationStep {
  label: string
  detail: string
}

export interface InteractiveStep {
  title: string
  summary: string
  detail: string
  timeline: string
}

export interface NotRightFitCard {
  title: string
  desc: string
}

export interface TechStackTool {
  name: string
  why: string
}

export interface PricingTier {
  name: string
  price: string
  tag: string
  recommended?: boolean
  timeline: string
  supportPeriod: string
  features: string[]
}

export interface VitalComparison {
  metric: string
  techName: string
  wordpress: number
  nextjs: number
  unit: string
  threshold: number
  lower: boolean
  whatItIs: string
  whatItMeans: string
}

export interface Deliverable {
  title: string
  desc: string
}

export interface FaqItem {
  q: string
  a: string
}

export interface SourceLink {
  label: string
  href: string
}

export interface WebDevTranslations {
  locale: Locale
  dir: 'ltr' | 'rtl'

  hero: {
    eyebrow: string
    headlineLine1: string
    headlineLine2: string
    subheadline: string
    description: string
    ctaPrimary: string
    ctaSecondary: string
    textUs: string
    scroll: string
  }

  transformationFlow: {
    steps: TransformationStep[]
  }

  problem: {
    headline: string
    sub: string
    stats: { stat: string; label: string }[]
    footnote: string
  }

  interlude: {
    title: string
    subtitle: string
  }

  performance: {
    headline: string
    sub: string
    vitals: VitalComparison[]
    gaugeGood: string
    gaugeNeedsWork: string
    gaugeMeetsStandard: string
    gaugeMayLower: string
  }

  deliverables: {
    headline: string
    sub: string
    items: Deliverable[]
  }

  howItWorks: {
    headline: string
    sub: string
    steps: InteractiveStep[]
  }

  pricing: {
    headline: string
    sub: string
    tiers: PricingTier[]
    managed: {
      badge: string
      name: string
      price: string
      priceUnit: string
      description: string
      features: string[]
      cta: string
    }
    supportNote: string
    getStarted: string
  }

  techStack: {
    headline: string
    sub: string
    tools: TechStackTool[]
    verifyLink: string
  }

  notRightFit: {
    title: string
    subtitle: string
    cards: NotRightFitCard[]
  }

  faq: {
    headline: string
    items: FaqItem[]
  }

  sources: {
    headline: string
    links: SourceLink[]
  }

  cta: {
    headline: string
    description: string
    ctaPrimary: string
    ctaSecondary: string
  }
}
