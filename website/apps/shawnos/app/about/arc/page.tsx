import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema } from '@shawnos/shared/components'

export const metadata: Metadata = {
  title: 'The Arc',
  description:
    'Plumber. SDR. GTM Engineer. The full arc behind shawnos.ai and the operating system.',
  keywords: [
    'plumber to tech',
    'SDR career path',
    'self-taught developer',
    'career transition into tech',
    'non-traditional tech background',
    'GTM engineer origin story',
    'sales development representative',
    'blue collar to software engineer',
    'build in public journey',
    'unconventional career path',
  ],
  alternates: { canonical: 'https://shawnos.ai/about/arc' },
  openGraph: {
    title: 'The Arc | shawnos.ai',
    description:
      'Plumber. SDR. GTM Engineer. The full arc.',
    url: 'https://shawnos.ai/about/arc',
    images: [{ url: '/og?title=The+Arc&subtitle=Plumber.+SDR.+GTM+Engineer.', width: 1200, height: 630 }],
  },
  twitter: {
    title: 'The Arc | shawnos.ai',
    description:
      'Plumber. SDR. GTM Engineer. The full arc.',
    images: ['/og?title=The+Arc&subtitle=Plumber.+SDR.+GTM+Engineer.'],
  },
}

/* ── data ─────────────────────────────────────────── */

const layers: {
  title: string
  subtitle: string
  body: string
  lesson: string
}[] = [
  {
    title: 'plumber',
    subtitle: 'layer 1',
    body: 'before tech, I was a plumber. not a metaphor. actual plumbing. diagnosing problems by listening to walls, tracing pipes nobody else wanted to touch, fixing systems under pressure with no documentation.',
    lesson: 'every system has a logic. follow the flow. if something breaks upstream, everything downstream fails. and nobody respects the fix until the water stops leaking.',
  },
  {
    title: 'SDR',
    subtitle: 'layer 2',
    body: '200+ cold emails a day. primary domains, no warmup, SalesLoft sequences, Salesforce activity logging by hand. building buying committees from scratch in accounts nobody wanted.',
    lesson: 'volume is a teacher. rejection is data. and the people who manually grind through outreach are the ones who actually understand what should be automated later.',
  },
  {
    title: 'GTM engineer',
    subtitle: 'layer 3',
    body: 'I stopped working inside the systems and started building them. Clay tables, HubSpot automation, Instantly sequences, web reveal workflows, enrichment pipelines. the same work I used to do by hand, now running on infrastructure I designed.',
    lesson: 'the best builders are the ones who did the job before they automated it. you can\'t engineer what you don\'t understand.',
  },
]

const sites: { name: string; desc: string; accent: string }[] = [
  {
    name: 'shawnos.ai',
    desc: 'the builder. the personal operating system. daily tracker, RPG progression, avatar system, API layer. this is where the infrastructure lives.',
    accent: 'var(--accent)',
  },
  {
    name: 'thegtmos.ai',
    desc: 'the playbook. GTM engineering frameworks, workflow breakdowns, campaign architectures. the systems behind pipeline generation.',
    accent: 'var(--gtmos-teal, #4ec3a0)',
  },
  {
    name: 'thecontentos.ai',
    desc: 'the voice engine. content-as-code publishing, voice DNA, repurpose pipelines. how the words get made and where they go.',
    accent: 'var(--contentos-purple, #a78bfa)',
  },
]

const buildLinks: { href: string; label: string; desc: string }[] = [
  { href: '/api', label: 'the API', desc: 'endpoints, schemas, live data' },
  { href: '/log/quests', label: 'quest board', desc: 'challenges for builders' },
  { href: '/log/build-your-own', label: 'build your own', desc: 'the starter prompt' },
  { href: '/log/skill-guide', label: 'skill guide', desc: 'how the RPG system works' },
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

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '48px 0',
}

const card: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '12px',
  transition: 'border-color 0.15s ease',
}

/* ── page ─────────────────────────────────────────── */

