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
const CLAY_BLUE = '#4B5CFA'
const CLAY_AFFILIATE = 'https://clay.com/?via=f57c60'

/* ── metadata ─────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Clay Wiki | The Practitioner\'s Guide to Clay',
  description:
    'Everything you need to know about Clay - enrichment patterns, scoring systems, Claygent prompts, formulas, certification tips, and real-world plays from a certified Clay practitioner.',
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

/* ── workflow data ─────────────────────────────────── */

const WORKFLOWS = [
  {
    title: 'Landing Page Generation',
    description:
      'Generate personalized landing pages from Clay enrichment data. Account research flows directly into page copy.',
  },
  {
    title: 'HubSpot CRM Sync',
    description:
      'Bi-directional Clay-to-HubSpot sync. Enriched contacts push to CRM with scoring, routing, and lifecycle stage automation.',
  },
  {
    title: 'Exa Research Enrichment',
    description:
      'Deep prospect intelligence using Exa API. Company research, news monitoring, and competitive intel - all inside Clay.',
  },
  {
    title: 'Account Scoring Formulas',
    description:
      'Multi-signal scoring using Clay formulas. Combine firmographic, technographic, and intent data for ICP fit scores.',
  },
]

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
  padding: '0 20px 80px',
  fontFamily: 'var(--font-mono)',
}

const clayStripe: React.CSSProperties = {
  height: '3px',
  background: `linear-gradient(90deg, ${CLAY_BLUE}, ${CLAY_BLUE}88, transparent)`,
  marginBottom: '40px',
  borderRadius: '0 0 2px 2px',
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

const certifiedCallout: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '11px',
  fontWeight: 700,
  color: CLAY_BLUE,
  background: `${CLAY_BLUE}12`,
  border: `1px solid ${CLAY_BLUE}33`,
  borderRadius: '6px',
  padding: '8px 16px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
}

const tryClayButton: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: 700,
  color: '#ffffff',
  background: CLAY_BLUE,
  borderRadius: '6px',
  padding: '10px 20px',
  textDecoration: 'none',
  letterSpacing: '0.02em',
  transition: 'opacity 0.15s ease, transform 0.1s ease',
}

const spriteWrap: React.CSSProperties = {
  flexShrink: 0,
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '40px 0',
}

/* ── workflow section styles ──────────────────────── */

const workflowSection: React.CSSProperties = {
  marginBottom: '48px',
}

const workflowHeader: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  marginBottom: '8px',
}

const workflowTitle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '20px',
}

const workflowGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '16px',
}

const workflowCard: React.CSSProperties = {
  padding: '20px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderLeft: `3px solid ${CLAY_BLUE}`,
  borderRadius: '8px',
}

const workflowCardTitle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '8px',
}

const workflowCardDesc: React.CSSProperties = {
  fontSize: '12px',
  lineHeight: 1.6,
  color: 'var(--text-secondary)',
}

const greenDot: React.CSSProperties = {
  display: 'inline-block',
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: '#4ade80',
  flexShrink: 0,
}

/* ── affiliate CTA banner styles ─────────────────── */

const ctaBanner: React.CSSProperties = {
  padding: '40px 32px',
  background: `linear-gradient(135deg, ${CLAY_BLUE}0a, ${CLAY_BLUE}18, ${CLAY_BLUE}0a)`,
  border: `1px solid ${CLAY_BLUE}22`,
  borderRadius: '12px',
  textAlign: 'center' as const,
  marginBottom: '48px',
}

const ctaHeading: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '8px',
}

const ctaSubtext: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.6,
  color: 'var(--text-secondary)',
  marginBottom: '20px',
  maxWidth: 520,
  margin: '0 auto 20px',
}

const ctaButton: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: 700,
  color: '#ffffff',
  background: CLAY_BLUE,
  borderRadius: '6px',
  padding: '12px 24px',
  textDecoration: 'none',
  letterSpacing: '0.02em',
  transition: 'opacity 0.15s ease, transform 0.1s ease',
}

/* ── category section styles ─────────────────────── */

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

const navLinkClay: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: 600,
  color: CLAY_BLUE,
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
          { name: 'Knowledge', url: `${SITE_URL}/knowledge` },
          { name: 'Clay Wiki', url: `${SITE_URL}/clay-wiki` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div style={pageWrap}>
        {/* Clay-blue gradient stripe */}
        <div style={clayStripe} />

        {/* Terminal header */}
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span> cd ~/clay-wiki
        </h1>

        {/* Hero section with sprite */}
        <div style={heroSection}>
          <div style={heroText}>
            <h2 style={heroTitle}>Clay Wiki</h2>
            <p style={heroDesc}>
              The practitioner&apos;s guide to Clay. Not the docs - the patterns, plays, and
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

            {/* Certification badge + Clay Creator badge + Certified callout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brands/clay-creator-full.png"
                alt="Clay Creator badge"
                width={100}
                height={100}
                style={{ borderRadius: 8, objectFit: 'contain' }}
              />
              <div style={certBadge}>
                <span style={{ fontSize: '16px' }}>&#9670;</span>
                Clay Certified Practitioner &middot; 98/100
              </div>
              <div style={certifiedCallout}>
                <span style={{ fontSize: '14px' }}>&#10003;</span>
                Certified Clay Creator
              </div>
            </div>

            {/* Try Clay CTA */}
            <a
              href={CLAY_AFFILIATE}
              target="_blank"
              rel="noopener noreferrer"
              style={tryClayButton}
            >
              Try Clay &rarr;
            </a>
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

        {/* ── Real Workflows Section ──────────────────── */}
        <div style={workflowSection}>
          <div style={workflowHeader}>
            <span style={{ color: 'var(--accent)' }}>$</span> ls ~/clay-wiki/workflows/
          </div>
          <h3 style={workflowTitle}>Real Workflows</h3>
          <div style={workflowGrid}>
            {WORKFLOWS.map((wf) => (
              <div key={wf.title} style={workflowCard}>
                <div style={workflowCardTitle}>
                  <span style={greenDot} />
                  {wf.title}
                </div>
                <div style={workflowCardDesc}>{wf.description}</div>
              </div>
            ))}
          </div>
        </div>

        <hr style={divider} />

        {/* ── Affiliate CTA Banner ────────────────────── */}
        <div style={ctaBanner}>
          <div style={ctaHeading}>Ready to build your own GTM workflows?</div>
          <div style={ctaSubtext}>
            Clay is the data enrichment and automation platform powering modern go-to-market teams.
          </div>
          <a
            href={CLAY_AFFILIATE}
            target="_blank"
            rel="noopener noreferrer"
            style={ctaButton}
          >
            Start with Clay
          </a>
        </div>

        <hr style={divider} />

        {/* ── Category Sections ───────────────────────── */}
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

        {/* ── Bottom Navigation ───────────────────────── */}
        <div style={navRow}>
          <Link href="/knowledge" style={navLink}>
            &larr; knowledge guide
          </Link>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a
              href={CLAY_AFFILIATE}
              target="_blank"
              rel="noopener noreferrer"
              style={navLinkClay}
            >
              try clay &rarr;
            </a>
            <Link href="/content-wiki" style={navLink}>
              content wiki &rarr;
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
