import type { Metadata } from 'next'
import { Link } from '../../../../i18n/navigation'
import {
  GEO_WIKI_ENTRIES,
  GEO_WIKI_CATEGORIES,
  getGeoWikiEntry,
} from '@shawnos/shared/data/geo-wiki'
import type { WikiSection } from '@shawnos/shared/data/clay-wiki'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { GeoEntryTracking } from './GeoEntryTracking'

const SITE_URL = 'https://shawnos.ai'

/* ── static params for SSG ────────────────────────── */

export function generateStaticParams() {
  return GEO_WIKI_ENTRIES.map((entry) => ({ slug: entry.id }))
}

/* ── dynamic metadata ─────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = getGeoWikiEntry(slug)

  if (!entry) {
    return { title: 'Entry Not Found | GEO Wiki' }
  }

  const title = `${entry.title} | GEO Wiki`
  const description = entry.description.slice(0, 155)
  const url = `${SITE_URL}/geo/${entry.id}`
  const catMeta = GEO_WIKI_CATEGORIES.find((c) => c.id === entry.category)

  return {
    title,
    description,
    keywords: entry.keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: `/og?title=${encodeURIComponent(entry.title)}&subtitle=${encodeURIComponent(catMeta?.label ?? 'GEO Wiki')}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [
        `/og?title=${encodeURIComponent(entry.title)}&subtitle=${encodeURIComponent(catMeta?.label ?? 'GEO Wiki')}`,
      ],
    },
  }
}

/* ── section type styling ─────────────────────────── */

function sectionTypeLabel(type: WikiSection['type']): { label: string; color: string } {
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
  display: 'flex',
  alignItems: 'flex-start',
  gap: '24px',
  marginBottom: '24px',
}

const headerText: React.CSSProperties = {
  flex: '1 1 0',
  minWidth: 0,
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

const diffBadge = (d: 'beginner' | 'intermediate' | 'advanced'): React.CSSProperties => ({
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

const hubBacklink: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12px',
  fontWeight: 500,
  color: 'var(--accent)',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  padding: '6px 14px',
  textDecoration: 'none',
  transition: 'border-color 0.15s ease',
  marginTop: '8px',
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

export default async function GeoEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = getGeoWikiEntry(slug)

  if (!entry) {
    return (
      <div style={pageWrap}>
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span> man geo/???
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          entry not found. try the{' '}
          <Link href="/geo" style={{ color: 'var(--accent)' }}>
            geo wiki
          </Link>
          .
        </p>
      </div>
    )
  }

  const catMeta = GEO_WIKI_CATEGORIES.find((c) => c.id === entry.category)

  const relatedEntries = entry.related
    .map((id) => {
      const r = GEO_WIKI_ENTRIES.find((e) => e.id === id)
      return r ? { id: r.id, title: r.title } : null
    })
    .filter((r): r is { id: string; title: string } => !!r)

  /* ── Article structured data ── */
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.title,
    description: entry.description,
    author: { '@type': 'Person', name: 'Shawn Tenam', url: SITE_URL },
    publisher: { '@type': 'Person', name: 'Shawn Tenam', url: SITE_URL },
    url: `${SITE_URL}/geo/${entry.id}`,
    mainEntityOfPage: `${SITE_URL}/geo/${entry.id}`,
    keywords: entry.keywords,
    isPartOf: {
      '@type': 'CollectionPage',
      name: 'GEO Wiki',
      url: `${SITE_URL}/geo`,
    },
  }

  /* ── FAQ from sections ── */
  const faqItems = entry.sections
    .filter((s) => s.type === 'prose' || s.type === 'pattern')
    .slice(0, 3)
    .map((s) => ({
      '@type': 'Question',
      name: s.heading.endsWith('?') ? s.heading : `What is ${s.heading}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: s.content.slice(0, 500),
      },
    }))

  const faqSchema = faqItems.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems,
      }
    : null

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Knowledge', url: `${SITE_URL}/knowledge` },
          { name: 'GEO Wiki', url: `${SITE_URL}/geo` },
          { name: catMeta?.label ?? entry.category, url: `${SITE_URL}/geo#${entry.category}` },
          { name: entry.title, url: `${SITE_URL}/geo/${entry.id}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <GeoEntryTracking slug={entry.id} title={entry.title} />

      <div style={pageWrap}>
        {/* Terminal header */}
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span> man geo/
          {entry.id}
        </h1>

        {/* Header row */}
        <div style={headerRow}>
          <div style={headerText}>
            <div style={metaRow}>
              <span style={categoryBadge}>
                {catMeta?.label ?? entry.category}
              </span>
              <span style={diffBadge(entry.difficulty)}>
                {entry.difficulty}
              </span>
            </div>
            <h2 style={entryTitle}>{entry.title}</h2>
            <p style={entrySubtitle}>{entry.subtitle}</p>
          </div>
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
              <span style={{ color: 'var(--accent)' }}>$</span> content loading...
            </p>
            <p style={{ marginTop: '8px', fontSize: '12px' }}>
              This guide is being written by a practitioner. Check back soon.
            </p>
          </div>
        )}

        {/* Hub backlink */}
        <hr style={divider} />
        <div style={relatedLabel}>hub</div>
        <div style={relatedWrap}>
          <Link href="/geo" style={hubBacklink}>
            <span>&#8594;</span> Back to GEO Wiki
          </Link>
        </div>

        {/* Related entries */}
        {relatedEntries.length > 0 && (
          <>
            <hr style={divider} />
            <div style={relatedLabel}>related entries</div>
            <div style={relatedWrap}>
              {relatedEntries.map((r) => (
                <Link
                  key={r.id}
                  href={`/geo/${r.id}`}
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
          <Link href="/geo" style={navLink}>
            &larr; geo wiki
          </Link>
          <Link href="/how-to" style={navLink}>
            how-to wiki &rarr;
          </Link>
        </div>
      </div>
    </>
  )
}
