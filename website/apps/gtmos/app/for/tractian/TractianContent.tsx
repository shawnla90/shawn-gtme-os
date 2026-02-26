'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
  MagneticHover,
} from '@shawnos/shared/components'

/* ── Tractian theme ──────────────────────────────── */

const TR = {
  green: '#00C853',
  greenLt: '#69F0AE',
  greenGlow: 'rgba(0, 200, 83, 0.10)',
  greenBorder: 'rgba(0, 200, 83, 0.25)',
  dark: '#090E0B',
  darkSubtle: '#0E1610',
  darkCard: '#141F18',
  border: '#1E3024',
  borderLt: '#2A4232',
  text: '#E0F0E4',
  textSecondary: '#9BB8A2',
  textMuted: '#5A7D62',
  white: '#F5FFF7',
  font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, 'Helvetica Neue', sans-serif",
} as const

/* ── data ────────────────────────────────────────── */

const stats = [
  { value: '5,548%', label: 'Revenue Growth' },
  { value: '$184M', label: 'Total Funding' },
  { value: '#24', label: 'Deloitte Fast 500' },
  { value: '526+', label: 'Team Members' },
  { value: '41', label: 'Open Roles' },
]

const challenges = [
  {
    icon: '01',
    title: 'Building a US Sales Machine from Scratch',
    desc: 'New CRO (Jan 2026), four new Regional Sales Directors in two months. The US org is being built in real-time  - they need pipeline infrastructure on day one, not month six.',
  },
  {
    icon: '02',
    title: 'Selling Hardware + Software to the Factory Floor',
    desc: 'IoT sensors + AI platform + asset management. Tractian\'s sale is multi-product and multi-persona  - maintenance managers, reliability engineers, plant directors. Each needs different messaging at different stages.',
  },
  {
    icon: '03',
    title: 'Scaling Outbound to Match 5,548% Revenue Growth',
    desc: 'The product has proven market fit with John Deere, P&G, Caterpillar, and Goodyear. Now the outbound motion needs to match the inbound momentum  - systematically reaching every manufacturing plant in North America.',
  },
  {
    icon: '04',
    title: 'Competing in the AI-Powered Maintenance Race',
    desc: 'MaintainX, UpKeep, Limble  - all going after the same maintenance budget. Tractian\'s hardware moat is real, but winning deals requires reaching decision-makers first with the right signal at the right time.',
  },
]

const deliverables = [
  {
    title: 'Manufacturing Signal Engine',
    desc: 'Detect buying triggers  - plant expansions, equipment failures, compliance changes, new facility announcements  - and auto-route them into personalized sequences for maintenance and reliability personas.',
    tags: ['Signals', 'Manufacturing', 'Automation'],
  },
  {
    title: 'AI Account Intelligence',
    desc: 'ZoomInfo + custom AI enrichment. Before an ADR touches a lead, they know the plant\'s equipment profile, current CMMS, maintenance headcount, and recent operational challenges.',
    tags: ['ZoomInfo', 'AI Research', 'Enrichment'],
  },
  {
    title: 'Multi-Persona Pipeline System',
    desc: 'Salesforce routing for maintenance managers, reliability engineers, and plant directors. Different scoring models, different sequences, different nurture tracks  - all automated.',
    tags: ['Salesforce', 'HubSpot', 'Routing'],
  },
  {
    title: 'ADR Enablement & Ramp',
    desc: 'AI-powered playbooks for each industry vertical  - food & beverage, chemicals, automotive, mining. Hardware + software objection handling. New ADRs ramped in weeks, not quarters.',
    tags: ['Playbooks', 'Training', 'AI Coaching'],
  },
]

const engagementSteps = [
  {
    title: 'Audit & Architecture',
    subtitle: 'Month 1',
    desc: 'Map your Salesforce, HubSpot, ZoomInfo, and outbound workflows. Identify the gaps between the Brazil-built playbook and what the US market requires. Design the target-state infrastructure for the new CRO\'s org.',
  },
  {
    title: 'Build & Deploy',
    subtitle: 'Month 2',
    desc: 'Manufacturing signal engine goes live. AI enrichment pipelines, outbound automation, Salesforce workflows  - all wired together. Industry-specific playbooks for every vertical Tractian sells into.',
  },
  {
    title: 'Enable & Transfer',
    subtitle: 'Month 3',
    desc: 'Train David, the Regional Sales Directors, and the ADR team to own the system. Documentation, runbooks, and hands-on coaching. The infrastructure runs independently as the team scales from 62 to 200+ sales reps.',
  },
]

