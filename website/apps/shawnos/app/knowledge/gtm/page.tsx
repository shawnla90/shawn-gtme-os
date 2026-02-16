import type { Metadata } from 'next'
import { GTMKnowledgeGuidePage } from '@shawnos/shared/pages/GTMKnowledgeGuidePage'

export const metadata: Metadata = {
  title: 'GTM OS Knowledge Guide | Email Campaigns & Outreach Terms',
  description:
    'Clay, HeyReach, Instantly, email deliverability, ICP, persona scoring, and the GTM terms you need to build outbound systems in 2026.',
  keywords: [
    'clay',
    'heyreach',
    'instantly',
    'email deliverability',
    'icp',
    'persona',
    'gtm engineering',
    'outbound sales',
    'email campaigns',
    'data enrichment',
  ],
  alternates: { canonical: 'https://shawnos.ai/knowledge/gtm' },
  openGraph: {
    title: 'GTM OS Knowledge Guide | shawnos.ai',
    description:
      'Email campaigns, outreach platforms, data operations, and the GTM terms explained from the builder side.',
    url: 'https://shawnos.ai/knowledge/gtm',
    images: [
      {
        url: '/og?title=GTM+OS+Knowledge+Guide&subtitle=Email+Campaigns+and+Outreach+Terms',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'GTM OS Knowledge Guide | shawnos.ai',
    description:
      'Email campaigns, outreach platforms, data operations, and the GTM terms explained from the builder side.',
    images: [
      '/og?title=GTM+OS+Knowledge+Guide&subtitle=Email+Campaigns+and+Outreach+Terms',
    ],
  },
}

export default function Page() {
  return <GTMKnowledgeGuidePage />
}
