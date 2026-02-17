import type { Metadata } from 'next'
import { KnowledgeGuidePage } from '@shawnos/shared/pages/KnowledgeGuidePage'
import { ENGINEERING_CATEGORIES } from '@shawnos/shared/data/engineering-terms'
import { BreadcrumbSchema } from '@shawnos/shared/components'

const SITE_URL = 'https://thegtmos.ai'

export const metadata: Metadata = {
  title: 'Knowledge Guide | Engineering & AI Terms',
  description:
    'Git, Vercel, AI agents, cron jobs, and the technical terms you need to know in 2026. No gatekeeping, no overcomplicated BS.',
  keywords: [
    'git',
    'vercel',
    'ai agents',
    'deployment',
    'gtm engineering',
    'cursor ide',
    'mcp servers',
    'monorepo',
    'developer tools',
  ],
  alternates: { canonical: `${SITE_URL}/knowledge` },
  openGraph: {
    title: 'Engineering & AI Knowledge Guide | theGTMOS.ai',
    description:
      'Technical terms explained for GTM engineers. No gatekeeping, no overcomplicated BS.',
    url: `${SITE_URL}/knowledge`,
  },
  twitter: {
    title: 'Engineering & AI Knowledge Guide | theGTMOS.ai',
    description:
      'Technical terms explained for GTM engineers.',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: ENGINEERING_CATEGORIES.flatMap((cat) =>
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
      <BreadcrumbSchema items={[{ name: 'Knowledge', url: `${SITE_URL}/knowledge` }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <KnowledgeGuidePage />
    </>
  )
}
