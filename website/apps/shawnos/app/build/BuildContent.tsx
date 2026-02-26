import Link from 'next/link'
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
  MagneticHover,
  ScrollRevealSection,
} from '../components/motion'
import { ProcessSteps } from '../components/ProcessSteps'

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
      "companies that know AI matters but don't know where to start. executives who need a plan before a build.",
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

const howItWorksSteps = [
  {
    title: 'you book a call',
    description:
      'we talk about what you need. 30 minutes. no pitch deck. just your problems and what I can build.',
  },
  {
    title: 'I scope the build',
    description:
      'within 24 hours you get a build plan — what ships, when, and what it costs. no surprises.',
  },
  {
    title: 'I build it',
    description:
      'AI-accelerated development. you get daily progress updates. most website builds ship in under a week.',
  },
  {
    title: 'you own it',
    description:
      'full source code, full documentation, deployed and running. no vendor lock-in. no monthly platform fees.',
  },
]

const systemLinks = [
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
]

/* ── section headline helper ────────────────────── */

function SectionHeadline({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2
        style={{
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          lineHeight: 1.2,
          margin: 0,
        }}
      >
        {children}
      </h2>
      {subtitle && (
        <p
          style={{
            fontSize: 'clamp(14px, 1.5vw, 16px)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            marginTop: 8,
            margin: '8px 0 0',
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

/* ── component ──────────────────────────────────── */

export function BuildContent() {
  return (
    <>
      {/* ── Hero — 100dvh, centered, bold ── */}
      <section
        className="full-bleed"
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'var(--canvas)',
          position: 'relative',
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        <MotionReveal variant="fadeUp" delay={0.1}>
          <p
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              marginBottom: 16,
            }}
          >
            <span style={{ color: 'var(--accent)' }}>$</span> cat ~/build.md
          </p>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.2}>
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 52px)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.2,
              margin: '0 0 24px',
              maxWidth: 800,
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>I build websites in a day.</span>{' '}
            <span style={{ color: 'var(--accent)' }}>I build AI operating systems in a month.</span>
          </h1>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.35}>
          <p
            style={{
              fontSize: 'clamp(14px, 1.8vw, 18px)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.6,
              maxWidth: 580,
              margin: '0 auto 16px',
              fontStyle: 'italic',
            }}
          >
            the site you&apos;re on right now is the proof of work.
          </p>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.45}>
          <p
            style={{
              fontSize: 'clamp(14px, 1.5vw, 16px)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.7,
              maxWidth: 580,
              margin: '0 auto 40px',
            }}
          >
            not an agency. not a chatbot wrapper. not prompt engineering.
            I build the machine that does the work.
          </p>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.55}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <MagneticHover>
              <a
                href="https://calendly.com/shawntenam/30min"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  fontSize: '15px',
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
            </MagneticHover>
            <MagneticHover>
              <a
                href="#packages"
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent)',
                  background: 'transparent',
                  border: '1px solid var(--accent)',
                  borderRadius: 6,
                  textDecoration: 'none',
                  transition: 'background 0.15s ease, color 0.15s ease',
                }}
              >
                see packages
              </a>
            </MagneticHover>
          </div>
        </MotionReveal>

        {/* Scroll indicator */}
        <div
          className="scroll-indicator"
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'var(--text-muted)',
            fontSize: '24px',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          &#8964;
        </div>
      </section>

      {/* ── Packages ── */}
      <ScrollRevealSection background="var(--canvas-subtle)" style={{ scrollMarginTop: 80 }}>
        <div id="packages" />
        <SectionHeadline subtitle="four ways to work together. start wherever makes sense.">
          Packages
        </SectionHeadline>

        <StaggerContainer stagger={0.12}>
          {packages.map((pkg) => (
            <StaggerItem key={pkg.name}>
              <div
                className="package-card"
                style={{
                  background: 'var(--canvas)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: 24,
                  marginBottom: 16,
                  transition: 'border-color 0.15s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 10,
                    marginBottom: 6,
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: 'var(--accent)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {pkg.name}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      padding: '2px 10px',
                      border: '1px solid var(--border)',
                      borderRadius: 3,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {pkg.tag}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: 16,
                    marginBottom: 14,
                    flexWrap: 'wrap',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {pkg.price}
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {pkg.duration}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 16,
                  }}
                >
                  {pkg.description}
                </p>

                <div
                  style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: 14,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      display: 'block',
                      marginBottom: 10,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    deliverables:
                  </span>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 0,
                      listStyleType: 'none',
                    }}
                  >
                    {pkg.deliverables.map((d) => (
                      <li
                        key={d}
                        style={{
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          lineHeight: 2,
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        <span style={{ color: 'var(--accent)', marginRight: 8 }}>+</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginRight: 8,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    ideal for:
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                      lineHeight: 1.6,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {pkg.ideal}
                  </span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </ScrollRevealSection>

      {/* ── Proof of Work ── */}
      <ScrollRevealSection background="var(--canvas)">
        <SectionHeadline subtitle="this isn't a portfolio. this is the live system. everything below is running right now.">
          Proof of Work
        </SectionHeadline>

        <StaggerContainer
          stagger={0.08}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 14,
          }}
        >
          {proofPoints.map((p) => (
            <StaggerItem key={p.metric}>
              <div
                style={{
                  padding: '18px 20px',
                  background: 'var(--canvas-subtle)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    marginBottom: 6,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {p.metric}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    lineHeight: 1.5,
                  }}
                >
                  {p.detail}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </ScrollRevealSection>

      {/* ── The Stack ── */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <SectionHeadline subtitle="the tools behind the machine">
          The Stack
        </SectionHeadline>

        <StaggerContainer
          stagger={0.05}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 10,
          }}
        >
          {stack.map((s) => (
            <StaggerItem key={s.name}>
              <div
                style={{
                  padding: '14px 18px',
                  background: 'var(--canvas)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 2,
                  }}
                >
                  {s.name}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {s.role}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </ScrollRevealSection>

      {/* ── How It Works ── */}
      <ScrollRevealSection background="var(--canvas)">
        <SectionHeadline subtitle="from call to shipped — here's the process">
          How It Works
        </SectionHeadline>
        <ProcessSteps steps={howItWorksSteps} />
      </ScrollRevealSection>

      {/* ── CTA ── */}
      <ScrollRevealSection background="var(--canvas-subtle)" variant="scale">
        <div
          style={{
            padding: '48px 32px',
            background: 'var(--canvas)',
            border: '1px solid var(--accent)',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(24px, 3.5vw, 36px)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent)',
              margin: '0 0 12px',
            }}
          >
            ready to build?
          </h2>
          <p
            style={{
              fontSize: 'clamp(14px, 1.5vw, 16px)',
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              marginBottom: 28,
              maxWidth: 500,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            book a 30-minute call. we&apos;ll talk about what you need and
            whether I&apos;m the right builder for it. no pitch. no commitment.
          </p>
          <MagneticHover>
            <a
              href="https://calendly.com/shawntenam/30min"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '14px 36px',
                fontSize: '16px',
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
          </MagneticHover>
        </div>
      </ScrollRevealSection>

      {/* ── See the System ── */}
      <ScrollRevealSection background="var(--canvas)">
        <SectionHeadline subtitle="explore the infrastructure behind the pitch">
          See the System
        </SectionHeadline>

        <StaggerContainer stagger={0.08} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {systemLinks.map((link) => (
            <StaggerItem key={link.href}>
              <Link
                href={link.href}
                className="system-link-card"
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 14,
                  padding: '14px 18px',
                  background: 'var(--canvas-subtle)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  textDecoration: 'none',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {link.label} &rarr;
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {link.desc}
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </ScrollRevealSection>

      {/* ── Back to home ── */}
      <ScrollRevealSection
        background="var(--canvas-subtle)"
        variant="fadeIn"
        style={{ paddingTop: 24, paddingBottom: 48 }}
      >
        <Link
          href="/"
          style={{
            display: 'inline-block',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--accent)',
            textDecoration: 'none',
            fontFamily: 'var(--font-mono)',
          }}
        >
          &larr; back to home
        </Link>
      </ScrollRevealSection>
    </>
  )
}
