import type { Metadata } from 'next'
import { CONTENT_WIKI_ENTRIES, CONTENT_WIKI_CATEGORIES } from '@shawnos/shared/data/content-wiki'
import { getHowToWikiEntriesBySite } from '@shawnos/shared/data/how-to-wiki'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import SearchContent from './SearchContent'
import type { SearchItem } from './SearchContent'

const SITE_URL = 'https://thecontentos.ai'

/* ── metadata ─────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Search | theContentOS.ai',
  description:
    'Search content wiki entries and how-to guides on theContentOS.ai — platform playbooks, voice systems, content workflows, tools, and step-by-step tutorials.',
  alternates: { canonical: `${SITE_URL}/search` },
  openGraph: {
    title: 'Search | theContentOS.ai',
    description:
      'Search content wiki entries and how-to guides on theContentOS.ai.',
    url: `${SITE_URL}/search`,
    images: [
      {
        url: '/og?title=Search&subtitle=Find+anything+on+theContentOS.ai',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Search | theContentOS.ai',
    description:
      'Search content wiki entries and how-to guides on theContentOS.ai.',
    images: ['/og?title=Search&subtitle=Find+anything+on+theContentOS.ai'],
  },
}

/* ── page ─────────────────────────────────────────── */

export default function SearchPage() {
  const contentHowTos = getHowToWikiEntriesBySite('contentos')

  const items: SearchItem[] = [
    /* content wiki */
    ...CONTENT_WIKI_ENTRIES.map((e) => ({
      title: e.title,
      description: e.subtitle,
      href: `/content-wiki/${e.id}`,
      type: 'Content Wiki' as const,
      category: e.category,
      keywords: e.keywords,
    })),

    /* how-to guides (contentos only) */
    ...contentHowTos.map((e) => ({
      title: e.title,
      description: e.subtitle,
      href: `/how-to/${e.id}`,
      type: 'How-To' as const,
      category: e.category,
      keywords: e.keywords,
    })),
  ]

  /* category counts for empty state */
  const categoryCounts: Record<string, number> = {}
  for (const cat of CONTENT_WIKI_CATEGORIES) {
    categoryCounts[cat.label] = CONTENT_WIKI_ENTRIES.filter(
      (e) => e.category === cat.id,
    ).length
  }
  categoryCounts['How-To Guides'] = contentHowTos.length

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Search', url: `${SITE_URL}/search` },
        ]}
      />
      <div
        style={{
          maxWidth: '760px',
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
          <span style={{ color: 'var(--accent)' }}>$</span> search
          --index=content-wiki,how-to
        </h1>

        <SearchContent items={items} categoryCounts={categoryCounts} />
      </div>
    </>
  )
}
