import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema } from '@shawnos/shared/components'

export const metadata: Metadata = {
  title: 'Build With Me',
  description:
    'I build websites in a day. I build AI operating systems in a month. Full-stack web development and AI infrastructure — shipped fast, built to last.',
  keywords: [
    'AI developer for hire',
    'full stack web developer',
    'Next.js developer',
    'AI operating system',
    'website builder',
    'AI automation engineer',
    'GTM engineer',
    'Vercel developer',
    'AI agent development',
    'website deployment',
  ],
  alternates: { canonical: 'https://shawnos.ai/build' },
  openGraph: {
    title: 'Build With Me | shawnos.ai',
    description:
      'I build websites in a day. I build AI operating systems in a month.',
    url: 'https://shawnos.ai/build',
    images: [
      {
        url: '/og?title=Build+With+Me&subtitle=Websites+in+a+day.+AI+systems+in+a+month.',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Build With Me | shawnos.ai',
    description:
      'I build websites in a day. I build AI operating systems in a month.',
    images: [
      '/og?title=Build+With+Me&subtitle=Websites+in+a+day.+AI+systems+in+a+month.',
    ],
  },
}

/* ── data ─────────────────────────────────────────── */

const packages: {
  name: string
  tag: string
  price: string
  duration: string
  description: string
  deliverables: string[]
  ideal: string
}[] = [
  {
    name: 'full-stack website',
    tag: 'ship fast',
    price: '$3,500 - $7,500',
    duration: '1-2 weeks',
    description:
      'a production-ready, deployed website built with AI-accelerated development. from concept to live URL while you get coffee.',
    deliverables: [
      'Next.js 15 / React 19 / TailwindCSS 4 site',
      'responsive design, mobile-first',
      'Vercel deployment with CI/CD (push to live)',
      'SEO fundamentals (meta, OG images, sitemap)',
      '1 integration (CRM, analytics, email capture)',
      'DNS + domain configuration',
      'content population assistance',
      '30 days post-launch support',
    ],
    ideal:
      'founders and small businesses who need a real site fast. not a template. not a 3-month agency timeline.',
  },
  {
    name: 'AI ops audit',
    tag: 'map the gaps',
    price: '$2,500',
    duration: '1 week',
    description:
      'a full audit of your tool stack, workflows, and automation gaps. you get a custom architecture doc and a build roadmap.',
    deliverables: [
      'map current tools and manual processes',
      'identify 5-10 automation opportunities (ranked by ROI)',
      'custom ARCHITECTURE.md + gap analysis',
      'phased build roadmap with estimates',
      '1-hour walkthrough call',
    ],
    ideal:
      'companies that know AI matters but don\'t know where to start. executives who need a plan before a build.',
  },
  {
    name: 'AI operating system',
    tag: 'the full build',
    price: '$10,000 - $25,000',
    duration: '4-8 weeks',
    description:
      'a custom AI OS — autonomous agents, nightly pipelines, multi-site dashboards, content machines, lead enrichment. the same architecture that runs this site, built for your company.',
    deliverables: [
      'custom skill tree architecture',
      'nightly cron pipeline (scan, score, commit, deploy)',
      'multi-site Turborepo architecture',
      'multi-agent system with custom soul files',
      'key integrations (CRM, email, Slack, enrichment)',
      'content pipeline with voice system',
      'signal detection + lead scoring',
      'IP protection strategy',
      'full documentation suite',
      'weekly check-ins + 30 days post-launch support',
    ],
    ideal:
      'companies that want the full AI infrastructure. not an agency, not a contractor. a builder who moves in and builds the machine.',
  },
  {
    name: 'AI ops retainer',
    tag: 'ongoing',
    price: '$5,000/month',
    duration: 'continuous',
    description:
      'continuous improvement, new skill development, pipeline monitoring, and strategic guidance. your AI infrastructure keeps compounding.',
    deliverables: [
      '20 hours/month of build time',
      'priority async support',
      'monthly system health audit',
      'new skill and workflow development',
      'model allocation optimization',
      'quarterly IP and architecture review',
    ],
    ideal:
      'companies that already have an AI OS (or just had one built) and want it to keep growing.',
  },
]

const proofPoints: { metric: string; detail: string }[] = [
  { metric: '4 live websites', detail: 'all deployed from one monorepo' },
  { metric: '50 skills', detail: 'invokable AI workflows in production' },
  { metric: '17 integrations', detail: 'MCP servers connected and operational' },
  { metric: 'nightly automation', detail: 'scan, score, commit, deploy — every night at midnight' },
  { metric: '3 production partners', detail: 'real companies with real pipeline, not demos' },
  { metric: '280+ contacts enriched', detail: 'signal detection, icebreakers, scoring — automated' },
]

const stack: { name: string; role: string }[] = [
  { name: 'Next.js 15', role: 'framework' },
  { name: 'React 19', role: 'UI' },
  { name: 'TailwindCSS 4', role: 'styling' },
  { name: 'TypeScript', role: 'language' },
  { name: 'Python', role: 'automation + data' },
  { name: 'Claude', role: 'reasoning engine' },
  { name: 'Vercel', role: 'deployment' },
  { name: 'Turborepo', role: 'monorepo' },
  { name: 'SQLite', role: 'local persistence' },
  { name: 'Cursor IDE', role: 'AI-native dev' },
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

export default function BuildPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'Build With Me', url: 'https://shawnos.ai/build' }]}
      />
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
          <span style={{ color: 'var(--accent)' }}>$</span> cat ~/build.md
        </h1>

        {/* ── Hero ── */}
        <div style={section}>
          <p
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--accent)',
              marginBottom: '8px',
              lineHeight: 1.3,
            }}
          >
            I build websites in a day. I build AI operating systems in a month.
          </p>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              marginBottom: '24px',
              fontStyle: 'italic',
            }}
          >
            the site you&apos;re on right now is the proof of work.
          </p>

          <p style={paragraph}>
            I&apos;m a GTM engineer who builds AI-native infrastructure for companies.
            full-stack websites deployed in days. autonomous AI operating systems
            that scan, score, enrich, and deploy — all running while you sleep.
          </p>
          <p style={paragraph}>
            not an agency. not a chatbot wrapper. not prompt engineering.
            I build the machine that does the work.
          </p>
        </div>

        <hr style={divider} />

        {/* ── Packages ── */}
        <div style={section}>
          <h2 style={sectionTitle}>packages</h2>

          <p style={{ ...mutedText, marginBottom: '20px' }}>
            four ways to work together. start wherever makes sense.
          </p>

          {packages.map((pkg) => (
            <div key={pkg.name} style={{ ...card, marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '10px',
                  marginBottom: '6px',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--accent)',
                  }}
                >
                  {pkg.name}
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
                  {pkg.tag}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  {pkg.price}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    alignSelf: 'center',
                  }}
                >
                  {pkg.duration}
                </span>
              </div>

              <p style={{ ...mutedText, marginBottom: '14px' }}>
                {pkg.description}
              </p>

              <div
                style={{
                  borderTop: '1px solid var(--border)',
                  paddingTop: '12px',
                  marginBottom: '12px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.06em',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  deliverables:
                </span>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '16px',
                    listStyleType: 'none',
                  }}
                >
                  {pkg.deliverables.map((d) => (
                    <li
                      key={d}
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.8,
                      }}
                    >
                      <span style={{ color: 'var(--accent)', marginRight: '8px' }}>
                        +
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border)',
                  paddingTop: '10px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.06em',
                    marginRight: '8px',
                  }}
                >
                  ideal for:
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    lineHeight: 1.6,
                  }}
                >
                  {pkg.ideal}
                </span>
              </div>
            </div>
          ))}
        </div>

        <hr style={divider} />

        {/* ── Proof ── */}
        <div style={section}>
          <h2 style={sectionTitle}>proof of work</h2>

          <p style={{ ...mutedText, marginBottom: '20px' }}>
            this isn&apos;t a portfolio. this is the live system. everything below
            is running right now.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '12px',
            }}
          >
            {proofPoints.map((p) => (
              <div
                key={p.metric}
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
                    fontWeight: 700,
                    color: 'var(--accent)',
                    marginBottom: '4px',
                  }}
                >
                  {p.metric}
                </span>
                <span
                  style={{ fontSize: '12px', color: 'var(--text-muted)' }}
                >
                  {p.detail}
                </span>
              </div>
            ))}
          </div>
        </div>

        <hr style={divider} />

        {/* ── Stack ── */}
        <div style={section}>
          <h2 style={sectionTitle}>the stack</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '8px',
            }}
          >
            {stack.map((s) => (
              <div
                key={s.name}
                style={{
                  padding: '10px 14px',
                  background: 'var(--canvas-subtle)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  {s.name}
                </span>
                <span
                  style={{ fontSize: '11px', color: 'var(--text-muted)' }}
                >
                  {s.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <hr style={divider} />

        {/* ── How it works ── */}
        <div style={section}>
          <h2 style={sectionTitle}>how it works</h2>

          {[
            {
              step: '01',
              title: 'you book a call',
              desc: 'we talk about what you need. 30 minutes. no pitch deck. just your problems and what I can build.',
            },
            {
              step: '02',
              title: 'I scope the build',
              desc: 'within 24 hours you get a build plan — what ships, when, and what it costs. no surprises.',
            },
            {
              step: '03',
              title: 'I build it',
              desc: 'AI-accelerated development. you get daily progress updates. most website builds ship in under a week.',
            },
            {
              step: '04',
              title: 'you own it',
              desc: 'full source code, full documentation, deployed and running. no vendor lock-in. no monthly platform fees.',
            },
          ].map((s) => (
            <div
              key={s.step}
              style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '16px',
                alignItems: 'baseline',
              }}
            >
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  opacity: 0.5,
                  minWidth: '28px',
                }}
              >
                {s.step}
              </span>
              <div>
                <span
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                  }}
                >
                  {s.title}
                </span>
                <span style={mutedText}>{s.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <hr style={divider} />

        {/* ── CTA ── */}
        <div style={section}>
          <div
            style={{
              background: 'var(--canvas-subtle)',
              border: '1px solid var(--accent)',
              borderRadius: '8px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--accent)',
                marginBottom: '8px',
              }}
            >
              ready to build?
            </p>
            <p
              style={{
                fontSize: '13px',
                lineHeight: 1.65,
                color: 'var(--text-secondary)',
                marginBottom: '16px',
              }}
            >
              book a 30-minute call. we&apos;ll talk about what you need and
              whether I&apos;m the right builder for it. no pitch. no commitment.
            </p>
            <a
              href="https://calendly.com/shawntenam/30min"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                fontSize: '14px',
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
              book a call &rarr;
            </a>
          </div>
        </div>

        {/* ── See the system ── */}
        <div style={section}>
          <h2 style={sectionTitle}>see the system</h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {[
              {
                href: '/method',
                label: 'the method',
                desc: 'recursive drift — the non-linear way I build with AI',
              },
              {
                href: '/about/arc',
                label: 'the arc',
                desc: 'plumber, SDR, GTM engineer — the full story',
              },
              {
                href: '/log',
                label: 'the log',
                desc: 'daily output — what shipped, what scored, what leveled up',
              },
              {
                href: '/vitals',
                label: 'the vitals',
                desc: 'live system metrics and progression data',
              },
              {
                href: '/api',
                label: 'the API',
                desc: 'endpoints, schemas, live data — the system is open',
              },
            ].map((link) => (
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
                <span
                  style={{ fontSize: '12px', color: 'var(--text-muted)' }}
                >
                  {link.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Back ── */}
        <div style={{ marginTop: '48px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--accent)',
              textDecoration: 'none',
            }}
          >
            &larr; back to home
          </Link>
        </div>
      </div>
    </>
  )
}
