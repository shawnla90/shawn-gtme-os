'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
  MagneticHover,
} from '../../components/motion'

/* ── BuildOps theme ─────────────────────────────── */

const BO = {
  orange: '#FF6B2B',
  orangeLt: '#FF9B6B',
  orangeGlow: 'rgba(255, 107, 43, 0.12)',
  orangeBorder: 'rgba(255, 107, 43, 0.25)',
  dark: '#0C0A0F',
  darkSubtle: '#12101A',
  darkCard: '#1A1724',
  border: '#2A2438',
  borderLt: '#3A3248',
  text: '#E8E2F0',
  textSecondary: '#A89BBE',
  textMuted: '#6B5F80',
  white: '#FAF8FC',
  font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, 'Helvetica Neue', sans-serif",
} as const

/* ── data ────────────────────────────────────────── */

const stats = [
  { value: '$1B', label: 'Valuation' },
  { value: '$60M', label: 'Revenue' },
  { value: '447', label: 'Team Members' },
  { value: '73.5%', label: 'YoY Headcount Growth' },
  { value: '55', label: 'Open Roles' },
]

const challenges = [
  {
    icon: '01',
    title: 'Scaling a Brand-New Revenue Org Post-Unicorn',
    desc: 'New CRO (Nov 2025), new CMO (Oct 2025), new Chief AI Officer (Jan 2026). The entire go-to-market leadership team is fresh — they need infrastructure that accelerates ramp, not slows it down.',
  },
  {
    icon: '02',
    title: 'Owning the Commercial Contractor Category',
    desc: 'ServiceTitan went public. FieldEdge, Housecall Pro, and Service Fusion are circling. BuildOps needs signal-driven outbound that reaches commercial contractors before competitors even know they\'re in-market.',
  },
  {
    icon: '03',
    title: 'Selling an All-in-One Platform vs. Point Solutions',
    desc: 'Invoicing, scheduling, estimates, project management, dispatching — all in one. The value prop is massive, but it requires multi-stakeholder selling and deeper account intelligence than single-product pitches.',
  },
  {
    icon: '04',
    title: 'Geographic Expansion at 73.5% Headcount Growth',
    desc: 'New Raleigh hub. Teams in Philippines, Brazil, Canada. 122 people in sales alone. Every new market and every new hire needs the same playbook quality and signal access as HQ.',
  },
]

const deliverables = [
  {
    title: 'Contractor Signal Engine',
    desc: 'Detect commercial contractor buying signals — new construction permits, HVAC code changes, fleet expansions, equipment upgrades — and auto-route them into personalized Outreach sequences.',
    tags: ['Outreach', 'Signals', 'Permitting Data'],
  },
  {
    title: 'AI Account Intelligence',
    desc: 'ZoomInfo + custom AI enrichment. Before an SDR touches a lead, they know the contractor\'s specialty, fleet size, current software stack, recent projects, and pain indicators.',
    tags: ['ZoomInfo', 'AI Research', 'Enrichment'],
  },
  {
    title: 'Pipeline Infrastructure',
    desc: 'Salesforce + LeanData routing, lead scoring calibrated for commercial contractors, inbound qualification automation. Every lead scored in seconds, routed to the right rep.',
    tags: ['Salesforce', 'LeanData', 'Scoring'],
  },
  {
    title: 'SDR Ramp System',
    desc: 'AI-powered playbooks for HVAC, plumbing, electrical, and fire protection verticals. Objection handling, persona-specific messaging, and ramp acceleration for the 55+ open roles.',
    tags: ['Playbooks', 'Training', 'AI Coaching'],
  },
]

const engagementSteps = [
  {
    title: 'Audit & Architecture',
    subtitle: 'Month 1',
    desc: 'Map your Salesforce, Outreach, ZoomInfo, and LeanData workflows. Identify the manual bottlenecks slowing down a sales org growing at 73.5% YoY. Design the target-state infrastructure.',
  },
  {
    title: 'Build & Deploy',
    subtitle: 'Month 2',
    desc: 'Contractor signal engine goes live. AI enrichment pipelines, Outreach automation, Salesforce workflows — all wired together. Vertical-specific playbooks for HVAC, plumbing, electrical, and fire protection.',
  },
  {
    title: 'Enable & Transfer',
    subtitle: 'Month 3',
    desc: 'Train Greg, Colin, and the leadership team to own the system. Documentation, runbooks, and hands-on coaching. The infrastructure runs independently — built to scale with every new hire.',
  },
]

