import Link from 'next/link'
import { LogCard, ScrambleCycler } from '@shawnos/shared/components'
import type { DailyLogSummary } from '@shawnos/shared/lib/logs'
import { VideoShowcase } from './VideoShowcase'
import { StatsStrip } from './StatsStrip'
import { BuiltWithStrip } from './BuiltWithStrip'
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
  MagneticHover,
  ScrollRevealSection,
} from './components/motion'
import { SectionHeadline } from './components/SectionHeadline'
import { FAQAccordion } from './components/FAQAccordion'
import { ProcessSteps } from './components/ProcessSteps'

/* ── data ────────────────────────────────────────── */

const bootLines = [
  { status: 'OK', label: 'clay enrichment ... online' },
  { status: 'OK', label: 'instantly outbound ... routing' },
  { status: 'OK', label: 'heyreach linkedin ... synced' },
  { status: 'OK', label: 'qualification engine ... scoring' },
  { status: 'OK', label: 'partner engine ... active' },
  { status: 'OK', label: 'network link ... theContentOS.ai' },
]

const gtmStack = [
  {
    command: 'clay',
    title: 'Clay',
    description: 'Enrichment and qualification. Pull 50+ data points per lead, score ICP fit, route to the right sequence - all from one table.',
    tags: ['Enrichment', 'Qualification', 'Waterfall'],
    href: '/clay-wiki',
  },
  {
    command: 'instantly',
    title: 'Instantly',
    description: 'Email outbound at scale. Domain rotation, warmup, smart sending windows. The backbone of cold email that actually lands.',
    tags: ['Email', 'Outbound', 'Deliverability'],
    href: '/knowledge/email',
  },
  {
    command: 'heyreach',
    title: 'HeyReach',
    description: 'LinkedIn outbound automation. Connection requests, follow-ups, and engagement sequences across multiple sender accounts.',
    tags: ['LinkedIn', 'Automation', 'Multi-sender'],
    href: '/how-to',
  },
]

const processSteps = [
  {
    command: 'enrich',
    title: 'Enrich',
    description: 'Pull firmographic, technographic, and intent data. Clay waterfalls across 50+ providers to fill every field.',
  },
  {
    command: 'qualify',
    title: 'Qualify',
    description: 'Score against your ICP. Web reveal, job title matching, tech stack detection. Only qualified leads move forward.',
  },
  {
    command: 'route',
    title: 'Route',
    description: 'Domain-based routing decides the channel. Email via Instantly, LinkedIn via HeyReach, high-value via manual outreach.',
  },
  {
    command: 'engage',
    title: 'Engage',
    description: 'Multi-channel sequences fire automatically. Personalized copy, smart timing, follow-up cadences that adapt to engagement.',
  },
  {
    command: 'compound',
    title: 'Compound',
    description: 'Every campaign teaches the next one. Reply rates feed back into qualification. The system gets smarter every week.',
  },
]

const faqLinkStyle: React.CSSProperties = {
  color: 'var(--accent)',
  textDecoration: 'none',
  fontWeight: 600,
}

const faqItems: { question: string; answer: React.ReactNode }[] = [
  {
    question: 'What is GTM engineering?',
    answer: (
      <>
        GTM engineering is the practice of building go-to-market systems with code instead of clicking through CRMs. You write enrichment pipelines, automate outbound sequences, build qualification workflows, and ship campaign infrastructure - all version-controlled and composable.{' '}
        <Link href="/knowledge/gtm" style={faqLinkStyle}>explore the GTM playbook &rarr;</Link>
      </>
    ),
  },
  {
    question: 'What is Clay and why use it?',
    answer: (
      <>
        Clay is a data enrichment platform that waterfalls across 50+ providers to build complete lead profiles. It replaces manual research with automated workflows that score, qualify, and route leads in seconds.{' '}
        <Link href="/clay-wiki" style={faqLinkStyle}>browse the Clay Wiki &rarr;</Link>
      </>
    ),
  },
  {
    question: 'How does the outbound stack work?',
    answer: (
      <>
        Leads enter through Clay enrichment, get qualified against your ICP, then route to the right channel. Instantly handles cold email with domain rotation and warmup. HeyReach handles LinkedIn with multi-sender automation. Both run sequences that adapt to engagement signals.{' '}
        <Link href="/how-to" style={faqLinkStyle}>see the playbooks &rarr;</Link>
      </>
    ),
  },
  {
    question: 'What does "built in public" mean for GTM?',
    answer: (
      <>
        Every workflow, campaign template, and pipeline design ships to this site. The Clay Wiki, outbound playbooks, and knowledge base are all public artifacts. Building in public turns GTM experiments into compounding content.{' '}
        <Link href="/log" style={faqLinkStyle}>see the build log &rarr;</Link>
      </>
    ),
  },
  {
    question: 'Can I use these playbooks?',
    answer: (
      <>
        Absolutely. The Clay Wiki, outbound guides, and pipeline blueprints are all free and public. They document real workflows running in production - not theory. Start with the Clay Wiki for enrichment or the How-To guides for outbound sequences.{' '}
        <Link href="/clay-wiki" style={faqLinkStyle}>start with Clay &rarr;</Link>
      </>
    ),
  },
]

