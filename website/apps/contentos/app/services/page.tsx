import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { ServicesContent } from './ServicesContent'

const SITE_URL = 'https://thecontentos.ai'

export const metadata: Metadata = {
  title: 'Content Services | Personal AI Infrastructure — ContentOS',
  description:
    'We help solopreneurs build their own AI assistant infrastructure, not rent someone else\'s. Voice DNA calibration, content operating system, and distribution ops that compound.',
  keywords: [
    'personal AI infrastructure setup',
    'AI content operating system',
    'ai agent memory system',
    'ai agent memory system setup',
    'persistent agent memory',
    'context retention AI',
    'AI agent configuration',
    'personal AI assistant',
    'AI assistant with memory',
    'AI with memory',
    'content operating system',
    'free ai agent automation tool',
    'ai agent setup',
    'ai agent automation',
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
    title: 'Personal AI Infrastructure Setup & AI Content Operating System | ContentOS',
    description:
      'ContentOS is your personal AI infrastructure setup - persistent agent memory, knowledge bases, and a full AI content operating system. Content engine retainer, AI agent configuration, and full dominance packages.',
    url: `${SITE_URL}/services`,
  },
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'ContentOS - Content Operating System Services',
  url: `${SITE_URL}/services`,
  description:
    'AI agent automation tools and AI agent setup services. Voice DNA calibration, content engine retainer, and full dominance packages. Content distribution that compounds.',
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
