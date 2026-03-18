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
const BG_FAQ = '#0E0E0E'
const BORDER = '#1A1A1A'
const BORDER_HOVER = '#2A2A2A'
const TEXT = '#F5F5F5'
const TEXT_DIM = '#A0A0A0'
const MONO = 'var(--font-mono)'
const SANS = 'var(--font-sans)'

const CAL_LINK = 'https://cal.com/shawn-lead-alchemy/30min'

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

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={RED}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: 'transform 0.25s ease',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        flexShrink: 0,
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

/* ── Data ── */
const services = [
  {
    icon: CodeIcon,
    title: 'Web Development',
    subtitle: 'The website-with-soul stack',
    href: '/services/web-development',
    cta: 'See packages',
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
    href: CAL_LINK,
    external: true,
    cta: 'Book a call',
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
    href: '/reddit',
    cta: 'See the playbook',
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
  { number: '7,500+', label: 'visitors in 48 hours' },
  { number: '86', label: 'countries reached' },
  { number: '500K+', label: 'Reddit impressions' },
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

const personas = [
  {
    label: 'SaaS Founders',
    desc: 'You need a site that converts, not a template that looks like everyone else.',
  },
  {
    label: 'GTM Teams',
    desc: 'Your pipeline needs infrastructure, not another spreadsheet.',
  },
  {
    label: 'Agencies',
    desc: 'You need a builder who ships production code, not mockups.',
  },
  {
    label: 'Solo Operators',
    desc: 'You need systems that compound while you sleep.',
  },
]

const faqItems = [
  {
    q: 'How is this different from hiring an agency?',
    a: 'Agencies sell hours. I sell outcomes. You get a fixed scope, a fixed price, and a working system - not a 47-slide deck and a monthly retainer. I build the infrastructure myself using AI-accelerated development, which means you get senior-level architecture at a fraction of the timeline.',
  },
  {
    q: 'What does AI enablement actually mean?',
    a: 'It means your team stops copy-pasting into ChatGPT and starts shipping with AI built into their workflow. I set up Claude Code with custom instructions for your codebase, build MCP servers that connect your tools, create agent pipelines for repetitive work, and train your team to use all of it. The goal is autonomous systems, not prompt engineering.',
  },
  {
    q: 'How does the Reddit growth service work?',
    a: 'AI search engines like Perplexity, ChatGPT, and Gemini pull heavily from Reddit. I build authentic authority in your niche subreddits through real engagement - not bots, not spam. Content strategy mapped to keyword clusters, karma building, and community presence that gets your brand cited by AI models. Results are measurable: impressions, traffic, and citations.',
  },
  {
    q: 'What is your tech stack?',
    a: 'Next.js 15, React 19, TypeScript, TailwindCSS 4, Vercel for deployment, PostHog for analytics, and Claude for AI-accelerated development. Everything ships from a monorepo with CI/CD. No WordPress, no page builders, no vendor lock-in. You own the repo.',
  },
  {
    q: 'How fast can you ship?',
    a: 'A production website ships in 1-2 weeks. A full AI operating system takes 4-8 weeks. I scope everything upfront so there are no surprises. You get weekly demos with real, deployed progress - not Figma files.',
  },
  {
    q: 'What do your websites cost?',
    a: 'Custom sites start at $3,500 for a 5-7 page build with SEO, analytics, and lead capture included. The most popular package is $5,500 which adds bilingual support, booking systems, and 3 months of post-launch support. Full details on the web development page.',
  },
  {
    q: 'Do you work with international companies?',
    a: 'Yes. Every site I build supports multilingual content out of the box - not a translation plugin, but properly localized pages with their own SEO. Current sites run in English, Spanish, Hebrew, Chinese, and Japanese.',
  },
  {
    q: 'What happens after the project is done?',
    a: 'Your site keeps running with zero ongoing cost - hosting is free on Vercel. You can self-manage, or upgrade to a managed plan ($500-$1,000/month) for ongoing optimization, content updates, and priority support. The code is yours either way.',
  },
]

/* ── FAQ Item ── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{
        borderBottom: `1px solid ${BORDER}`,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          padding: '20px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          color: TEXT,
          fontFamily: SANS,
          fontSize: 16,
          fontWeight: 600,
          lineHeight: 1.4,
          transition: 'color 0.15s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = RED }}
        onMouseLeave={(e) => { e.currentTarget.style.color = TEXT }}
      >
        {q}
        <ChevronIcon open={open} />
      </button>
      <div
        style={{
          maxHeight: open ? 300 : 0,
          opacity: open ? 1 : 0,
          transition: 'max-height 0.3s ease, opacity 0.25s ease, padding 0.3s ease',
          paddingBottom: open ? 20 : 0,
          overflow: 'hidden',
        }}
      >
        <p style={{
          fontSize: 15,
          color: TEXT_DIM,
          lineHeight: 1.7,
          margin: 0,
          fontFamily: SANS,
        }}>
          {a}
        </p>
      </div>
    </div>
  )
}

/* ── Component ── */
export function ServicesContent() {
  const posthog = usePostHog()
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const trackCTA = (source: string) => {
    posthog?.capture('services_cta_clicked', { source })
  }

  return (
    <div style={{ background: BG, color: TEXT, fontFamily: SANS, margin: '-0px -24px', padding: '0 24px' }}>
      {/* ══ HERO ══ */}
      <section style={{ textAlign: 'center', padding: '120px 0 80px', maxWidth: 800, margin: '0 auto' }}>
        <MotionReveal>
          <p style={{ fontSize: 13, fontFamily: MONO, color: RED, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>
            ShawnOS Services
          </p>
          <h1 style={{
            fontSize: 'clamp(36px, 5.5vw, 60px)',
            fontWeight: 800,
            fontFamily: SANS,
            lineHeight: 1.08,
            margin: '0 0 24px',
            color: TEXT,
            letterSpacing: '-0.02em',
          }}>
            Build systems that{' '}
            <span style={{ color: RED }}>compound</span>
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 19px)',
            color: TEXT_DIM,
            lineHeight: 1.65,
            maxWidth: 560,
            margin: '0 auto 40px',
          }}>
            Web development, AI enablement, and Reddit growth engineering
            for SaaS founders and GTM teams who build.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={CAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTA('hero')}
              style={{
                display: 'inline-block',
                padding: '16px 40px',
                background: RED,
                color: '#fff',
                fontSize: 15,
                fontFamily: SANS,
                fontWeight: 600,
                borderRadius: 8,
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
              Book a free call
            </a>
            <a
              href="#services"
              style={{
                display: 'inline-block',
                padding: '16px 40px',
                background: 'transparent',
                color: TEXT_DIM,
                fontSize: 15,
                fontFamily: SANS,
                fontWeight: 600,
                borderRadius: 8,
                textDecoration: 'none',
                border: `1px solid ${BORDER_HOVER}`,
                transition: 'color 0.15s ease, border-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = TEXT
                e.currentTarget.style.borderColor = TEXT_DIM
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = TEXT_DIM
                e.currentTarget.style.borderColor = BORDER_HOVER
              }}
            >
              See services
            </a>
          </div>
        </MotionReveal>
      </section>

      {/* ══ SERVICE CARDS ══ */}
      <section id="services" style={{ maxWidth: 1080, margin: '0 auto', padding: '0 0 80px', scrollMarginTop: 80 }}>
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
                  <a
                    href={s.href}
                    {...(s.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    onClick={() => trackCTA(`card_${s.title.toLowerCase().replace(/\s+/g, '_')}`)}
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
                      textDecoration: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
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
                      fontSize: 14,
                      color: RED,
                      margin: '0 0 16px',
                      fontFamily: SANS,
                      fontWeight: 500,
                      letterSpacing: '0.01em',
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
                          fontSize: 14,
                          color: TEXT_DIM,
                          lineHeight: 1.8,
                          paddingLeft: 20,
                          position: 'relative' as const,
                          fontFamily: SANS,
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
                    <div style={{
                      marginTop: 24,
                      fontSize: 14,
                      fontWeight: 600,
                      color: RED,
                      fontFamily: SANS,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'gap 0.2s ease',
                    }}>
                      {s.cta}
                      <span style={{
                        transition: 'transform 0.2s ease',
                        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                        display: 'inline-block',
                      }}>
                        &rarr;
                      </span>
                    </div>
                  </a>
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
                  fontSize: 'clamp(32px, 4.5vw, 44px)',
                  fontWeight: 800,
                  fontFamily: SANS,
                  color: RED,
                  lineHeight: 1,
                  marginBottom: 8,
                  letterSpacing: '-0.02em',
                }}>
                  {p.number}
                </div>
                <div style={{
                  fontSize: 14,
                  color: TEXT_DIM,
                  fontFamily: SANS,
                }}>
                  {p.label}
                </div>
              </div>
            ))}
          </div>
        </MotionReveal>
      </section>

      {/* ══ WHO THIS IS FOR ══ */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '80px 0' }}>
        <MotionReveal>
          <p style={{
            fontSize: 13,
            fontFamily: MONO,
            color: RED,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: 12,
          }}>
            Who this is for
          </p>
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 36px)',
            fontWeight: 700,
            fontFamily: SANS,
            textAlign: 'center',
            marginBottom: 48,
            color: TEXT,
            letterSpacing: '-0.01em',
          }}>
            Built for people who ship
          </h2>
        </MotionReveal>
        <StaggerContainer>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}>
            {personas.map((p, i) => (
              <StaggerItem key={i}>
                <div style={{
                  padding: '24px 20px',
                  background: BG_CARD,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 10,
                  borderLeft: `3px solid ${RED}`,
                  transition: 'border-color 0.2s ease',
                }}>
                  <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: TEXT,
                    marginBottom: 8,
                    fontFamily: SANS,
                  }}>
                    {p.label}
                  </div>
                  <div style={{
                    fontSize: 14,
                    color: TEXT_DIM,
                    lineHeight: 1.6,
                    fontFamily: SANS,
                  }}>
                    {p.desc}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: '80px 0',
        borderTop: `1px solid ${BORDER}`,
      }}>
        <MotionReveal>
          <p style={{
            fontSize: 13,
            fontFamily: MONO,
            color: RED,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: 12,
          }}>
            Process
          </p>
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 36px)',
            fontWeight: 700,
            fontFamily: SANS,
            textAlign: 'center',
            marginBottom: 48,
            color: TEXT,
            letterSpacing: '-0.01em',
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
                  padding: '24px',
                  background: BG_CARD,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 10,
                }}>
                  <div style={{
                    fontSize: 32,
                    fontWeight: 800,
                    fontFamily: MONO,
                    color: RED,
                    lineHeight: 1,
                    minWidth: 48,
                    opacity: 0.5,
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
                      fontSize: 15,
                      color: TEXT_DIM,
                      lineHeight: 1.65,
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

      {/* ══ FAQ ══ */}
      <section style={{
        borderTop: `1px solid ${BORDER}`,
        background: BG_FAQ,
        margin: '0 -24px',
        padding: '80px 24px',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <MotionReveal>
            <p style={{
              fontSize: 13,
              fontFamily: MONO,
              color: RED,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textAlign: 'center',
              marginBottom: 12,
            }}>
              FAQ
            </p>
            <h2 style={{
              fontSize: 'clamp(24px, 3.5vw, 36px)',
              fontWeight: 700,
              fontFamily: SANS,
              textAlign: 'center',
              marginBottom: 48,
              color: TEXT,
              letterSpacing: '-0.01em',
            }}>
              Questions people actually ask
            </h2>
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <div style={{ borderTop: `1px solid ${BORDER}` }}>
              {faqItems.map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section style={{
        textAlign: 'center',
        padding: '100px 24px',
        borderTop: `1px solid ${BORDER}`,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 200,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${RED}, transparent)`,
        }} />
        <MotionReveal>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            fontFamily: SANS,
            marginBottom: 16,
            color: TEXT,
            letterSpacing: '-0.02em',
          }}>
            Ready to build?
          </h2>
          <p style={{
            fontSize: 16,
            color: TEXT_DIM,
            marginBottom: 32,
            maxWidth: 480,
            margin: '0 auto 40px',
            lineHeight: 1.65,
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
                padding: '16px 40px',
                background: RED,
                color: '#fff',
                fontSize: 15,
                fontFamily: SANS,
                fontWeight: 600,
                borderRadius: 8,
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
                padding: '16px 40px',
                background: 'transparent',
                color: RED,
                fontSize: 15,
                fontFamily: SANS,
                fontWeight: 600,
                borderRadius: 8,
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
            marginTop: 32,
            opacity: 0.5,
          }}>
            by Shawn Tenam
          </p>
        </MotionReveal>
      </section>
    </div>
  )
}
