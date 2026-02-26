'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
  MagneticHover,
} from '../../components/motion'

/* ── MaintainX theme ─────────────────────────────── */

const MX = {
  blue: '#246CFF',
  blueLt: '#6E9EFF',
  blueGlow: 'rgba(36, 108, 255, 0.12)',
  blueBorder: 'rgba(36, 108, 255, 0.25)',
  dark: '#0A0F1C',
  darkSubtle: '#0F1629',
  darkCard: '#131A2E',
  border: '#1C2640',
  borderLt: '#253352',
  text: '#E2E8F0',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  white: '#F8FAFC',
  font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, 'Helvetica Neue', sans-serif",
} as const

/* ── data ────────────────────────────────────────── */

const stats = [
  { value: '$2.5B', label: 'Valuation' },
  { value: '13K+', label: 'Customers' },
  { value: '750+', label: 'Team Members' },
  { value: '46%', label: 'YoY Growth' },
  { value: '#1', label: 'G2 CMMS' },
]

const challenges = [
  {
    icon: '01',
    title: 'Scaling SDR Operations at Hypergrowth Speed',
    desc: 'Onboarding, ramping, and coaching SDRs faster than traditional methods allow — across multiple geographies and languages.',
  },
  {
    icon: '02',
    title: 'Moving Upmarket to Enterprise',
    desc: 'Enterprise deals require multi-threaded prospecting, deeper account research, and longer nurture sequences. Your mid-market playbook needs a new layer.',
  },
  {
    icon: '03',
    title: 'Processing High-Volume Inbound at Speed',
    desc: 'Leads from manufacturing, F&B, chemicals, mining — all with different qualification criteria. Routing and scoring need to happen in seconds, not hours.',
  },
  {
    icon: '04',
    title: 'Making Outbound Match the Product',
    desc: 'MaintainX sells AI-powered intelligence. Your outbound should feel equally intelligent — signal-driven, deeply personalized, not templated.',
  },
]

const deliverables = [
  {
    title: 'Signal Engine',
    desc: 'Trigger events — plant expansions, compliance changes, equipment failures, leadership hires — automatically feed personalized Outreach sequences. No manual research.',
    tags: ['Outreach', 'Signals', 'Automation'],
  },
  {
    title: 'AI Enrichment Layer',
    desc: 'ZoomInfo data + custom AI research. Deep account intelligence before an SDR touches a lead — industry context, tech stack, recent news, pain indicators.',
    tags: ['ZoomInfo', 'AI Research', 'Enrichment'],
  },
  {
    title: 'Pipeline Intelligence',
    desc: 'Salesforce routing, lead scoring, qualification automation. Inbound leads scored and routed in real-time. Outbound pipeline tracked end-to-end.',
    tags: ['Salesforce', 'Scoring', 'Routing'],
  },
  {
    title: 'SDR Enablement System',
    desc: 'AI-assisted persona playbooks, objection handling, and ramp acceleration. New SDRs performing at target in weeks — not quarters.',
    tags: ['Playbooks', 'Training', 'AI Coaching'],
  },
]

const engagementSteps = [
  {
    title: 'Audit & Architecture',
    subtitle: 'Month 1',
    desc: 'Map your Salesforce, Outreach, and ZoomInfo workflows. Identify every manual process that should be automated. Design the target-state infrastructure.',
  },
  {
    title: 'Build & Deploy',
    subtitle: 'Month 2',
    desc: 'Custom AI infrastructure goes live. Signal detection, enrichment pipelines, Outreach automation, Salesforce workflows — all wired together and tested.',
  },
  {
    title: 'Enable & Transfer',
    subtitle: 'Month 3',
    desc: 'Train you and your team to own the system. Documentation, runbooks, and hands-on coaching. The infrastructure runs independently after handoff.',
  },
]

const faqItems = [
  {
    question: 'How does the engagement start?',
    answer: 'A focused discovery session to map your current stack, workflows, and bottlenecks. I come prepared with research — the goal is to identify the highest-leverage automations within the first week.',
  },
  {
    question: 'What access do you need?',
    answer: 'Read access to Salesforce, Outreach, and ZoomInfo to audit current workflows. Admin access to a sandbox environment for building and testing. Everything is documented and reversible.',
  },
  {
    question: 'How does pricing work?',
    answer: 'Fixed monthly rate for the 3-month engagement. No hourly billing, no scope creep surprises. The price reflects the value of infrastructure that compounds — not hours logged.',
  },
  {
    question: 'Can I manage this independently after?',
    answer: 'That\'s the entire point. Month 3 is dedicated to enablement and transfer. You\'ll have the knowledge, documentation, and confidence to run and iterate on everything that was built.',
  },
  {
    question: 'What makes this different from hiring an agency?',
    answer: 'Agencies optimize campaigns. I build infrastructure. The difference is compounding returns — once the signal engine and enrichment layer are running, they improve your entire pipeline permanently, not just one campaign.',
  },
  {
    question: 'What if we need to extend beyond 3 months?',
    answer: 'The system is designed to be self-sustaining. But if you want to expand scope — new channels, new markets, deeper automation — we can discuss a follow-on engagement. No lock-in.',
  },
]

