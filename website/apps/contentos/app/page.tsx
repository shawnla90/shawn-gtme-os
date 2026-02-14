import type { Metadata } from 'next'
import path from 'path'
import Link from 'next/link'
import { getAllLogs } from '@shawnos/shared/lib'
import { LogCard } from '@shawnos/shared/components'

export const metadata: Metadata = {
  title: 'thecontentos.ai — the content operating system',
  description:
    'One voice across every platform. AI-powered content that sounds like you, not AI slop. Voice engine, platform playbooks, and recursive content loops — from one repo.',
  alternates: { canonical: 'https://thecontentos.ai' },
  openGraph: {
    title: 'thecontentos.ai — the content operating system',
    description:
      'One voice across every platform. AI-powered content that sounds like you, not AI slop.',
    url: 'https://thecontentos.ai',
  },
  twitter: {
    title: 'thecontentos.ai — the content operating system',
    description:
      'One voice across every platform. AI-powered content that sounds like you, not AI slop.',
  },
}

const LOG_DIR = path.join(process.cwd(), '../../../data/daily-log')

/* ── boot log entries ────────────────────────────── */

const bootLines: { status: string; label: string }[] = [
  { status: 'OK', label: 'voice engine ... calibrated' },
  { status: 'OK', label: 'content pipeline ... flowing' },
  { status: 'OK', label: 'pillar detection ... active' },
  { status: 'OK', label: 'recursive loop ... engaged' },
  { status: 'OK', label: 'platform playbooks ... loaded' },
  { status: 'OK', label: 'network link ... thegtmos.ai' },
]

/* ── system features ─────────────────────────────── */

const systemFeatures: { title: string; desc: string }[] = [
  {
    title: 'voice engine',
    desc: 'Speak to your AI. Generate content that sounds like you — not a template, not slop. Your cadence, your energy, your words.',
  },
  {
    title: 'platform playbooks',
    desc: 'LinkedIn, X, Substack, TikTok, Reddit — each platform\'s rules encoded. The system adapts your voice without losing it.',
  },
  {
    title: 'pillar detection',
    desc: 'Content pillars auto-tagged, cross-referenced, threaded. Every post knows where it sits in the bigger picture.',
  },
  {
    title: 'recursive loop',
    desc: 'Every post feeds the next one. Breadcrumbs. Forward-references. The system compounds — your content library grows itself.',
  },
  {
    title: 'cross-platform distribution',
    desc: 'LinkedIn, X, Substack, TikTok, Reddit from one source of truth. One draft becomes five native posts.',
  },
]

/* ── lead magnet teases ──────────────────────────── */

const resources: { title: string; desc: string }[] = [
  {
    title: 'scaffold prompt',
    desc: 'Build your own content OS from 3 questions. Copy-paste-ready.',
  },
  {
    title: 'platform playbook starters',
    desc: 'X, TikTok, Reddit, YouTube — starter playbooks for each platform.',
  },
  {
    title: 'AI slop detection checklist',
    desc: 'Spot and fix the patterns that make AI writing sound like everyone else.',
  },
  {
    title: 'MCP integration guide',
    desc: 'Connect your tools — Instantly, HeyReach, Firecrawl, and more.',
  },
]

/* ── the pain points ─────────────────────────────── */

const painPoints: string[] = [
  'You want to grow. But every platform rewrites your voice.',
  'LinkedIn has its rules. X has its rules. Substack, TikTok, Reddit — all different.',
  'People make it look easy. It\'s not. It takes real work.',
  'The energy it takes to adapt, engage, and thread across platforms — that\'s the hidden cost nobody talks about.',
  'You shouldn\'t have to navigate a million tabs to be yourself everywhere.',
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

const promptStyle: React.CSSProperties = {
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
  maxWidth: 560,
}

const ctaRow: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
}

const ctaPrimary: React.CSSProperties = {
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

const ctaSecondary: React.CSSProperties = {
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

const sectionTitle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--accent)',
  marginBottom: 16,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const sectionStyle: React.CSSProperties = {
  marginBottom: 56,
}

const painBlock: React.CSSProperties = {
  padding: '24px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: 6,
}

const painLine: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 2,
  color: 'var(--text-secondary)',
  margin: 0,
}

const featureGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 16,
}

const featureCard: React.CSSProperties = {
  padding: '20px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: 6,
}

const featureTitle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  color: 'var(--accent)',
  marginBottom: 8,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}

const featureDesc: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.7,
  color: 'var(--text-secondary)',
  margin: 0,
}

const resourceList: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
}

const resourceItem: React.CSSProperties = {
  padding: '16px 20px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  marginBottom: 8,
}

const resourceTitle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  color: 'var(--accent)',
  marginBottom: 4,
}

const resourceDesc: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--text-secondary)',
  margin: 0,
  lineHeight: 1.5,
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

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '48px 0',
}

/* ── page ────────────────────────────────────────── */

export default function HomePage() {
  const logs = getAllLogs(LOG_DIR)
  const latestLog = logs.length > 0 ? logs[0] : null

  return (
    <div style={page}>
      {/* ── Hero ── */}
      <section style={heroSection}>
        <p style={promptStyle}>
          <span style={promptChar}>$</span> ./boot thecontentos.ai
        </p>

        <p style={heroLoaded}>&gt; thecontentos.ai loaded</p>

        <h1 style={heroTitle}>thecontentos.ai</h1>

        <p style={tagline}>
          the content operating system. one voice. every platform. no tab-surfing.
          speak to your AI and ship content that actually sounds like you.
        </p>

        <div style={ctaRow}>
          <Link href="/log" style={ctaPrimary}>
            view the build log &rarr;
          </Link>
          <a href="https://shawnos.ai" style={ctaSecondary}>
            explore shawnos.ai
          </a>
        </div>
      </section>

      <hr style={divider} />

      {/* ── The Problem ── */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>
          <span style={promptChar}>$</span>{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            cat ~/problem.log
          </span>
        </h2>

        <div style={painBlock}>
          {painPoints.map((point, i) => (
            <p key={i} style={painLine}>
              <span style={{ color: 'var(--text-muted)' }}>&gt;</span> {point}
            </p>
          ))}
          <p
            style={{
              ...painLine,
              color: 'var(--accent)',
              fontWeight: 600,
              marginTop: 16,
              paddingTop: 12,
              borderTop: '1px solid var(--border)',
            }}
          >
            there has to be a better way.
          </p>
        </div>
      </section>

      <hr style={divider} />

      {/* ── The System ── */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>
          <span style={promptChar}>$</span>{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            ls ~/system --modules
          </span>
        </h2>

        <div style={featureGrid}>
          {systemFeatures.map((f) => (
            <div key={f.title} style={featureCard}>
              <h3 style={featureTitle}>{f.title}</h3>
              <p style={featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr style={divider} />

      {/* ── What's Inside ── */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>
          <span style={promptChar}>$</span>{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            ls ~/resources --available
          </span>
        </h2>

        <ul style={resourceList}>
          {resources.map((r) => (
            <li key={r.title} style={resourceItem}>
              <div style={resourceTitle}>{r.title}</div>
              <p style={resourceDesc}>{r.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Latest Log ── */}
      {latestLog && (
        <>
          <hr style={divider} />

          <section style={sectionStyle}>
            <h2 style={sectionTitle}>
              <span style={promptChar}>$</span>{' '}
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                cat ~/log --latest
              </span>
            </h2>

            <LogCard {...latestLog} basePath="/log" />

            <div style={{ marginTop: 24 }}>
              <Link
                href="/log"
                style={{
                  fontSize: '13px',
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                view all logs &rarr;
              </Link>
            </div>
          </section>
        </>
      )}

      <hr style={divider} />

      {/* ── Boot Log ── */}
      <section style={{ ...sectionStyle, marginBottom: 24 }}>
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
              [<span style={bootStatus}>{line.status}</span>] {line.label}
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
            &gt; all systems operational_
          </div>
        </div>
      </section>
    </div>
  )
}
