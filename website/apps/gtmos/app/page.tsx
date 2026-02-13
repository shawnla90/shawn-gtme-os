import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'thegtmos.ai — the GTM operating system',
  description:
    'The GTM operating system. Launching soon.',
  alternates: { canonical: 'https://thegtmos.ai' },
  openGraph: {
    title: 'thegtmos.ai — the GTM operating system',
    description: 'The GTM operating system. Launching soon.',
    url: 'https://thegtmos.ai',
  },
  twitter: {
    title: 'thegtmos.ai — the GTM operating system',
    description: 'The GTM operating system. Launching soon.',
  },
}

/* ── boot log entries ────────────────────────────── */

const bootLines: { status: string; label: string }[] = [
  { status: '...', label: 'gtm pipeline ... initializing' },
  { status: '...', label: 'campaign engine ... warming up' },
  { status: '...', label: 'outbound stack ... calibrating' },
  { status: 'OK', label: 'network link ... shawnos.ai' },
]

/* ── styles ──────────────────────────────────────── */

const page: React.CSSProperties = {
  maxWidth: 720,
  margin: '0 auto',
  padding: '48px 20px',
  fontFamily: 'var(--font-mono)',
}

const heroSection: React.CSSProperties = {
  marginBottom: 56,
  textAlign: 'center',
}

const prompt: React.CSSProperties = {
  fontSize: '14px',
  color: 'var(--text-muted)',
  marginBottom: 16,
}

const promptChar: React.CSSProperties = {
  color: 'var(--accent)',
}

const heroTitle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 700,
  color: 'var(--accent)',
  margin: '0 0 8px 0',
  lineHeight: 1.2,
}

const heroLoaded: React.CSSProperties = {
  fontSize: '14px',
  color: 'var(--text-muted)',
  marginBottom: 8,
  fontWeight: 400,
}

const tagline: React.CSSProperties = {
  fontSize: '16px',
  color: 'var(--text-primary)',
  lineHeight: 1.6,
  marginBottom: 28,
  maxWidth: 520,
  margin: '0 auto 28px',
}

const ctaLink: React.CSSProperties = {
  display: 'inline-block',
  padding: '10px 22px',
  fontSize: '13px',
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  color: 'var(--canvas)',
  background: 'var(--accent)',
  border: '1px solid var(--accent)',
  borderRadius: 6,
  textDecoration: 'none',
  transition: 'opacity 0.15s ease',
}

const sectionTitle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--accent)',
  marginBottom: 16,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const section: React.CSSProperties = {
  marginBottom: 56,
}

const bootLine: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 2,
  color: 'var(--text-secondary)',
}

const bootStatus: React.CSSProperties = {
  color: 'var(--accent)',
  fontWeight: 600,
}

const pendingStatus: React.CSSProperties = {
  color: 'var(--text-muted)',
  fontWeight: 600,
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '48px 0',
}

/* ── page ────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div style={page}>
      {/* ── Hero ── */}
      <section style={heroSection}>
        <p style={prompt}>
          <span style={promptChar}>$</span> ./boot thegtmos.ai
        </p>

        <p style={heroLoaded}>&gt; thegtmos.ai loading...</p>

        <h1 style={heroTitle}>thegtmos.ai</h1>

        <p style={tagline}>
          the gtm operating system. launching soon.
        </p>

        <a href="https://shawnos.ai" style={ctaLink}>
          visit shawnos.ai &rarr;
        </a>
      </section>

      <hr style={divider} />

      {/* ── Boot Log ── */}
      <section style={{ ...section, marginBottom: 24 }}>
        <h2 style={sectionTitle}>system status</h2>

        <div
          style={{
            padding: '20px 24px',
            background: 'var(--canvas-subtle)',
            border: '1px solid var(--border)',
            borderRadius: 6,
          }}
        >
          {bootLines.map((line) => (
            <div key={line.label} style={bootLine}>
              [<span style={line.status === 'OK' ? bootStatus : pendingStatus}>
                {line.status}
              </span>] {line.label}
            </div>
          ))}
          <div
            style={{
              marginTop: 16,
              paddingTop: 12,
              borderTop: '1px solid var(--border)',
              fontSize: '13px',
              color: 'var(--accent)',
              fontWeight: 600,
            }}
          >
            &gt; launch sequence pending_
          </div>
        </div>
      </section>
    </div>
  )
}
