import type { Metadata } from 'next'
import Link from 'next/link'
import {
  LEMLIST_WIKI_ENTRIES,
  LEMLIST_WIKI_CATEGORIES,
} from '@shawnos/shared/data/lemlist-wiki'
import { BreadcrumbSchema, AffiliateLink, AffiliateDisclosure } from '@shawnos/shared/components'
import { SITES } from '@shawnos/shared/lib/sites'

const SITE_URL = SITES.gtmos
const LEMLIST_PURPLE = '#7C3AED'
const LEMLIST_AFFILIATE = 'https://get.lemlist.com/bpxtvqplcews'

/* ── metadata ─────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Lemlist Wiki | Multichannel Outreach for GTM Engineers',
  description:
    'Everything you need to know about Lemlist - multichannel sequences, deliverability, inbox rotation, A/B testing, and real-world outreach patterns from production campaigns.',
  keywords: [
    'lemlist wiki',
    'lemlist guide',
    'lemlist tutorial',
    'multichannel outreach',
    'email outreach',
    'lemlist sequences',
    'lemlist deliverability',
    'lemwarm',
    'email automation',
    'outreach tool',
  ],
  alternates: { canonical: `${SITE_URL}/lemlist-wiki` },
  openGraph: {
    title: 'Lemlist Wiki | Multichannel Outreach for GTM Engineers',
    description:
      'Multichannel sequences, deliverability, and outreach patterns from production campaigns.',
    url: `${SITE_URL}/lemlist-wiki`,
  },
  twitter: {
    title: 'Lemlist Wiki | Multichannel Outreach for GTM Engineers',
    description:
      'Multichannel sequences, deliverability, and outreach patterns from production campaigns.',
  },
}

/* ── FAQ schema ───────────────────────────────────── */

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Lemlist used for in GTM?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lemlist is a multichannel outreach platform for email, LinkedIn, and phone sequences. GTM engineers use it to execute personalized outreach campaigns at scale with built-in deliverability tools like Lemwarm, inbox rotation, and A/B testing.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does Lemwarm work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lemwarm is Lemlist\'s built-in domain warm-up tool. It sends and receives emails between real inboxes in a warm-up network, generating opens, replies, and spam rescues that build your sender reputation with email providers.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does Lemlist compare to Instantly and Smartlead?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lemlist excels at multichannel (email + LinkedIn + phone in one sequence). Instantly focuses on high-volume email with aggressive inbox rotation. Smartlead specializes in agency-scale sending with sub-accounts. Choose based on whether you need multichannel or pure email volume.',
      },
    },
  ],
}

/* ── workflow data ─────────────────────────────────── */

