import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { AboutContent } from './AboutContent'

export const metadata: Metadata = {
  title: 'About',
  description:
    'GTM Engineer. Builder. Shipped from a monorepo. The operating system behind shawnos.ai.',
  keywords: [
    'GTM engineer',
    'revenue operations engineer',
    'GTM systems architect',
    'go-to-market automation',
    'sales operations engineer',
    'AI-native development',
    'monorepo builder',
    'Clay HubSpot automation',
    'outbound pipeline engineering',
    'Cursor IDE developer',
  ],
  alternates: { canonical: 'https://shawnos.ai/about' },
  openGraph: {
    title: 'About | shawnos.ai',
    description: 'GTM Engineer. Builder. Shipped from a monorepo.',
    url: 'https://shawnos.ai/about',
    images: [{ url: '/og?title=About&subtitle=GTM+Engineer.+Builder.+Shipped+from+a+monorepo.', width: 1200, height: 630 }],
  },
  twitter: {
    title: 'About | shawnos.ai',
    description: 'GTM Engineer. Builder. Shipped from a monorepo.',
    images: ['/og?title=About&subtitle=GTM+Engineer.+Builder.+Shipped+from+a+monorepo.'],
  },
}

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'About', url: 'https://shawnos.ai/about' }]} />
      <AboutContent />
    </>
  )
}
