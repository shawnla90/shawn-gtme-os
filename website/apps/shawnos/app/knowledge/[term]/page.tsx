import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ENGINEERING_CATEGORIES,
  toSlug,
} from '@shawnos/shared/data/engineering-terms'
import { GTM_CATEGORIES } from '@shawnos/shared/data/gtm-terms'
import { BreadcrumbSchema } from '@shawnos/shared/components'

const SITE_URL = 'https://shawnos.ai'

/* ── unified term type ──────────────────────────── */

interface UnifiedTerm {
  slug: string
  name: string
  definition: string
  whyItMatters: string
  howYouUseIt: string
  relatedRaw: string[]
  category: string
  source: 'engineering' | 'gtm'
}

/* ── build lookup tables (runs at build time, no client boundary issues) ── */

const SLUG_TO_TERM = new Map<string, UnifiedTerm>()
const NAME_OR_ID_TO_SLUG = new Map<string, string>()

for (const cat of ENGINEERING_CATEGORIES) {
  for (const term of cat.terms) {
    const slug = toSlug(term.name)
    NAME_OR_ID_TO_SLUG.set(term.name, slug)
    NAME_OR_ID_TO_SLUG.set(slug, slug)
  }
}

for (const cat of GTM_CATEGORIES) {
  for (const term of cat.terms) {
    NAME_OR_ID_TO_SLUG.set(term.id, term.id)
    NAME_OR_ID_TO_SLUG.set(term.name, term.id)
  }
}

for (const cat of ENGINEERING_CATEGORIES) {
  for (const term of cat.terms) {
    const slug = toSlug(term.name)
    SLUG_TO_TERM.set(slug, {
      slug,
      name: term.name,
      definition: term.definition,
      whyItMatters: term.whyItMatters,
      howYouUseIt: term.howYouUseIt,
      relatedRaw: term.related,
      category: cat.name,
      source: 'engineering',
    })
  }
}

for (const cat of GTM_CATEGORIES) {
  for (const term of cat.terms) {
    SLUG_TO_TERM.set(term.id, {
      slug: term.id,
      name: term.name,
      definition: term.definition,
      whyItMatters: term.whyItMatters,
      howYouUseIt: term.howYouUseIt,
      relatedRaw: term.related,
      category: cat.name,
      source: 'gtm',
    })
  }
}

/* ── resolve related term links ─────────────────── */

function resolveRelated(t: UnifiedTerm): { slug: string; name: string }[] {
  return t.relatedRaw
    .map((r) => {
      const slug = NAME_OR_ID_TO_SLUG.get(r)
      if (!slug) return null
      const related = SLUG_TO_TERM.get(slug)
      return related ? { slug: related.slug, name: related.name } : null
    })
    .filter((r): r is { slug: string; name: string } => !!r)
}

/* ── static params for SSG ──────────────────────── */

export function generateStaticParams() {
  return Array.from(SLUG_TO_TERM.keys()).map((term) => ({ term }))
}

/* ── dynamic metadata ───────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ term: string }>
}): Promise<Metadata> {
  const { term } = await params
  const t = SLUG_TO_TERM.get(term)
  if (!t) {
    return { title: 'Term Not Found' }
  }

  const title = `What is ${t.name}? | ${t.source === 'gtm' ? 'GTM' : 'Engineering'} Knowledge`
  const description = `${t.definition} Learn how ${t.name} works in real GTM and engineering workflows.`
  const url = `${SITE_URL}/knowledge/${t.slug}`

  return {
    title,
    description,
    keywords: [
      t.name.toLowerCase(),
      `what is ${t.name.toLowerCase()}`,
      `${t.name.toLowerCase()} explained`,
      t.source === 'gtm' ? 'gtm engineering' : 'vibe coding',
      t.category.toLowerCase(),
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: `/og?title=${encodeURIComponent(t.name)}&subtitle=${encodeURIComponent(t.category)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [
        `/og?title=${encodeURIComponent(t.name)}&subtitle=${encodeURIComponent(t.category)}`,
      ],
    },
  }
}

/* ── styles ──────────────────────────────────────── */

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
  marginBottom: '16px',
}

