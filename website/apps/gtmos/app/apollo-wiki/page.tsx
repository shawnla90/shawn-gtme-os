import type { Metadata } from 'next'
import Link from 'next/link'
import {
  APOLLO_WIKI_ENTRIES,
  APOLLO_WIKI_CATEGORIES,
} from '@shawnos/shared/data/apollo-wiki'
import type { ApolloWikiCategory } from '@shawnos/shared/data/apollo-wiki'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { AffiliateLink, AffiliateDisclosure } from '@shawnos/shared/components'
import { SITES } from '@shawnos/shared/lib/sites'

const SITE_URL = SITES.gtmos
const APOLLO_INDIGO = '#6366F1'
const APOLLO_AFFILIATE = 'https://get.apollo.io/y3gtusoq4h9g'

/* ── metadata ─────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Apollo Wiki | People Search Infrastructure for GTM Engineers',
  description:
    'Everything you need to know about Apollo for GTM sourcing - people search patterns, API architecture, title filtering, Supabase warehouse design, and automation workflows for hackers and SDRs.',
  keywords: [
    'apollo wiki',
    'apollo guide',
    'apollo api guide',
    'apollo people search',
    'apollo gtm',
    'apollo sourcing',
    'apollo enrichment',
    'apollo automation',
    'people search automation',
    'b2b sourcing',
  ],
  alternates: { canonical: `${SITE_URL}/apollo-wiki` },
  openGraph: {
    title: 'Apollo Wiki | People Search Infrastructure for GTM Engineers',
    description:
      'People search patterns, API architecture, and automation workflows for Apollo. The practitioner guide for GTM engineers.',
    url: `${SITE_URL}/apollo-wiki`,
  },
  twitter: {
    title: 'Apollo Wiki | People Search Infrastructure for GTM Engineers',
    description:
      'People search patterns, API architecture, and automation workflows for Apollo. The practitioner guide for GTM engineers.',
  },
}

/* ── FAQ schema for hub page ──────────────────────── */

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Why should Apollo be your first sourcing run?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Apollo has the richest B2B people database (275M+ contacts) with a free API tier. People search is the biggest bottleneck in GTM engineering - most teams still do it manually. Starting with Apollo gives you structured people data before you spend credits on Clay enrichment.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the Apollo free API work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Apollo provides 10,000 free credits per month. The key endpoints are /v1/mixed_people/search for people search and /v1/organizations/enrich for company data. Authentication is a simple API key passed in the request body. No OAuth required.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between the hacker track and SDR enablement track?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The hacker track uses Supabase + Apollo API + Claude Code + cron jobs for full automation. The SDR enablement track uses Claude Co-work with folder systems and CSV exports for teams that prefer a no-code workflow. Both produce CRM-ready output.',
      },
    },
  ],
}

/* ── workflow data ─────────────────────────────────── */