const faqItems = [
  {
    question: 'How does the engagement start?',
    answer: 'A focused discovery session to map your current stack, workflows, and bottlenecks. I come prepared with research on BuildOps, your competitive landscape, and contractor vertical dynamics — the goal is to identify the highest-leverage automations within the first week.',
  },
  {
    question: 'What access do you need?',
    answer: 'Read access to Salesforce, Outreach, ZoomInfo, and LeanData to audit current workflows. Admin access to a sandbox environment for building and testing. Everything is documented and reversible.',
  },
  {
    question: 'How does pricing work?',
    answer: 'Fixed monthly rate for the 3-month engagement. No hourly billing, no scope creep surprises. The price reflects the value of infrastructure that compounds — not hours logged.',
  },
  {
    question: 'Can we manage this independently after?',
    answer: 'That\'s the entire point. Month 3 is dedicated to enablement and transfer. Your team will have the knowledge, documentation, and confidence to run and iterate on everything that was built.',
  },
  {
    question: 'What makes this different from hiring a RevOps agency?',
    answer: 'Agencies optimize campaigns. I build infrastructure. The difference is compounding returns — once the signal engine and enrichment layer are running, they improve your entire pipeline permanently, not just one quarter.',
  },
  {
    question: 'Can this scale across the Raleigh hub and international teams?',
    answer: 'Absolutely. The infrastructure is designed for multi-geo, multi-team scale. Signal routing, playbooks, and enrichment work the same whether the rep is in Santa Monica, Raleigh, or Manila.',
  },
]

/* ── scoped CSS ──────────────────────────────────── */

const scopedCSS = `
  .bo-page * {
    box-sizing: border-box;
  }
  .bo-page a {
    transition: opacity 0.15s ease;
  }
  .bo-page a:hover {
    opacity: 0.85;
  }
  .bo-stat-value {
    font-size: clamp(28px, 5vw, 44px);
    font-weight: 700;
    color: ${BO.orange};
    line-height: 1;
  }
  .bo-stat-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${BO.textMuted};
    margin-top: 6px;
  }
  @media (max-width: 768px) {
    .bo-stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .bo-challenge-grid {
      grid-template-columns: 1fr !important;
    }
    .bo-deliverable-grid {
      grid-template-columns: 1fr !important;
    }
    .bo-hero-title {
      font-size: clamp(28px, 7vw, 48px) !important;
    }
  }
  @media (max-width: 480px) {
    .bo-stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 20px !important;
    }
  }
`

/* ── section wrapper ─────────────────────────────── */

