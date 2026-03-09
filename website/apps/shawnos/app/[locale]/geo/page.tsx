import type { Metadata } from 'next'
import Link from 'next/link'
import {
  GEO_WIKI_ENTRIES,
  GEO_WIKI_CATEGORIES,
} from '@shawnos/shared/data/geo-wiki'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { PageHero, ScrollRevealSection } from '../../WikiReveal'

const SITE_URL = 'https://shawnos.ai'

/* ── metadata ─────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'GEO Wiki | Generative Engine Optimization Guide',
  description:
    'The complete guide to Generative Engine Optimization (GEO). 25 entries covering how to get cited by ChatGPT, Perplexity, Gemini, and AI Overviews. Foundations, tactics, technical implementation, measurement, and case studies.',
  keywords: [
    'generative engine optimization',
    'GEO',
    'AEO',
    'AI citations',
    'AI search optimization',
    'ChatGPT SEO',
    'Perplexity optimization',
    'AI Overview optimization',
    'answer engine optimization',
    'llms.txt',
  ],
  alternates: { canonical: `${SITE_URL}/geo` },
  openGraph: {
    title: 'GEO Wiki | Generative Engine Optimization Guide',
    description:
      'The complete guide to getting cited by AI engines. 25 entries on GEO foundations, tactics, technical implementation, and measurement.',
    url: `${SITE_URL}/geo`,
    images: [
      {
        url: `/og?title=${encodeURIComponent('GEO Wiki')}&subtitle=${encodeURIComponent('Generative Engine Optimization Guide')}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'GEO Wiki | Generative Engine Optimization Guide',
    description:
      'The complete guide to getting cited by AI engines. 25 entries on GEO foundations, tactics, technical implementation, and measurement.',
    images: [
      `/og?title=${encodeURIComponent('GEO Wiki')}&subtitle=${encodeURIComponent('Generative Engine Optimization Guide')}`,
    ],
  },
}

/* ── FAQ schema ───────────────────────────────────── */

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Generative Engine Optimization (GEO)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Generative Engine Optimization is the practice of structuring your content so AI engines like ChatGPT, Perplexity, Gemini, and Google AI Overviews can discover, understand, and cite it in their responses. GEO goes beyond traditional SEO by focusing on extractability, entity authority, and structured data that AI models can parse.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is GEO different from SEO?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SEO optimizes for search engine result pages where users click through to your site. GEO optimizes for AI-generated responses where the AI cites your content directly. SEO focuses on keywords and backlinks. GEO focuses on answer blocks, schema markup, entity authority, and content structure that AI can extract and attribute.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is llms.txt?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'llms.txt is a markdown file you place at the root of your site that gives AI assistants a structured map of your content. It lists your pages, their topics, and how they relate to each other. Think of it as a sitemap built specifically for language models instead of search engine crawlers.',
      },
    },
  ],
}

const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'GEO Wiki',
  description: 'Complete guide to Generative Engine Optimization',
  url: `${SITE_URL}/geo`,
  numberOfItems: GEO_WIKI_ENTRIES.length,
  author: { '@type': 'Person', name: 'Shawn Tenam', url: SITE_URL },
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

const cardTitleStyle: React.CSSProperties = {
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

/* ── answer block (AI-extractable) ────────────────── */

const answerBlock: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '32px',
  fontSize: '14px',
  lineHeight: 1.75,
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-mono)',
}

/* ── page component ───────────────────────────────── */

export default function GeoWikiPage() {
  const entryCount = GEO_WIKI_ENTRIES.length
  const categoryCount = GEO_WIKI_CATEGORIES.length

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Knowledge', url: `${SITE_URL}/knowledge` },
          { name: 'GEO Wiki', url: `${SITE_URL}/geo` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <PageHero
        compact
        title="GEO Wiki"
        subtitle="Get cited by AI engines. Not just indexed."
      />

      {/* Answer block - AI-extractable summary */}
      <ScrollRevealSection background="var(--canvas)">
        <div style={answerBlock}>
          <strong style={{ color: 'var(--text-primary)' }}>
            Generative Engine Optimization (GEO)
          </strong>{' '}
          is the practice of structuring content so AI engines - ChatGPT, Perplexity,
          Gemini, Google AI Overviews - can discover, understand, and cite it in their
          responses. Unlike traditional SEO which optimizes for click-through from search
          results, GEO optimizes for direct citation in AI-generated answers. This wiki
          covers foundations, tactics, technical implementation, measurement, and real
          case studies across {entryCount} entries.
        </div>

        {/* Stats row */}
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
            <span style={statLabel}>AI Engines Covered</span>
          </div>
        </div>

        <div style={certBadge}>
          <span style={{ fontSize: '16px' }}>&#9670;</span>
          GEO Practitioner
        </div>
      </ScrollRevealSection>

      {/* Category sections */}
      {GEO_WIKI_CATEGORIES.map((cat, idx) => {
        const entries = GEO_WIKI_ENTRIES.filter((e) => e.category === cat.id)
        return (
          <ScrollRevealSection key={cat.id} background={idx % 2 === 0 ? 'var(--canvas-subtle)' : 'var(--canvas)'}>
            <h3 style={categoryTitle}>{cat.label}</h3>
            <p style={categoryDesc}>{cat.description}</p>
            <div style={cardGrid}>
              {entries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/geo/${entry.id}`}
                  style={card}
                >
                  <div style={cardTitleStyle}>{entry.title}</div>
                  <div style={cardSubtitle}>{entry.subtitle}</div>
                  <div style={cardMeta}>
                    <span style={diffBadge(entry.difficulty)}>
                      {entry.difficulty}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollRevealSection>
        )
      })}

      {/* Navigation */}
      <ScrollRevealSection background="var(--canvas)">
        <div style={navRow}>
          <Link href="/context-wiki" style={navLink}>
            &larr; context wiki
          </Link>
          <Link href="/how-to" style={navLink}>
            how-to wiki &rarr;
          </Link>
        </div>
      </ScrollRevealSection>
    </>
  )
}