const WORKFLOWS = [
  {
    title: 'Clay Enrichment Pipeline',
    description:
      'Enriched, scored leads from Clay flow directly into personalized Lemlist sequences with custom variables.',
  },
  {
    title: 'Multichannel Sequences',
    description:
      'Email + LinkedIn profile visits + connection requests + messages in a single automated sequence.',
  },
  {
    title: 'Domain Warm-Up',
    description:
      'Lemwarm handles new domain reputation building. Start warm-up day one, campaign sends by week three.',
  },
  {
    title: 'CRM Activity Sync',
    description:
      'Outreach events (sent, opened, replied) sync to your CRM via native integrations or webhooks.',
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

const lemlistStripe: React.CSSProperties = {
  height: '3px',
  background: `linear-gradient(90deg, ${LEMLIST_PURPLE}, ${LEMLIST_PURPLE}88, transparent)`,
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
  background: `${LEMLIST_PURPLE}15`,
  border: `2px solid ${LEMLIST_PURPLE}33`,
  borderRadius: '16px',
  fontSize: '48px',
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '40px 0',
}

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
  borderLeft: `3px solid ${LEMLIST_PURPLE}`,
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

const ctaBanner: React.CSSProperties = {
  padding: '40px 32px',
  background: `linear-gradient(135deg, ${LEMLIST_PURPLE}0a, ${LEMLIST_PURPLE}18, ${LEMLIST_PURPLE}0a)`,
  border: `1px solid ${LEMLIST_PURPLE}22`,
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
  background: LEMLIST_PURPLE,
  borderRadius: '6px',
  padding: '12px 24px',
  textDecoration: 'none',
  letterSpacing: '0.02em',
  transition: 'opacity 0.15s ease, transform 0.1s ease',
}

const tryButton: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: 700,
  color: '#ffffff',
  background: LEMLIST_PURPLE,
  borderRadius: '6px',
  padding: '10px 20px',
  textDecoration: 'none',
  letterSpacing: '0.02em',
  transition: 'opacity 0.15s ease, transform 0.1s ease',
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

const navLinkLemlist: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: 600,
  color: LEMLIST_PURPLE,
  textDecoration: 'none',
}

/* ── page component ───────────────────────────────── */

export default function LemlistWikiPage() {
  const entryCount = LEMLIST_WIKI_ENTRIES.length
  const categoryCount = LEMLIST_WIKI_CATEGORIES.length

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Knowledge', url: `${SITE_URL}/knowledge` },
          { name: 'Lemlist Wiki', url: `${SITE_URL}/lemlist-wiki` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div style={pageWrap}>
        {/* Lemlist-purple gradient stripe */}
        <div style={lemlistStripe} />

        {/* Terminal header */}
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span> cd ~/lemlist-wiki
        </h1>

        {/* Hero section */}
        <div style={heroSection}>
          <div style={heroText}>
            <h2 style={heroTitle}>Lemlist Wiki</h2>
            <p style={heroDesc}>
              Multichannel outreach infrastructure for GTM engineers. Not the docs - the
              sequence patterns, deliverability playbook, and hard-won opinions from running
              production campaigns. Email, LinkedIn, and phone touches orchestrated in one tool.
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
                <span style={statNum}>3</span>
                <span style={statLabel}>Channels</span>
              </div>
            </div>

            {/* Try Lemlist CTA */}
            <AffiliateLink
              href={LEMLIST_AFFILIATE}
              style={tryButton}
            >
              Try Lemlist &rarr;
            </AffiliateLink>
          </div>

          {/* Lemlist icon */}
          <div style={spriteWrap}>
            &#9993;
          </div>
        </div>

        <hr style={divider} />

        {/* ── Real Workflows Section ──────────────────── */}
        <div style={workflowSection}>
          <div style={workflowHeader}>
            <span style={{ color: 'var(--accent)' }}>$</span> ls ~/lemlist-wiki/workflows/
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
          <div style={ctaHeading}>Ready to build multichannel sequences?</div>
          <div style={ctaSubtext}>
            Lemlist is the multichannel outreach platform for teams that want
            email, LinkedIn, and phone in one workflow.
          </div>
          <a
            href={LEMLIST_AFFILIATE}
            target="_blank"
            rel="noopener noreferrer"
            style={ctaButton}
          >
            Start with Lemlist
          </a>
          <AffiliateDisclosure />
        </div>

        <hr style={divider} />

        {/* ── Category Sections ───────────────────────── */}
        {LEMLIST_WIKI_CATEGORIES.map((cat) => {
          const entries = LEMLIST_WIKI_ENTRIES.filter((e) => e.category === cat.id)
          return (
            <div key={cat.id} style={categorySection}>
              <div style={categoryHeader}>{cat.prompt}</div>
              <h3 style={categoryTitle}>{cat.label}</h3>
              <p style={categoryDesc}>{cat.description}</p>
              <div style={cardGrid}>
                {entries.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/lemlist-wiki/${entry.id}`}
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
              href={LEMLIST_AFFILIATE}
              target="_blank"
              rel="noopener noreferrer"
              style={navLinkLemlist}
            >
              try lemlist &rarr;
            </a>
            <Link href="/apollo-wiki" style={navLink}>
              apollo wiki &rarr;
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
