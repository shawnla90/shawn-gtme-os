import type { Metadata } from 'next'
import path from 'path'
import { hreflang } from '../../../i18n/hreflang'
import { getTranslations } from 'next-intl/server'
import { ENGINEERING_CATEGORIES, toSlug } from '@shawnos/shared/data/engineering-terms'
import { HOW_TO_WIKI_ENTRIES, HOW_TO_WIKI_CATEGORIES } from '@shawnos/shared/data/how-to-wiki'
import { CONTEXT_WIKI_ENTRIES, CONTEXT_WIKI_CATEGORIES } from '@shawnos/shared/data/context-wiki'
import { GEO_WIKI_ENTRIES, GEO_WIKI_CATEGORIES } from '@shawnos/shared/data/geo-wiki'
import { GTM_CODING_AGENT_GUIDE } from '@shawnos/shared/data/guide-manifest'
import { getAllLogs, resolveDataRoot } from '@shawnos/shared/lib'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { KnowledgeHub, type KnowledgeTabSummary } from './KnowledgeHub'

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

function buildTabs(): KnowledgeTabSummary[] {
  const knowledgeTermsCount = ENGINEERING_CATEGORIES.reduce((acc, c) => acc + c.terms.length, 0)
  const knowledgeSamples = ENGINEERING_CATEGORIES.slice(0, 5).flatMap((c) => c.terms.slice(0, 1)).slice(0, 5)
  const knowledgeCats = ENGINEERING_CATEGORIES.slice(0, 6).map((c) => c.name).join(' · ')

  const howToCatNames = HOW_TO_WIKI_CATEGORIES.slice(0, 6).map((c) => c.label).join(' · ')
  const howToSamples = HOW_TO_WIKI_ENTRIES.slice(0, 5)

  const contextCatNames = CONTEXT_WIKI_CATEGORIES.slice(0, 6).map((c) => c.label).join(' · ')
  const contextSamples = CONTEXT_WIKI_ENTRIES.slice(0, 5)

  const geoCatNames = GEO_WIKI_CATEGORIES.slice(0, 6).map((c) => c.label).join(' · ')
  const geoSamples = GEO_WIKI_ENTRIES.slice(0, 5)

  const guideChapterCount = GTM_CODING_AGENT_GUIDE.parts.reduce((acc, p) => acc + p.chapters.length, 0)
  const guideSamples = GTM_CODING_AGENT_GUIDE.parts.flatMap((p) =>
    p.chapters.slice(0, 2).map((c) => ({
      title: c.title,
      href: `/guide/${GTM_CODING_AGENT_GUIDE.slug}/${c.slug}`,
    })),
  ).slice(0, 5)

  const DATA_ROOT = resolveDataRoot()
  const LOG_DIR = path.join(DATA_ROOT, 'daily-log')
  const logs = getAllLogs(LOG_DIR)
  const dailySamples = logs.slice(0, 5).map((l) => ({
    title: `${l.date} · grade ${l.letter_grade} · ${l.accomplishment_count} ships`,
    href: `/claude-daily/${l.date}`,
  }))

  return [
    {
      id: 'knowledge',
      label: 'Knowledge',
      count: knowledgeTermsCount,
      countSuffix: ' terms',
      description: 'Technical terms for vibe coders and GTM engineers. Git, deployment, AI agents, debugging.',
      categoriesText: knowledgeCats,
      samples: knowledgeSamples.map((t) => ({ title: t.name, href: `/knowledge/${toSlug(t.name)}` })),
      fullHref: '/knowledge#all',
      fullLabel: 'Browse all terms',
    },
    {
      id: 'how-to',
      label: 'How-To',
      count: HOW_TO_WIKI_ENTRIES.length,
      countSuffix: ' entries',
      description: 'Step-by-step playbooks. IDE setup, MCP servers, parallel agents, ABM pipelines.',
      categoriesText: howToCatNames,
      samples: howToSamples.map((e) => ({ title: e.title, href: `/how-to#${e.id}` })),
      fullHref: '/how-to',
      fullLabel: 'Open How-To',
    },
    {
      id: 'context',
      label: 'Context',
      count: CONTEXT_WIKI_ENTRIES.length,
      countSuffix: ' entries',
      description: 'How memory shapes Claude output. Plan mode, skills, voice DNA, sub-agents.',
      categoriesText: contextCatNames,
      samples: contextSamples.map((e) => ({ title: e.title, href: `/context-wiki#${e.id}` })),
      fullHref: '/context-wiki',
      fullLabel: 'Open Context Wiki',
    },
    {
      id: 'geo',
      label: 'GEO',
      count: GEO_WIKI_ENTRIES.length,
      countSuffix: ' entries',
      description: 'Generative Engine Optimization. Getting cited by ChatGPT, Perplexity, AI Overviews.',
      categoriesText: geoCatNames,
      samples: geoSamples.map((e) => ({ title: e.title, href: `/geo#${e.id}` })),
      fullHref: '/geo',
      fullLabel: 'Open GEO Wiki',
    },
    {
      id: 'guide',
      label: 'Guide',
      count: guideChapterCount,
      countSuffix: ' chapters',
      description: 'GTM Coding Agent. The long-form playbook on context, automation, and tools.',
      samples: guideSamples,
      fullHref: `/guide/${GTM_CODING_AGENT_GUIDE.slug}`,
      fullLabel: 'Open the Guide',
    },
    {
      id: 'daily',
      label: 'Daily',
      count: logs.length,
      countSuffix: ' days',
      description: 'Daily log of what shipped, what got reviewed, what landed in production.',
      samples: dailySamples,
      fullHref: '/claude-daily',
      fullLabel: 'Open Claude Daily',
    },
    {
      id: 'contacts',
      label: 'Contacts',
      description: 'The network surface lands here. Builders, operators, collaborators.',
      samples: [{ title: 'Being curated. Join the Discord to get on it.' }],
      fullHref: 'https://discord.gg/6eKe49nth',
      fullLabel: 'Join the Discord',
    },
  ]
}

export default async function Page() {
  const t = await getTranslations('Knowledge')
  const tabs = buildTabs()
  return (
    <>
      <BreadcrumbSchema items={[{ name: t('breadcrumb'), url: 'https://shawnos.ai/knowledge' }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <KnowledgeHub tabs={tabs} />
    </>
  )
}
