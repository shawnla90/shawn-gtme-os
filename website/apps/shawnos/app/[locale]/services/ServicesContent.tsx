'use client'

import { useState } from 'react'
import { usePostHog } from 'posthog-js/react'
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
} from '@shawnos/shared/components'

/* ── Theme ── */
const RED = '#E63946'
const RED_DIM = 'rgba(230, 57, 70, 0.15)'
const RED_GLOW = 'rgba(230, 57, 70, 0.3)'
const BG = '#0A0A0A'
const BG_CARD = '#111111'
const BORDER = '#1A1A1A'
const TEXT = '#E8E8E8'
const TEXT_DIM = '#888888'
const MONO = 'var(--font-mono)'
const SANS = 'var(--font-sans)'

const CAL_LINK = 'https://cal.com/shawntenam/30min'

/* ── SVG Icons ── */
function CodeIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function BrainIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
      <line x1="9" y1="22" x2="15" y2="22" />
      <line x1="10" y1="2" x2="10" y2="5" />
      <line x1="14" y1="2" x2="14" y2="5" />
    </svg>
  )
}

function TrendingIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

/* ── Data ── */
const services = [
  {
    icon: CodeIcon,
    title: 'Web Development',
    subtitle: 'The website-with-soul stack',
    points: [
      'Next.js 15 + Vercel. Sub-second loads.',
      'SEO, structured data, OG images built in.',
      'PostHog analytics + lead capture from day one.',
      'Multilingual. Accessible. Dark mode.',
      'You own the repo. No vendor lock.',
    ],
  },
  {
    icon: BrainIcon,
    title: 'AI Enablement',
    subtitle: 'Your team ships with AI, not around it',
    points: [
      'Claude Code workflows for your codebase.',
      'Custom MCP servers for your tools.',
      'Agent pipelines that do real work.',
      'Context engineering. Memory systems.',
      'Training your team to build, not just prompt.',
    ],
  },
  {
    icon: TrendingIcon,
    title: 'Reddit Growth (GEO)',
    subtitle: 'Generative Engine Optimization',
    points: [
      'Authentic authority in your niche subreddits.',
      'AI search engines cite Reddit. You need to be there.',
      'Content strategy mapped to keyword clusters.',
      'Real engagement, real karma, real results.',
      'Perplexity, ChatGPT, Gemini all pull from Reddit.',
    ],
  },
]

const proof = [
  { number: '2,200+', label: 'visitors in 48 hours' },
  { number: '86', label: 'countries reached' },
  { number: '200K+', label: 'Reddit impressions' },
  { number: '3', label: 'sites shipped from 1 monorepo' },
]

const steps = [
  {
    num: '01',
    title: 'We talk',
    desc: 'You tell me what you are building and where it hurts. 30-minute call. No pitch deck.',
  },
  {
    num: '02',
    title: 'I scope it',
    desc: 'You get a clear spec. What ships, what it costs, when it is done. No hourly billing.',
  },
  {
    num: '03',
    title: 'I build it',
    desc: 'Weekly demos. You see real progress, not Figma files. Ship fast or kill it fast.',
  },
]

