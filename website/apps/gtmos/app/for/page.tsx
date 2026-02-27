import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllSlugs, getPageData } from '@/lib/abm'

const SITE_URL = 'https://thegtmos.ai'
const ACCENT = '#10B981'

export const metadata: Metadata = {
  title: 'Landing Pages | theGTMOS.ai',
  description:
    'Personalized landing pages built for each prospect. AI-generated, account-specific GTM infrastructure demos.',
  alternates: { canonical: `${SITE_URL}/for` },
  robots: { index: false, follow: false },
}

/* ── styles ─────────────────────────────────────────── */

const pageWrap: React.CSSProperties = {
  maxWidth: 1080,
  margin: '0 auto',
  padding: '0 20px 80px',
  fontFamily: 'var(--font-mono)',
}

const accentStripe: React.CSSProperties = {
  height: '3px',
  background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT}88, transparent)`,
  marginBottom: '40px',
  borderRadius: '0 0 2px 2px',
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

const cardCompany: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '6px',
  lineHeight: 1.3,
}

const cardDomain: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-muted)',
  marginBottom: '10px',
}

const cardHeadline: React.CSSProperties = {
  fontSize: '12px',
  lineHeight: 1.6,
  color: 'var(--text-secondary)',
  marginBottom: '12px',
}

const colorDot = (color: string): React.CSSProperties => ({
  display: 'inline-block',
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  background: color,
  flexShrink: 0,
  marginRight: '8px',
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

/* ── page ────────────────────────────────────────────── */

export default function ForDirectoryPage() {
  const slugs = getAllSlugs()
  const pages = slugs
    .map((slug) => getPageData(slug))
    .filter(Boolean)
    .sort((a, b) => a!.company.localeCompare(b!.company))

  return (
    <div style={pageWrap}>
      <div style={accentStripe} />

      <h1 style={terminalHeader}>
        <span style={{ color: 'var(--accent)' }}>$</span> ls ~/landing-pages/
      </h1>

      <h2 style={heroTitle}>Landing Pages</h2>
      <p style={heroDesc}>
        Personalized, account-specific landing pages generated for each prospect.
        Every page is built from enrichment data - custom challenges, deliverables,
        and engagement steps tailored to each company.
      </p>

      <div style={statsRow}>
        <div style={statBox}>
          <span style={statNum}>{pages.length}</span>
          <span style={statLabel}>Pages</span>
        </div>
        <div style={statBox}>
          <span style={statNum}>AI</span>
          <span style={statLabel}>Generated</span>
        </div>
        <div style={statBox}>
          <span style={statNum}>1:1</span>
          <span style={statLabel}>Personalized</span>
        </div>
      </div>

      <hr style={divider} />

      <div style={cardGrid}>
        {pages.map((page) => {
          if (!page) return null
          return (
            <Link key={page.slug} href={`/for/${page.slug}`} style={card}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={colorDot(page.theme.primary)} />
                <span style={cardCompany}>{page.company}</span>
              </div>
              <div style={cardDomain}>{page.domain}</div>
              <div style={cardHeadline}>{page.headline}</div>
            </Link>
          )
        })}
      </div>

      <div style={navRow}>
        <Link href="/" style={navLink}>
          &larr; home
        </Link>
        <Link href="/features" style={navLink}>
          features &rarr;
        </Link>
      </div>
    </div>
  )
}
