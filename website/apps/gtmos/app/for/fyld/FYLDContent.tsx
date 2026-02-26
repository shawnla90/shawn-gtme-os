'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
  MagneticHover,
} from '../../components/motion'

/* ── FYLD theme ──────────────────────────────────── */

const FY = {
  teal: '#00B4D8',
  tealLt: '#48CAE4',
  tealGlow: 'rgba(0, 180, 216, 0.10)',
  tealBorder: 'rgba(0, 180, 216, 0.25)',
  dark: '#080C10',
  darkSubtle: '#0C1218',
  darkCard: '#121A24',
  border: '#1C2A38',
  borderLt: '#283A4C',
  text: '#DEE8F0',
  textSecondary: '#8FA8BA',
  textMuted: '#546878',
  white: '#F2F8FC',
  font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, 'Helvetica Neue', sans-serif",
} as const

/* ── data ────────────────────────────────────────── */

const stats = [
  { value: '$41M', label: 'Series B (Feb 2026)' },
  { value: '$44M', label: 'Total Funding' },
  { value: '51', label: 'Team Members' },
  { value: '7', label: 'Countries' },
  { value: '4.6/5', label: 'Glassdoor Rating' },
]

const challenges = [
  {
    icon: '01',
    title: 'Breaking Into the US Market at Scale',
    desc: 'New VP of US Utilities (Brett Stein), new Houston presence. FYLD\'s UK traction is proven — now the challenge is replicating that growth in a completely different regulatory and utility landscape.',
  },
  {
    icon: '02',
    title: 'Selling AI to Infrastructure Enterprises',
    desc: 'Utilities and heavy civils are notoriously slow to adopt new technology. The buying cycle is long, the stakeholders are many, and the proof requirements are high. Your outbound needs to speak their language from first touch.',
  },
  {
    icon: '03',
    title: 'Scaling Beyond 51 People Without Losing Quality',
    desc: 'FYLD\'s Glassdoor rating is 4.6/5. That\'s rare. As you scale with fresh Series B capital, every new hire — especially in sales — needs to match the culture and quality bar while moving fast.',
  },
  {
    icon: '04',
    title: 'Competing Against Larger Incumbents',
    desc: 'TotalMobile, Samsara, even ServiceTitan are adjacent. FYLD\'s AI-powered frontline intelligence is differentiated — but only if prospects understand the difference before they default to the bigger brand.',
  },
]

const deliverables = [
  {
    title: 'Infrastructure Signal Engine',
    desc: 'Detect buying triggers — new utility capital projects, grid modernization RFPs, safety incidents, regulatory changes — and auto-route them into personalized sequences for operations and safety personas.',
    tags: ['Signals', 'Utilities', 'Automation'],
  },
  {
    title: 'AI Account Intelligence',
    desc: 'Enrich every target account with utility-specific data — service territory, regulatory environment, workforce size, current field tech stack, recent capital plans, and safety record.',
    tags: ['AI Research', 'Enrichment', 'Utilities'],
  },
  {
    title: 'US Market Pipeline System',
    desc: 'HubSpot automation, lead scoring calibrated for US utilities and heavy civils, persona routing for operations directors, safety leads, and field managers. Every inbound and outbound lead handled in seconds.',
    tags: ['HubSpot', 'Scoring', 'Routing'],
  },
  {
    title: 'Sales Enablement & Playbooks',
    desc: 'AI-powered playbooks for utilities, heavy civils, and energy verticals. US-market objection handling, compliance-aware messaging, and ROI frameworks based on FYLD\'s proven metrics — 10,400 fieldworker hours saved, 20% incident reduction.',
    tags: ['Playbooks', 'Training', 'AI Coaching'],
  },
]

const engagementSteps = [
  {
    title: 'Audit & Architecture',
    subtitle: 'Month 1',
    desc: 'Map your HubSpot, outbound, and data workflows. Audit the UK playbook and identify what translates to the US market vs. what needs rebuilding. Design the target-state infrastructure for Brett\'s US org.',
  },
  {
    title: 'Build & Deploy',
    subtitle: 'Month 2',
    desc: 'Infrastructure signal engine goes live. AI enrichment pipelines, outbound automation, HubSpot workflows — all wired together. US-specific playbooks for utilities, heavy civils, and energy.',
  },
  {
    title: 'Enable & Transfer',
    subtitle: 'Month 3',
    desc: 'Train Brett, Philippa, and the expanding team to own the system. Documentation, runbooks, and hands-on coaching. The infrastructure runs independently as FYLD scales from 51 to 100+ people.',
  },
]

