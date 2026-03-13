import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { ServicesContent } from './ServicesContent'

const SITE_URL = 'https://thecontentos.ai'

export const metadata: Metadata = {
  title: 'Services - Content Operating System for Your Business',
  description:
    'Voice DNA calibration, content engine retainer, and full dominance packages. We drove 527 visitors and 75,000+ Reddit views in 24 hours. Content distribution that compounds.',
  keywords: [
    'content operating system',
    'content marketing services',
    'voice DNA calibration',
    'content distribution strategy',
    'AI content engine',
    'content retainer',
    'multi-channel content distribution',
    'Reddit marketing',
    'LinkedIn content strategy',
    'content automation',
    'GTM content services',
  ],
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    title: 'Services | theContentOS.ai',
    description:
      'Voice DNA calibration, content engine retainer, and full dominance packages. Content distribution that compounds.',
    url: `${SITE_URL}/services`,
  },
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'ContentOS - Content Operating System Services',
  url: `${SITE_URL}/services`,
  description:
    'Voice DNA calibration, content engine retainer, and full dominance packages. Content distribution that compounds.',
  provider: {
    '@type': 'Person',
    name: 'Shawn Tenam',
    url: 'https://shawnos.ai',
  },
  areaServed: { '@type': 'Country', name: 'US' },
  serviceType: 'Content Marketing',
}

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Services', url: `${SITE_URL}/services` }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <ServicesContent />
    </>
  )
}
