import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CLAY_WIKI_ENTRIES,
  CLAY_WIKI_CATEGORIES,
  getClayWikiEntry,
} from '@shawnos/shared/data/clay-wiki'
import type { WikiSection } from '@shawnos/shared/data/clay-wiki'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { getToolAvatarUrls } from '@shawnos/shared/lib/rpg'

const SITE_URL = 'https://shawnos.ai'

/* ── static params for SSG ────────────────────────── */

export function generateStaticParams() {
  return CLAY_WIKI_ENTRIES.map((entry) => ({ slug: entry.id }))
}

/* ── dynamic metadata ─────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = getClayWikiEntry(slug)

  if (!entry) {
    return { title: 'Entry Not Found | Clay Wiki' }
  }

  const title = `Clay Wiki: ${entry.title}`
  const description = entry.description.slice(0, 155)
  const url = `${SITE_URL}/clay-wiki/${entry.id}`
  const catMeta = CLAY_WIKI_CATEGORIES.find((c) => c.id === entry.category)

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
          url: `/og?title=${encodeURIComponent(entry.title)}&subtitle=${encodeURIComponent(catMeta?.label ?? 'Clay Wiki')}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [
        `/og?title=${encodeURIComponent(entry.title)}&subtitle=${encodeURIComponent(catMeta?.label ?? 'Clay Wiki')}`,
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

const knowledgeBacklink: React.CSSProperties = {
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

/* ── page component ───────────────────────────────── */

export default async function ClayWikiEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = getClayWikiEntry(slug)

  if (!entry) {
    return (
      <div style={pageWrap}>
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span> man clay-wiki/???
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          entry not found. try the{' '}
          <Link href="/clay-wiki" style={{ color: 'var(--accent)' }}>
            clay wiki
          </Link>
          .
        </p>
      </div>
    )
  }

  const catMeta = CLAY_WIKI_CATEGORIES.find((c) => c.id === entry.category)
  const claySprite = getToolAvatarUrls('clay')

  const relatedEntries = entry.related
    .map((id) => {
      const r = CLAY_WIKI_ENTRIES.find((e) => e.id === id)
      return r ? { id: r.id, title: r.title } : null
    })
    .filter((r): r is { id: string; title: string } => !!r)

  /* ── knowledge backlink mapping ── */
  const knowledgeLinks: { slug: string; label: string }[] = []
  const knowledgeTerms = ['clay', 'claygent', 'sculptor', 'enrichment']
  for (const kt of knowledgeTerms) {
    if (
      entry.id.includes(kt) ||
      entry.title.toLowerCase().includes(kt) ||
      entry.keywords.some((k) => k.includes(kt))
    ) {
      knowledgeLinks.push({
        slug: kt,
        label: kt.charAt(0).toUpperCase() + kt.slice(1),
      })
    }
  }

  /* ── structured data ── */
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.title,
    description: entry.description,
    author: { '@type': 'Person', name: 'Shawn Tenam', url: SITE_URL },
    publisher: { '@type': 'Person', name: 'Shawn Tenam', url: SITE_URL },
    url: `${SITE_URL}/clay-wiki/${entry.id}`,
    mainEntityOfPage: `${SITE_URL}/clay-wiki/${entry.id}`,
    articleSection: catMeta?.label ?? 'Clay Wiki',
    keywords: entry.keywords,
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Knowledge', url: `${SITE_URL}/knowledge` },
          { name: 'Clay Wiki', url: `${SITE_URL}/clay-wiki` },
          { name: entry.title, url: `${SITE_URL}/clay-wiki/${entry.id}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div style={pageWrap}>
        {/* Terminal header */}
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span> man clay-wiki/
          {entry.id}
        </h1>

        {/* Header row with sprite */}
        <div style={headerRow}>
          <div style={headerText}>
            {/* Meta badges */}
            <div style={metaRow}>
              <span style={categoryBadge}>
                {catMeta?.label ?? entry.category}
              </span>
              <span style={diffBadge(entry.difficulty)}>
                {entry.difficulty}
              </span>
            </div>

            {/* Title */}
            <h2 style={entryTitle}>{entry.title}</h2>
            <p style={entrySubtitle}>{entry.subtitle}</p>
          </div>

          {/* Clay sprite */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={claySprite.idle}
            alt="Clay tool avatar"
            width={96}
            height={96}
            style={{
              imageRendering: 'pixelated',
              flexShrink: 0,
            }}
          />
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
              This entry is being written by a practitioner. Check back soon.
            </p>
          </div>
        )}

        {/* Knowledge backlinks */}
        {knowledgeLinks.length > 0 && (
          <>
            <hr style={divider} />
            <div style={relatedLabel}>knowledge guide</div>
            <div style={relatedWrap}>
              {knowledgeLinks.map((kl) => (
                <Link
                  key={kl.slug}
                  href={`/knowledge/${kl.slug}`}
                  style={knowledgeBacklink}
                >
                  <span>&#8594;</span> See &quot;{kl.label}&quot; in Knowledge
                </Link>
              ))}
            </div>
          </>
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
                  href={`/clay-wiki/${r.id}`}
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
          <Link href="/clay-wiki" style={navLink}>
            &larr; clay wiki
          </Link>
          <Link href="/knowledge" style={navLink}>
            knowledge guide &rarr;
          </Link>
        </div>
      </div>
    </>
  )
}