const faqItems = [
  {
    question: 'How does the engagement start?',
    answer: 'A focused discovery session to map your current stack, workflows, and bottlenecks. I come prepared with research on FYLD\'s go-to-market, the US utility landscape, and your competitive positioning — the goal is to identify the highest-leverage automations within the first week.',
  },
  {
    question: 'What access do you need?',
    answer: 'Read access to HubSpot and any existing outbound tools to audit current workflows. Admin access to a sandbox environment for building and testing. Everything is documented and reversible.',
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
    question: 'What makes this different from hiring an agency?',
    answer: 'Agencies optimize campaigns. I build infrastructure. The difference is compounding returns — once the signal engine and enrichment layer are running, they improve your entire pipeline permanently, not just one campaign.',
  },
  {
    question: 'Can this support both UK and US markets?',
    answer: 'The infrastructure is designed for multi-market scale. Signal routing, playbooks, and enrichment work across geographies — with market-specific customization for regulatory environments, buyer personas, and competitive landscapes.',
  },
]

/* ── scoped CSS ──────────────────────────────────── */

const scopedCSS = `
  .fy-page * {
    box-sizing: border-box;
  }
  .fy-page a {
    transition: opacity 0.15s ease;
  }
  .fy-page a:hover {
    opacity: 0.85;
  }
  .fy-stat-value {
    font-size: clamp(28px, 5vw, 44px);
    font-weight: 700;
    color: ${FY.teal};
    line-height: 1;
  }
  .fy-stat-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${FY.textMuted};
    margin-top: 6px;
  }
  @media (max-width: 768px) {
    .fy-stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .fy-challenge-grid {
      grid-template-columns: 1fr !important;
    }
    .fy-deliverable-grid {
      grid-template-columns: 1fr !important;
    }
    .fy-hero-title {
      font-size: clamp(28px, 7vw, 48px) !important;
    }
  }
  @media (max-width: 480px) {
    .fy-stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 20px !important;
    }
  }
`

/* ── section wrapper ─────────────────────────────── */

