'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
  MagneticHover,
} from '@shawnos/shared/components'

/* ── theme (GTMOS orange) ───────────────────────── */

const GTM = {
  orange: '#F97316',
  orangeLt: '#FB923C',
  orangeGlow: 'rgba(249, 115, 22, 0.12)',
  orangeBorder: 'rgba(249, 115, 22, 0.25)',
  dark: '#0D1117',
  darkSubtle: '#161B22',
  darkCard: '#1C2128',
  border: '#30363D',
  borderLt: '#484F58',
  text: '#C9D1D9',
  textSecondary: '#8B949E',
  textMuted: '#484F58',
  white: '#F0F6FC',
  font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, 'Helvetica Neue', sans-serif",
} as const

/* ── data ────────────────────────────────────────── */

const problems = [
  {
    icon: '01',
    title: 'Agency Vendor Lock-In',
    desc: 'Your agency picked the tools. They control the logins. When you leave, you start from zero - no data, no workflows, no institutional knowledge.',
    href: '/knowledge/vendor-lock-in',
  },
  {
    icon: '02',
    title: 'Credit Opacity',
    desc: 'How many Clay credits did that enrichment actually burn? How many Instantly sends went to bad domains? If you can\'t answer, someone else is deciding your ROI.',
    href: '/knowledge/credit-transparency',
  },
  {
    icon: '03',
    title: 'Engineers Spread Too Thin',
    desc: 'Your GTM engineer is managing 9-10 workspaces across clients. That\'s not engineering - that\'s maintenance. Your pipeline deserves focused attention.',
    href: '/how-to/workspace-red-flag',
  },
  {
    icon: '04',
    title: 'Optimizing for Campaigns, Not Outcomes',
    desc: 'Agencies bill for campaigns shipped, not pipeline generated. The incentive is volume, not quality. Your outbound should compound - not just churn.',
    href: '/how-to/agency-evaluation-checklist',
  },
]

const workflowSteps = [
  {
    command: 'audit',
    title: 'Audit Your Stack',
    desc: 'Independent evaluation of your current GTM tools, workflows, and vendor relationships. No allegiance to any platform.',
  },
  {
    command: 'recommend',
    title: 'Recommend the Right Tools',
    desc: 'Should you use Clay? Do you need Instantly or should you build on your existing ESP? Buy vs build analysis for every layer.',
  },
  {
    command: 'build',
    title: 'Build the Infrastructure',
    desc: 'Enrichment pipelines, qualification workflows, outbound automation - built to your ICP, in your accounts, under your control.',
  },
  {
    command: 'transfer',
    title: 'Transfer Ownership',
    desc: 'Documentation, training, and runbooks. Your team owns every login, every workflow, every piece of data. No lock-in, no dependency.',
  },
]

const litmusTests = [
  {
    title: 'MCP + CLI Access',
    desc: 'Can your tools be automated programmatically? If the only interface is a GUI, you\'re paying for clicks, not infrastructure.',
    href: '/how-to/mcp-cli-litmus-test',
  },
  {
    title: 'Credit Transparency',
    desc: 'Do you know exactly what each enrichment, send, and lookup costs? Credit-based tools should report consumption to the penny.',
    href: '/how-to/credit-transparency-gtm-tools',
  },
  {
    title: 'Data Lake Alternatives',
    desc: 'Are you storing enrichment results, or re-running the same lookups every campaign? A data lake saves money and builds institutional knowledge.',
    href: '/how-to/data-lake-for-gtm',
  },
]

const faqLinkStyle: React.CSSProperties = {
  color: GTM.orange,
  textDecoration: 'none',
  fontWeight: 600,
}

