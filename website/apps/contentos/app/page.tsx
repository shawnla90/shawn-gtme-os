import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'thecontentos.ai — the content operating system',
  description:
    'The content operating system. Launching soon.',
  alternates: { canonical: 'https://thecontentos.ai' },
  openGraph: {
    title: 'thecontentos.ai — the content operating system',
    description: 'The content operating system. Launching soon.',
    url: 'https://thecontentos.ai',
  },
  twitter: {
    title: 'thecontentos.ai — the content operating system',
    description: 'The content operating system. Launching soon.',
  },
}

/* ── boot log entries ────────────────────────────── */

const bootLines: { status: string; label: string }[] = [
  { status: '...', label: 'voice engine ... initializing' },
  { status: '...', label: 'content pipeline ... standby' },
  { status: '...', label: 'pillar detection ... queued' },
  { status: '...', label: 'recursive loop ... pending' },
  { status: 'OK', label: 'network link ... connected' },
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
}

const ctaLink: React.CSSProperties = {
  display: 'inline-block',
  padding: '10px 22px',
  fontSize: '13px',
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  color: 'var(--accent)',
  background: 'transparent',
  border: '1px solid var(--accent)',
  borderRadius: 6,
  textDecoration: 'none',
  transition: 'background 0.15s ease, color 0.15s ease',
}

const section: React.CSSProperties = {
  marginBottom: 56,
}

const sectionTitle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--accent)',
  marginBottom: 16,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
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

const bootPending: React.CSSProperties = {
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
          <span style={promptChar}>$</span> ./boot thecontentos.ai
        </p>

        <p style={heroLoaded}>&gt; thecontentos.ai loading...</p>

        <h1 style={heroTitle}>thecontentos.ai</h1>

        <p style={tagline}>
          the content operating system. launching soon.
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
              [<span style={line.status === 'OK' ? bootStatus : bootPending}>
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
              color: 'var(--text-muted)',
              fontWeight: 600,
            }}
          >
            &gt; awaiting launch sequence_
          </div>
        </div>
      </section>
    </div>
  )
}
