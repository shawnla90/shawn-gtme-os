'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
  MagneticHover,
} from '@shawnos/shared/components'

/* ── Clear Cove Partners theme ─────────────────── */

const CC = {
  blue: '#116DFF',
  blueLt: '#5A9AFF',
  blueGlow: 'rgba(17, 109, 255, 0.12)',
  blueBorder: 'rgba(17, 109, 255, 0.25)',
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

/* ── data ──────────────────────────────────────── */

const stats = [
  { value: 'SEC', label: 'Registered Adviser' },
  { value: '2020', label: 'MSLP Pioneer' },
  { value: 'NYC', label: 'Headquarters' },
  { value: 'Boutique', label: 'Partner-Led' },
]

const challenges = [
  {
    icon: '01',
    title: 'Sourcing Deal Flow Without a Sales Engine',
    desc: 'Boutique advisory firms live and die by relationships. But manually tracking referral networks, conferences, and warm intros leaves pipeline visibility at zero.',
  },
  {
    icon: '02',
    title: 'Scaling Borrower Outreach as MSLP Matures',
    desc: 'Thousands of MSLP borrowers need refinancing guidance. Reaching them at the right moment - before their loans mature - requires precision timing, not batch emails.',
  },
  {
    icon: '03',
    title: 'Positioning as the Category Expert',
    desc: 'You built the only dedicated MSLP Solutions coverage group in the country. But translating that authority into consistent inbound from borrowers and bank partners takes more than a press release.',
  },
  {
    icon: '04',
    title: 'Multiplying Partner Reach Without Adding Headcount',
    desc: 'A lean team means every partner is the rainmaker, the deal manager, and the closer. Automation should handle the research, outreach, and follow-up so you focus on the advisory work.',
  },
]

const deliverables = [
  {
    title: 'Deal Signal Engine',
    desc: 'Monitor MSLP maturity dates, bank portfolio shifts, and borrower financial triggers. Surface qualified opportunities before competitors know they exist.',
    tags: ['Signal Detection', 'MSLP Monitoring', 'Automation'],
  },
  {
    title: 'AI Research Layer',
    desc: 'Automated deep-dive on every prospective borrower and bank partner - financials, loan history, portfolio composition, leadership changes - delivered before first contact.',
    tags: ['AI Research', 'Enrichment', 'Due Diligence'],
  },
  {
    title: 'Pipeline Intelligence',
    desc: 'CRM automation built for advisory deal flow. Track every referral source, borrower conversation, and bank relationship with zero manual data entry.',
    tags: ['CRM', 'Deal Tracking', 'Analytics'],
  },
  {
    title: 'Authority & Outreach System',
    desc: 'Thought leadership distribution, targeted borrower outreach, and bank partner nurture sequences that position Clear Cove as the definitive MSLP advisory firm.',
    tags: ['Content', 'Outreach', 'Positioning'],
  },
]

const engagementSteps = [
  {
    title: 'Audit & Architecture',
    subtitle: 'Month 1',
    desc: 'Map your current deal sourcing, borrower pipeline, and bank partner relationships. Identify every manual touchpoint that should be automated. Design the target-state infrastructure.',
  },
  {
    title: 'Build & Deploy',
    subtitle: 'Month 2',
    desc: 'Signal detection, AI research pipelines, CRM automation, and outreach sequences go live. Wired together and tested against real borrower and bank partner data.',
  },
  {
    title: 'Enable & Transfer',
    subtitle: 'Month 3',
    desc: 'Train your team to own the system. Documentation, runbooks, and hands-on coaching. The infrastructure runs independently after handoff - no ongoing dependency.',
  },
]

const faqItems = [
  {
    question: 'How does the engagement start?',
    answer: 'A focused discovery session to map your current deal sourcing, borrower pipeline, and bank partner network. I come prepared with research on your MSLP positioning and competitive landscape - the goal is to identify the highest-leverage automations within the first week.',
  },
  {
    question: 'What access do you need?',
    answer: 'Read access to your CRM and any existing outreach tools to audit current workflows. A walkthrough of your deal process and borrower qualification criteria. Everything is documented and reversible.',
  },
  {
    question: 'How does pricing work?',
    answer: 'Fixed monthly rate for the 3-month engagement. No hourly billing, no scope creep surprises. The price reflects the value of infrastructure that compounds - not hours logged.',
  },
  {
    question: 'Can we manage this independently after?',
    answer: 'That\u0027s the entire point. Month 3 is dedicated to enablement and transfer. Your team will have the knowledge, documentation, and confidence to run and iterate on everything that was built.',
  },
  {
    question: 'What makes this different from a marketing agency?',
    answer: 'Agencies run campaigns. I build infrastructure. The difference is compounding returns - once the signal engine and research layer are running, they improve your entire deal pipeline permanently, not just one outreach sequence.',
  },
  {
    question: 'Do you work with other financial advisory firms?',
    answer: 'I specialize in go-to-market infrastructure for firms where the product is expertise. Financial advisory, professional services, and B2B companies where trust and positioning drive revenue. The systems are adapted to your specific deal motion.',
  },
]

/* ── scoped CSS ────────────────────────────────── */

const scopedCSS = `
  .cc-page * {
    box-sizing: border-box;
  }
  .cc-page a {
    transition: opacity 0.15s ease;
  }
  .cc-page a:hover {
    opacity: 0.85;
  }
  .cc-stat-value {
    font-size: clamp(24px, 4vw, 36px);
    font-weight: 700;
    color: ${CC.blue};
    line-height: 1;
  }
  .cc-stat-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${CC.textMuted};
    margin-top: 6px;
  }
  @media (max-width: 768px) {
    .cc-stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .cc-challenge-grid {
      grid-template-columns: 1fr !important;
    }
    .cc-deliverable-grid {
      grid-template-columns: 1fr !important;
    }
    .cc-hero-title {
      font-size: clamp(28px, 7vw, 48px) !important;
    }
  }
  @media (max-width: 480px) {
    .cc-stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 20px !important;
    }
  }
`

/* ── section wrapper ───────────────────────────── */

function CCSection({
  children,
  background = CC.dark,
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

/* ── section headline ──────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: CC.blue,
        fontFamily: CC.font,
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
          color: CC.text,
          fontFamily: CC.font,
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
            color: CC.textSecondary,
            fontFamily: CC.font,
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

/* ── FAQ accordion ─────────────────────────────── */

function CCAccordion({ items }: { items: typeof faqItems }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <MotionReveal key={i} variant="fadeUp" delay={i * 0.05}>
            <div
              style={{
                borderBottom: `1px solid ${CC.border}`,
                ...(i === 0 ? { borderTop: `1px solid ${CC.border}` } : {}),
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
                  fontFamily: CC.font,
                  fontSize: '16px',
                  color: CC.text,
                  textAlign: 'left',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ flex: 1, fontWeight: 500 }}>{item.question}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    color: CC.blue,
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
                        borderLeft: `2px solid ${CC.blue}`,
                        marginLeft: 0,
                        paddingLeft: 20,
                        fontSize: '15px',
                        lineHeight: 1.7,
                        color: CC.textSecondary,
                        fontFamily: CC.font,
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

/* ── main component ────────────────────────────── */

export function ClearCoveContent() {
  return (
    <div className="cc-page" style={{ fontFamily: CC.font }}>
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
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${CC.blueGlow}, ${CC.dark} 70%)`,
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
              background: CC.blueGlow,
              border: `1px solid ${CC.blueBorder}`,
              borderRadius: 20,
              fontSize: '13px',
              fontWeight: 500,
              color: CC.blueLt,
              fontFamily: CC.font,
              marginBottom: 32,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: CC.blue }} />
            Custom Proposal
          </div>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.2}>
          <h1
            className="cc-hero-title"
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 700,
              fontFamily: CC.font,
              lineHeight: 1.1,
              margin: '0 0 24px',
              maxWidth: 800,
            }}
          >
            <span style={{ color: CC.white }}>Built for </span>
            <span style={{ color: CC.blue }}>Clear Cove Partners</span>
          </h1>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.35}>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: CC.textSecondary,
              fontFamily: CC.font,
              lineHeight: 1.6,
              maxWidth: 580,
              margin: '0 auto 48px',
            }}
          >
            AI-powered deal sourcing and GTM infrastructure for
            <br />
            debt capital markets advisory.
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
                  fontFamily: CC.font,
                  color: '#fff',
                  background: CC.blue,
                  border: `1px solid ${CC.blue}`,
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
                  fontFamily: CC.font,
                  color: CC.blue,
                  background: 'transparent',
                  border: `1px solid ${CC.blueBorder}`,
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
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            color: CC.textMuted,
            fontSize: '24px',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          &#8964;
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <CCSection
        background={CC.darkSubtle}
        style={{
          borderTop: `1px solid ${CC.border}`,
          borderBottom: `1px solid ${CC.border}`,
          padding: '48px 24px',
        }}
        noPad
      >
        <div
          className="cc-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
            gap: 32,
            textAlign: 'center',
          }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div className="cc-stat-value">{s.value}</div>
              <div className="cc-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            textAlign: 'center',
            marginTop: 24,
            fontSize: '13px',
            color: CC.textMuted,
            fontFamily: CC.font,
          }}
        >
          We did our homework.
        </div>
      </CCSection>

      {/* ── The Challenge ── */}
      <CCSection background={CC.dark}>
        <SectionLabel>The Challenge</SectionLabel>
        <SectionTitle subtitle="Scaling an advisory practice in debt capital markets requires deal flow infrastructure - not just a bigger Rolodex.">
          What Keeps Advisory Partners Up at Night
        </SectionTitle>

        <StaggerContainer stagger={0.1}>
          <div
            className="cc-challenge-grid"
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
                    background: CC.darkCard,
                    border: `1px solid ${CC.border}`,
                    borderRadius: 10,
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: CC.blue,
                      fontFamily: CC.font,
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
                      color: CC.text,
                      fontFamily: CC.font,
                      marginBottom: 10,
                      lineHeight: 1.3,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: CC.textSecondary,
                      fontFamily: CC.font,
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
      </CCSection>

      {/* ── What I Build ── */}
      <CCSection background={CC.darkSubtle} style={{ scrollMarginTop: 80 }}>
        <div id="deliverables" style={{ position: 'absolute', marginTop: -100 }} />
        <SectionLabel>The Solution</SectionLabel>
        <SectionTitle subtitle="Four systems that integrate with your existing workflows and multiply every partner's deal capacity.">
          What I Build for You
        </SectionTitle>

        <StaggerContainer stagger={0.12}>
          <div
            className="cc-deliverable-grid"
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
                    borderColor: CC.blueBorder,
                    scale: 1.01,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: '28px',
                    background: CC.darkCard,
                    border: `1px solid ${CC.border}`,
                    borderRadius: 10,
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: CC.text,
                      fontFamily: CC.font,
                      marginBottom: 10,
                    }}
                  >
                    {d.title}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: CC.textSecondary,
                      fontFamily: CC.font,
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
                          fontFamily: CC.font,
                          padding: '3px 10px',
                          borderRadius: 4,
                          background: CC.blueGlow,
                          color: CC.blueLt,
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
      </CCSection>

      {/* ── The Engagement ── */}
      <CCSection background={CC.dark} style={{ scrollMarginTop: 80 }}>
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
                background: `linear-gradient(to bottom, ${CC.blue}, ${CC.blueBorder})`,
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
                      border: `2px solid ${CC.blue}`,
                      background: CC.dark,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: CC.blue,
                      fontFamily: CC.font,
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
                        color: CC.blue,
                        fontFamily: CC.font,
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
                        color: CC.text,
                        fontFamily: CC.font,
                        marginBottom: 8,
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      style={{
                        fontSize: '15px',
                        color: CC.textSecondary,
                        fontFamily: CC.font,
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
      </CCSection>

      {/* ── The Meta Proof ── */}
      <CCSection
        background={CC.darkSubtle}
        style={{
          borderTop: `1px solid ${CC.border}`,
          borderBottom: `1px solid ${CC.border}`,
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
                color: CC.blue,
                fontFamily: CC.font,
                marginBottom: 20,
              }}
            >
              The Proof of Concept
            </div>
            <h2
              style={{
                fontSize: 'clamp(24px, 4vw, 38px)',
                fontWeight: 700,
                color: CC.white,
                fontFamily: CC.font,
                lineHeight: 1.25,
                margin: '0 0 20px',
              }}
            >
              This page is the demo.
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: CC.textSecondary,
                fontFamily: CC.font,
                lineHeight: 1.7,
                margin: '0 0 12px',
              }}
            >
              Custom-branded to your firm. Deeply researched - your SEC registration,
              your MSLP expertise, your team&apos;s pedigree. Built and deployed in a single session
              using the same AI infrastructure I&apos;d build for your deal pipeline.
            </p>
            <p
              style={{
                fontSize: '17px',
                color: CC.text,
                fontFamily: CC.font,
                lineHeight: 1.7,
                fontWeight: 600,
              }}
            >
              Now imagine what 3 months of focused work delivers.
            </p>
          </MotionReveal>
        </div>
      </CCSection>

      {/* ── Stack Integration ── */}
      <CCSection background={CC.dark}>
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
              { name: 'CRM', role: 'Pipeline & Relationships' },
              { name: 'AI Research', role: 'Borrower Intelligence' },
              { name: 'Signal Engine', role: 'Trigger Detection' },
              { name: 'Outreach', role: 'Sequences & Nurture' },
              { name: 'Analytics', role: 'Deal Flow Insights' },
            ].map((tool) => (
              <StaggerItem key={tool.name}>
                <div
                  style={{
                    padding: '24px 20px',
                    background: CC.darkCard,
                    border: `1px solid ${CC.border}`,
                    borderRadius: 8,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: CC.text,
                      fontFamily: CC.font,
                      marginBottom: 4,
                    }}
                  >
                    {tool.name}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: CC.textMuted,
                      fontFamily: CC.font,
                    }}
                  >
                    {tool.role}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </CCSection>

      {/* ── FAQ ── */}
      <CCSection background={CC.darkSubtle}>
        <SectionLabel>FAQ</SectionLabel>
        <SectionTitle>Common Questions</SectionTitle>
        <CCAccordion items={faqItems} />
      </CCSection>

      {/* ── CTA ── */}
      <CCSection background={CC.dark}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <MotionReveal variant="fadeUp">
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 700,
                color: CC.white,
                fontFamily: CC.font,
                lineHeight: 1.2,
                margin: '0 0 16px',
              }}
            >
              Let&apos;s explore what&apos;s possible.
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: CC.textSecondary,
                fontFamily: CC.font,
                lineHeight: 1.6,
                margin: '0 0 36px',
              }}
            >
              The infrastructure scales. The deal flow compounds.
              Let&apos;s talk about building it for Clear Cove Partners.
            </p>
            <MagneticHover>
              <a
                href="mailto:shawn@leadalchemy.co?subject=Clear%20Cove%20Partners%20%E2%80%94%20GTM%20Infrastructure"
                style={{
                  display: 'inline-block',
                  padding: '16px 44px',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: CC.font,
                  color: '#fff',
                  background: CC.blue,
                  border: `1px solid ${CC.blue}`,
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
                color: CC.textMuted,
                fontFamily: CC.font,
              }}
            >
              shawn@leadalchemy.co
            </div>
          </MotionReveal>
        </div>
      </CCSection>

      {/* ── Footer Attribution ── */}
      <CCSection
        background={CC.darkSubtle}
        style={{
          borderTop: `1px solid ${CC.border}`,
          padding: '32px 24px',
        }}
        noPad
      >
        <div
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: CC.textMuted,
            fontFamily: CC.font,
          }}
        >
          Built with{' '}
          <a
            href="https://thegtmos.ai"
            style={{ color: CC.textSecondary, textDecoration: 'none' }}
          >
            theGTMOS.ai
          </a>{' '}
          - the go-to-market operating system
        </div>
      </CCSection>
    </div>
  )
}
