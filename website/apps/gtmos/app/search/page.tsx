import type { Metadata } from 'next'
import path from 'path'
import { getAllLogs, resolveDataRoot } from '@shawnos/shared/lib'
import { getHowToWikiEntriesBySite } from '@shawnos/shared/data/how-to-wiki'
import { ENGINEERING_CATEGORIES, toSlug } from '@shawnos/shared/data/engineering-terms'
import { GTM_CATEGORIES } from '@shawnos/shared/data/gtm-terms'
import { CLAY_WIKI_ENTRIES } from '@shawnos/shared/data/clay-wiki'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { SITES } from '@shawnos/shared/lib/sites'
import SearchContent from './SearchContent'
import type { SearchItem } from './SearchContent'

const SITE_URL = SITES.gtmos
const DATA_ROOT = resolveDataRoot()
const LOG_DIR = path.join(DATA_ROOT, 'daily-log')

/* ── metadata ─────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Search',
  description:
    'Search all content on theGTMOS.ai — GTM knowledge, engineering terms, Clay wiki, how-to guides, and daily logs.',
  alternates: { canonical: `${SITE_URL}/search` },
  openGraph: {
    title: 'Search | theGTMOS.ai',
    description: 'Search all content on theGTMOS.ai.',
    url: `${SITE_URL}/search`,
  },
  twitter: {
    title: 'Search | theGTMOS.ai',
    description: 'Search all content on theGTMOS.ai.',
  },
}

/* ── page ─────────────────────────────────────────── */

export default function SearchPage() {
  const logs = getAllLogs(LOG_DIR)
  const gtmHowTos = getHowToWikiEntriesBySite('gtmos')

  const items: SearchItem[] = [
    /* GTM terms */
    ...GTM_CATEGORIES.flatMap((cat) =>
      cat.terms.map((t) => ({
        title: t.name,
        description: t.definition,
        href: `/knowledge/gtm#${t.id}`,
        type: 'GTM Knowledge',
      }))
    ),

    /* engineering terms */
    ...ENGINEERING_CATEGORIES.flatMap((cat) =>
      cat.terms.map((t) => ({
        title: t.name,
        description: t.definition,
        href: `/knowledge/${toSlug(t.name)}`,
        type: 'Engineering Knowledge',
      }))
    ),

    /* Clay wiki */
    ...CLAY_WIKI_ENTRIES.map((e) => ({
      title: e.title,
      description: e.subtitle,
      href: `/clay-wiki/${e.id}`,
      type: 'Clay Wiki',
    })),

    /* how-to entries */
    ...gtmHowTos.map((e) => ({
      title: e.title,
      description: e.subtitle,
      href: `/how-to/${e.id}`,
      type: 'How-To',
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
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Search', url: `${SITE_URL}/search` },
        ]}
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
          &quot;&quot; ~/gtm/
        </h1>

        <SearchContent items={items} />
      </div>
    </>
  )
}