const faqItems = [
  {
    question: 'How does the engagement start?',
    answer: 'A focused discovery session to map your current stack, workflows, and bottlenecks. I come prepared with research on Tractian\'s go-to-market, your competitive landscape, and manufacturing vertical dynamics  - the goal is to identify the highest-leverage automations within the first week.',
  },
  {
    question: 'What access do you need?',
    answer: 'Read access to Salesforce, HubSpot, and ZoomInfo to audit current workflows. Admin access to a sandbox environment for building and testing. Everything is documented and reversible.',
  },
  {
    question: 'How does pricing work?',
    answer: 'Fixed monthly rate for the 3-month engagement. No hourly billing, no scope creep surprises. The price reflects the value of infrastructure that compounds  - not hours logged.',
  },
  {
    question: 'Can we manage this independently after?',
    answer: 'That\'s the entire point. Month 3 is dedicated to enablement and transfer. Your team will have the knowledge, documentation, and confidence to run and iterate on everything that was built.',
  },
  {
    question: 'What makes this different from hiring an agency?',
    answer: 'Agencies optimize campaigns. I build infrastructure. The difference is compounding returns  - once the signal engine and enrichment layer are running, they improve your entire pipeline permanently, not just one campaign.',
  },
  {
    question: 'Does this work for our hardware + software sales motion?',
    answer: 'Specifically designed for it. Multi-product sales require multi-persona routing, different qualification criteria, and industry-specific messaging. The infrastructure handles all of it  - sensors, platform, and asset management as one coordinated motion.',
  },
]

/* ── scoped CSS ──────────────────────────────────── */

const scopedCSS = `
  .tr-page * {
    box-sizing: border-box;
  }
  .tr-page a {
    transition: opacity 0.15s ease;
  }
  .tr-page a:hover {
    opacity: 0.85;
  }
  .tr-stat-value {
    font-size: clamp(28px, 5vw, 44px);
    font-weight: 700;
    color: ${TR.green};
    line-height: 1;
  }
  .tr-stat-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${TR.textMuted};
    margin-top: 6px;
  }
  @media (max-width: 768px) {
    .tr-stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .tr-challenge-grid {
      grid-template-columns: 1fr !important;
    }
    .tr-deliverable-grid {
      grid-template-columns: 1fr !important;
    }
    .tr-hero-title {
      font-size: clamp(28px, 7vw, 48px) !important;
    }
  }
  @media (max-width: 480px) {
    .tr-stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 20px !important;
    }
  }
`

/* ── section wrapper ─────────────────────────────── */

