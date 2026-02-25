import type { Metadata } from 'next'
import { GTMKnowledgeGuidePage } from '@shawnos/shared/pages/GTMKnowledgeGuidePage'
import { GTM_CATEGORIES } from '@shawnos/shared/data/gtm-terms'
import { BreadcrumbSchema } from '@shawnos/shared/components'

const SITE_URL = 'https://thegtmos.ai'

export const metadata: Metadata = {
  title: 'GTM OS Knowledge Guide | Email Campaigns, MCP Servers & Outreach Terms',
  description:
    'Clay, Exa, MCP servers, HeyReach, Instantly, Smartlead, email deliverability, ICP scoring, enrichment pipelines, and the GTM terms you need to build outbound systems in 2026. Real use cases, not theory.',
  keywords: [
    'clay',
    'heyreach',
    'instantly',
    'smartlead',
    'email deliverability',
    'icp',
    'persona',
    'gtm engineering',
    'outbound sales',
    'email campaigns',
    'data enrichment',
    'exa api',
    'exa sdk',
    'mcp server',
    'model context protocol',
    'ai enrichment',
    'parallel agents',
    'lead scoring model',
    'icebreaker prompt',
    'poke the bear email',
    'signal based outbound',
    'tam expansion',
    'enrichment pipeline',
  ],
  alternates: { canonical: `${SITE_URL}/knowledge/gtm` },
  openGraph: {
    title: 'GTM OS Knowledge Guide | theGTMOS.ai',
    description:
      'Email campaigns, MCP servers, Exa enrichment, AI automation, and the GTM terms explained from the builder side — with real use cases and code.',
    url: `${SITE_URL}/knowledge/gtm`,
  },
  twitter: {
    title: 'GTM OS Knowledge Guide | theGTMOS.ai',
    description:
      'Email campaigns, MCP servers, Exa enrichment, AI automation, and the GTM terms explained from the builder side — with real use cases and code.',
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
