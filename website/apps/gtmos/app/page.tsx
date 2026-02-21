import type { Metadata } from 'next'
import path from 'path'
import Link from 'next/link'
import { getAllLogs } from '@shawnos/shared/lib'
import { LogCard, TypewriterHero, ScrambleCycler, AvatarBadge } from '@shawnos/shared/components'
import { VideoShowcase } from './VideoShowcase'

export const metadata: Metadata = {
  title: 'theGTMOS.ai | the GTM operating system',
  description:
    'Pipeline orchestration, outbound automation, and partner workflows. Running from one repo. The go-to-market operating system, built in public.',
  alternates: { canonical: 'https://thegtmos.ai' },
  openGraph: {
    title: 'theGTMOS.ai | the GTM operating system',
    description:
      'Pipeline orchestration, outbound automation, and partner workflows. Running from one repo.',
    url: 'https://thegtmos.ai',
  },
  twitter: {
    title: 'theGTMOS.ai | the GTM operating system',
    description:
      'Pipeline orchestration, outbound automation, and partner workflows. Running from one repo.',
  },
}

const LOG_DIR = path.join(process.cwd(), '../../../data/daily-log')

/* ── boot log entries ────────────────────────────── */

const bootLines: { status: string; label: string }[] = [
  { status: 'OK', label: 'gtm pipeline ... online' },
  { status: 'OK', label: 'campaign engine ... active' },
  { status: 'OK', label: 'outbound stack ... routing' },
  { status: 'OK', label: 'partner engine ... synced' },
  { status: 'OK', label: 'lead magnets ... loaded' },
  { status: 'OK', label: 'network link ... theContentOS.ai' },
]

/* ── feature grid data ───────────────────────────── */

const features: { title: string; desc: string }[] = [
  {
    title: 'pipeline orchestration',
    desc: 'Clay workflows, web reveal qualification, ICP scoring. Leads enter, qualified prospects exit.',
  },
  {
    title: 'outbound stack',
    desc: 'Instantly for email. HeyReach for LinkedIn. Domain-based routing decides which channel fires.',
  },
  {
    title: 'partner engine',
    desc: 'Onboarding scaffolds, campaign copy generation, Slack sync, resource handoff. One command.',
  },
  {
    title: 'lead magnets',
    desc: 'Scaffold prompts, MCP guides, platform playbooks. Value you can share before the first call.',
  },
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

const heroRow: React.CSSProperties = {
  display: 'flex',
  gap: 32,
  alignItems: 'flex-start',
  flexWrap: 'wrap',
}

const heroLeft: React.CSSProperties = {
  flex: '1 1 340px',
  minWidth: 0,
}

const heroRight: React.CSSProperties = {
  flex: '0 0 auto',
  padding: '20px 24px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  minWidth: 200,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  alignSelf: 'flex-start',
  marginTop: 4,
}

const scrambleLabel: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: 'var(--accent)',
  letterSpacing: '0.08em',
  fontFamily: 'var(--font-mono)',
}

const prompt: React.CSSProperties = {
  fontSize: '14px',
  color: 'var(--text-muted)',
  marginBottom: 16,
}

const promptChar: React.CSSProperties = {
  color: 'var(--accent)',
}

const heroLoaded: React.CSSProperties = {
  fontSize: '14px',
  color: 'var(--text-muted)',
  marginBottom: 8,
  fontWeight: 400,
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

const section: React.CSSProperties = {
  marginBottom: 56,
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
        <p style={prompt}>
          <span style={promptChar}>$</span> ./boot theGTMOS.ai
        </p>

        <p style={heroLoaded}>&gt; theGTMOS.ai loaded</p>

        <div style={heroRow}>
          {/* Left — title + typewriter + CTAs */}
          <div style={heroLeft}>
            <TypewriterHero
              siteName="theGTMOS.ai"
              maxWidth={420}
              typeOnce
              sequences={[
                {
                  text: 'the go-to-market operating system. pipeline to close, one repo. every workflow, campaign, and partner playbook runs through the same codebase.',
                },
              ]}
            />

            <div style={ctaRow}>
              <Link href="/log" style={ctaPrimary}>
                view the build log &rarr;
              </Link>
              <a href="https://shawnos.ai" style={ctaSecondary}>
                explore ShawnOS.ai
              </a>
            </div>
          </div>

          {/* Right — avatar badge + scramble decode cycler */}
          <div style={heroRight}>
            <AvatarBadge size="compact" />
            <Link
              href="/log/skill-guide"
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontFamily: 'var(--font-mono)',
                transition: 'color 0.15s ease',
              }}
            >
              what is this? &rarr;
            </Link>
            <div
              style={{
                width: '100%',
                borderTop: '1px solid var(--border)',
                margin: '4px 0',
              }}
            />
            <div style={scrambleLabel}>G.T.M.</div>
            <ScrambleCycler
              phrases={[
                'Go. To. Market.',
                'Get. The. Meeting.',
                'Grow. The. Machine.',
              ]}
              holdMs={3000}
              scrambleSpeed={30}
              resolveSpeed={50}
            />
          </div>
        </div>
      </section>

      <hr style={divider} />

      {/* ── Highlight Reel ── */}
      <section style={section}>
        <h2 style={sectionTitle}>
          <span style={promptChar}>$</span>{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            play ./highlight-reel
          </span>
        </h2>
        <VideoShowcase />
      </section>

      <hr style={divider} />

      {/* ── What's Running ── */}
      <section style={section}>
        <h2 style={sectionTitle}>
          <span style={promptChar}>$</span>{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            ls ~/stack --active
          </span>
        </h2>

        <div style={featureGrid}>
          {features.map((f) => (
            <div key={f.title} style={featureCard}>
              <h3 style={featureTitle}>{f.title}</h3>
              <p style={featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Latest Log ── */}
      {latestLog && (
        <>
          <hr style={divider} />

          <section style={section}>
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
