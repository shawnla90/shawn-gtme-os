import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { SITES } from '@shawnos/shared/lib/sites'
import { ReactLabDemos } from './demos'

const SITE_URL = SITES.contentos

export const metadata: Metadata = {
  title: 'React Lab — Live Content Components',
  description:
    'Interactive React components that demonstrate content operations — terminal aesthetics, hook styles, voice DNA, content pipelines, and palette systems. The React is the content.',
  keywords: [
    'react content components',
    'content operations demo',
    'terminal aesthetic react',
    'content OS',
    'voice DNA',
    'hook styles',
  ],
  alternates: { canonical: `${SITE_URL}/react-lab` },
  openGraph: {
    title: 'React Lab — Live Content Components',
    description:
      'Interactive React components that demonstrate content operations. The React is the content.',
    url: `${SITE_URL}/react-lab`,
  },
  twitter: {
    card: 'summary',
    title: 'React Lab — Live Content Components',
    description:
      'Interactive React components that demonstrate content operations.',
  },
}

/* ── inline styles ── */

const page: React.CSSProperties = {
  maxWidth: 760,
  margin: '0 auto',
  padding: '40px 20px 60px',
  fontFamily: 'var(--font-mono)',
}

const heading: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text-muted)',
  marginBottom: 8,
}

const title: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: 8,
}

const subtitle: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
  marginBottom: 32,
  maxWidth: 560,
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '32px 0',
}

const statsRow: React.CSSProperties = {
  display: 'flex',
  gap: 32,
  marginBottom: 32,
  flexWrap: 'wrap',
}

const stat: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
}

const statNum: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: 'var(--accent)',
}

const statLabel: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--text-muted)',
  marginTop: 2,
}

const navRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 16,
  fontSize: 13,
  color: 'var(--text-secondary)',
  flexWrap: 'wrap',
}

export default function ReactLabPage() {
  return (
    <div style={page}>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'React Lab', url: `${SITE_URL}/react-lab` },
        ]}
      />

      <div style={heading}>$ cd ~/content-os/react-lab</div>
      <h1 style={title}>React Lab</h1>
      <p style={subtitle}>
        interactive components that demonstrate content operations. each
        component is both a demo and a piece of content — the React is the
        content.
      </p>

      <div style={statsRow}>
        <div style={stat}>
          <span style={statNum}>6</span>
          <span style={statLabel}>live demos</span>
        </div>
        <div style={stat}>
          <span style={statNum}>0</span>
          <span style={statLabel}>external APIs</span>
        </div>
        <div style={stat}>
          <span style={statNum}>3</span>
          <span style={statLabel}>color schemas</span>
        </div>
        <div style={stat}>
          <span style={statNum}>5</span>
          <span style={statLabel}>hook styles</span>
        </div>
      </div>

      <hr style={divider} />

      <ReactLabDemos />

      <hr style={divider} />

      <nav style={navRow}>
        <Link
          href="/content-wiki"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}
        >
          {'\u2190'} Content Wiki
        </Link>
        <Link
          href="/updates"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}
        >
          Updates {'\u2192'}
        </Link>
      </nav>
    </div>
  )
}
