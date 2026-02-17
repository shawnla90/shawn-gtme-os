import type { Metadata } from 'next'
import { GTMKnowledgeGuidePage } from '@shawnos/shared/pages/GTMKnowledgeGuidePage'
import { GTM_CATEGORIES } from '@shawnos/shared/data/gtm-terms'
import { BreadcrumbSchema } from '@shawnos/shared/components'

const SITE_URL = 'https://thegtmos.ai'

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
  alternates: { canonical: `${SITE_URL}/knowledge/gtm` },
  openGraph: {
    title: 'GTM OS Knowledge Guide | theGTMOS.ai',
    description:
      'Email campaigns, outreach platforms, data operations, and the GTM terms explained from the builder side.',
    url: `${SITE_URL}/knowledge/gtm`,
  },
  twitter: {
    title: 'GTM OS Knowledge Guide | theGTMOS.ai',
    description:
      'Email campaigns, outreach platforms, data operations, and the GTM terms explained from the builder side.',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: GTM_CATEGORIES.flatMap((cat) =>
    cat.terms.map((term) => ({
      '@type': 'Question',
      name: `What is ${term.name}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${term.definition} ${term.whyItMatters.slice(0, 300)}`,
      },
    })),
  ),
}

export default function Page() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Knowledge', url: `${SITE_URL}/knowledge` },
          { name: 'GTM', url: `${SITE_URL}/knowledge/gtm` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <GTMKnowledgeGuidePage />
    </>
  )
}
