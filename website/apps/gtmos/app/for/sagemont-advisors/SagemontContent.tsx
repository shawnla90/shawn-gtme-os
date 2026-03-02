'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
  MagneticHover,
} from '@shawnos/shared/components'

/* -- Sagemont Advisors theme -- */

const SA = {
  green: '#0D9668',
  greenLt: '#34D399',
  greenGlow: 'rgba(13, 150, 104, 0.12)',
  greenBorder: 'rgba(13, 150, 104, 0.25)',
  dark: '#0A0F1C',
  darkSubtle: '#0C1320',
  darkCard: '#111827',
  border: '#1C2640',
  borderLt: '#253352',
  text: '#E2E8F0',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  white: '#F8FAFC',
  font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, 'Helvetica Neue', sans-serif",
} as const

/* -- data -- */

const stats = [
  { value: '$1B+', label: 'Credits Substantiated' },
  { value: '2,500+', label: 'Organizations Served' },
  { value: 'A&M / EY', label: 'Leadership Pedigree' },
  { value: 'FL', label: 'Fort Lauderdale HQ' },
]

const challenges = [
  {
    icon: '01',
    title: 'Scaling Beyond ERC Into New Credit Verticals',
    desc: 'The ERC wave built the engine. But R&D credits, WOTC, and tax controversy require different client profiles, different messaging, and different acquisition motions - all at once.',
  },
  {
    icon: '02',
    title: 'Reaching Eligible Businesses Before Competitors',
    desc: 'Thousands of mid-market businesses are leaving R&D credits and WOTC money on the table. Finding them at the right moment - before a competitor does - requires signal detection, not cold outreach.',
  },
  {
    icon: '03',
    title: 'Converting Thought Leadership Into Pipeline',
    desc: 'Your team publishes in Forbes, WSJ, and Bloomberg. That authority should generate inbound. But translating media credibility into qualified client conversations takes infrastructure, not just content.',
  },
  {
    icon: '04',
    title: 'Multiplying Revenue Per Rep Without Adding Headcount',
    desc: 'A 30+ person org with a dedicated sales team needs every rep operating at peak efficiency. Automation should handle research, qualification, and follow-up so reps focus on closing.',
  },
]

const deliverables = [
  {
    title: 'Client Signal Engine',
    desc: 'Monitor IRS filing patterns, industry shifts, and business triggers that indicate tax credit eligibility. Surface qualified prospects before they start searching for help.',
    tags: ['Signal Detection', 'Tax Credit Intel', 'Automation'],
  },
  {
    title: 'AI Research Layer',
    desc: 'Automated deep-dive on every prospect - revenue size, R&D activity, hiring patterns, existing credit claims - delivered to reps before first contact.',
    tags: ['AI Research', 'Enrichment', 'Qualification'],
  },
  {
    title: 'Pipeline Intelligence',
    desc: 'CRM automation built for multi-service tax advisory. Track every client across ERC, R&D, WOTC, and controversy engagements with zero manual data entry.',
    tags: ['CRM', 'Multi-Service', 'Analytics'],
  },
  {
    title: 'Authority Distribution System',
    desc: 'Turn Forbes and WSJ thought leadership into targeted nurture sequences. Position Sagemont as the definitive tax credit advisory firm across every channel that matters.',
    tags: ['Content', 'Distribution', 'Positioning'],
  },
]