const faqItems: { question: string; answer: React.ReactNode }[] = [
  {
    question: 'What makes this different from an agency?',
    answer: (
      <>
        Agencies optimize campaigns. I evaluate the tools and workflows powering those campaigns. Think of it as a second opinion before you sign - or a diagnostic when results plateau. I don&apos;t sell leads. I tell you who should be generating them and which tools to buy.{' '}
        <Link href="/how-to/agency-evaluation-checklist" style={faqLinkStyle}>see the agency evaluation checklist &rarr;</Link>
      </>
    ),
  },
  {
    question: 'Do you sell tools?',
    answer: (
      <>
        No. I have no vendor allegiances, no referral fees, no partnerships that bias recommendations. My evaluation is independent. If Clay is right for you, I&apos;ll say so. If a $0 alternative does the job, I&apos;ll say that too.{' '}
        <Link href="/how-to/should-you-get-clay" style={faqLinkStyle}>read the Clay evaluation &rarr;</Link>
      </>
    ),
  },
  {
    question: 'How does pricing work?',
    answer: 'Fixed monthly rate for engagement duration. No hourly billing, no credit markups, no hidden fees. The price reflects the value of infrastructure that compounds - not hours logged.',
  },
  {
    question: 'What do I own at the end?',
    answer: 'Everything. Every login, every workflow, every line of automation, every piece of documentation. The system runs independently after handoff. You don\'t need me to keep it going.',
  },
  {
    question: 'What if I already have an agency?',
    answer: 'Good. I can audit what they\'re doing and tell you if it\'s working. Sometimes agencies are doing great work and you just need confirmation. Sometimes the data tells a different story. Either way, you\'ll know.',
  },
]

/* ── scoped CSS ──────────────────────────────────── */

const scopedCSS = `
  .wi-page * {
    box-sizing: border-box;
  }
  .wi-page a {
    transition: opacity 0.15s ease;
  }
  .wi-page a:hover {
    opacity: 0.85;
  }
  @media (max-width: 768px) {
    .wi-problem-grid {
      grid-template-columns: 1fr !important;
    }
    .wi-workflow-grid {
      grid-template-columns: 1fr !important;
    }
    .wi-litmus-grid {
      grid-template-columns: 1fr !important;
    }
    .wi-hero-title {
      font-size: clamp(28px, 7vw, 48px) !important;
    }
    .wi-cta-row {
      flex-direction: column !important;
      align-items: stretch !important;
    }
    .wi-cta-row a {
      text-align: center !important;
    }
  }
`

/* ── section wrapper ─────────────────────────────── */

function WISection({
  children,
  background = GTM.dark,
  style,
  noPad,
}: {
  children: React.ReactNode
  background?: string
  style?: React.CSSProperties
  noPad?: boolean
}) {
  return (
    <section
      className="full-bleed"
      style={{
        background,
        padding: noPad ? '0 24px' : '80px 24px',
        ...style,
      }}
    >
      <MotionReveal variant="fadeUp">
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>{children}</div>
      </MotionReveal>
    </section>
  )
}

/* ── section label + title ───────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: GTM.orange,
        fontFamily: 'var(--font-mono)',
        marginBottom: 12,
      }}
    >
      <span style={{ opacity: 0.6 }}>$</span> {children}
    </div>
  )
}

function SectionTitle({
  children,
  subtitle,
}: {
  children: React.ReactNode
  subtitle?: string
}) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2
        style={{
          fontSize: 'clamp(26px, 4vw, 40px)',
          fontWeight: 700,
          color: GTM.text,
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
            fontSize: '16px',
            color: GTM.textSecondary,
            fontFamily: GTM.font,
            marginTop: 10,
            lineHeight: 1.6,
            maxWidth: 640,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

/* ── FAQ accordion ───────────────────────────────── */

function WIAccordion({ items }: { items: { question: string; answer: React.ReactNode }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <MotionReveal key={i} variant="fadeUp" delay={i * 0.05}>
            <div
              style={{
                borderBottom: `1px solid ${GTM.border}`,
                ...(i === 0 ? { borderTop: `1px solid ${GTM.border}` } : {}),
              }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '22px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '15px',
                  color: GTM.text,
                  textAlign: 'left',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: GTM.orange, opacity: 0.6, fontSize: '14px' }}>$</span>
                <span style={{ flex: 1, fontWeight: 500 }}>{item.question}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    color: GTM.orange,
                    fontSize: '20px',
                    flexShrink: 0,
                    display: 'inline-block',
                    fontWeight: 300,
                  }}
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        padding: '0 0 22px 0',
                        borderLeft: `2px solid ${GTM.orange}`,
                        marginLeft: 0,
                        paddingLeft: 20,
                        fontSize: '15px',
                        lineHeight: 1.7,
                        color: GTM.textSecondary,
                        fontFamily: GTM.font,
                      }}
                    >
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </MotionReveal>
        )
      })}
    </div>
  )
}