function FYSection({
  children,
  background = FY.dark,
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
        color: FY.teal,
        fontFamily: FY.font,
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
          color: FY.text,
          fontFamily: FY.font,
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
            color: FY.textSecondary,
            fontFamily: FY.font,
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

function FYAccordion({ items }: { items: typeof faqItems }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <MotionReveal key={i} variant="fadeUp" delay={i * 0.05}>
            <div
              style={{
                borderBottom: `1px solid ${FY.border}`,
                ...(i === 0 ? { borderTop: `1px solid ${FY.border}` } : {}),
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
                  fontFamily: FY.font,
                  fontSize: '16px',
                  color: FY.text,
                  textAlign: 'left',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ flex: 1, fontWeight: 500 }}>{item.question}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    color: FY.teal,
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
                        borderLeft: `2px solid ${FY.teal}`,
                        marginLeft: 0,
                        paddingLeft: 20,
                        fontSize: '15px',
                        lineHeight: 1.7,
                        color: FY.textSecondary,
                        fontFamily: FY.font,
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

export function FYLDContent() {
  return (
    <div className="fy-page" style={{ fontFamily: FY.font }}>
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
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${FY.tealGlow}, ${FY.dark} 70%)`,
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
              background: FY.tealGlow,
              border: `1px solid ${FY.tealBorder}`,
              borderRadius: 20,
              fontSize: '13px',
              fontWeight: 500,
              color: FY.tealLt,
              fontFamily: FY.font,
              marginBottom: 32,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: FY.teal }} />
            Custom Proposal
          </div>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.2}>
          <h1
            className="fy-hero-title"
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 700,
              fontFamily: FY.font,
              lineHeight: 1.1,
              margin: '0 0 24px',
              maxWidth: 800,
            }}
          >
            <span style={{ color: FY.white }}>Built for </span>
            <span style={{ color: FY.teal }}>FYLD</span>
          </h1>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.35}>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: FY.textSecondary,
              fontFamily: FY.font,
              lineHeight: 1.6,
              maxWidth: 580,
              margin: '0 auto 48px',
            }}
          >
            AI-powered sales development infrastructure for the frontline intelligence platform.
            <br />
            Signal-based outbound. Utility-grade research. Built for US market expansion.
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
                  fontFamily: FY.font,
                  color: '#fff',
                  background: FY.teal,
                  border: `1px solid ${FY.teal}`,
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
                  fontFamily: FY.font,
                  color: FY.teal,
                  background: 'transparent',
                  border: `1px solid ${FY.tealBorder}`,
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
            color: FY.textMuted,
            fontSize: '24px',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          &#8964;
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <FYSection
        background={FY.darkSubtle}
        style={{
          borderTop: `1px solid ${FY.border}`,
          borderBottom: `1px solid ${FY.border}`,
          padding: '48px 24px',
        }}
        noPad
      >
        <div
          className="fy-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
            gap: 32,
            textAlign: 'center',
          }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div className="fy-stat-value">{s.value}</div>
              <div className="fy-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            textAlign: 'center',
            marginTop: 24,
            fontSize: '13px',
            color: FY.textMuted,
            fontFamily: FY.font,
          }}
        >
          We did our homework.
        </div>
      </FYSection>

      {/* ── Your Challenge ── */}
      <FYSection background={FY.dark}>
        <SectionLabel>The Challenge</SectionLabel>
        <SectionTitle subtitle="Fresh $41M Series B, US market expansion underway, and a product that saves utilities millions. FYLD needs outbound infrastructure that matches the ambition.">
          What Keeps Growth Leaders Up at Night
        </SectionTitle>

        <StaggerContainer stagger={0.1}>
          <div
            className="fy-challenge-grid"
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
                    background: FY.darkCard,
                    border: `1px solid ${FY.border}`,
                    borderRadius: 10,
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: FY.teal,
                      fontFamily: FY.font,
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
                      color: FY.text,
                      fontFamily: FY.font,
                      marginBottom: 10,
                      lineHeight: 1.3,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: FY.textSecondary,
                      fontFamily: FY.font,
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
      </FYSection>

      {/* ── What I Build ── */}
      <FYSection background={FY.darkSubtle} style={{ scrollMarginTop: 80 }}>
        <div id="deliverables" style={{ position: 'absolute', marginTop: -100 }} />
        <SectionLabel>The Solution</SectionLabel>
        <SectionTitle subtitle="Four systems that integrate with your existing stack — HubSpot, Snowflake, Tableau — and give every sales rep utility-grade intelligence on every account.">
          What I Build for You
        </SectionTitle>

        <StaggerContainer stagger={0.12}>
          <div
            className="fy-deliverable-grid"
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
                    borderColor: FY.tealBorder,
                    scale: 1.01,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: '28px',
                    background: FY.darkCard,
                    border: `1px solid ${FY.border}`,
                    borderRadius: 10,
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: FY.text,
                      fontFamily: FY.font,
                      marginBottom: 10,
                    }}
                  >
                    {d.title}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: FY.textSecondary,
                      fontFamily: FY.font,
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
                          fontFamily: FY.font,
                          padding: '3px 10px',
                          borderRadius: 4,
                          background: FY.tealGlow,
                          color: FY.tealLt,
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
      </FYSection>

      {/* ── The Engagement ── */}
      <FYSection background={FY.dark} style={{ scrollMarginTop: 80 }}>
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
                background: `linear-gradient(to bottom, ${FY.teal}, ${FY.tealBorder})`,
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
                      border: `2px solid ${FY.teal}`,
                      background: FY.dark,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: FY.teal,
                      fontFamily: FY.font,
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
                        color: FY.teal,
                        fontFamily: FY.font,
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
                        color: FY.text,
                        fontFamily: FY.font,
                        marginBottom: 8,
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      style={{
                        fontSize: '15px',
                        color: FY.textSecondary,
                        fontFamily: FY.font,
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
      </FYSection>

      {/* ── The Meta Proof ── */}
      <FYSection
        background={FY.darkSubtle}
        style={{
          borderTop: `1px solid ${FY.border}`,
          borderBottom: `1px solid ${FY.border}`,
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
                color: FY.teal,
                fontFamily: FY.font,
                marginBottom: 20,
              }}
            >
              The Proof of Concept
            </div>
            <h2
              style={{
                fontSize: 'clamp(24px, 4vw, 38px)',
                fontWeight: 700,
                color: FY.white,
                fontFamily: FY.font,
                lineHeight: 1.25,
                margin: '0 0 20px',
              }}
            >
              This page is the demo.
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: FY.textSecondary,
                fontFamily: FY.font,
                lineHeight: 1.7,
                margin: '0 0 12px',
              }}
            >
              Custom-branded to FYLD. Deeply researched — your $41M Series B, your US expansion,
              your 10,400 fieldworker hours saved metric, your 20% incident reduction. Built and deployed
              in a single session using the same AI infrastructure I&apos;d build for your team.
            </p>
            <p
              style={{
                fontSize: '17px',
                color: FY.text,
                fontFamily: FY.font,
                lineHeight: 1.7,
                fontWeight: 600,
              }}
            >
              Now imagine what 3 months of focused work delivers.
            </p>
          </MotionReveal>
        </div>
      </FYSection>

      {/* ── Your Stack, Amplified ── */}
      <FYSection background={FY.dark}>
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
              { name: 'HubSpot', role: 'CRM & Pipeline' },
              { name: 'Snowflake', role: 'Data Warehouse' },
              { name: 'Tableau', role: 'Analytics & Reporting' },
              { name: 'Intercom', role: 'Customer Comms' },
              { name: 'AI Layer', role: 'Signals & Enrichment' },
            ].map((tool) => (
              <StaggerItem key={tool.name}>
                <div
                  style={{
                    padding: '24px 20px',
                    background: FY.darkCard,
                    border: `1px solid ${FY.border}`,
                    borderRadius: 8,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: FY.text,
                      fontFamily: FY.font,
                      marginBottom: 4,
                    }}
                  >
                    {tool.name}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: FY.textMuted,
                      fontFamily: FY.font,
                    }}
                  >
                    {tool.role}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </FYSection>

      {/* ── FAQ ── */}
      <FYSection background={FY.darkSubtle}>
        <SectionLabel>FAQ</SectionLabel>
        <SectionTitle>Common Questions</SectionTitle>
        <FYAccordion items={faqItems} />
      </FYSection>

      {/* ── CTA ── */}
      <FYSection background={FY.dark}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <MotionReveal variant="fadeUp">
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 700,
                color: FY.white,
                fontFamily: FY.font,
                lineHeight: 1.2,
                margin: '0 0 16px',
              }}
            >
              Let&apos;s explore what&apos;s possible.
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: FY.textSecondary,
                fontFamily: FY.font,
                lineHeight: 1.6,
                margin: '0 0 36px',
              }}
            >
              FYLD just closed $41M to scale into the US. The product saves utilities millions.
              Let&apos;s build the outbound infrastructure to match.
            </p>
            <MagneticHover>
              <a
                href="mailto:shawn@leadalchemy.co?subject=FYLD%20%E2%80%94%20AI%20Sales%20Dev%20Infrastructure"
                style={{
                  display: 'inline-block',
                  padding: '16px 44px',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: FY.font,
                  color: '#fff',
                  background: FY.teal,
                  border: `1px solid ${FY.teal}`,
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
                color: FY.textMuted,
                fontFamily: FY.font,
              }}
            >
              shawn@leadalchemy.co
            </div>
          </MotionReveal>
        </div>
      </FYSection>

      {/* ── Footer Attribution ── */}
      <FYSection
        background={FY.darkSubtle}
        style={{
          borderTop: `1px solid ${FY.border}`,
          padding: '32px 24px',
        }}
        noPad
      >
        <div
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: FY.textMuted,
            fontFamily: FY.font,
          }}
        >
          Built with{' '}
          <a
            href="https://thegtmos.ai"
            style={{ color: FY.textSecondary, textDecoration: 'none' }}
          >
            theGTMOS.ai
          </a>{' '}
          — the go-to-market operating system
        </div>
      </FYSection>
    </div>
  )
}