function TRSection({
  children,
  background = TR.dark,
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
        color: TR.green,
        fontFamily: TR.font,
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
          color: TR.text,
          fontFamily: TR.font,
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
            color: TR.textSecondary,
            fontFamily: TR.font,
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

function TRAccordion({ items }: { items: typeof faqItems }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <MotionReveal key={i} variant="fadeUp" delay={i * 0.05}>
            <div
              style={{
                borderBottom: `1px solid ${TR.border}`,
                ...(i === 0 ? { borderTop: `1px solid ${TR.border}` } : {}),
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
                  fontFamily: TR.font,
                  fontSize: '16px',
                  color: TR.text,
                  textAlign: 'left',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ flex: 1, fontWeight: 500 }}>{item.question}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    color: TR.green,
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
                        borderLeft: `2px solid ${TR.green}`,
                        marginLeft: 0,
                        paddingLeft: 20,
                        fontSize: '15px',
                        lineHeight: 1.7,
                        color: TR.textSecondary,
                        fontFamily: TR.font,
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

export function TractianContent() {
  return (
    <div className="tr-page" style={{ fontFamily: TR.font }}>
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
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${TR.greenGlow}, ${TR.dark} 70%)`,
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
              background: TR.greenGlow,
              border: `1px solid ${TR.greenBorder}`,
              borderRadius: 20,
              fontSize: '13px',
              fontWeight: 500,
              color: TR.greenLt,
              fontFamily: TR.font,
              marginBottom: 32,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: TR.green }} />
            Custom Proposal
          </div>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.2}>
          <h1
            className="tr-hero-title"
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 700,
              fontFamily: TR.font,
              lineHeight: 1.1,
              margin: '0 0 24px',
              maxWidth: 800,
            }}
          >
            <span style={{ color: TR.white }}>Built for </span>
            <span style={{ color: TR.green }}>Tractian</span>
          </h1>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.35}>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: TR.textSecondary,
              fontFamily: TR.font,
              lineHeight: 1.6,
              maxWidth: 580,
              margin: '0 auto 48px',
            }}
          >
            AI-powered sales development infrastructure for the fastest-growing industrial AI company in the world.
            <br />
            Signal-based outbound. Manufacturing intelligence. Built for 5,548% growth.
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
                  fontFamily: TR.font,
                  color: '#fff',
                  background: TR.green,
                  border: `1px solid ${TR.green}`,
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
                  fontFamily: TR.font,
                  color: TR.green,
                  background: 'transparent',
                  border: `1px solid ${TR.greenBorder}`,
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
            color: TR.textMuted,
            fontSize: '24px',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          &#8964;
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <TRSection
        background={TR.darkSubtle}
        style={{
          borderTop: `1px solid ${TR.border}`,
          borderBottom: `1px solid ${TR.border}`,
          padding: '48px 24px',
        }}
        noPad
      >
        <div
          className="tr-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
            gap: 32,
            textAlign: 'center',
          }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div className="tr-stat-value">{s.value}</div>
              <div className="tr-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            textAlign: 'center',
            marginTop: 24,
            fontSize: '13px',
            color: TR.textMuted,
            fontFamily: TR.font,
          }}
        >
          We did our homework.
        </div>
      </TRSection>

      {/* ── Your Challenge ── */}
      <TRSection background={TR.dark}>
        <SectionLabel>The Challenge</SectionLabel>
        <SectionTitle subtitle="5,548% revenue growth, a brand-new US sales org, and a hardware+software sale that demands intelligent outbound. Tractian needs infrastructure, not just headcount.">
          What Keeps Revenue Leaders Up at Night
        </SectionTitle>

        <StaggerContainer stagger={0.1}>
          <div
            className="tr-challenge-grid"
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
                    background: TR.darkCard,
                    border: `1px solid ${TR.border}`,
                    borderRadius: 10,
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: TR.green,
                      fontFamily: TR.font,
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
                      color: TR.text,
                      fontFamily: TR.font,
                      marginBottom: 10,
                      lineHeight: 1.3,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: TR.textSecondary,
                      fontFamily: TR.font,
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
      </TRSection>

      {/* ── What I Build ── */}
      <TRSection background={TR.darkSubtle} style={{ scrollMarginTop: 80 }}>
        <div id="deliverables" style={{ position: 'absolute', marginTop: -100 }} />
        <SectionLabel>The Solution</SectionLabel>
        <SectionTitle subtitle="Four systems that integrate with your existing stack  - Salesforce, HubSpot, ZoomInfo  - and make every ADR across every manufacturing vertical 10x more effective.">
          What I Build for You
        </SectionTitle>

        <StaggerContainer stagger={0.12}>
          <div
            className="tr-deliverable-grid"
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
                    borderColor: TR.greenBorder,
                    scale: 1.01,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: '28px',
                    background: TR.darkCard,
                    border: `1px solid ${TR.border}`,
                    borderRadius: 10,
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: TR.text,
                      fontFamily: TR.font,
                      marginBottom: 10,
                    }}
                  >
                    {d.title}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: TR.textSecondary,
                      fontFamily: TR.font,
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
                          fontFamily: TR.font,
                          padding: '3px 10px',
                          borderRadius: 4,
                          background: TR.greenGlow,
                          color: TR.greenLt,
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
      </TRSection>

      {/* ── The Engagement ── */}
      <TRSection background={TR.dark} style={{ scrollMarginTop: 80 }}>
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
                background: `linear-gradient(to bottom, ${TR.green}, ${TR.greenBorder})`,
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
                      border: `2px solid ${TR.green}`,
                      background: TR.dark,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: TR.green,
                      fontFamily: TR.font,
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
                        color: TR.green,
                        fontFamily: TR.font,
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
                        color: TR.text,
                        fontFamily: TR.font,
                        marginBottom: 8,
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      style={{
                        fontSize: '15px',
                        color: TR.textSecondary,
                        fontFamily: TR.font,
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
      </TRSection>

      {/* ── The Meta Proof ── */}
      <TRSection
        background={TR.darkSubtle}
        style={{
          borderTop: `1px solid ${TR.border}`,
          borderBottom: `1px solid ${TR.border}`,
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
                color: TR.green,
                fontFamily: TR.font,
                marginBottom: 20,
              }}
            >
              The Proof of Concept
            </div>
            <h2
              style={{
                fontSize: 'clamp(24px, 4vw, 38px)',
                fontWeight: 700,
                color: TR.white,
                fontFamily: TR.font,
                lineHeight: 1.25,
                margin: '0 0 20px',
              }}
            >
              This page is the demo.
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: TR.textSecondary,
                fontFamily: TR.font,
                lineHeight: 1.7,
                margin: '0 0 12px',
              }}
            >
              Custom-branded to Tractian. Deeply researched  - your 5,548% revenue growth, your new US CRO,
              your Series C, your Oracle partnership, your Deloitte Fast 500 ranking. Built and deployed in a
              single session using the same AI infrastructure I&apos;d build for your team.
            </p>
            <p
              style={{
                fontSize: '17px',
                color: TR.text,
                fontFamily: TR.font,
                lineHeight: 1.7,
                fontWeight: 600,
              }}
            >
              Now imagine what 3 months of focused work delivers.
            </p>
          </MotionReveal>
        </div>
      </TRSection>

      {/* ── Your Stack, Amplified ── */}
      <TRSection background={TR.dark}>
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
              { name: 'HubSpot', role: 'Marketing & Nurture' },
              { name: 'ZoomInfo', role: 'Contact Intelligence' },
              { name: 'Snowflake', role: 'Data Warehouse' },
              { name: 'AI Layer', role: 'Signals & Enrichment' },
            ].map((tool) => (
              <StaggerItem key={tool.name}>
                <div
                  style={{
                    padding: '24px 20px',
                    background: TR.darkCard,
                    border: `1px solid ${TR.border}`,
                    borderRadius: 8,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: TR.text,
                      fontFamily: TR.font,
                      marginBottom: 4,
                    }}
                  >
                    {tool.name}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: TR.textMuted,
                      fontFamily: TR.font,
                    }}
                  >
                    {tool.role}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </TRSection>

      {/* ── FAQ ── */}
      <TRSection background={TR.darkSubtle}>
        <SectionLabel>FAQ</SectionLabel>
        <SectionTitle>Common Questions</SectionTitle>
        <TRAccordion items={faqItems} />
      </TRSection>

      {/* ── CTA ── */}
      <TRSection background={TR.dark}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <MotionReveal variant="fadeUp">
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 700,
                color: TR.white,
                fontFamily: TR.font,
                lineHeight: 1.2,
                margin: '0 0 16px',
              }}
            >
              Let&apos;s explore what&apos;s possible.
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: TR.textSecondary,
                fontFamily: TR.font,
                lineHeight: 1.6,
                margin: '0 0 36px',
              }}
            >
              Tractian is building the US sales machine right now. New CRO, new directors, new territory.
              Let&apos;s make sure they have the infrastructure to match the ambition.
            </p>
            <MagneticHover>
              <a
                href="mailto:shawn@leadalchemy.co?subject=Tractian%20%E2%80%94%20AI%20Sales%20Dev%20Infrastructure"
                style={{
                  display: 'inline-block',
                  padding: '16px 44px',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: TR.font,
                  color: '#fff',
                  background: TR.green,
                  border: `1px solid ${TR.green}`,
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
                color: TR.textMuted,
                fontFamily: TR.font,
              }}
            >
              shawn@leadalchemy.co
            </div>
          </MotionReveal>
        </div>
      </TRSection>

      {/* ── Footer Attribution ── */}
      <TRSection
        background={TR.darkSubtle}
        style={{
          borderTop: `1px solid ${TR.border}`,
          padding: '32px 24px',
        }}
        noPad
      >
        <div
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: TR.textMuted,
            fontFamily: TR.font,
          }}
        >
          Built with{' '}
          <a
            href="https://thegtmos.ai"
            style={{ color: TR.textSecondary, textDecoration: 'none' }}
          >
            theGTMOS.ai
          </a>{' '}
           - the go-to-market operating system
        </div>
      </TRSection>
    </div>
  )
}
