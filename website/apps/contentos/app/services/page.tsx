import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { ServicesContent } from './ServicesContent'

const SITE_URL = 'https://thecontentos.ai'

export const metadata: Metadata = {
  title: 'Services - Content Operating System for Your Business',
  description:
    'Voice DNA calibration, content engine retainer, and full dominance packages. We drove 527 visitors and 75,000+ Reddit views in 24 hours. Content distribution that compounds.',
  openGraph: {
    title: 'Services | theContentOS.ai',
    description:
      'Voice DNA calibration, content engine retainer, and full dominance packages. Content distribution that compounds.',
    url: `${SITE_URL}/services`,
  },
}

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Services', url: `${SITE_URL}/services` }]} />
      <ServicesContent />
    </>
  )
}