const termTitle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '16px',
  lineHeight: 1.2,
}

const defStyle: React.CSSProperties = {
  fontSize: '16px',
  lineHeight: 1.75,
  color: 'var(--text-primary)',
  fontWeight: 500,
  marginBottom: '32px',
  maxWidth: 640,
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '32px 0',
}

const sectionLabel: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '12px',
}

const sectionBody: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.75,
  color: 'var(--text-secondary)',
  marginBottom: '32px',
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

/* ── page component ─────────────────────────────── */

export default async function TermPage({
  params,
}: {
  params: Promise<{ term: string }>
}) {
  const { term } = await params
  const t = SLUG_TO_TERM.get(term)

  if (!t) {
    return (
      <div style={pageWrap}>
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span> man ???
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          term not found. try the{' '}
          <Link href="/knowledge" style={{ color: 'var(--accent)' }}>
            knowledge guide
          </Link>
          .
        </p>
      </div>
    )
  }

  const backHref = t.source === 'gtm' ? '/knowledge/gtm' : '/knowledge'
  const backLabel =
    t.source === 'gtm' ? 'GTM knowledge guide' : 'engineering & AI guide'

  const breadcrumbItems =
    t.source === 'gtm'
      ? [
          { name: 'Knowledge', url: `${SITE_URL}/knowledge` },
          { name: 'GTM', url: `${SITE_URL}/knowledge/gtm` },
          { name: t.name, url: `${SITE_URL}/knowledge/${t.slug}` },
        ]
      : [
          { name: 'Knowledge', url: `${SITE_URL}/knowledge` },
          { name: t.name, url: `${SITE_URL}/knowledge/${t.slug}` },
        ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${t.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${t.definition} ${t.whyItMatters.slice(0, 400)}`,
        },
      },
      {
        '@type': 'Question',
        name: `How do you use ${t.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: t.howYouUseIt.slice(0, 500),
        },
      },
    ],
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `What is ${t.name}?`,
    description: t.definition,
    author: { '@type': 'Person', name: 'Shawn Tenam', url: SITE_URL },
    publisher: { '@type': 'Person', name: 'Shawn Tenam', url: SITE_URL },
    url: `${SITE_URL}/knowledge/${t.slug}`,
    mainEntityOfPage: `${SITE_URL}/knowledge/${t.slug}`,
    articleSection: t.category,
    keywords: [t.name, t.category, t.source === 'gtm' ? 'GTM' : 'Engineering'],
  }

  const related = resolveRelated(t)

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div style={pageWrap}>
        {/* Terminal header */}
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span> man{' '}
          {t.slug}
        </h1>

        {/* Category badge */}
        <div style={categoryBadge}>
          {t.source === 'gtm' ? 'GTM' : 'Engineering'} &middot; {t.category}
        </div>

        {/* Term name */}
        <h2 style={termTitle}>{t.name}</h2>

        {/* Definition */}
        <p style={defStyle}>{t.definition}</p>

        <hr style={divider} />

        {/* Why it matters */}
        <div style={sectionLabel}>why it matters</div>
        <p style={sectionBody}>{t.whyItMatters}</p>

        {/* How you use it */}
        <div style={sectionLabel}>
          {t.source === 'gtm' ? 'how I use it' : 'how you use it'}
        </div>
        <p style={sectionBody}>{t.howYouUseIt}</p>

        {/* Related terms */}
        {related.length > 0 && (
          <>
            <hr style={divider} />
            <div style={sectionLabel}>related terms</div>
            <div style={relatedWrap}>
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/knowledge/${r.slug}`}
                  style={relatedChip}
                >
                  {r.name}
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Navigation */}
        <div style={navRow}>
          <Link href={backHref} style={navLink}>
            &larr; {backLabel}
          </Link>
          <Link href="/knowledge" style={navLink}>
            all terms &rarr;
          </Link>
        </div>
      </div>
    </>
  )
}