const WORKFLOWS = [
  {
    title: 'People Search Automation',
    description:
      'Automated sourcing with Apollo API. Batch by persona, filter by title, deduplicate against existing contacts.',
  },
  {
    title: 'Supabase Data Warehouse',
    description:
      'Account-contact split in Postgres. Upsert logic, enrichment tracking, and pipeline analytics queries.',
  },
  {
    title: 'Conference Prospecting',
    description:
      'Scan 100-1000 attendees, qualify by ICP, tier contacts, and route to pre-event outreach sequences.',
  },
  {
    title: 'SDR Research Pipeline',
    description:
      'Claude Co-work + folder systems. Research, icebreakers, tech stack analysis, and CRM-ready output.',
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

const apolloStripe: React.CSSProperties = {
  height: '3px',
  background: `linear-gradient(90deg, ${APOLLO_INDIGO}, ${APOLLO_INDIGO}88, transparent)`,
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

const spriteWrap: React.CSSProperties = {
  flexShrink: 0,
  width: 128,
  height: 128,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `${APOLLO_INDIGO}15`,
  border: `2px solid ${APOLLO_INDIGO}33`,
  borderRadius: '16px',
  fontSize: '48px',
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
  borderLeft: `3px solid ${APOLLO_INDIGO}`,
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

/* ── CTA banner styles ─────────────────── */

const ctaBanner: React.CSSProperties = {
  padding: '40px 32px',
  background: `linear-gradient(135deg, ${APOLLO_INDIGO}0a, ${APOLLO_INDIGO}18, ${APOLLO_INDIGO}0a)`,
  border: `1px solid ${APOLLO_INDIGO}22`,
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
  background: APOLLO_INDIGO,
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

const navLinkApollo: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: 600,
  color: APOLLO_INDIGO,
  textDecoration: 'none',
}

/* ── page component ───────────────────────────────── */

export default function ApolloWikiPage() {
  const entryCount = APOLLO_WIKI_ENTRIES.length
  const categoryCount = APOLLO_WIKI_CATEGORIES.length

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Knowledge', url: `${SITE_URL}/knowledge` },
          { name: 'Apollo Wiki', url: `${SITE_URL}/apollo-wiki` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div style={pageWrap}>
        {/* Apollo-indigo gradient stripe */}
        <div style={apolloStripe} />

        {/* Terminal header */}
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span> cd ~/apollo-wiki
        </h1>

        {/* Hero section */}
        <div style={heroSection}>
          <div style={heroText}>
            <h2 style={heroTitle}>Apollo Wiki</h2>
            <p style={heroDesc}>
              People search infrastructure for GTM engineers. Not the docs - the
              architecture, workflows, and hard-won patterns from building production
              sourcing pipelines with Apollo&apos;s API. Why people search should be
              your first run, not your last.
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
                <span style={statNum}>275M+</span>
                <span style={statLabel}>Contacts in Apollo</span>
              </div>
            </div>

            {/* Apollo CTA */}
            <AffiliateLink
              href={APOLLO_AFFILIATE}
              style={{
                display: 'inline-block',
                fontSize: '13px',
                fontWeight: 700,
                color: '#ffffff',
                background: APOLLO_INDIGO,
                borderRadius: '6px',
                padding: '10px 20px',
                textDecoration: 'none',
                letterSpacing: '0.02em',
                transition: 'opacity 0.15s ease, transform 0.1s ease',
              }}
            >
              Try Apollo &rarr;
            </AffiliateLink>
          </div>

          {/* Apollo icon placeholder */}
          <div style={spriteWrap}>
            &#9790;
          </div>
        </div>

        <hr style={divider} />

        {/* ── Real Workflows Section ──────────────────── */}
        <div style={workflowSection}>
          <div style={workflowHeader}>
            <span style={{ color: 'var(--accent)' }}>$</span> ls ~/apollo-wiki/workflows/
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

        {/* ── CTA Banner ────────────────────── */}
        <div style={ctaBanner}>
          <div style={ctaHeading}>Ready to automate your people search?</div>
          <div style={ctaSubtext}>
            Apollo is the people search layer for modern GTM pipelines.
            Start with the free API and scale from there.
          </div>
          <a
            href={APOLLO_AFFILIATE}
            target="_blank"
            rel="noopener noreferrer"
            style={ctaButton}
          >
            Start with Apollo
          </a>
          <AffiliateDisclosure />
        </div>

        <hr style={divider} />

        {/* ── Category Sections ───────────────────────── */}
        {APOLLO_WIKI_CATEGORIES.map((cat) => {
          const entries = APOLLO_WIKI_ENTRIES.filter((e) => e.category === cat.id)
          return (
            <div key={cat.id} style={categorySection}>
              <div style={categoryHeader}>{cat.prompt}</div>
              <h3 style={categoryTitle}>{cat.label}</h3>
              <p style={categoryDesc}>{cat.description}</p>
              <div style={cardGrid}>
                {entries.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/apollo-wiki/${entry.id}`}
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
              href={APOLLO_AFFILIATE}
              target="_blank"
              rel="noopener noreferrer"
              style={navLinkApollo}
            >
              try apollo &rarr;
            </a>
            <Link href="/clay-wiki" style={navLink}>
              clay wiki &rarr;
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
