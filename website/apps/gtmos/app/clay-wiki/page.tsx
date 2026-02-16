import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CLAY_WIKI_ENTRIES,
  CLAY_WIKI_CATEGORIES,
} from '@shawnos/shared/data/clay-wiki'
import type { ClayWikiCategory } from '@shawnos/shared/data/clay-wiki'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { getToolAvatarUrls } from '@shawnos/shared/lib/rpg'

const SITE_URL = 'https://thegtmos.ai'

/* ── metadata ─────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Clay Wiki | The Practitioner\'s Guide to Clay',
  description:
    'Everything you need to know about Clay — enrichment patterns, scoring systems, Claygent prompts, formulas, certification tips, and real-world plays from a certified Clay practitioner.',
  keywords: [
    'clay wiki',
    'learn clay',
    'clay guide',
    'clay playbooks',
    'clay tutorial',
    'clay enrichment',
    'clay certification',
    'claygent prompts',
    'clay formulas',
    'clay credit system',
    'clay scoring',
  ],
  alternates: { canonical: `${SITE_URL}/clay-wiki` },
  openGraph: {
    title: 'Clay Wiki | The Practitioner\'s Guide to Clay',
    description:
      'Enrichment patterns, scoring systems, Claygent prompts, formulas, and real-world plays from a certified Clay practitioner.',
    url: `${SITE_URL}/clay-wiki`,
  },
  twitter: {
    title: 'Clay Wiki | The Practitioner\'s Guide to Clay',
    description:
      'Enrichment patterns, scoring systems, Claygent prompts, formulas, and real-world plays from a certified Clay practitioner.',
  },
}

/* ── FAQ schema for hub page ──────────────────────── */

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Clay used for in GTM?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Clay is a data enrichment and automation platform used by GTM engineers to find emails, validate companies, run AI research prompts, build scoring systems, and route contacts to CRMs and outreach tools. It\'s the orchestration layer for modern go-to-market workflows.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do Clay credits work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Clay credits are consumed when you use native enrichment providers, Claygent prompts, and certain integrations. The practitioner philosophy: if the time spent avoiding credits exceeds the credit cost, just use the credits. Prove and test with credits, then optimize with APIs at scale.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the account-first enrichment pattern?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Always split contacts to an account table, dedupe by domain, enrich at the account level, then write back to contacts via lookup. This is THE fundamental Clay architecture pattern that saves credits and ensures data consistency.',
      },
    },
  ],
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
  maxWidth: 1080,
  margin: '0 auto',
  padding: '40px 20px 80px',
  fontFamily: 'var(--font-mono)',
}

const heroSection: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '32px',
  marginBottom: '40px',
}

const heroText: React.CSSProperties = {
  flex: '1 1 0',
  minWidth: 0,
}

const terminalHeader: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  marginBottom: '24px',
}

const heroTitle: React.CSSProperties = {
  fontSize: '32px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  lineHeight: 1.2,
  marginBottom: '16px',
}

const heroDesc: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.75,
  color: 'var(--text-secondary)',
  marginBottom: '24px',
  maxWidth: 640,
}

const certBadge: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--accent)',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  padding: '8px 16px',
  letterSpacing: '0.03em',
}

const spriteWrap: React.CSSProperties = {
  flexShrink: 0,
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '40px 0',
}

const categorySection: React.CSSProperties = {
  marginBottom: '48px',
}

const categoryHeader: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  marginBottom: '8px',
}

const categoryTitle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '8px',
}

const categoryDesc: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.6,
  color: 'var(--text-secondary)',
  marginBottom: '20px',
  maxWidth: 640,
}

const cardGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '16px',
}

const card: React.CSSProperties = {
  display: 'block',
  padding: '20px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  textDecoration: 'none',
  transition: 'border-color 0.15s ease, transform 0.1s ease',
}

const cardTitle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '6px',
  lineHeight: 1.3,
}

const cardSubtitle: React.CSSProperties = {
  fontSize: '12px',
  lineHeight: 1.6,
  color: 'var(--text-secondary)',
  marginBottom: '12px',
}

const cardMeta: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}

const diffBadge = (d: 'beginner' | 'intermediate' | 'advanced'): React.CSSProperties => ({
  fontSize: '10px',
  fontWeight: 600,
  color: difficultyColor(d),
  border: `1px solid ${difficultyColor(d)}33`,
  borderRadius: '3px',
  padding: '2px 8px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
})

const statsRow: React.CSSProperties = {
  display: 'flex',
  gap: '24px',
  marginBottom: '32px',
  flexWrap: 'wrap',
}

const statBox: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
}

const statNum: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  color: 'var(--accent)',
}

const statLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
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

export default function ClayWikiPage() {
  const claySprite = getToolAvatarUrls('clay')
  const entryCount = CLAY_WIKI_ENTRIES.length
  const categoryCount = CLAY_WIKI_CATEGORIES.length

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Clay Wiki', url: `${SITE_URL}/clay-wiki` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div style={pageWrap}>
        {/* Terminal header */}
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span> cd ~/clay-wiki
        </h1>

        {/* Hero section with sprite */}
        <div style={heroSection}>
          <div style={heroText}>
            <h2 style={heroTitle}>Clay Wiki</h2>
            <p style={heroDesc}>
              The practitioner&apos;s guide to Clay. Not the docs — the patterns, plays, and
              hard-won opinions from building real GTM pipelines. Enrichment architecture,
              scoring systems, Claygent prompt engineering, formulas, and every workflow
              pattern I use in production.
            </p>

            {/* Stats */}
            <div style={statsRow}>
              <div style={statBox}>
                <span style={statNum}>{entryCount}</span>
                <span style={statLabel}>Wiki Entries</span>
              </div>
              <div style={statBox}>
                <span style={statNum}>{categoryCount}</span>
                <span style={statLabel}>Categories</span>
              </div>
              <div style={statBox}>
                <span style={statNum}>98</span>
                <span style={statLabel}>Cert Score</span>
              </div>
            </div>

            {/* Certification badge */}
            <div style={certBadge}>
              <span style={{ fontSize: '16px' }}>&#9670;</span>
              Clay Certified Practitioner &middot; 98/100
            </div>
          </div>

          {/* Clay sprite */}
          <div style={spriteWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={claySprite.idle}
              alt="Clay tool avatar"
              width={128}
              height={128}
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </div>

        <hr style={divider} />

        {/* Category sections */}
        {CLAY_WIKI_CATEGORIES.map((cat) => {
          const entries = CLAY_WIKI_ENTRIES.filter((e) => e.category === cat.id)
          return (
            <div key={cat.id} style={categorySection}>
              <div style={categoryHeader}>{cat.prompt}</div>
              <h3 style={categoryTitle}>{cat.label}</h3>
              <p style={categoryDesc}>{cat.description}</p>
              <div style={cardGrid}>
                {entries.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/clay-wiki/${entry.id}`}
                    style={card}
                  >
                    <div style={cardTitle}>{entry.title}</div>
                    <div style={cardSubtitle}>{entry.subtitle}</div>
                    <div style={cardMeta}>
                      <span style={diffBadge(entry.difficulty)}>
                        {entry.difficulty}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}

        {/* Navigation */}
        <div style={navRow}>
          <Link href="/" style={navLink}>
            &larr; home
          </Link>
        </div>
      </div>
    </>
  )
}
