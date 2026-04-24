'use client'

import Link from 'next/link'
import {
  MotionReveal,
  ScrollRevealSection,
  StaggerContainer,
  StaggerItem,
  SectionHeadline,
  ScrambleCycler,
} from '@shawnos/shared/components'

/* ── data ────────────────────────────────────────────── */

const tiers = [
  {
    name: 'Voice Setup',
    price: '$2,500',
    model: 'One-time',
    color: '#4EC373',
    cta: 'Build My Voice System',
    features: [
      'Voice DNA calibration (core voice, anti-slop, hooks, safety)',
      'Anti-slop system tuned to your patterns',
      'Platform playbooks (LinkedIn, X, Reddit, Substack)',
      'Content templates per platform',
      'Voice verification checklist',
      'Delivered as versioned files you own forever',
    ],
  },
  {
    name: 'Content Engine',
    price: '$5,000',
    model: '/month',
    color: '#1D9BF0',
    recommended: true,
    cta: 'Launch My Content Engine',
    features: [
      'Everything in Voice Setup',
      'Weekly content pipeline (4-8 pieces)',
      'Multi-platform distribution (LinkedIn, X, Reddit)',
      'Reddit strategy + community engagement',
      'Performance analytics + optimization',
      'Voice system refinement based on data',
      'Monthly strategy call',
    ],
  },
  {
    name: 'Full Dominance',
    price: 'Book a Call',
    model: 'Retainer',
    color: '#D2A53C',
    cta: 'Book a Call',
    features: [
      'Everything in Content Engine',
      'Full Reddit account management',
      'Reddit Ads setup + management',
      'Karma building campaigns',
      'Blog pipeline (weekly SEO-optimized posts)',
      'Full SEO content strategy',
      'Content distribution at scale',
      'AI-optimized content for search + AI models',
      'Dedicated content strategist',
    ],
  },
]

const proofStats = [
  { value: '527', label: 'visitors in 24 hours' },
  { value: '1,600', label: 'page views' },
  { value: '75K+', label: 'Reddit views' },
  { value: '800+', label: 'karma in one weekend' },
]

/* ── component ───────────────────────────────────────── */

