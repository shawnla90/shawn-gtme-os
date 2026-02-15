import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description:
    'GTM Engineer. Builder. Shipped from a monorepo. The operating system behind shawnos.ai.',
  alternates: { canonical: 'https://shawnos.ai/about' },
  openGraph: {
    title: 'About | shawnos.ai',
    description:
      'GTM Engineer. Builder. Shipped from a monorepo.',
    url: 'https://shawnos.ai/about',
    images: [{ url: '/og?title=About&subtitle=GTM+Engineer.+Builder.+Shipped+from+a+monorepo.', width: 1200, height: 630 }],
  },
  twitter: {
    title: 'About | shawnos.ai',
    description:
      'GTM Engineer. Builder. Shipped from a monorepo.',
    images: ['/og?title=About&subtitle=GTM+Engineer.+Builder.+Shipped+from+a+monorepo.'],
  },
}

/* ── data ─────────────────────────────────────────── */

const tools: { name: string; note: string }[] = [
  { name: 'Cursor IDE', note: 'AI-native development' },
  { name: 'Claude', note: 'reasoning engine' },
  { name: 'Vercel', note: 'deployment' },
  { name: 'Turborepo', note: 'monorepo' },
  { name: 'Next.js', note: 'framework' },
  { name: 'Python + Pillow', note: 'content images' },
  { name: 'HeyReach', note: 'LinkedIn automation' },
  { name: 'Instantly', note: 'email sequencing' },
  { name: 'Clay', note: 'data enrichment' },
]

const network: { label: string; url: string; accent: string; desc: string }[] = [
  {
    label: 'theGTMOS.ai',
    url: 'https://thegtmos.ai',
    accent: 'var(--gtmos-teal)',
    desc: 'The GTM operating system. Frameworks, playbooks, and live builds for go-to-market engineering.',
  },
  {
    label: 'theContentOS.ai',
    url: 'https://thecontentos.ai',
    accent: 'var(--contentos-purple)',
    desc: 'The content operating system. Voice-first publishing, repurpose pipelines, and content-as-code.',
  },
]

const socials: { label: string; url: string }[] = [
  { label: 'LinkedIn', url: 'https://linkedin.com/in/shawntenam' },
  { label: 'X / Twitter', url: 'https://x.com/shawntenam' },
  { label: 'Substack', url: 'https://shawntenam.substack.com' },
  { label: 'GitHub', url: 'https://github.com/shawnla90' },
]

/* ── styles ───────────────────────────────────────── */

const section: React.CSSProperties = {
  marginBottom: '48px',
}

const sectionTitle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--accent)',
  marginBottom: '16px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
}

const paragraph: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.75,
  color: 'var(--text-primary)',
  marginBottom: '12px',
}

const mutedText: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
}

/* ── page ─────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <div
      style={{
        maxWidth: '680px',
        margin: '0 auto',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* ── Terminal header ── */}
      <h1
        style={{
          fontSize: '16px',
          fontWeight: 400,
          color: 'var(--text-muted)',
          marginBottom: '32px',
        }}
      >
        <span style={{ color: 'var(--accent)' }}>$</span> cat ~/about.md
      </h1>

      {/* ── Identity ── */}
      <div style={section}>
        <h2 style={sectionTitle}>identity</h2>

        <p style={paragraph}>
          GTM engineer. builder. shipped from a monorepo.
        </p>

        <p style={paragraph}>
          I build AI-native pipelines, agent-driven workflows, and content
          systems that compound. every skill, every post, every campaign runs
          through a single codebase. the site you&apos;re on right now is the
          proof of work.
        </p>
      </div>

      {/* ── Tool Stack ── */}
      <div style={section}>
        <h2 style={sectionTitle}>tool stack</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          {tools.map((t) => (
            <div
              key={t.name}
              style={{
                padding: '14px 16px',
                background: 'var(--canvas-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '4px',
                }}
              >
                {t.name}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {t.note}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── The Network ── */}
      <div style={section}>
        <h2 style={sectionTitle}>the network</h2>

        <p style={{ ...mutedText, marginBottom: '16px' }}>
          shawnos.ai is one node in a three-site system. each site owns a
          domain of the stack.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {network.map((site) => (
            <a
              key={site.label}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '16px',
                background: 'var(--canvas-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'border-color 0.15s ease',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: site.accent,
                  marginBottom: '6px',
                }}
              >
                {site.label} &rarr;
              </span>
              <span style={mutedText}>{site.desc}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ── Connect ── */}
      <div style={{ ...section, marginBottom: '24px' }}>
        <h2 style={sectionTitle}>connect</h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--accent)',
                background: 'transparent',
                border: '1px solid var(--accent)',
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'background 0.15s ease, color 0.15s ease',
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Arc CTA ── */}
      <div
        style={{
          background: 'var(--canvas-subtle)',
          border: '1px solid var(--accent)',
          borderRadius: '8px',
          padding: '24px',
          textAlign: 'center',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--accent)',
            marginBottom: '8px',
          }}
        >
          want the full story?
        </div>
        <p
          style={{
            fontSize: '13px',
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
            marginBottom: '16px',
          }}
        >
          plumber. SDR. GTM engineer. the layers, the thesis, and why three
          domains exist.
        </p>
        <Link
          href="/arc"
          style={{
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
          }}
        >
          read the arc &rarr;
        </Link>
      </div>
    </div>
  )
}