const engagementSteps = [
  {
    title: 'Audit & Architecture',
    subtitle: 'Month 1',
    desc: 'Map your current client acquisition, sales operations, and multi-service pipeline. Identify every manual touchpoint that should be automated. Design the target-state infrastructure.',
  },
  {
    title: 'Build & Deploy',
    subtitle: 'Month 2',
    desc: 'Signal detection, AI research pipelines, CRM automation, and outreach sequences go live. Wired together and tested against real prospect data across all credit verticals.',
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
    answer: 'A focused discovery session to map your current client acquisition, sales pipeline, and multi-service delivery model. I come prepared with research on your market positioning and competitive landscape - the goal is to identify the highest-leverage automations within the first week.',
  },
  {
    question: 'What access do you need?',
    answer: 'Read access to your CRM and any existing outreach tools to audit current workflows. A walkthrough of your sales process and client qualification criteria across each service line. Everything is documented and reversible.',
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
    answer: 'Agencies run campaigns. I build infrastructure. The difference is compounding returns - once the signal engine and research layer are running, they improve your entire client pipeline permanently, not just one outreach sequence.',
  },
  {
    question: 'Do you work with other tax advisory firms?',
    answer: 'I specialize in go-to-market infrastructure for firms where the product is expertise. Tax advisory, professional services, and B2B companies where trust and positioning drive revenue. The systems are adapted to your specific sales motion and service mix.',
  },
]

/* -- scoped CSS -- */

const scopedCSS = `
  .sa-page * {
    box-sizing: border-box;
  }
  .sa-page a {
    transition: opacity 0.15s ease;
  }
  .sa-page a:hover {
    opacity: 0.85;
  }
  .sa-stat-value {
    font-size: clamp(24px, 4vw, 36px);
    font-weight: 700;
    color: ${SA.green};
    line-height: 1;
  }
  .sa-stat-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${SA.textMuted};
    margin-top: 6px;
  }
  @media (max-width: 768px) {
    .sa-stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .sa-challenge-grid {
      grid-template-columns: 1fr !important;
    }
    .sa-deliverable-grid {
      grid-template-columns: 1fr !important;
    }
    .sa-hero-title {
      font-size: clamp(28px, 7vw, 48px) !important;
    }
  }
  @media (max-width: 480px) {
    .sa-stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 20px !important;
    }
  }
`

/* -- section wrapper -- */

