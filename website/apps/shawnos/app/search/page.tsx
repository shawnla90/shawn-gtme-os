import type { Metadata } from 'next'
import path from 'path'
import { getAllPosts, getAllLogs, resolveDataRoot } from '@shawnos/shared/lib'
import { HOW_TO_WIKI_ENTRIES } from '@shawnos/shared/data/how-to-wiki'
import { ENGINEERING_CATEGORIES, toSlug } from '@shawnos/shared/data/engineering-terms'
import { CONTEXT_WIKI_ENTRIES } from '@shawnos/shared/data/context-wiki'
import { CLAY_WIKI_ENTRIES } from '@shawnos/shared/data/clay-wiki'
import { CONTENT_WIKI_ENTRIES } from '@shawnos/shared/data/content-wiki'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import SearchContent from './SearchContent'
import type { SearchItem } from './SearchContent'

const CONTENT_DIR = path.join(process.cwd(), '../../../content/website/final')
const DATA_ROOT = resolveDataRoot()
const LOG_DIR = path.join(DATA_ROOT, 'daily-log')

/* ── metadata ─────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Search',
  description:
    'Search all content on shawnos.ai — how-to guides, knowledge terms, wiki entries, blog posts, and daily logs.',
  alternates: { canonical: 'https://shawnos.ai/search' },
  openGraph: {
    title: 'Search | shawnos.ai',
    description: 'Search all content on shawnos.ai.',
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
    description: 'Search all content on shawnos.ai.',
    images: ['/og?title=Search&subtitle=Find+anything+on+shawnos.ai'],
  },
}

/* ── page ─────────────────────────────────────────── */

export default function SearchPage() {
  const posts = getAllPosts(CONTENT_DIR)
  const logs = getAllLogs(LOG_DIR)

  const items: SearchItem[] = [
    /* how-to wiki */
    ...HOW_TO_WIKI_ENTRIES.map((e) => ({
      title: e.title,
      description: e.subtitle,
      href: `/how-to/${e.id}`,
      type: 'How-To',
    })),

    /* knowledge terms */
    ...ENGINEERING_CATEGORIES.flatMap((cat) =>
      cat.terms.map((t) => ({
        title: t.name,
        description: t.definition,
        href: `/knowledge/${toSlug(t.name)}`,
        type: 'Knowledge',
      }))
    ),

    /* context wiki */
    ...CONTEXT_WIKI_ENTRIES.map((e) => ({
      title: e.title,
      description: e.subtitle,
      href: `/context-wiki/${e.id}`,
      type: 'Context Wiki',
    })),

    /* clay wiki */
    ...CLAY_WIKI_ENTRIES.map((e) => ({
      title: e.title,
      description: e.subtitle,
      href: `/clay-wiki/${e.id}`,
      type: 'Clay Wiki',
    })),

    /* content wiki */
    ...CONTENT_WIKI_ENTRIES.map((e) => ({
      title: e.title,
      description: e.subtitle,
      href: `/content-wiki/${e.id}`,
      type: 'Content Wiki',
    })),

    /* blog posts */
    ...posts.map((p) => ({
      title: p.title,
      description: p.excerpt,
      href: `/blog/${p.slug}`,
      type: 'Blog',
    })),

    /* daily logs */
    ...logs.map((l) => ({
      title: `Daily Log — ${l.date}`,
      description: `Grade: ${l.letter_grade} | Score: ${l.output_score} | ${l.accomplishment_count} accomplishments`,
      href: `/log/${l.date}`,
      type: 'Daily Log',
    })),
  ]

  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'Search', url: 'https://shawnos.ai/search' }]}
      />
      <div
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {/* ── Terminal header ── */}
        <h1
          style={{
            fontSize: '16px',
            fontWeight: 400,
            color: 'var(--text-muted)',
            marginBottom: '32px',
          }}
        >
          <span style={{ color: 'var(--accent)' }}>$</span> grep -r
          &quot;&quot; ~/
        </h1>

        <SearchContent items={items} />
      </div>
    </>
  )
}
