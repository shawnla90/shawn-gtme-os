import type { Metadata } from 'next'
import path from 'path'
import { getTranslations } from 'next-intl/server'
import { getAllPosts, getAllLogs, resolveDataRoot } from '@shawnos/shared/lib'
import { HOW_TO_WIKI_ENTRIES } from '@shawnos/shared/data/how-to-wiki'
import { ENGINEERING_CATEGORIES, toSlug } from '@shawnos/shared/data/engineering-terms'
import { CONTEXT_WIKI_ENTRIES } from '@shawnos/shared/data/context-wiki'
import { CLAY_WIKI_ENTRIES } from '@shawnos/shared/data/clay-wiki'
import { CONTENT_WIKI_ENTRIES } from '@shawnos/shared/data/content-wiki'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import SearchContent from './SearchContent'
import type { SearchItem } from './SearchContent'
import { PageHero, ScrollRevealSection } from './SearchReveal'

const CONTENT_DIR = path.join(process.cwd(), '../../../content/website/final')
const DATA_ROOT = resolveDataRoot()
const LOG_DIR = path.join(DATA_ROOT, 'daily-log')

/* ── metadata ─────────────────────────────────────── */

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Search')
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    alternates: { canonical: 'https://shawnos.ai/search' },
    openGraph: {
      title: 'Search | shawnos.ai',
      description: t('metadata.description'),
      url: 'https://shawnos.ai/search',
      images: [
        {
          url: '/og?title=Search&subtitle=Find+anything+on+shawnos.ai',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title: 'Search | shawnos.ai',
      description: t('metadata.description'),
      images: ['/og?title=Search&subtitle=Find+anything+on+shawnos.ai'],
    },
  }
}

/* ── page ─────────────────────────────────────────── */

export default async function SearchPage() {
  const t = await getTranslations('Search')
  const posts = getAllPosts(CONTENT_DIR)
  const logs = getAllLogs(LOG_DIR)

  const items: SearchItem[] = [
    /* how-to wiki */
    ...HOW_TO_WIKI_ENTRIES.map((e) => ({
      title: e.title,
      description: e.subtitle,
      href: `/how-to/${e.id}`,
      type: t('types.howTo'),
    })),

    /* knowledge terms */
    ...ENGINEERING_CATEGORIES.flatMap((cat) =>
      cat.terms.map((term) => ({
        title: term.name,
        description: term.definition,
        href: `/knowledge/${toSlug(term.name)}`,
        type: t('types.knowledge'),
      }))
    ),

    /* context wiki */
    ...CONTEXT_WIKI_ENTRIES.map((e) => ({
      title: e.title,
      description: e.subtitle,
      href: `/context-wiki/${e.id}`,
      type: t('types.contextWiki'),
    })),

    /* clay wiki */
    ...CLAY_WIKI_ENTRIES.map((e) => ({
      title: e.title,
      description: e.subtitle,
      href: `/clay-wiki/${e.id}`,
      type: t('types.clayWiki'),
    })),

    /* content wiki */
    ...CONTENT_WIKI_ENTRIES.map((e) => ({
      title: e.title,
      description: e.subtitle,
      href: `/content-wiki/${e.id}`,
      type: t('types.contentWiki'),
    })),

    /* blog posts */
    ...posts.map((p) => ({
      title: p.title,
      description: p.excerpt,
      href: `/blog/${p.slug}`,
      type: t('types.blog'),
    })),

    /* daily logs */
    ...logs.map((l) => ({
      title: `Daily Log — ${l.date}`,
      description: `Grade: ${l.letter_grade} | Score: ${l.output_score} | ${l.accomplishment_count} accomplishments`,
      href: `/log/${l.date}`,
      type: t('types.dailyLog'),
    })),
  ]

  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'Search', url: 'https://shawnos.ai/search' }]}
      />
      <PageHero
        compact
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
      />
      <ScrollRevealSection background="var(--canvas)">
        <SearchContent items={items} />
      </ScrollRevealSection>
    </>
  )
}