function SASection({
  children,
  background = SA.dark,
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

/* -- section headline -- */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: SA.green,
        fontFamily: SA.font,
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
          color: SA.text,
          fontFamily: SA.font,
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
            color: SA.textSecondary,
            fontFamily: SA.font,
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

/* -- FAQ accordion -- */

function SAAccordion({ items }: { items: typeof faqItems }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <MotionReveal key={i} variant="fadeUp" delay={i * 0.05}>
            <div
              style={{
                borderBottom: `1px solid ${SA.border}`,
                ...(i === 0 ? { borderTop: `1px solid ${SA.border}` } : {}),
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
                  fontFamily: SA.font,
                  fontSize: '16px',
                  color: SA.text,
                  textAlign: 'left',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ flex: 1, fontWeight: 500 }}>{item.question}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    color: SA.green,
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
                        borderLeft: `2px solid ${SA.green}`,
                        marginLeft: 0,
                        paddingLeft: 20,
                        fontSize: '15px',
                        lineHeight: 1.7,
                        color: SA.textSecondary,
                        fontFamily: SA.font,
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

/* -- main component -- */

export function SagemontContent() {
  return (
    <div className="sa-page" style={{ fontFamily: SA.font }}>
      <style>{scopedCSS}</style>

      {/* -- Hero -- */}
      <section
        className="full-bleed"
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${SA.greenGlow}, ${SA.dark} 70%)`,
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
              background: SA.greenGlow,
              border: `1px solid ${SA.greenBorder}`,
              borderRadius: 20,
              fontSize: '13px',
              fontWeight: 500,
              color: SA.greenLt,
              fontFamily: SA.font,
              marginBottom: 32,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: SA.green }} />
            Custom Proposal
          </div>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.2}>
          <h1
            className="sa-hero-title"
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 700,
              fontFamily: SA.font,
              lineHeight: 1.1,
              margin: '0 0 24px',
              maxWidth: 800,
            }}
          >
            <span style={{ color: SA.white }}>Built for </span>
            <span style={{ color: SA.green }}>Sagemont Advisors</span>
          </h1>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.35}>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: SA.textSecondary,
              fontFamily: SA.font,
              lineHeight: 1.6,
              maxWidth: 580,
              margin: '0 auto 48px',
            }}
          >
            AI-powered client acquisition and GTM infrastructure for
            <br />
            tax credit advisory at scale.
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
                  fontFamily: SA.font,
                  color: '#fff',
                  background: SA.green,
                  border: `1px solid ${SA.green}`,
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
                  fontFamily: SA.font,
                  color: SA.green,
                  background: 'transparent',
                  border: `1px solid ${SA.greenBorder}`,
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
            color: SA.textMuted,
            fontSize: '24px',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          &#8964;
        </div>
      </section>

      {/* -- Stats Strip -- */}
      <SASection
        background={SA.darkSubtle}
        style={{
          borderTop: `1px solid ${SA.border}`,
          borderBottom: `1px solid ${SA.border}`,
          padding: '48px 24px',
        }}
        noPad
      >
        <div
          className="sa-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
            gap: 32,
            textAlign: 'center',
          }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div className="sa-stat-value">{s.value}</div>
              <div className="sa-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            textAlign: 'center',
            marginTop: 24,
            fontSize: '13px',
            color: SA.textMuted,
            fontFamily: SA.font,
          }}
        >
          We did our homework.
        </div>
      </SASection>

      {/* -- The Challenge -- */}
      <SASection background={SA.dark}>
        <SectionLabel>The Challenge</SectionLabel>
        <SectionTitle subtitle="You built a $100M+ tax credit practice. Scaling into R&D, WOTC, and controversy requires a new GTM engine - not just more reps.">
          What Keeps Growth Leaders Up at Night
        </SectionTitle>

        <StaggerContainer stagger={0.1}>
          <div
            className="sa-challenge-grid"
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
                    background: SA.darkCard,
                    border: `1px solid ${SA.border}`,
                    borderRadius: 10,
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: SA.green,
                      fontFamily: SA.font,
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
                      color: SA.text,
                      fontFamily: SA.font,
                      marginBottom: 10,
                      lineHeight: 1.3,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: SA.textSecondary,
                      fontFamily: SA.font,
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
      </SASection>

      {/* -- What I Build -- */}
      <SASection background={SA.darkSubtle} style={{ scrollMarginTop: 80 }}>
        <div id="deliverables" style={{ position: 'absolute', marginTop: -100 }} />
        <SectionLabel>The Solution</SectionLabel>
        <SectionTitle subtitle="Four systems that integrate with your existing workflows and multiply every rep's client capacity.">
          What I Build for You
        </SectionTitle>

        <StaggerContainer stagger={0.12}>
          <div
            className="sa-deliverable-grid"
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
                    borderColor: SA.greenBorder,
                    scale: 1.01,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: '28px',
                    background: SA.darkCard,
                    border: `1px solid ${SA.border}`,
                    borderRadius: 10,
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: SA.text,
                      fontFamily: SA.font,
                      marginBottom: 10,
                    }}
                  >
                    {d.title}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: SA.textSecondary,
                      fontFamily: SA.font,
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
                          fontFamily: SA.font,
                          padding: '3px 10px',
                          borderRadius: 4,
                          background: SA.greenGlow,
                          color: SA.greenLt,
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
      </SASection>

      {/* -- The Engagement -- */}
      <SASection background={SA.dark} style={{ scrollMarginTop: 80 }}>
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
                background: `linear-gradient(to bottom, ${SA.green}, ${SA.greenBorder})`,
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
                      border: `2px solid ${SA.green}`,
                      background: SA.dark,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: SA.green,
                      fontFamily: SA.font,
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
                        color: SA.green,
                        fontFamily: SA.font,
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
                        color: SA.text,
                        fontFamily: SA.font,
                        marginBottom: 8,
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      style={{
                        fontSize: '15px',
                        color: SA.textSecondary,
                        fontFamily: SA.font,
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
      </SASection>

      {/* -- The Meta Proof -- */}
      <SASection
        background={SA.darkSubtle}
        style={{
          borderTop: `1px solid ${SA.border}`,
          borderBottom: `1px solid ${SA.border}`,
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
                color: SA.green,
                fontFamily: SA.font,
                marginBottom: 20,
              }}
            >
              The Proof of Concept
            </div>
            <h2
              style={{
                fontSize: 'clamp(24px, 4vw, 38px)',
                fontWeight: 700,
                color: SA.white,
                fontFamily: SA.font,
                lineHeight: 1.25,
                margin: '0 0 20px',
              }}
            >
              This page is the demo.
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: SA.textSecondary,
                fontFamily: SA.font,
                lineHeight: 1.7,
                margin: '0 0 12px',
              }}
            >
              Custom-branded to your firm. Deeply researched - your $1B+ in credits substantiated,
              your A&amp;M and EY pedigree, your multi-vertical expansion. Built and deployed in a single session
              using the same AI infrastructure I&apos;d build for your client pipeline.
            </p>
            <p
              style={{
                fontSize: '17px',
                color: SA.text,
                fontFamily: SA.font,
                lineHeight: 1.7,
                fontWeight: 600,
              }}
            >
              Now imagine what 3 months of focused work delivers.
            </p>
          </MotionReveal>
        </div>
      </SASection>

      {/* -- Stack Integration -- */}
      <SASection background={SA.dark}>
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
              { name: 'CRM', role: 'Pipeline & Clients' },
              { name: 'AI Research', role: 'Prospect Intelligence' },
              { name: 'Signal Engine', role: 'Eligibility Detection' },
              { name: 'Outreach', role: 'Sequences & Nurture' },
              { name: 'Analytics', role: 'Revenue Insights' },
            ].map((tool) => (
              <StaggerItem key={tool.name}>
                <div
                  style={{
                    padding: '24px 20px',
                    background: SA.darkCard,
                    border: `1px solid ${SA.border}`,
                    borderRadius: 8,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: SA.text,
                      fontFamily: SA.font,
                      marginBottom: 4,
                    }}
                  >
                    {tool.name}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: SA.textMuted,
                      fontFamily: SA.font,
                    }}
                  >
                    {tool.role}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </SASection>

      {/* -- FAQ -- */}
      <SASection background={SA.darkSubtle}>
        <SectionLabel>FAQ</SectionLabel>
        <SectionTitle>Common Questions</SectionTitle>
        <SAAccordion items={faqItems} />
      </SASection>

      {/* -- CTA -- */}
      <SASection background={SA.dark}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <MotionReveal variant="fadeUp">
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 700,
                color: SA.white,
                fontFamily: SA.font,
                lineHeight: 1.2,
                margin: '0 0 16px',
              }}
            >
              Let&apos;s explore what&apos;s possible.
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: SA.textSecondary,
                fontFamily: SA.font,
                lineHeight: 1.6,
                margin: '0 0 36px',
              }}
            >
              The infrastructure scales. The client pipeline compounds.
              Let&apos;s talk about building it for Sagemont Advisors.
            </p>
            <MagneticHover>
              <a
                href="mailto:shawn@leadalchemy.co?subject=Sagemont%20Advisors%20%E2%80%94%20GTM%20Infrastructure"
                style={{
                  display: 'inline-block',
                  padding: '16px 44px',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: SA.font,
                  color: '#fff',
                  background: SA.green,
                  border: `1px solid ${SA.green}`,
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
                color: SA.textMuted,
                fontFamily: SA.font,
              }}
            >
              shawn@leadalchemy.co
            </div>
          </MotionReveal>
        </div>
      </SASection>

      {/* -- Footer Attribution -- */}
      <SASection
        background={SA.darkSubtle}
        style={{
          borderTop: `1px solid ${SA.border}`,
          padding: '32px 24px',
        }}
        noPad
      >
        <div
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: SA.textMuted,
            fontFamily: SA.font,
          }}
        >
          Built with{' '}
          <a
            href="https://thegtmos.ai"
            style={{ color: SA.textSecondary, textDecoration: 'none' }}
          >
            theGTMOS.ai
          </a>{' '}
          - the go-to-market operating system
        </div>
      </SASection>
    </div>
  )
}
