import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CONTENT_WIKI_ENTRIES,
  CONTENT_WIKI_CATEGORIES,
  getContentWikiEntry,
} from '@shawnos/shared/data/content-wiki'
import type { WikiSection } from '@shawnos/shared/data/clay-wiki'
import { BreadcrumbSchema } from '@shawnos/shared/components'

const SITE_URL = 'https://thegtmos.ai'

/* ── static params for SSG ────────────────────────── */

export function generateStaticParams() {
  return CONTENT_WIKI_ENTRIES.map((entry) => ({ slug: entry.id }))
}

/* ── dynamic metadata ─────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = getContentWikiEntry(slug)

  if (!entry) {
    return { title: 'Entry Not Found | Content Wiki' }
  }

  const title = `Content Wiki: ${entry.title}`
  const description = entry.description.slice(0, 155)
  const url = `${SITE_URL}/content-wiki/${entry.id}`
  const catMeta = CONTENT_WIKI_CATEGORIES.find((c) => c.id === entry.category)

  return {
    title,
    description,
    keywords: entry.keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
    },
    twitter: {
      title,
      description,
    },
  }
}

/* ── section type styling ─────────────────────────── */

function sectionTypeLabel(
  type: WikiSection['type']
): { label: string; color: string } {
  switch (type) {
    case 'prose':
      return { label: '', color: '' }
    case 'pattern':
      return { label: 'PATTERN', color: '#4ade80' }
    case 'code':
      return { label: 'CODE', color: '#60a5fa' }
    case 'anti-pattern':
      return { label: 'ANTI-PATTERN', color: '#f87171' }
    case 'pro-tip':
      return { label: 'PRO TIP', color: '#facc15' }
    case 'formula':
      return { label: 'FORMULA', color: '#c084fc' }
  }
}

/* ── difficulty badge colors ──────────────────────── */

function difficultyColor(d: 'beginner' | 'intermediate' | 'advanced'): string {
  switch (d) {
    case 'beginner':
      return '#4ade80'
    case 'intermediate':
      return '#facc15'
    case 'advanced':
      return '#f87171'
  }
}

/* ── styles ────────────────────────────────────────── */

const pageWrap: React.CSSProperties = {
  maxWidth: 760,
  margin: '0 auto',
  padding: '40px 20px 80px',
  fontFamily: 'var(--font-mono)',
}

const terminalHeader: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  marginBottom: '32px',
}

const headerRow: React.CSSProperties = {
  marginBottom: '24px',
}

const metaRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '16px',
  flexWrap: 'wrap',
}

const categoryBadge: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--accent)',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  padding: '3px 10px',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
}

const diffBadge = (
  d: 'beginner' | 'intermediate' | 'advanced'
): React.CSSProperties => ({
  display: 'inline-block',
  fontSize: '10px',
  fontWeight: 600,
  color: difficultyColor(d),
  border: `1px solid ${difficultyColor(d)}33`,
  borderRadius: '3px',
  padding: '2px 8px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
})

const entryTitle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '12px',
  lineHeight: 1.2,
}

const entrySubtitle: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.6,
  color: 'var(--text-secondary)',
  marginBottom: '32px',
  fontStyle: 'italic',
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '32px 0',
}

const sectionWrap: React.CSSProperties = {
  marginBottom: '32px',
}

const sectionHeading: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '12px',
}

const sectionTypeBadge = (color: string): React.CSSProperties => ({
  display: 'inline-block',
  fontSize: '10px',
  fontWeight: 700,
  color,
  border: `1px solid ${color}44`,
  borderRadius: '3px',
  padding: '2px 8px',
  marginBottom: '8px',
  letterSpacing: '0.06em',
})

const sectionContent: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.75,
  color: 'var(--text-secondary)',
}

const emptyNotice: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.75,
  color: 'var(--text-muted)',
  padding: '24px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  textAlign: 'center',
}

const relatedLabel: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '12px',
}