export default function ArcPage() {
  return (
    <>
    <BreadcrumbSchema items={[{ name: 'About', url: 'https://shawnos.ai/about' }, { name: 'The Arc', url: 'https://shawnos.ai/about/arc' }]} />
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
        <span style={{ color: 'var(--accent)' }}>$</span> cat ~/arc.md
      </h1>

      {/* ── Skip this ── */}
      <div style={section}>
        <p style={paragraph}>
          every GTM creator has the same about page.
        </p>
        <p
          style={{
            fontSize: '14px',
            lineHeight: 1.75,
            color: 'var(--text-muted)',
            marginBottom: '12px',
            fontStyle: 'italic',
          }}
        >
          &ldquo;I was an SDR. then I found Clay. now I teach people how to use it.&rdquo;
        </p>
        <p style={paragraph}>cool. here&apos;s mine.</p>
        <p style={paragraph}>
          except mine starts with copper pipe and a blowtorch.
        </p>
      </div>

      <hr style={divider} />

      {/* ── The Layers ── */}
      <div style={section}>
        <h2 style={sectionTitle}>the layers</h2>

        <p style={{ ...mutedText, marginBottom: '20px' }}>
          I didn&apos;t go from SDR to GTM engineer in a straight line. I went
          through three layers, and each one rewired how I think about building.
        </p>

        {layers.map((layer) => (
          <div key={layer.title} style={card}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '10px',
                marginBottom: '10px',
              }}
            >
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--accent)',
                }}
              >
                {layer.title}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.06em',
                  padding: '1px 8px',
                  border: '1px solid var(--border)',
                  borderRadius: '3px',
                }}
              >
                {layer.subtitle}
              </span>
            </div>
            <p style={{ ...mutedText, marginBottom: '12px' }}>{layer.body}</p>
            <div
              style={{
                borderTop: '1px solid var(--border)',
                paddingTop: '10px',
                marginTop: '4px',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.06em',
                  marginRight: '8px',
                }}
              >
                what it taught me:
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                {layer.lesson}
              </span>
            </div>
          </div>
        ))}

        <p style={{ ...paragraph, marginTop: '16px', marginBottom: 0 }}>
          none of these define me. all of them sharpen what I ship.
        </p>
      </div>

      <hr style={divider} />

      {/* ── The Thesis ── */}
      <div style={section}>
        <h2 style={sectionTitle}>the thesis</h2>

        <p style={{ ...paragraph, fontWeight: 600, color: 'var(--accent)' }}>
          this is not vibe coding.
        </p>

        <p style={paragraph}>
          I don&apos;t prompt once and ship whatever comes back. I use plan mode
          before I write a single line. I use ask mode when something breaks. I
          run sub-agents for parallel work. I test, I break things, I read the
          error, I fix it, I ship it.
        </p>

        <p style={paragraph}>
          AI doesn&apos;t do the work for you. it accelerates the work you
          already understand.
        </p>

        <p style={paragraph}>
          every page on this site was iterated, not generated. every skill was
          debugged before it was documented. every campaign template was tested
          on real pipeline before it became a playbook.
        </p>

        <p style={{ ...paragraph, marginBottom: 0, color: 'var(--text-muted)' }}>
          the repo has over 400 files. zero of them were one-shot prompts.
        </p>
      </div>

      <hr style={divider} />

      {/* ── Three Sites ── */}
      <div style={section}>
        <h2 style={sectionTitle}>three sites, one system</h2>

        <p style={{ ...mutedText, marginBottom: '20px' }}>
          this isn&apos;t vanity. it&apos;s architecture.
        </p>

        {sites.map((site) => (
          <div key={site.name} style={card}>
            <span
              style={{
                display: 'block',
                fontSize: '15px',
                fontWeight: 700,
                color: site.accent,
                marginBottom: '6px',
              }}
            >
              {site.name}
            </span>
            <span style={mutedText}>{site.desc}</span>
          </div>
        ))}

        <p style={{ ...mutedText, marginTop: '16px' }}>
          three domains. one monorepo. every page, every API route, every
          generated image comes from the same codebase. nothing here is an
          accident.
        </p>
      </div>

      <hr style={divider} />

      {/* ── Build With Me ── */}
      <div style={section}>
        <h2 style={sectionTitle}>build with me</h2>

        <p style={{ ...paragraph, marginBottom: '20px' }}>
          this isn&apos;t a portfolio you look at. it&apos;s a system you can fork.
        </p>

        <p style={{ ...mutedText, marginBottom: '20px' }}>
          the API is open. the progression engine is documented. the quest board
          has challenges for builders who want to learn by doing, not by watching.
        </p>

        <p style={{ ...paragraph, marginBottom: '20px' }}>
          take the approach. break it. rebuild it better. come at me with a better pixel.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {buildLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '12px',
                padding: '12px 16px',
                background: 'var(--canvas-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'border-color 0.15s ease',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  whiteSpace: 'nowrap',
                }}
              >
                {link.label} &rarr;
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {link.desc}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <hr style={divider} />

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

      {/* ── Back to About ── */}
      <div style={{ marginTop: '48px' }}>
        <Link
          href="/about"
          style={{
            display: 'inline-block',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--accent)',
            textDecoration: 'none',
          }}
        >
          &larr; back to about
        </Link>
      </div>
    </div>
    </>
  )
}