export function ServicesContent() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background:
            'radial-gradient(ellipse 800px 600px at 50% 30%, rgba(29, 155, 240, 0.12), transparent 60%), var(--canvas)',
          textAlign: 'center',
          padding: '0 24px',
          position: 'relative',
        }}
      >
        <MotionReveal variant="fadeUp" delay={0.05}>
          <div
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--accent)',
              background: 'rgba(255, 105, 180, 0.08)',
              border: '1px solid rgba(255, 105, 180, 0.2)',
              borderRadius: 999,
              marginBottom: 20,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Content Services
          </div>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.15}>
          <h1
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.15,
              margin: '0 0 24px',
              maxWidth: 800,
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>Your personal AI assistant for solopreneurs,</span>{' '}
            <span style={{ color: 'var(--accent)' }}>
              <ScrambleCycler
                phrases={[
                  'systematized.',
                  'distributed everywhere.',
                  'compounding daily.',
                  'driving real traffic.',
                ]}
                holdMs={3000}
                scrambleSpeed={30}
                resolveSpeed={50}
              />
            </span>
          </h1>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.25}>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: 640,
              margin: '0 auto 40px',
            }}
          >
            We help solopreneurs build their own AI assistant infrastructure, not rent someone else&apos;s.
            Voice DNA + platform playbooks + distribution ops = traffic that compounds every week.
          </p>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.3}>
          <p
            style={{
              fontSize: 'clamp(14px, 1.6vw, 17px)',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              maxWidth: 600,
              margin: '0 auto 32px',
            }}
          >
            Whether you want to build your own AI assistant, start with our free AI tools,
            or hand off the entire operation - ContentOS services meet you where you are.
            Every package is built on the same infrastructure: persistent memory, voice
            calibration, and distribution systems that do the work without you babysitting it.
          </p>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.35}>
          <a
            href="#pricing"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: 'var(--accent)',
              color: 'var(--text-on-accent)',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 15,
              textDecoration: 'none',
            }}
          >
            See Pricing
          </a>
        </MotionReveal>

        <div
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

      {/* ── Proof Section ── */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <SectionHeadline
            label="CASE STUDY"
            subtitle="Joe Parziale Plumbing Co. - results in 24 hours"
          >
            Reddit Is King
          </SectionHeadline>
        </div>

        <StaggerContainer stagger={0.08}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 16,
              maxWidth: 700,
              margin: '0 auto 32px',
            }}
          >
            {proofStats.map((s) => (
              <StaggerItem key={s.label}>
                <div
                  style={{
                    padding: '24px 16px',
                    background: 'var(--canvas)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: 'clamp(28px, 4vw, 40px)',
                      fontWeight: 700,
                      color: 'var(--accent)',
                      fontFamily: 'var(--font-mono)',
                      lineHeight: 1.1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      marginTop: 8,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        <MotionReveal variant="fadeUp" delay={0.3}>
          <div
            style={{
              maxWidth: 640,
              margin: '0 auto',
              padding: '20px 24px',
              borderLeft: '3px solid var(--accent)',
              background: 'rgba(255, 105, 180, 0.05)',
              borderRadius: '0 6px 6px 0',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              One Reddit post. One day. A local plumbing business went from zero
              online presence to 527 unique visitors, 1,600 page views, and 75,000+
              Reddit views. No paid ads. No SEO waiting game. Reddit is the
              distribution layer for 2026 - and AI models are reading it too.
            </p>
          </div>
        </MotionReveal>
      </ScrollRevealSection>

      {/* ── Pricing ── */}
      <ScrollRevealSection background="var(--canvas)">
        <div id="pricing" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionHeadline
            label="PACKAGES"
            subtitle="From voice calibration to full content dominance"
          >
            Build Your Own AI Infrastructure
          </SectionHeadline>

          <StaggerContainer stagger={0.1}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 24,
              }}
            >
              {tiers.map((tier) => (
                <StaggerItem key={tier.name}>
                  <div
                    style={{
                      padding: '32px 28px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: `${tier.recommended ? '2px' : '1px'} solid ${tier.recommended ? tier.color : 'var(--border)'}`,
                      borderRadius: 8,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: tier.color,
                      }}
                    />

                    {tier.recommended && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -1,
                          right: 16,
                          backgroundColor: tier.color,
                          color: '#1a1a1a',
                          padding: '4px 12px',
                          borderRadius: '0 0 6px 6px',
                          fontSize: 11,
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        Recommended
                      </div>
                    )}

                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '3px 10px',
                        borderRadius: 20,
                        background: `${tier.color}15`,
                        border: `1px solid ${tier.color}40`,
                        fontSize: 11,
                        fontWeight: 600,
                        color: tier.color,
                        fontFamily: 'var(--font-mono)',
                        marginBottom: 12,
                        alignSelf: 'flex-start',
                      }}
                    >
                      {tier.model}
                    </div>

                    <div
                      style={{
                        fontSize: 'clamp(22px, 3vw, 28px)',
                        fontWeight: 700,
                        color: tier.color,
                        marginBottom: 4,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {tier.name}
                    </div>

                    <div
                      style={{
                        fontSize: 'clamp(28px, 4vw, 36px)',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: 20,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {tier.price}
                      {tier.model === '/month' && (
                        <span
                          style={{
                            fontSize: 14,
                            color: 'var(--text-muted)',
                            fontWeight: 400,
                          }}
                        >
                          /mo
                        </span>
                      )}
                    </div>

                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        flex: 1,
                      }}
                    >
                      {tier.features.map((f) => (
                        <li
                          key={f}
                          style={{
                            fontSize: 14,
                            color: 'var(--text-secondary)',
                            padding: '8px 0',
                            borderBottom: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 8,
                          }}
                        >
                          <span
                            style={{
                              color: tier.color,
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            +
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <a
                      href="https://cal.com/shawn-lead-alchemy/30min?overlayCalendar=true"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        padding: '14px 24px',
                        marginTop: 20,
                        backgroundColor: tier.recommended ? tier.color : 'transparent',
                        color: tier.recommended ? '#1a1a1a' : tier.color,
                        border: tier.recommended ? 'none' : `1px solid ${tier.color}`,
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 14,
                        textDecoration: 'none',
                        transition: 'opacity 0.15s',
                      }}
                    >
                      {tier.cta}
                    </a>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </ScrollRevealSection>

      {/* ── How It Works ── */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <SectionHeadline label="PROCESS" subtitle="From voice calibration to compounding content">
          How It Works
        </SectionHeadline>

        <StaggerContainer stagger={0.08}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              maxWidth: 700,
              margin: '0 auto',
            }}
          >
            {[
              {
                step: '01',
                label: 'Voice Calibration',
                desc: 'We study your existing content, interview you, and encode your voice into versioned files. Core voice, anti-slop patterns, hooks, safety filters.',
              },
              {
                step: '02',
                label: 'Platform Playbooks',
                desc: 'Your voice adapted per platform. LinkedIn gets one format, Reddit another, X another. Same DNA, different containers.',
              },
              {
                step: '03',
                label: 'Content Pipeline',
                desc: 'Weekly content produced from your voice system. Each piece goes through anti-slop validation, substance checks, and platform formatting.',
              },
              {
                step: '04',
                label: 'Distribution',
                desc: 'Content goes out across all channels. Reddit posts, LinkedIn articles, X threads, blog posts. Timed for maximum reach.',
              },
              {
                step: '05',
                label: 'Compound Loop',
                desc: 'Performance data feeds back into your voice rules. What works gets amplified. What falls flat gets refined. Post 100 is easier than post 1.',
              },
            ].map((item, i, arr) => (
              <StaggerItem key={item.step}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '16px 20px',
                    background: 'rgba(29, 155, 240, 0.04)',
                    border: '1px solid rgba(29, 155, 240, 0.12)',
                    borderRadius:
                      i === 0
                        ? '8px 8px 2px 2px'
                        : i === arr.length - 1
                          ? '2px 2px 8px 8px'
                          : '2px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#1D9BF0',
                      minWidth: 30,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {item.step}
                  </span>
                  <div>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#1D9BF0',
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        marginLeft: 12,
                      }}
                    >
                      {item.desc}
                    </span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </ScrollRevealSection>

      {/* ── Cross-link ── */}
      <ScrollRevealSection background="var(--canvas)">
        <div
          style={{
            maxWidth: 640,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <MotionReveal variant="fadeUp">
            <div
              style={{
                padding: '40px 32px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border)',
                borderRadius: 8,
              }}
            >
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 12,
                }}
              >
                Need the website too?
              </p>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: 20,
                }}
              >
                ShawnOS builds high-performance websites for service businesses. Pair
                it with ContentOS for the full stack - website + content distribution
                that actually drives traffic.
              </p>
              <Link
                href="https://shawnos.ai/services/web-development"
                style={{
                  display: 'inline-block',
                  padding: '12px 28px',
                  border: '1px solid var(--accent)',
                  color: 'var(--accent)',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: 'none',
                }}
              >
                ShawnOS Web Development &rarr;
              </Link>
            </div>
          </MotionReveal>
        </div>
      </ScrollRevealSection>

      {/* ── CTA ── */}
      <section
        style={{
          padding: '80px 24px',
          textAlign: 'center',
          background:
            'radial-gradient(ellipse 600px 400px at 50% 50%, rgba(255, 105, 180, 0.08), transparent 60%), var(--canvas-subtle)',
        }}
      >
        <MotionReveal variant="fadeUp">
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              marginBottom: 16,
            }}
          >
            Stop publishing into the void.
          </h2>
        </MotionReveal>
        <MotionReveal variant="fadeUp" delay={0.1}>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
              maxWidth: 500,
              margin: '0 auto 32px',
              lineHeight: 1.7,
            }}
          >
            Book a call. We will audit your current content, show you what a voice
            system looks like, and map out the distribution strategy.
          </p>
        </MotionReveal>
        <MotionReveal variant="fadeUp" delay={0.2}>
          <a
            href="https://cal.com/shawn-lead-alchemy/30min?overlayCalendar=true"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '16px 40px',
              backgroundColor: 'var(--accent)',
              color: 'var(--text-on-accent)',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 16,
              textDecoration: 'none',
            }}
          >
            Book a Call
          </a>
        </MotionReveal>
      </section>
    </>
  )
}
