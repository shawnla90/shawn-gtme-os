import type { Metadata } from 'next'
import { hreflang } from '../../../i18n/hreflang'
import { getTranslations } from 'next-intl/server'
import { KnowledgeGuidePage } from '@shawnos/shared/pages/KnowledgeGuidePage'
import { ENGINEERING_CATEGORIES } from '@shawnos/shared/data/engineering-terms'
import { BreadcrumbSchema } from '@shawnos/shared/components'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Knowledge')
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: [
      'git',
      'vercel',
      'ai agents',
      'deployment',
      'vibe coding',
      'gtm engineering',
      'cursor ide',
      'mcp servers',
      'monorepo',
      'developer tools',
    ],
    alternates: { canonical: 'https://shawnos.ai/knowledge', languages: hreflang('/knowledge') },
    openGraph: {
      title: 'Engineering & AI Knowledge Guide | shawnos.ai',
      description:
        'Technical terms explained for vibe coders and GTM engineers. No gatekeeping, no overcomplicated BS.',
      url: 'https://shawnos.ai/knowledge',
      images: [
        {
          url: '/og?title=Knowledge+Guide&subtitle=Engineering+and+AI+Terms',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title: 'Engineering & AI Knowledge Guide | shawnos.ai',
      description:
        'Technical terms explained for vibe coders and GTM engineers.',
      images: [
        '/og?title=Knowledge+Guide&subtitle=Engineering+and+AI+Terms',
      ],
    },
  }
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

export default async function Page() {
  const t = await getTranslations('Knowledge')
  return (
    <>
      <BreadcrumbSchema items={[{ name: t('breadcrumb'), url: 'https://shawnos.ai/knowledge' }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <KnowledgeGuidePage />
    </>
  )
}
