import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { SITES } from '@shawnos/shared/lib/sites'
import { MidJourneyContent } from './MidJourneyContent'

const SITE_URL = SITES.contentos

export const metadata: Metadata = {
  title:
    'MidJourney Mastery - Character Design, CREF, OREF & Prompt Engineering',
  description:
    'Interactive guide to MidJourney prompt engineering. Learn CREF character references, OREF object locking, style consistency, and the techniques behind production-grade AI art.',
  keywords: [
    'midjourney',
    'midjourney tutorial',
    'CREF',
    'OREF',
    'SREF',
    'character reference',
    'object reference',
    'style reference',
    'prompt engineering',
    'AI art',
    'character design',
    'midjourney tips',
    'midjourney parameters',
  ],
  alternates: { canonical: `${SITE_URL}/midjourney` },
  openGraph: {
    title: 'MidJourney Mastery | theContentOS.ai',
    description:
      'Interactive guide to MidJourney prompt engineering - CREF, OREF, style consistency, and production-grade techniques.',
    url: `${SITE_URL}/midjourney`,
    images: [
      {
        url: '/og?title=MidJourney+Mastery&subtitle=Prompt+Engineering+%26+Character+Design',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MidJourney Mastery | theContentOS.ai',
    description:
      'Interactive guide to MidJourney prompt engineering - CREF, OREF, style consistency, and production-grade techniques.',
    images: [
      '/og?title=MidJourney+Mastery&subtitle=Prompt+Engineering+%26+Character+Design',
    ],
  },
}

export default function MidJourneyPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'MidJourney Mastery', url: `${SITE_URL}/midjourney` },
        ]}
      />
      <MidJourneyContent />
    </>
  )
}
