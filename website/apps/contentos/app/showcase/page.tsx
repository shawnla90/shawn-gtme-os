import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { ShowcaseDemos } from './demos'

const SITE_URL = 'https://thecontentos.ai'

export const metadata: Metadata = {
  title: 'Showcase — Content Operations in React',
  description:
    'Ten interactive React demos that prove content operations are infrastructure, not decoration. Anti-slop detector, platform formatter, content pillar map, recursive content loop, and six more — all client-side, zero external APIs.',
  keywords: [
    'content operations showcase',
    'react content components',
    'anti-slop detector',
    'platform content formatter',
    'content pillar map',
    'recursive content loop',
    'content OS',
    'voice DNA',
    'content pipeline demo',
    'terminal aesthetic react',
  ],
  alternates: { canonical: `${SITE_URL}/showcase` },
  openGraph: {
    title: 'Showcase — Content Operations in React | theContentOS.ai',
    description:
      'Ten interactive React demos. Anti-slop detector, platform formatter, content pillars, recursive loops. The React is the content.',
    url: `${SITE_URL}/showcase`,
  },
  twitter: {
    card: 'summary',
    title: 'Showcase — Content Operations in React | theContentOS.ai',
    description:
      'Ten interactive React demos. The React is the content.',
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
  maxWidth: 580,
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

export default function ShowcasePage() {
  return (
    <div style={page}>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Showcase', url: `${SITE_URL}/showcase` },
        ]}
      />

      <div style={heading}>$ showcase --mode=interactive</div>
      <h1 style={title}>Showcase</h1>
      <p style={subtitle}>
        ten interactive components that demonstrate content operations as
        infrastructure. every demo runs client-side — the React is the content.
      </p>

      <div style={statsRow}>
        <div style={stat}>
          <span style={statNum}>10</span>
          <span style={statLabel}>live demos</span>
        </div>
        <div style={stat}>
          <span style={statNum}>4</span>
          <span style={statLabel}>new components</span>
        </div>
        <div style={stat}>
          <span style={statNum}>0</span>
          <span style={statLabel}>external APIs</span>
        </div>
        <div style={stat}>
          <span style={statNum}>20</span>
          <span style={statLabel}>anti-slop rules</span>
        </div>
      </div>

      <hr style={divider} />

      <ShowcaseDemos />

      <hr style={divider} />

      <nav style={navRow}>
        <Link
          href="/react-lab"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}
        >
          {'\u2190'} React Lab
        </Link>
        <Link
          href="/content-wiki"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}
        >
          Content Wiki {'\u2192'}
        </Link>
      </nav>
    </div>
  )
}