const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, sans-serif"

/* ── types ───────────────────────────────────────── */

interface HomeContentProps {
  latestLog: DailyLogSummary | null
}

/* ── component ──────────────────────────────────── */

export function HomeContent({ latestLog }: HomeContentProps) {
  return (
    <>
      {/* ── 1. Hero - 100dvh, centered, orange glow ── */}
      <section
        className="full-bleed"
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'radial-gradient(ellipse 800px 600px at 50% 30%, rgba(249, 115, 22, 0.15), transparent 60%), radial-gradient(ellipse 1200px 800px at 50% 60%, rgba(249, 115, 22, 0.06), transparent 70%), var(--canvas)',
          position: 'relative',
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        <MotionReveal variant="fadeUp" delay={0.05}>
          <div
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: SANS,
              color: 'var(--accent)',
              background: 'rgba(249, 115, 22, 0.08)',
              border: '1px solid rgba(249, 115, 22, 0.2)',
              borderRadius: 999,
              marginBottom: 20,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            GTM Operating System
          </div>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.1}>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              marginBottom: 16,
            }}
          >
            <span style={{ color: 'var(--accent)' }}>$</span> ./boot theGTMOS.ai
          </p>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.2}>
          <h1
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.15,
              margin: '0 0 24px',
              maxWidth: 900,
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>the </span>
            <span style={{ color: 'var(--accent)' }}>GTM OS</span>
          </h1>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.3}>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'var(--text-secondary)',
              fontFamily: SANS,
              lineHeight: 1.6,
              maxWidth: 640,
              margin: '0 auto 16px',
            }}
          >
            Pipeline orchestration, outbound automation, and partner workflows. One repo. One operating system.
          </p>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.4}>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--accent)',
              letterSpacing: '0.08em',
              fontFamily: 'var(--font-mono)',
              marginBottom: 32,
            }}
          >
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
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.5}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <MagneticHover>
              <Link
                href="/clay-wiki"
                className="cta-primary"
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: SANS,
                  color: 'var(--canvas)',
                  background: 'var(--accent)',
                  border: '1px solid var(--accent)',
                  borderRadius: 6,
                  textDecoration: 'none',
                }}
              >
                explore the clay wiki &rarr;
              </Link>
            </MagneticHover>
            <MagneticHover>
              <Link
                href="/knowledge/gtm"
                className="cta-secondary"
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: SANS,
                  color: 'var(--accent)',
                  background: 'transparent',
                  border: '1px solid var(--accent)',
                  borderRadius: 6,
                  textDecoration: 'none',
                }}
              >
                GTM knowledge base
              </Link>
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

      {/* ── 2. Stats Strip ── */}
      <ScrollRevealSection
        background="var(--canvas-subtle)"
        style={{
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          paddingTop: 48,
          paddingBottom: 48,
        }}
      >
        <StatsStrip />
      </ScrollRevealSection>

      {/* ── 3. Highlight Reel ── */}
      <ScrollRevealSection background="var(--canvas)">
        <SectionHeadline label="SHOWCASE" subtitle="Recent builds, shipped live">Highlight Reel</SectionHeadline>
        <VideoShowcase />
      </ScrollRevealSection>

      {/* ── 4. The GTM Stack (partner showcase) ── */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <SectionHeadline label="THE GTM STACK" subtitle="The tools powering the pipeline">The GTM Stack</SectionHeadline>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {gtmStack.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="gtm-card"
              style={{
                display: 'block',
                padding: 24,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0)), var(--canvas)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: 8,
                }}
              >
                <span style={{ color: 'var(--accent)' }}>$</span> run {tool.command}
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: 8,
                }}
              >
                {tool.title}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  fontFamily: SANS,
                  lineHeight: 1.6,
                  marginBottom: 12,
                }}
              >
                {tool.description}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      padding: '4px 10px',
                      borderRadius: 4,
                      background: 'rgba(249, 115, 22, 0.1)',
                      color: 'var(--accent)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </ScrollRevealSection>

      {/* ── 5. How It Works (ProcessSteps) ── */}
      <ScrollRevealSection background="var(--canvas)">
        <SectionHeadline label="HOW IT WORKS" subtitle="Five-step pipeline from lead to close">How It Works</SectionHeadline>
        <ProcessSteps steps={processSteps} />
      </ScrollRevealSection>

      {/* ── 6. FAQ ── */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <SectionHeadline label="FAQ" subtitle="Common questions answered">FAQ</SectionHeadline>
        <FAQAccordion items={faqItems} />
      </ScrollRevealSection>

      {/* ── 7. Latest Log ── */}
      {latestLog && (
        <ScrollRevealSection background="var(--canvas)">
          <SectionHeadline label="BUILD LOG" subtitle="Today's build log">Latest Log</SectionHeadline>

          <LogCard {...latestLog} basePath="/log" />

          <div style={{ marginTop: 24 }}>
            <Link
              href="/log"
              style={{
                fontSize: '15px',
                color: 'var(--accent)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              view all logs &rarr;
            </Link>
          </div>
        </ScrollRevealSection>
      )}

      {/* ── 8. Boot Log ── */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <h2
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--accent)',
            marginBottom: 16,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          system status
        </h2>

        <div
          style={{
            padding: '20px 24px',
            background: 'var(--canvas)',
            border: '1px solid var(--border)',
            borderRadius: 6,
          }}
        >
          <StaggerContainer stagger={0.05}>
            {bootLines.map((line) => (
              <StaggerItem key={line.label}>
                <div
                  style={{
                    fontSize: '13px',
                    lineHeight: 2,
                    color: 'var(--text-secondary)',
                  }}
                >
                  [<span style={{ color: 'var(--accent)', fontWeight: 600 }}>{line.status}</span>] {line.label}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
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
      </ScrollRevealSection>

      {/* ── 9. Built With / Partners ── */}
      <ScrollRevealSection
        background="var(--canvas)"
        style={{ paddingTop: 48, paddingBottom: 48 }}
      >
        <BuiltWithStrip />
      </ScrollRevealSection>

      {/* ── 10. Choose Your Path CTA ── */}
      <ScrollRevealSection background="var(--canvas-subtle)" variant="scale">
        <div
          style={{
            padding: '40px 32px',
            background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.04), transparent), var(--canvas)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(249, 115, 22, 0.08)',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(24px, 3.5vw, 36px)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
              margin: '0 0 32px',
            }}
          >
            Choose Your Path
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
              maxWidth: 800,
              margin: '0 auto',
            }}
          >
            {[
              { label: 'Building content systems?', href: 'https://thecontentos.ai', text: 'theContentOS.ai' },
              { label: 'Exploring the full OS?', href: 'https://shawnos.ai', text: 'ShawnOS.ai' },
              { label: 'Learning Clay workflows?', href: '/clay-wiki', text: 'Clay Wiki', internal: true },
              { label: 'Want GTM playbooks?', href: '/knowledge/gtm', text: 'Knowledge Base', internal: true },
            ].map((item) => {
              const LinkEl = item.internal ? Link : 'a'
              return (
                <LinkEl
                  key={item.text}
                  href={item.href}
                  {...(!item.internal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  style={{
                    display: 'block',
                    padding: '20px 16px',
                    background: 'var(--canvas-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    textDecoration: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      fontFamily: SANS,
                      marginBottom: 6,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: 'var(--accent)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {item.text} &rarr;
                  </div>
                </LinkEl>
              )
            })}
          </div>
        </div>
      </ScrollRevealSection>
    </>
  )
}