/* ── main component ──────────────────────────────── */

export function WhyIndependentContent() {
  const posthog = usePostHog()
  const track = (event: string, props?: Record<string, string>) =>
    posthog?.capture(event, { page: 'why_independent', ...props })

  return (
    <div className="wi-page" style={{ fontFamily: GTM.font }}>
      <style>{scopedCSS}</style>

      {/* ── Hero ── */}
      <section
        className="full-bleed"
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: `radial-gradient(ellipse 800px 600px at 50% 30%, ${GTM.orangeGlow}, transparent 60%), radial-gradient(ellipse 1200px 800px at 50% 60%, rgba(249, 115, 22, 0.06), transparent 70%), ${GTM.dark}`,
          position: 'relative',
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        <MotionReveal variant="fadeUp" delay={0.1}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              background: GTM.orangeGlow,
              border: `1px solid ${GTM.orangeBorder}`,
              borderRadius: 20,
              fontSize: '13px',
              fontWeight: 500,
              color: GTM.orangeLt,
              fontFamily: 'var(--font-mono)',
              marginBottom: 32,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: GTM.orange }} />
            Independent GTM Engineering
          </div>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.2}>
          <h1
            className="wi-hero-title"
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.1,
              margin: '0 0 24px',
              maxWidth: 900,
            }}
          >
            <span style={{ color: GTM.white }}>Your GTM stack deserves </span>
            <span style={{ color: GTM.orange }}>a second opinion.</span>
          </h1>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.35}>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: GTM.textSecondary,
              fontFamily: GTM.font,
              lineHeight: 1.6,
              maxWidth: 640,
              margin: '0 auto 48px',
            }}
          >
            Not an agency. Not a vendor. An independent go-to-market engineer consultant who evaluates your tools, audits your workflows, and builds infrastructure you own.
          </p>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.5}>
          <div className="wi-cta-row" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <MagneticHover>
              <a
                href="https://cal.com/shawntenam/30min"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('wi_cta_clicked', { cta_type: 'book_call', section: 'hero' })}
                style={{
                  display: 'inline-block',
                  padding: '14px 36px',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: GTM.font,
                  color: '#fff',
                  background: GTM.orange,
                  border: `1px solid ${GTM.orange}`,
                  borderRadius: 6,
                  textDecoration: 'none',
                }}
              >
                Book a Call
              </a>
            </MagneticHover>
            <MagneticHover>
              <a
                href="tel:3474520467"
                onClick={() => track('wi_cta_clicked', { cta_type: 'phone', section: 'hero' })}
                style={{
                  display: 'inline-block',
                  padding: '14px 36px',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: GTM.font,
                  color: GTM.orange,
                  background: 'transparent',
                  border: `1px solid ${GTM.orangeBorder}`,
                  borderRadius: 6,
                  textDecoration: 'none',
                }}
              >
                347-452-0467
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
            color: GTM.textMuted,
            fontSize: '24px',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          &#8964;
        </div>
      </section>

      {/* ── The Problem ── */}
      <WISection background={GTM.darkSubtle}>
        <SectionLabel>the problem</SectionLabel>
        <SectionTitle subtitle="There are GTM engineers, agencies, agencies that hire GTM engineers, and recruiters. But how many independent GTM engineer consultants are there?">
          The Gap Nobody Fills
        </SectionTitle>

        <StaggerContainer stagger={0.1}>
          <div
            className="wi-problem-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 20,
            }}
          >
            {problems.map((p) => (
              <StaggerItem key={p.icon}>
                <Link
                  href={p.href}
                  onClick={() => track('wi_knowledge_link_clicked', { link_title: p.title, link_href: p.href, section: 'problems' })}
                  style={{
                    display: 'block',
                    padding: '28px',
                    background: GTM.darkCard,
                    border: `1px solid ${GTM.border}`,
                    borderRadius: 10,
                    textDecoration: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: GTM.orange,
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.06em',
                      marginBottom: 12,
                      opacity: 0.7,
                    }}
                  >
                    {p.icon}
                  </div>
                  <div
                    style={{
                      fontSize: '17px',
                      fontWeight: 600,
                      color: GTM.text,
                      fontFamily: GTM.font,
                      marginBottom: 10,
                      lineHeight: 1.3,
                    }}
                  >
                    {p.title}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: GTM.textSecondary,
                      fontFamily: GTM.font,
                      lineHeight: 1.65,
                    }}
                  >
                    {p.desc}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: GTM.orange,
                      fontFamily: 'var(--font-mono)',
                      marginTop: 14,
                      fontWeight: 600,
                    }}
                  >
                    learn more &rarr;
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </WISection>

      {/* ── The GTM Engineer Consultant ── */}
      <WISection
        background={GTM.dark}
        style={{
          borderTop: `1px solid ${GTM.border}`,
          borderBottom: `1px solid ${GTM.border}`,
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
          <MotionReveal variant="scale" delay={0.1}>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: GTM.orange,
                fontFamily: 'var(--font-mono)',
                marginBottom: 20,
              }}
            >
              <span style={{ opacity: 0.6 }}>$</span> the positioning
            </div>
            <h2
              style={{
                fontSize: 'clamp(24px, 4vw, 38px)',
                fontWeight: 700,
                color: GTM.white,
                fontFamily: 'var(--font-mono)',
                lineHeight: 1.25,
                margin: '0 0 20px',
              }}
            >
              The strategist to the strategist.
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: GTM.textSecondary,
                fontFamily: GTM.font,
                lineHeight: 1.7,
                margin: '0 0 12px',
              }}
            >
              We&apos;re not selling lead gen services. We&apos;re giving you the evaluation for who should give you lead gen services and which tools you should buy.
            </p>
            <p
              style={{
                fontSize: '16px',
                color: GTM.textSecondary,
                fontFamily: GTM.font,
                lineHeight: 1.7,
                margin: '0 0 12px',
              }}
            >
              Independent. No vendor allegiance. Same tribal knowledge agencies charge for - but aligned to your outcomes, not their retainer.
            </p>
            <p
              style={{
                fontSize: '17px',
                color: GTM.text,
                fontFamily: GTM.font,
                lineHeight: 1.7,
                fontWeight: 600,
              }}
            >
              The agent to the agent. The engineer who evaluates the engineers.
            </p>
          </MotionReveal>
        </div>
      </WISection>

      {/* ── What I Do ── */}
      <WISection background={GTM.darkSubtle}>
        <SectionLabel>what I do</SectionLabel>
        <SectionTitle subtitle="Four phases. You own everything at the end.">
          Audit. Recommend. Build. Transfer.
        </SectionTitle>

        <StaggerContainer stagger={0.15}>
          <div style={{ position: 'relative', paddingLeft: 48 }}>
            {/* Connecting line */}
            <div
              style={{
                position: 'absolute',
                left: 19,
                top: 20,
                bottom: 20,
                width: 2,
                background: `linear-gradient(to bottom, ${GTM.orange}, ${GTM.orangeBorder})`,
                opacity: 0.4,
              }}
            />

            {workflowSteps.map((step, i) => (
              <StaggerItem key={i}>
                <div
                  style={{
                    position: 'relative',
                    marginBottom: i < workflowSteps.length - 1 ? 56 : 0,
                  }}
                >
                  {/* Numbered circle */}
                  <div
                    style={{
                      position: 'absolute',
                      left: -48,
                      top: 0,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      border: `2px solid ${GTM.orange}`,
                      background: GTM.darkSubtle,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: GTM.orange,
                      fontFamily: 'var(--font-mono)',
                      zIndex: 1,
                    }}
                  >
                    {i + 1}
                  </div>

                  {/* Content */}
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        color: GTM.textMuted,
                        fontFamily: 'var(--font-mono)',
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ color: GTM.orange }}>$</span> {step.command}
                    </div>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 600,
                        color: GTM.text,
                        fontFamily: 'var(--font-mono)',
                        marginBottom: 8,
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      style={{
                        fontSize: '15px',
                        color: GTM.textSecondary,
                        fontFamily: GTM.font,
                        lineHeight: 1.65,
                        maxWidth: 560,
                      }}
                    >
                      {step.desc}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </WISection>

      {/* ── The Litmus Tests ── */}
      <WISection background={GTM.dark}>
        <SectionLabel>litmus tests</SectionLabel>
        <SectionTitle subtitle="Three questions every GTM leader should be asking about their tools.">
          Is Your Stack Passing?
        </SectionTitle>

        <StaggerContainer stagger={0.1}>
          <div
            className="wi-litmus-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
            }}
          >
            {litmusTests.map((test) => (
              <StaggerItem key={test.title}>
                <Link
                  href={test.href}
                  onClick={() => track('wi_knowledge_link_clicked', { link_title: test.title, link_href: test.href, section: 'litmus_tests' })}
                  style={{ textDecoration: 'none', display: 'block', height: '100%' }}
                >
                  <motion.div
                    whileHover={{
                      borderColor: GTM.orangeBorder,
                      scale: 1.01,
                    }}
                    transition={{ duration: 0.2 }}
                    style={{
                      padding: '28px',
                      background: GTM.darkCard,
                      border: `1px solid ${GTM.border}`,
                      borderRadius: 10,
                      height: '100%',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '17px',
                        fontWeight: 600,
                        color: GTM.text,
                        fontFamily: 'var(--font-mono)',
                        marginBottom: 10,
                      }}
                    >
                      {test.title}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: GTM.textSecondary,
                        fontFamily: GTM.font,
                        lineHeight: 1.65,
                      }}
                    >
                      {test.desc}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: GTM.orange,
                        fontFamily: 'var(--font-mono)',
                        marginTop: 14,
                        fontWeight: 600,
                      }}
                    >
                      take the test &rarr;
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </WISection>

      {/* ── FAQ ── */}
      <WISection background={GTM.darkSubtle}>
        <SectionLabel>faq</SectionLabel>
        <SectionTitle>Common Questions</SectionTitle>
        <WIAccordion items={faqItems} />
      </WISection>

      {/* ── CTA ── */}
      <WISection background={GTM.dark}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <MotionReveal variant="fadeUp">
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 700,
                color: GTM.white,
                fontFamily: 'var(--font-mono)',
                lineHeight: 1.2,
                margin: '0 0 16px',
              }}
            >
              Get the second opinion.
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: GTM.textSecondary,
                fontFamily: GTM.font,
                lineHeight: 1.6,
                margin: '0 0 36px',
              }}
            >
              30-minute call. We&apos;ll look at your stack, your workflows, and your vendor relationships. No pitch - just an honest evaluation.
            </p>
            <div className="wi-cta-row" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <MagneticHover>
                <a
                  href="https://cal.com/shawntenam/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('wi_cta_clicked', { cta_type: 'book_call', section: 'footer' })}
                  style={{
                    display: 'inline-block',
                    padding: '16px 44px',
                    fontSize: '16px',
                    fontWeight: 600,
                    fontFamily: GTM.font,
                    color: '#fff',
                    background: GTM.orange,
                    border: `1px solid ${GTM.orange}`,
                    borderRadius: 6,
                    textDecoration: 'none',
                  }}
                >
                  Book a Call
                </a>
              </MagneticHover>
              <MagneticHover>
                <a
                  href="tel:3474520467"
                  onClick={() => track('wi_cta_clicked', { cta_type: 'phone', section: 'footer' })}
                  style={{
                    display: 'inline-block',
                    padding: '16px 44px',
                    fontSize: '16px',
                    fontWeight: 600,
                    fontFamily: GTM.font,
                    color: GTM.orange,
                    background: 'transparent',
                    border: `1px solid ${GTM.orangeBorder}`,
                    borderRadius: 6,
                    textDecoration: 'none',
                  }}
                >
                  347-452-0467
                </a>
              </MagneticHover>
            </div>
          </MotionReveal>
        </div>
      </WISection>

      {/* ── Footer Attribution ── */}
      <WISection
        background={GTM.darkSubtle}
        style={{
          borderTop: `1px solid ${GTM.border}`,
          padding: '32px 24px',
        }}
        noPad
      >
        <div
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: GTM.textMuted,
            fontFamily: 'var(--font-mono)',
          }}
        >
          Built with{' '}
          <a
            href="https://thegtmos.ai"
            style={{ color: GTM.textSecondary, textDecoration: 'none' }}
          >
            theGTMOS.ai
          </a>{' '}
          - the go-to-market operating system
        </div>
      </WISection>
    </div>
  )
}