/* ── Component ── */
export function ServicesContent() {
  const posthog = usePostHog()
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const trackCTA = (source: string) => {
    posthog?.capture('services_cta_clicked', { source })
  }

  return (
    <div style={{ background: BG, color: TEXT, fontFamily: MONO, margin: '-0px -24px', padding: '0 24px' }}>
      {/* ══ HERO ══ */}
      <section style={{ textAlign: 'center', padding: '100px 0 80px', maxWidth: 800, margin: '0 auto' }}>
        <MotionReveal>
          <p style={{ fontSize: 13, fontFamily: MONO, color: RED, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>
            ShawnOS Services
          </p>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 800,
            fontFamily: SANS,
            lineHeight: 1.1,
            margin: '0 0 24px',
            color: TEXT,
          }}>
            Build systems that{' '}
            <span style={{ color: RED }}>compound</span>
          </h1>
          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: TEXT_DIM,
            lineHeight: 1.6,
            maxWidth: 560,
            margin: '0 auto 40px',
          }}>
            Web development, AI enablement, and Reddit growth engineering
            for SaaS founders and GTM teams who build.
          </p>
          <a
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA('hero')}
            style={{
              display: 'inline-block',
              padding: '14px 36px',
              background: RED,
              color: '#fff',
              fontSize: 14,
              fontFamily: MONO,
              fontWeight: 600,
              borderRadius: 6,
              textDecoration: 'none',
              transition: 'box-shadow 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 0 24px ${RED_GLOW}`
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Let&apos;s talk
          </a>
        </MotionReveal>
      </section>

      {/* ══ SERVICE CARDS ══ */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 0 80px' }}>
        <StaggerContainer>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}>
            {services.map((s, i) => {
              const Icon = s.icon
              const isHovered = hoveredCard === i
              return (
                <StaggerItem key={i}>
                  <div
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      background: BG_CARD,
                      border: `1px solid ${isHovered ? RED : BORDER}`,
                      borderRadius: 12,
                      padding: 32,
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
                      boxShadow: isHovered ? `0 4px 30px ${RED_DIM}` : 'none',
                      transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column' as const,
                    }}
                  >
                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: 12,
                      background: RED_DIM,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 20,
                    }}>
                      <Icon />
                    </div>
                    <h3 style={{
                      fontSize: 22,
                      fontWeight: 700,
                      fontFamily: SANS,
                      margin: '0 0 6px',
                      color: TEXT,
                    }}>
                      {s.title}
                    </h3>
                    <p style={{
                      fontSize: 13,
                      color: RED,
                      margin: '0 0 16px',
                      fontFamily: MONO,
                    }}>
                      {s.subtitle}
                    </p>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      flex: 1,
                    }}>
                      {s.points.map((p, j) => (
                        <li key={j} style={{
                          fontSize: 13,
                          color: TEXT_DIM,
                          lineHeight: 1.7,
                          paddingLeft: 16,
                          position: 'relative' as const,
                        }}>
                          <span style={{
                            position: 'absolute' as const,
                            left: 0,
                            color: RED,
                            fontSize: 10,
                            top: 4,
                          }}>
                            //
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              )
            })}
          </div>
        </StaggerContainer>
      </section>

      {/* ══ PROOF NUMBERS ══ */}
      <section style={{
        borderTop: `1px solid ${BORDER}`,
        borderBottom: `1px solid ${BORDER}`,
        padding: '60px 0',
      }}>
        <MotionReveal>
          <div style={{
            maxWidth: 1080,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 32,
            textAlign: 'center',
          }}>
            {proof.map((p, i) => (
              <div key={i}>
                <div style={{
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  fontWeight: 800,
                  fontFamily: SANS,
                  color: RED,
                  lineHeight: 1,
                  marginBottom: 8,
                }}>
                  {p.number}
                </div>
                <div style={{
                  fontSize: 13,
                  color: TEXT_DIM,
                  fontFamily: MONO,
                }}>
                  {p.label}
                </div>
              </div>
            ))}
          </div>
        </MotionReveal>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '80px 0' }}>
        <MotionReveal>
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 36px)',
            fontWeight: 700,
            fontFamily: SANS,
            textAlign: 'center',
            marginBottom: 48,
            color: TEXT,
          }}>
            How it works
          </h2>
        </MotionReveal>
        <StaggerContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {steps.map((step, i) => (
              <StaggerItem key={i}>
                <div style={{
                  display: 'flex',
                  gap: 24,
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    fontSize: 32,
                    fontWeight: 800,
                    fontFamily: MONO,
                    color: RED,
                    lineHeight: 1,
                    minWidth: 48,
                    opacity: 0.6,
                  }}>
                    {step.num}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: 18,
                      fontWeight: 700,
                      fontFamily: SANS,
                      margin: '0 0 8px',
                      color: TEXT,
                    }}>
                      {step.title}
                    </h3>
                    <p style={{
                      fontSize: 14,
                      color: TEXT_DIM,
                      lineHeight: 1.6,
                      margin: 0,
                    }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section style={{
        textAlign: 'center',
        padding: '80px 0 100px',
        borderTop: `1px solid ${BORDER}`,
      }}>
        <MotionReveal>
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 36px)',
            fontWeight: 700,
            fontFamily: SANS,
            marginBottom: 16,
            color: TEXT,
          }}>
            Ready to build?
          </h2>
          <p style={{
            fontSize: 15,
            color: TEXT_DIM,
            marginBottom: 32,
            maxWidth: 480,
            margin: '0 auto 32px',
            lineHeight: 1.6,
          }}>
            No rate cards. No 12-slide decks. Tell me what you are building
            and I will tell you exactly how I can help.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={CAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTA('bottom')}
              style={{
                display: 'inline-block',
                padding: '14px 36px',
                background: RED,
                color: '#fff',
                fontSize: 14,
                fontFamily: MONO,
                fontWeight: 600,
                borderRadius: 6,
                textDecoration: 'none',
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 24px ${RED_GLOW}`
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Schedule a call
            </a>
            <a
              href="sms:+13474520467"
              onClick={() => trackCTA('text')}
              style={{
                display: 'inline-block',
                padding: '14px 36px',
                background: 'transparent',
                color: RED,
                fontSize: 14,
                fontFamily: MONO,
                fontWeight: 600,
                borderRadius: 6,
                textDecoration: 'none',
                border: `1px solid ${RED}`,
                transition: 'background 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = RED_DIM
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Text me
            </a>
          </div>
          <p style={{
            fontSize: 12,
            color: TEXT_DIM,
            marginTop: 24,
            opacity: 0.6,
          }}>
            by Shawn Tenam
          </p>
        </MotionReveal>
      </section>
    </div>
  )
}
