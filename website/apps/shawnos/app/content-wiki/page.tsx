import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CONTENT_WIKI_ENTRIES,
  CONTENT_WIKI_CATEGORIES,
} from '@shawnos/shared/data/content-wiki'
import { BreadcrumbSchema } from '@shawnos/shared/components'

const SITE_URL = 'https://shawnos.ai'

/* ── metadata ─────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Content Wiki | Content Operating System Playbooks',
  description:
    'Platform playbooks, voice systems, AI slop avoidance, content workflows, and tools — everything for building a content operating system that compounds.',
  keywords: [
    'content wiki',
    'content operating system',
    'content playbooks',
    'AI slop avoidance',
    'voice system',
    'LinkedIn strategy',
    'X algorithm',
    'content repurposing',
    'recursive content',
    'content pillars',
    'pre-publish checklist',
  ],
  alternates: { canonical: `${SITE_URL}/content-wiki` },
  openGraph: {
    title: 'Content Wiki | Content Operating System Playbooks',
    description:
      'Platform playbooks, voice systems, AI slop avoidance, content workflows, and tools for building a content OS that compounds.',
    url: `${SITE_URL}/content-wiki`,
    images: [
      {
        url: `/og?title=${encodeURIComponent('Content Wiki')}&subtitle=${encodeURIComponent('Content Operating System Playbooks')}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Content Wiki | Content Operating System Playbooks',
    description:
      'Platform playbooks, voice systems, AI slop avoidance, content workflows, and tools for building a content OS that compounds.',
    images: [
      `/og?title=${encodeURIComponent('Content Wiki')}&subtitle=${encodeURIComponent('Content Operating System Playbooks')}`,
    ],
  },
}

/* ── FAQ schema for hub page ──────────────────────── */

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a content operating system?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A content operating system is a repo-based, skill-powered workflow where drafts, final copy, images, and publishing live in version-controlled folders. One piece of content becomes five: LinkedIn post to X thread to Substack to TikTok to Reddit. The system compounds through recursive flows and agent skills.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you avoid AI slop in content?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI slop avoidance starts with a voice system: DNA rules, context playbooks, and anti-slop checklists. Avoid em-dash overuse, authority signaling ("here\'s the thing"), narrator setups, purple gradients, emoji walls, and generic hooks. Use detection checklists and before/after calibration before publishing.',
      },
    },
    {
      '@type': 'Question',
      name: 'What platforms should content creators focus on?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Focus depends on audience and format. LinkedIn favors carousels, document posts, and authentic commenting. X rewards replies and quote tweets over likes. TikTok demands 16-second structure and hook-demo-result-loop. Substack drives newsletter + Notes cross-promo. Reddit rewards authentic subreddit targeting and karma signals.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does recursive content repurposing work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'One piece becomes many: write a LinkedIn post first, then thread it for X, expand to Substack, turn key points into a TikTok script, and post insight snippets to Reddit. Each platform gets format-appropriate content. The recursive loop compounds reach while keeping voice and message consistent.',
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
  marginBottom: '40px',
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

export default function ContentWikiPage() {
  const entryCount = CONTENT_WIKI_ENTRIES.length
  const categoryCount = CONTENT_WIKI_CATEGORIES.length

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Knowledge', url: `${SITE_URL}/knowledge` },
          { name: 'Content Wiki', url: `${SITE_URL}/content-wiki` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div style={pageWrap}>
        {/* Terminal header */}
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span> cd ~/content-wiki
        </h1>

        {/* Hero section */}
        <div style={heroSection}>
          <h2 style={heroTitle}>Content Wiki</h2>
          <p style={heroDesc}>
            Platform playbooks, voice systems, AI slop avoidance, and content
            workflows. Not generic advice — the patterns, playbooks, and tools
            from building a content operating system that compounds.
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
          </div>
        </div>

        <hr style={divider} />

        {/* Category sections */}
        {CONTENT_WIKI_CATEGORIES.map((cat) => {
          const entries = CONTENT_WIKI_ENTRIES.filter((e) => e.category === cat.id)
          return (
            <div key={cat.id} style={categorySection}>
              <div style={categoryHeader}>{cat.prompt}</div>
              <h3 style={categoryTitle}>{cat.label}</h3>
              <p style={categoryDesc}>{cat.description}</p>
              <div style={cardGrid}>
                {entries.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/content-wiki/${entry.id}`}
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
          <Link href="/knowledge" style={navLink}>
            &larr; knowledge guide
          </Link>
          <Link href="/clay-wiki" style={navLink}>
            clay wiki &rarr;
          </Link>
        </div>
      </div>
    </>
  )
}
