import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { SITES } from '@shawnos/shared/lib/sites'
import { AntiSlopClient } from './AntiSlopClient'

const SITE_URL = SITES.contentos

export const metadata: Metadata = {
  title: 'Anti-Slop Detector - Score Your Content Against 20 Rules',
  description:
    'Paste any text and score it against 20 anti-slop rules. Corporate filler words, passive voice patterns, and vague openers get flagged in real time. Lower score = cleaner copy.',
  keywords: [
    'anti-slop detector',
    'AI content checker',
    'corporate filler detector',
    'passive voice checker',
    'content quality tool',
    'writing quality score',
    'AI slop detector',
    'content OS tool',
  ],
  alternates: { canonical: `${SITE_URL}/anti-slop` },
  openGraph: {
    title: 'Anti-Slop Detector | theContentOS.ai',
    description:
      'Score your content against 20 anti-slop rules. Corporate filler, passive voice, vague openers - all flagged in real time.',
    url: `${SITE_URL}/anti-slop`,
    images: [
      {
        url: '/og?title=Anti-Slop+Detector&subtitle=Score+Your+Content',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Anti-Slop Detector | theContentOS.ai',
    description:
      'Score your content against 20 anti-slop rules. Corporate filler, passive voice, vague openers - all flagged in real time.',
    images: ['/og?title=Anti-Slop+Detector&subtitle=Score+Your+Content'],
  },
}

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Anti-Slop Detector',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: `${SITE_URL}/anti-slop`,
  description:
    'Paste any text and score it against 20 anti-slop rules. Corporate filler words, passive voice patterns, and vague openers get flagged in real time.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Person',
    name: 'Shawn Tenam',
    url: 'https://shawnos.ai',
  },
}

export default function AntiSlopPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Showcase', url: `${SITE_URL}/showcase` },
          { name: 'Anti-Slop Detector', url: `${SITE_URL}/anti-slop` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <AntiSlopClient />
    </>
  )
}