function BOSection({
  children,
  background = BO.dark,
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
        color: BO.orange,
        fontFamily: BO.font,
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
          color: BO.text,
          fontFamily: BO.font,
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
            color: BO.textSecondary,
            fontFamily: BO.font,
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

function BOAccordion({ items }: { items: typeof faqItems }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <MotionReveal key={i} variant="fadeUp" delay={i * 0.05}>
            <div
              style={{
                borderBottom: `1px solid ${BO.border}`,
                ...(i === 0 ? { borderTop: `1px solid ${BO.border}` } : {}),
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
                  fontFamily: BO.font,
                  fontSize: '16px',
                  color: BO.text,
                  textAlign: 'left',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ flex: 1, fontWeight: 500 }}>{item.question}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    color: BO.orange,
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
                        borderLeft: `2px solid ${BO.orange}`,
                        marginLeft: 0,
                        paddingLeft: 20,
                        fontSize: '15px',
                        lineHeight: 1.7,
                        color: BO.textSecondary,
                        fontFamily: BO.font,
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

export function BuildOpsContent() {
  return (
    <div className="bo-page" style={{ fontFamily: BO.font }}>
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
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${BO.orangeGlow}, ${BO.dark} 70%)`,
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
              background: BO.orangeGlow,
              border: `1px solid ${BO.orangeBorder}`,
              borderRadius: 20,
              fontSize: '13px',
              fontWeight: 500,
              color: BO.orangeLt,
              fontFamily: BO.font,
              marginBottom: 32,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: BO.orange }} />
            Custom Proposal
          </div>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.2}>
          <h1
            className="bo-hero-title"
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 700,
              fontFamily: BO.font,
              lineHeight: 1.1,
              margin: '0 0 24px',
              maxWidth: 800,
            }}
          >
            <span style={{ color: BO.white }}>Built for </span>
            <span style={{ color: BO.orange }}>BuildOps</span>
          </h1>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.35}>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: BO.textSecondary,
              fontFamily: BO.font,
              lineHeight: 1.6,
              maxWidth: 580,
              margin: '0 auto 48px',
            }}
          >
            AI-powered sales development infrastructure for the #1 commercial contractor platform.
            <br />
            Signal-based outbound. Vertical-specific intelligence. Built to scale with unicorn growth.
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
                  fontFamily: BO.font,
                  color: '#fff',
                  background: BO.orange,
                  border: `1px solid ${BO.orange}`,
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
                  fontFamily: BO.font,
                  color: BO.orange,
                  background: 'transparent',
                  border: `1px solid ${BO.orangeBorder}`,
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

        <div
          className="scroll-indicator"
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            color: BO.textMuted,
            fontSize: '24px',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          &#8964;
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <BOSection
        background={BO.darkSubtle}
        style={{
          borderTop: `1px solid ${BO.border}`,
          borderBottom: `1px solid ${BO.border}`,
          padding: '48px 24px',
        }}
        noPad
      >
        <div
          className="bo-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
            gap: 32,
            textAlign: 'center',
          }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div className="bo-stat-value">{s.value}</div>
              <div className="bo-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            textAlign: 'center',
            marginTop: 24,
            fontSize: '13px',
            color: BO.textMuted,
            fontFamily: BO.font,
          }}
        >
          We did our homework.
        </div>
      </BOSection>

      {/* ── Your Challenge ── */}
      <BOSection background={BO.dark}>
        <SectionLabel>The Challenge</SectionLabel>
        <SectionTitle subtitle="Fresh unicorn status, new GTM leadership, 73.5% headcount growth — BuildOps needs sales infrastructure that scales as fast as the team.">
          What Keeps Revenue Leaders Up at Night
        </SectionTitle>

        <StaggerContainer stagger={0.1}>
          <div
            className="bo-challenge-grid"
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
                    background: BO.darkCard,
                    border: `1px solid ${BO.border}`,
                    borderRadius: 10,
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: BO.orange,
                      fontFamily: BO.font,
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
                      color: BO.text,
                      fontFamily: BO.font,
                      marginBottom: 10,
                      lineHeight: 1.3,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: BO.textSecondary,
                      fontFamily: BO.font,
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
      </BOSection>

      {/* ── What I Build ── */}
      <BOSection background={BO.darkSubtle} style={{ scrollMarginTop: 80 }}>
        <div id="deliverables" style={{ position: 'absolute', marginTop: -100 }} />
        <SectionLabel>The Solution</SectionLabel>
        <SectionTitle subtitle="Four systems that integrate with your existing stack — Salesforce, Outreach, ZoomInfo, LeanData — and make every SDR across every vertical 10x more effective.">
          What I Build for You
        </SectionTitle>

        <StaggerContainer stagger={0.12}>
          <div
            className="bo-deliverable-grid"
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
                    borderColor: BO.orangeBorder,
                    scale: 1.01,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: '28px',
                    background: BO.darkCard,
                    border: `1px solid ${BO.border}`,
                    borderRadius: 10,
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: BO.text,
                      fontFamily: BO.font,
                      marginBottom: 10,
                    }}
                  >
                    {d.title}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: BO.textSecondary,
                      fontFamily: BO.font,
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
                          fontFamily: BO.font,
                          padding: '3px 10px',
                          borderRadius: 4,
                          background: BO.orangeGlow,
                          color: BO.orangeLt,
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
      </BOSection>

      {/* ── The Engagement ── */}
      <BOSection background={BO.dark} style={{ scrollMarginTop: 80 }}>
        <div id="engagement" style={{ position: 'absolute', marginTop: -100 }} />
        <SectionLabel>The Engagement</SectionLabel>
        <SectionTitle subtitle="3 months. Full infrastructure build and knowledge transfer. You own everything at the end.">
          Audit. Build. Enable.
        </SectionTitle>

        <StaggerContainer stagger={0.15}>
          <div style={{ position: 'relative', paddingLeft: 48 }}>
            <div
              style={{
                position: 'absolute',
                left: 19,
                top: 20,
                bottom: 20,
                width: 2,
                background: `linear-gradient(to bottom, ${BO.orange}, ${BO.orangeBorder})`,
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
                  <div
                    style={{
                      position: 'absolute',
                      left: -48,
                      top: 0,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      border: `2px solid ${BO.orange}`,
                      background: BO.dark,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: BO.orange,
                      fontFamily: BO.font,
                      zIndex: 1,
                    }}
                  >
                    {i + 1}
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: BO.orange,
                        fontFamily: BO.font,
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
                        color: BO.text,
                        fontFamily: BO.font,
                        marginBottom: 8,
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      style={{
                        fontSize: '15px',
                        color: BO.textSecondary,
                        fontFamily: BO.font,
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
      </BOSection>

      {/* ── The Meta Proof ── */}
      <BOSection
        background={BO.darkSubtle}
        style={{
          borderTop: `1px solid ${BO.border}`,
          borderBottom: `1px solid ${BO.border}`,
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
                color: BO.orange,
                fontFamily: BO.font,
                marginBottom: 20,
              }}
            >
              The Proof of Concept
            </div>
            <h2
              style={{
                fontSize: 'clamp(24px, 4vw, 38px)',
                fontWeight: 700,
                color: BO.white,
                fontFamily: BO.font,
                lineHeight: 1.25,
                margin: '0 0 20px',
              }}
            >
              This page is the demo.
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: BO.textSecondary,
                fontFamily: BO.font,
                lineHeight: 1.7,
                margin: '0 0 12px',
              }}
            >
              Custom-branded to BuildOps. Deeply researched — your $1B valuation, your new CRO and CMO,
              your Raleigh expansion, your 73.5% headcount growth. Built and deployed in a single session
              using the same AI infrastructure I&apos;d build for your team.
            </p>
            <p
              style={{
                fontSize: '17px',
                color: BO.text,
                fontFamily: BO.font,
                lineHeight: 1.7,
                fontWeight: 600,
              }}
            >
              Now imagine what 3 months of focused work delivers.
            </p>
          </MotionReveal>
        </div>
      </BOSection>

      {/* ── Your Stack, Amplified ── */}
      <BOSection background={BO.dark}>
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
              { name: 'ZoomInfo', role: 'Contact Intelligence' },
              { name: 'LeanData', role: 'Lead Routing' },
              { name: 'Demandbase', role: 'ABM & Targeting' },
              { name: 'AI Layer', role: 'Enrichment & Signals' },
            ].map((tool) => (
              <StaggerItem key={tool.name}>
                <div
                  style={{
                    padding: '24px 20px',
                    background: BO.darkCard,
                    border: `1px solid ${BO.border}`,
                    borderRadius: 8,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: BO.text,
                      fontFamily: BO.font,
                      marginBottom: 4,
                    }}
                  >
                    {tool.name}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: BO.textMuted,
                      fontFamily: BO.font,
                    }}
                  >
                    {tool.role}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </BOSection>

      {/* ── FAQ ── */}
      <BOSection background={BO.darkSubtle}>
        <SectionLabel>FAQ</SectionLabel>
        <SectionTitle>Common Questions</SectionTitle>
        <BOAccordion items={faqItems} />
      </BOSection>

      {/* ── CTA ── */}
      <BOSection background={BO.dark}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <MotionReveal variant="fadeUp">
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 700,
                color: BO.white,
                fontFamily: BO.font,
                lineHeight: 1.2,
                margin: '0 0 16px',
              }}
            >
              Let&apos;s explore what&apos;s possible.
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: BO.textSecondary,
                fontFamily: BO.font,
                lineHeight: 1.6,
                margin: '0 0 36px',
              }}
            >
              BuildOps just hit unicorn status. The team is scaling fast.
              Let&apos;s make sure the sales infrastructure scales just as fast.
            </p>
            <MagneticHover>
              <a
                href="mailto:shawn@leadalchemy.co?subject=BuildOps%20%E2%80%94%20AI%20Sales%20Dev%20Infrastructure"
                style={{
                  display: 'inline-block',
                  padding: '16px 44px',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: BO.font,
                  color: '#fff',
                  background: BO.orange,
                  border: `1px solid ${BO.orange}`,
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
                color: BO.textMuted,
                fontFamily: BO.font,
              }}
            >
              shawn@leadalchemy.co
            </div>
          </MotionReveal>
        </div>
      </BOSection>

      {/* ── Footer Attribution ── */}
      <BOSection
        background={BO.darkSubtle}
        style={{
          borderTop: `1px solid ${BO.border}`,
          padding: '32px 24px',
        }}
        noPad
      >
        <div
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: BO.textMuted,
            fontFamily: BO.font,
          }}
        >
          Built with{' '}
          <a
            href="https://thegtmos.ai"
            style={{ color: BO.textSecondary, textDecoration: 'none' }}
          >
            theGTMOS.ai
          </a>{' '}
          — the go-to-market operating system
        </div>
      </BOSection>
    </div>
  )
}
