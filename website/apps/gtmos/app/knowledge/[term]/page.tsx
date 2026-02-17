import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ENGINEERING_CATEGORIES,
  toSlug,
} from '@shawnos/shared/data/engineering-terms'
import { GTM_CATEGORIES } from '@shawnos/shared/data/gtm-terms'
import { EMAIL_CATEGORIES } from '@shawnos/shared/data/email-infrastructure'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { getToolAvatarUrls } from '@shawnos/shared/lib/rpg'
import { CONTENT_WIKI_ENTRIES } from '@shawnos/shared/data/content-wiki'

const SITE_URL = 'https://thegtmos.ai'

/* ── unified term type ──────────────────────────── */

interface UnifiedTerm {
  slug: string
  name: string
  definition: string
  whyItMatters: string
  howYouUseIt: string
  relatedRaw: string[]
  category: string
  source: 'engineering' | 'gtm' | 'email'
}

/* ── build lookup tables ────────────────────────── */

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

for (const cat of EMAIL_CATEGORIES) {
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

for (const cat of EMAIL_CATEGORIES) {
  for (const term of cat.terms) {
    SLUG_TO_TERM.set(term.id, {
      slug: term.id,
      name: term.name,
      definition: term.definition,
      whyItMatters: term.whyItMatters,
      howYouUseIt: term.howYouUseIt,
      relatedRaw: term.related,
      category: cat.name,
      source: 'email',
    })
  }
}

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

export function generateStaticParams() {
  return Array.from(SLUG_TO_TERM.keys()).map((term) => ({ term }))
}

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

  const sourceLabel =
    t.source === 'email' ? 'Email Infrastructure' : t.source === 'gtm' ? 'GTM' : 'Engineering'
  const title = `What is ${t.name}? | ${sourceLabel} Knowledge`
  const description = `${t.definition} Learn how ${t.name} works in real GTM and engineering workflows.`
  const url = `${SITE_URL}/knowledge/${t.slug}`

  return {
    title,
    description,
    keywords: [
      t.name.toLowerCase(),
      `what is ${t.name.toLowerCase()}`,
      `${t.name.toLowerCase()} explained`,
      t.source === 'email'
        ? 'email infrastructure'
        : t.source === 'gtm'
          ? 'gtm engineering'
          : 'vibe coding',
      t.category.toLowerCase(),
    ],
    alternates: { canonical: url },
    openGraph: { title, description, url },
    twitter: { title, description },
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

  const backHref =
    t.source === 'email'
      ? '/knowledge/email'
      : t.source === 'gtm'
        ? '/knowledge/gtm'
        : '/knowledge'
  const backLabel =
    t.source === 'email'
      ? 'email infrastructure guide'
      : t.source === 'gtm'
        ? 'GTM knowledge guide'
        : 'engineering & AI guide'

  const breadcrumbItems =
    t.source === 'email'
      ? [
          { name: 'Knowledge', url: `${SITE_URL}/knowledge` },
          { name: 'Email Infrastructure', url: `${SITE_URL}/knowledge/email` },
          { name: t.name, url: `${SITE_URL}/knowledge/${t.slug}` },
        ]
      : t.source === 'gtm'
        ? [
            { name: 'Knowledge', url: `${SITE_URL}/knowledge` },
            { name: 'GTM', url: `${SITE_URL}/knowledge/gtm` },
            { name: t.name, url: `${SITE_URL}/knowledge/${t.slug}` },
          ]
        : [
            { name: 'Knowledge', url: `${SITE_URL}/knowledge` },
            { name: t.name, url: `${SITE_URL}/knowledge/${t.slug}` },
          ]

  const sourceBadge =
    t.source === 'email'
      ? 'Email Infrastructure'
      : t.source === 'gtm'
        ? 'GTM'
        : 'Engineering'

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
    keywords: [t.name, t.category, sourceBadge],
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
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span> man{' '}
          {t.slug}
        </h1>

        {['clay', 'instantly', 'heyreach'].includes(t.slug) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getToolAvatarUrls(t.slug).idle}
            alt={`${t.name} avatar`}
            width={96}
            height={96}
            style={{
              float: 'right',
              imageRendering: 'pixelated',
              marginLeft: '24px',
              marginBottom: '16px',
            }}
          />
        )}

        <div style={categoryBadge}>
          {sourceBadge} &middot; {t.category}
        </div>

        <h2 style={termTitle}>{t.name}</h2>
        <p style={defStyle}>{t.definition}</p>

        <hr style={divider} />

        <div style={sectionLabel}>why it matters</div>
        <p style={sectionBody}>{t.whyItMatters}</p>

        <div style={sectionLabel}>
          {t.source === 'gtm' || t.source === 'email'
            ? 'how I use it'
            : 'how you use it'}
        </div>
        <p style={sectionBody}>{t.howYouUseIt}</p>

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

        {/* Email Infrastructure backlink */}
        {(t.source === 'email' ||
          ['deliverability', 'mx-record', 'domain-warming', 'instantly'].includes(
            t.slug,
          )) && (
          <>
            <hr style={divider} />
            <div style={sectionLabel}>go deeper</div>
            <Link
              href="/knowledge/email"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--accent)',
                background: 'var(--canvas-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '10px 18px',
                textDecoration: 'none',
                transition: 'border-color 0.15s ease',
              }}
            >
              <span style={{ fontSize: '16px' }}>&#9993;</span>
              Email Infrastructure Guide &rarr;
            </Link>
          </>
        )}

        {/* Clay Wiki backlink */}
        {['clay', 'claygent', 'sculptor', 'enrichment'].includes(t.slug) && (
          <>
            <hr style={divider} />
            <div style={sectionLabel}>go deeper</div>
            <Link
              href="/clay-wiki"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--accent)',
                background: 'var(--canvas-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '10px 18px',
                textDecoration: 'none',
                transition: 'border-color 0.15s ease',
              }}
            >
              <span style={{ fontSize: '16px' }}>&#9670;</span>
              See the Clay Wiki &rarr;
            </Link>
          </>
        )}

        {/* Content Wiki backlinks */}
        {(() => {
          const contentTermMap: Record<string, string[]> = {
            content: ['recursive-content-flow', 'repo-content-system', 'content-pillars'],
            voice: ['voice-system', 'ai-slop-guide'],
            linkedin: ['linkedin-playbook', 'commenting-strategy', 'call-to-actions'],
            twitter: ['x-algorithm', 'x-best-practices'],
            x: ['x-algorithm', 'x-best-practices'],
            substack: ['substack-growth'],
            tiktok: ['tiktok-playbook'],
            reddit: ['reddit-strategy'],
            typefully: ['typefully-mcp', 'content-mcps'],
            algorithm: ['x-algorithm', 'linkedin-playbook', 'tiktok-playbook'],
            slop: ['ai-slop-guide', 'anti-patterns'],
            pillar: ['content-pillars'],
            workflow: ['recursive-content-flow', 'content-skills'],
            figma: ['design-tools'],
            canva: ['design-tools'],
            pillow: ['python-pillow', 'image-generation-tools'],
            automation: ['content-skills', 'content-mcps'],
          }
          const matched = new Set<string>()
          const slug = t.slug.toLowerCase()
          const name = t.name.toLowerCase()
          for (const [keyword, entryIds] of Object.entries(contentTermMap)) {
            if (slug.includes(keyword) || name.includes(keyword)) {
              entryIds.forEach((id) => matched.add(id))
            }
          }
          const matchedEntries = CONTENT_WIKI_ENTRIES.filter((e) =>
            matched.has(e.id)
          )
          if (matchedEntries.length === 0) return null
          return (
            <>
              <hr style={divider} />
              <div style={sectionLabel}>content playbooks</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {matchedEntries.slice(0, 5).map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/content-wiki/${entry.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--accent)',
                      background: 'var(--canvas-subtle)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      padding: '10px 18px',
                      textDecoration: 'none',
                      transition: 'border-color 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>&#9826;</span>
                    {entry.title} &rarr;
                  </Link>
                ))}
              </div>
            </>
          )
        })()}

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