/* ── scoped CSS ──────────────────────────────────── */

const scopedCSS = `
  .mx-page * {
    box-sizing: border-box;
  }
  .mx-page a {
    transition: opacity 0.15s ease;
  }
  .mx-page a:hover {
    opacity: 0.85;
  }
  .mx-stat-value {
    font-size: clamp(28px, 5vw, 44px);
    font-weight: 700;
    color: ${MX.blue};
    line-height: 1;
  }
  .mx-stat-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${MX.textMuted};
    margin-top: 6px;
  }
  @media (max-width: 768px) {
    .mx-stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .mx-challenge-grid {
      grid-template-columns: 1fr !important;
    }
    .mx-deliverable-grid {
      grid-template-columns: 1fr !important;
    }
    .mx-hero-title {
      font-size: clamp(28px, 7vw, 48px) !important;
    }
  }
  @media (max-width: 480px) {
    .mx-stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 20px !important;
    }
  }
`

/* ── section wrapper ─────────────────────────────── */

function MXSection({
  children,
  background = MX.dark,
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

/* ── section headline ────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: MX.blue,
        fontFamily: MX.font,
        marginBottom: 12,
      }}
    >
      {children}
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
          color: MX.text,
          fontFamily: MX.font,
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
            color: MX.textSecondary,
            fontFamily: MX.font,
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

/* ── FAQ accordion (MaintainX-styled) ────────────── */

function MXAccordion({ items }: { items: typeof faqItems }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <MotionReveal key={i} variant="fadeUp" delay={i * 0.05}>
            <div
              style={{
                borderBottom: `1px solid ${MX.border}`,
                ...(i === 0 ? { borderTop: `1px solid ${MX.border}` } : {}),
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
                  fontFamily: MX.font,
                  fontSize: '16px',
                  color: MX.text,
                  textAlign: 'left',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ flex: 1, fontWeight: 500 }}>{item.question}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    color: MX.blue,
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
                        borderLeft: `2px solid ${MX.blue}`,
                        marginLeft: 0,
                        paddingLeft: 20,
                        fontSize: '15px',
                        lineHeight: 1.7,
                        color: MX.textSecondary,
                        fontFamily: MX.font,
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

export function MaintainXContent() {
  return (
    <div className="mx-page" style={{ fontFamily: MX.font }}>
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
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${MX.blueGlow}, ${MX.dark} 70%)`,
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
              background: MX.blueGlow,
              border: `1px solid ${MX.blueBorder}`,
              borderRadius: 20,
              fontSize: '13px',
              fontWeight: 500,
              color: MX.blueLt,
              fontFamily: MX.font,
              marginBottom: 32,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: MX.blue }} />
            Custom Proposal
          </div>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.2}>
          <h1
            className="mx-hero-title"
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 700,
              fontFamily: MX.font,
              lineHeight: 1.1,
              margin: '0 0 24px',
              maxWidth: 800,
            }}
          >
            <span style={{ color: MX.white }}>Built for </span>
            <span style={{ color: MX.blue }}>MaintainX</span>
          </h1>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.35}>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: MX.textSecondary,
              fontFamily: MX.font,
              lineHeight: 1.6,
              maxWidth: 580,
              margin: '0 auto 48px',
            }}
          >
            AI-powered sales development infrastructure.
            <br />
            Signal-based outbound. Intelligent enrichment. Built to compound.
          </p>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.5}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <MagneticHover>
              <a
                href="#engagement"
                style={{
                  display: 'inline-block',
                  padding: '14px 36px',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: MX.font,
                  color: '#fff',
                  background: MX.blue,
                  border: `1px solid ${MX.blue}`,
                  borderRadius: 8,
                  textDecoration: 'none',
                  transition: 'background 0.15s ease',
                }}
              >
                View the Engagement
              </a>
            </MagneticHover>
            <MagneticHover>
              <a
                href="#deliverables"
                style={{
                  display: 'inline-block',
                  padding: '14px 36px',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: MX.font,
                  color: MX.blue,
                  background: 'transparent',
                  border: `1px solid ${MX.blueBorder}`,
                  borderRadius: 8,
                  textDecoration: 'none',
                  transition: 'background 0.15s ease, border-color 0.15s ease',
                }}
              >
                See What I Build
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
            color: MX.textMuted,
            fontSize: '24px',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          &#8964;
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <MXSection
        background={MX.darkSubtle}
        style={{
          borderTop: `1px solid ${MX.border}`,
          borderBottom: `1px solid ${MX.border}`,
          padding: '48px 24px',
        }}
        noPad
      >
        <div
          className="mx-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
            gap: 32,
            textAlign: 'center',
          }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div className="mx-stat-value">{s.value}</div>
              <div className="mx-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            textAlign: 'center',
            marginTop: 24,
            fontSize: '13px',
            color: MX.textMuted,
            fontFamily: MX.font,
          }}
        >
          We did our homework.
        </div>
      </MXSection>

      {/* ── Your Challenge ── */}
      <MXSection background={MX.dark}>
        <SectionLabel>The Challenge</SectionLabel>
        <SectionTitle subtitle="Scaling sales development at a $2.5B company moving upmarket requires infrastructure, not just headcount.">
          What Keeps SDR Leaders Up at Night
        </SectionTitle>

        <StaggerContainer stagger={0.1}>
          <div
            className="mx-challenge-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 20,
            }}
          >
            {challenges.map((c) => (
              <StaggerItem key={c.icon}>
                <div
                  style={{
                    padding: '28px',
                    background: MX.darkCard,
                    border: `1px solid ${MX.border}`,
                    borderRadius: 10,
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: MX.blue,
                      fontFamily: MX.font,
                      letterSpacing: '0.06em',
                      marginBottom: 12,
                      opacity: 0.7,
                    }}
                  >
                    {c.icon}
                  </div>
                  <div
                    style={{
                      fontSize: '17px',
                      fontWeight: 600,
                      color: MX.text,
                      fontFamily: MX.font,
                      marginBottom: 10,
                      lineHeight: 1.3,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: MX.textSecondary,
                      fontFamily: MX.font,
                      lineHeight: 1.65,
                    }}
                  >
                    {c.desc}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </MXSection>

      {/* ── What I Build ── */}
      <MXSection background={MX.darkSubtle} style={{ scrollMarginTop: 80 }}>
        <div id="deliverables" style={{ position: 'absolute', marginTop: -100 }} />
        <SectionLabel>The Solution</SectionLabel>
        <SectionTitle subtitle="Four systems that integrate with your existing stack — Salesforce, Outreach, ZoomInfo — and make every SDR 10x more effective.">
          What I Build for You
        </SectionTitle>

        <StaggerContainer stagger={0.12}>
          <div
            className="mx-deliverable-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 20,
            }}
          >
            {deliverables.map((d) => (
              <StaggerItem key={d.title}>
                <motion.div
                  whileHover={{
                    borderColor: MX.blueBorder,
                    scale: 1.01,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: '28px',
                    background: MX.darkCard,
                    border: `1px solid ${MX.border}`,
                    borderRadius: 10,
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: MX.text,
                      fontFamily: MX.font,
                      marginBottom: 10,
                    }}
                  >
                    {d.title}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: MX.textSecondary,
                      fontFamily: MX.font,
                      lineHeight: 1.65,
                      marginBottom: 16,
                    }}
                  >
                    {d.desc}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {d.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '11px',
                          fontFamily: MX.font,
                          padding: '3px 10px',
                          borderRadius: 4,
                          background: MX.blueGlow,
                          color: MX.blueLt,
                          fontWeight: 600,
                          letterSpacing: '0.02em',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </MXSection>

      {/* ── The Engagement ── */}
      <MXSection background={MX.dark} style={{ scrollMarginTop: 80 }}>
        <div id="engagement" style={{ position: 'absolute', marginTop: -100 }} />
        <SectionLabel>The Engagement</SectionLabel>
        <SectionTitle subtitle="3 months. Full infrastructure build and knowledge transfer. You own everything at the end.">
          Audit. Build. Enable.
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
                background: `linear-gradient(to bottom, ${MX.blue}, ${MX.blueBorder})`,
                opacity: 0.4,
              }}
            />

            {engagementSteps.map((step, i) => (
              <StaggerItem key={i}>
                <div
                  style={{
                    position: 'relative',
                    marginBottom: i < engagementSteps.length - 1 ? 56 : 0,
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
                      border: `2px solid ${MX.blue}`,
                      background: MX.dark,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: MX.blue,
                      fontFamily: MX.font,
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
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: MX.blue,
                        fontFamily: MX.font,
                        marginBottom: 6,
                        opacity: 0.8,
                      }}
                    >
                      {step.subtitle}
                    </div>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 600,
                        color: MX.text,
                        fontFamily: MX.font,
                        marginBottom: 8,
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      style={{
                        fontSize: '15px',
                        color: MX.textSecondary,
                        fontFamily: MX.font,
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
      </MXSection>

      {/* ── The Meta Proof ── */}
      <MXSection
        background={MX.darkSubtle}
        style={{
          borderTop: `1px solid ${MX.border}`,
          borderBottom: `1px solid ${MX.border}`,
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
                color: MX.blue,
                fontFamily: MX.font,
                marginBottom: 20,
              }}
            >
              The Proof of Concept
            </div>
            <h2
              style={{
                fontSize: 'clamp(24px, 4vw, 38px)',
                fontWeight: 700,
                color: MX.white,
                fontFamily: MX.font,
                lineHeight: 1.25,
                margin: '0 0 20px',
              }}
            >
              This page is the demo.
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: MX.textSecondary,
                fontFamily: MX.font,
                lineHeight: 1.7,
                margin: '0 0 12px',
              }}
            >
              Custom-branded to your company. Deeply researched — your valuation, your stack,
              your G2 ranking, your growth trajectory. Built and deployed in a single session
              using the same AI infrastructure I&apos;d build for your team.
            </p>
            <p
              style={{
                fontSize: '17px',
                color: MX.text,
                fontFamily: MX.font,
                lineHeight: 1.7,
                fontWeight: 600,
              }}
            >
              Now imagine what 3 months of focused work delivers.
            </p>
          </MotionReveal>
        </div>
      </MXSection>

      {/* ── Your Stack, Amplified ── */}
      <MXSection background={MX.dark}>
        <SectionLabel>Stack Integration</SectionLabel>
        <SectionTitle subtitle="Everything plugs into the tools your team already uses. No rip-and-replace.">
          Your Stack, Amplified
        </SectionTitle>

        <StaggerContainer stagger={0.08}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
            }}
          >
            {[
              { name: 'Salesforce', role: 'CRM & Pipeline' },
              { name: 'Outreach', role: 'Sequences & Cadences' },
              { name: 'ZoomInfo', role: 'Contact Intelligence' },
              { name: 'AI Layer', role: 'Research & Enrichment' },
              { name: 'Signal Engine', role: 'Trigger Detection' },
            ].map((tool) => (
              <StaggerItem key={tool.name}>
                <div
                  style={{
                    padding: '24px 20px',
                    background: MX.darkCard,
                    border: `1px solid ${MX.border}`,
                    borderRadius: 8,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: MX.text,
                      fontFamily: MX.font,
                      marginBottom: 4,
                    }}
                  >
                    {tool.name}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: MX.textMuted,
                      fontFamily: MX.font,
                    }}
                  >
                    {tool.role}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </MXSection>

      {/* ── FAQ ── */}
      <MXSection background={MX.darkSubtle}>
        <SectionLabel>FAQ</SectionLabel>
        <SectionTitle>Common Questions</SectionTitle>
        <MXAccordion items={faqItems} />
      </MXSection>

      {/* ── CTA ── */}
      <MXSection background={MX.dark}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <MotionReveal variant="fadeUp">
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 700,
                color: MX.white,
                fontFamily: MX.font,
                lineHeight: 1.2,
                margin: '0 0 16px',
              }}
            >
              Let&apos;s explore what&apos;s possible.
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: MX.textSecondary,
                fontFamily: MX.font,
                lineHeight: 1.6,
                margin: '0 0 36px',
              }}
            >
              The infrastructure scales. The enablement compounds.
              Let&apos;s talk about building it for MaintainX.
            </p>
            <MagneticHover>
              <a
                href="mailto:shawn@leadalchemy.co?subject=MaintainX%20%E2%80%94%20AI%20Sales%20Dev%20Infrastructure"
                style={{
                  display: 'inline-block',
                  padding: '16px 44px',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: MX.font,
                  color: '#fff',
                  background: MX.blue,
                  border: `1px solid ${MX.blue}`,
                  borderRadius: 8,
                  textDecoration: 'none',
                  transition: 'background 0.15s ease',
                }}
              >
                Start the Conversation
              </a>
            </MagneticHover>
            <div
              style={{
                marginTop: 20,
                fontSize: '13px',
                color: MX.textMuted,
                fontFamily: MX.font,
              }}
            >
              shawn@leadalchemy.co
            </div>
          </MotionReveal>
        </div>
      </MXSection>

      {/* ── Footer Attribution ── */}
      <MXSection
        background={MX.darkSubtle}
        style={{
          borderTop: `1px solid ${MX.border}`,
          padding: '32px 24px',
        }}
        noPad
      >
        <div
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: MX.textMuted,
            fontFamily: MX.font,
          }}
        >
          Built with{' '}
          <a
            href="https://thegtmos.ai"
            style={{ color: MX.textSecondary, textDecoration: 'none' }}
          >
            theGTMOS.ai
          </a>{' '}
          — the go-to-market operating system
        </div>
      </MXSection>
    </div>
  )
}
