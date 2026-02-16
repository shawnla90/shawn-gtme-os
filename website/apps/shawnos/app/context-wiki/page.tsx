import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CONTEXT_WIKI_ENTRIES,
  CONTEXT_WIKI_CATEGORIES,
} from '@shawnos/shared/data/context-wiki'
import type { ContextWikiCategory } from '@shawnos/shared/data/context-wiki'
import { BreadcrumbSchema } from '@shawnos/shared/components'

const SITE_URL = 'https://shawnos.ai'

/* ── metadata ─────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Context Engineering Wiki | The Practitioner\'s Guide',
  description:
    'The practitioner\'s guide to context engineering for GTM engineers. How to build context repositories, use plan mode, run parallel agents, and give AI the right context so it stops guessing and starts executing.',
  keywords: [
    'context engineering',
    'claude code gtm',
    'ai agents gtm',
    'plan mode',
    'parallel agents',
    'context repository',
    'claude skills',
    'ai context window',
    'gtm ai agents',
  ],
  alternates: { canonical: `${SITE_URL}/context-wiki` },
  openGraph: {
    title: 'Context Engineering Wiki | The Practitioner\'s Guide',
    description:
      'The practitioner\'s guide to context engineering. Patterns, workflows, and infrastructure for building GTM systems with AI agents.',
    url: `${SITE_URL}/context-wiki`,
    images: [
      {
        url: `/og?title=${encodeURIComponent('Context Engineering Wiki')}&subtitle=${encodeURIComponent("The Practitioner's Guide")}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Context Engineering Wiki | The Practitioner\'s Guide',
    description:
      'The practitioner\'s guide to context engineering. Patterns, workflows, and infrastructure for building GTM systems with AI agents.',
    images: [
      `/og?title=${encodeURIComponent('Context Engineering Wiki')}&subtitle=${encodeURIComponent("The Practitioner's Guide")}`,
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
      name: 'What is context engineering?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Context engineering is the art of filling the context window with just the right information. It is not prompt engineering. Prompt engineering is crafting the question. Context engineering is architecting what the AI has access to before it answers. Same AI plus bad context equals generic garbage. Same AI plus rich context equals gold.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a context repository?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A context repository is a collection of markdown files in a GitHub repo that hold your products, personas, messaging, voice, and workflows. Update once, all AI systems use it. Your entire GTM OS repo can be your context repository. Every skill, every voice file, every partner folder. It is the work itself.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are Claude Code skills?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Skills are markdown files that capture how you do something. Write it once in plain English. Claude follows it every time. Every workflow you repeat more than twice becomes a skill. SOPs are dead. Why write a document for humans to follow when you can write a skill that an agent executes and improves on its own?',
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

export default function ContextWikiPage() {
  const entryCount = CONTEXT_WIKI_ENTRIES.length
  const categoryCount = CONTEXT_WIKI_CATEGORIES.length

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Knowledge', url: `${SITE_URL}/knowledge` },
          { name: 'Context Wiki', url: `${SITE_URL}/context-wiki` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div style={pageWrap}>
        {/* Terminal header */}
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span> cd ~/context-wiki
        </h1>

        {/* Hero section */}
        <div style={heroSection}>
          <div style={heroText}>
            <h2 style={heroTitle}>Context Engineering Wiki</h2>
            <p style={heroDesc}>
              The practitioner&apos;s guide to context engineering. Not theory. The
              patterns, workflows, and infrastructure I use every day to build GTM
              systems with AI agents. How to give AI the right context so it stops
              guessing and starts executing.
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
                <span style={statNum}>40+</span>
                <span style={statLabel}>Skills Built</span>
              </div>
            </div>

            {/* Badge */}
            <div style={certBadge}>
              <span style={{ fontSize: '16px' }}>&#9670;</span>
              Context Engineer
            </div>
          </div>
        </div>

        <hr style={divider} />

        {/* Category sections */}
        {CONTEXT_WIKI_CATEGORIES.map((cat) => {
          const entries = CONTEXT_WIKI_ENTRIES.filter((e) => e.category === cat.id)
          return (
            <div key={cat.id} style={categorySection}>
              <div style={categoryHeader}>{cat.prompt}</div>
              <h3 style={categoryTitle}>{cat.label}</h3>
              <p style={categoryDesc}>{cat.description}</p>
              <div style={cardGrid}>
                {entries.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/context-wiki/${entry.id}`}
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
