import type { Metadata } from 'next'
import { ServicesContent } from './ServicesContent'

const SITE_URL = 'https://shawnos.ai'

export const metadata: Metadata = {
  title: 'Services | ShawnOS.ai',
  description:
    'Web development, AI enablement, and Reddit growth engineering for SaaS founders and GTM teams. Systems that compound. No rate cards.',
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    type: 'website',
    title: 'Services | ShawnOS.ai',
    description:
      'Web development, AI enablement, and Reddit growth engineering. Systems that compound.',
    url: `${SITE_URL}/services`,
    images: [
      {
        url: `/og?title=${encodeURIComponent('Services')}&subtitle=${encodeURIComponent('Systems that compound')}`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'ShawnOS',
  url: SITE_URL,
  description:
    'GTM engineering studio building AI-native pipelines, content systems, and go-to-market infrastructure.',
  provider: { '@type': 'Person', name: 'Shawn Tenam', url: SITE_URL },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Web Development',
          description:
            'Next.js performance sites with SEO, analytics, and lead capture built in.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AI Enablement',
          description:
            'Claude Code workflows, MCP servers, agent pipelines, and AI-native GTM infrastructure.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Reddit Growth (GEO)',
          description:
            'Generative Engine Optimization through authentic Reddit authority building.',
        },
      },
    ],
  },
}

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <ServicesContent />
    </>
  )
}