const relatedWrap: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '8px',
}

const relatedChip: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '12px',
  fontWeight: 500,
  color: 'var(--text-muted)',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  padding: '4px 12px',
  textDecoration: 'none',
  transition: 'border-color 0.15s ease, color 0.15s ease',
}

const navRow: React.CSSProperties = {
  marginTop: '48px',
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '12px',
}

const navLink: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--accent)',
  textDecoration: 'none',
}

/* ── page component ───────────────────────────────── */

export default async function ContentWikiEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = getContentWikiEntry(slug)

  if (!entry) {
    return (
      <div style={pageWrap}>
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span> man content-wiki/???
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          entry not found. try the{' '}
          <Link href="/content-wiki" style={{ color: 'var(--accent)' }}>
            content wiki
          </Link>
          .
        </p>
      </div>
    )
  }

  const catMeta = CONTENT_WIKI_CATEGORIES.find((c) => c.id === entry.category)

  const relatedEntries = entry.related
    .map((id) => {
      const r = CONTENT_WIKI_ENTRIES.find((e) => e.id === id)
      return r ? { id: r.id, title: r.title } : null
    })
    .filter((r): r is { id: string; title: string } => !!r)

  /* ── structured data (Article schema) ── */
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.title,
    description: entry.description,
    author: { '@type': 'Person', name: 'Shawn Tenam', url: SITE_URL },
    publisher: { '@type': 'Person', name: 'Shawn Tenam', url: SITE_URL },
    url: `${SITE_URL}/content-wiki/${entry.id}`,
    mainEntityOfPage: `${SITE_URL}/content-wiki/${entry.id}`,
    articleSection: catMeta?.label ?? 'Content Wiki',
    keywords: entry.keywords,
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Content Wiki', url: `${SITE_URL}/content-wiki` },
          { name: entry.title, url: `${SITE_URL}/content-wiki/${entry.id}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div style={pageWrap}>
        {/* Terminal header */}
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span> man content-wiki/
          {entry.id}
        </h1>

        {/* Header row */}
        <div style={headerRow}>
          {/* Meta badges */}
          <div style={metaRow}>
            <span style={categoryBadge}>
              {catMeta?.label ?? entry.category}
            </span>
            <span style={diffBadge(entry.difficulty)}>{entry.difficulty}</span>
          </div>

          {/* Title */}
          <h2 style={entryTitle}>{entry.title}</h2>
          <p style={entrySubtitle}>{entry.subtitle}</p>
        </div>

        <hr style={divider} />

        {/* Content sections */}
        {entry.sections.length > 0 ? (
          entry.sections.map((section, i) => {
            const typeInfo = sectionTypeLabel(section.type)
            return (
              <div key={i} style={sectionWrap}>
                {typeInfo.label && (
                  <div style={sectionTypeBadge(typeInfo.color)}>
                    {typeInfo.label}
                  </div>
                )}
                <h3 style={sectionHeading}>{section.heading}</h3>
                <div
                  style={sectionContent}
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            )
          })
        ) : (
          <div style={emptyNotice}>
            <p>
              <span style={{ color: 'var(--accent)' }}>$</span> content
              loading...
            </p>
            <p style={{ marginTop: '8px', fontSize: '12px' }}>
              This entry is being written. Check back soon.
            </p>
          </div>
        )}

        {/* Related entries */}
        {relatedEntries.length > 0 && (
          <>
            <hr style={divider} />
            <div style={relatedLabel}>related entries</div>
            <div style={relatedWrap}>
              {relatedEntries.map((r) => (
                <Link
                  key={r.id}
                  href={`/content-wiki/${r.id}`}
                  style={relatedChip}
                >
                  {r.title}
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Navigation */}
        <div style={navRow}>
          <Link href="/content-wiki" style={navLink}>
            &larr; content wiki
          </Link>
          <Link href="/" style={navLink}>
            home &rarr;
          </Link>
        </div>
      </div>
    </>
  )
}
