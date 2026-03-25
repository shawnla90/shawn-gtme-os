'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
  MagneticHover,
  HorizontalScrollSection,
  HorizontalPanel,
} from '@shawnos/shared/components'

/* ─── TTL: 48 hours from deploy ─── */
const PROPOSAL_CREATED = new Date('2026-03-25T06:00:00Z').getTime()
const TTL_MS = 48 * 60 * 60 * 1000

/* ─── Theme ─── */
const NX = {
  green: '#4EC373',
  greenLt: '#7DD9A0',
  greenGlow: 'rgba(78, 195, 115, 0.12)',
  greenBorder: 'rgba(78, 195, 115, 0.25)',
  amber: '#D2A53C',
  amberLt: '#E8C06A',
  amberGlow: 'rgba(210, 165, 60, 0.12)',
  amberBorder: 'rgba(210, 165, 60, 0.25)',
  dark: '#0A0D10',
  darkSubtle: '#0F1318',
  darkCard: '#141920',
  border: '#1C222A',
  borderLt: '#253040',
  text: '#E2E8F0',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  white: '#F8FAFC',
  font: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "var(--font-mono), 'JetBrains Mono', monospace",
} as const

/* ─── Data ─── */
const stats = [
  { value: '93', label: 'BuildZoom Score' },
  { value: 'Top 27%', label: 'CA Contractors' },
  { value: '20+', label: 'Years Experience' },
  { value: 'A', label: 'BBB Rating' },
  { value: '5', label: 'Counties Served' },
]

const infrastructure = [
  { item: 'Mac Mini M4 (24GB / 512GB)', cost: '$999', note: 'Your always-on intelligence node' },
  { item: 'Domain (Cloudflare)', cost: '~$10/yr', note: 'Premium DNS, zero markup' },
  { item: 'Vercel Pro Hosting', cost: '$20/mo', note: 'Global edge deployment' },
  { item: 'Claude Pro (AI Assistant)', cost: '$20/mo', note: 'Voice DNA extraction + content' },
]

const roadmap = [
  {
    week: 'Overview',
    title: '30 Days. Full Stack.',
    subtitle: 'Everything from foundation to launch.',
    items: [
      'Custom website deployed on Vercel',
      'Mac Mini configured as your private server',
      'Database + knowledge repository',
      'Reddit channel strategy',
      'SEO/GEO optimized from day one',
      'Voice DNA from your actual words',
      'Content pipeline + RSS feeds',
    ],
  },
  {
    week: 'Week 1',
    title: 'Foundation',
    subtitle: 'Discovery, infrastructure, architecture.',
    items: [
      'Discovery session (30 min) to capture your voice',
      'Mac Mini setup + remote access configured',
      'Domain purchased + DNS configured',
      'Vercel deployment pipeline',
      'Database scaffold + knowledge repo',
      'Initial site architecture',
    ],
    deliverable: 'Your Mac Mini is online. Your domain resolves. The foundation is poured.',
  },
  {
    week: 'Week 2',
    title: 'Build',
    subtitle: 'The website takes shape.',
    items: [
      'Full website build (Next.js 15, dark mode)',
      'Service pages with your actual content',
      'Project gallery structure',
      'SEO structured data + Schema.org',
      'RSS feeds configured',
      'Mobile-first responsive design',
    ],
    deliverable: 'A live website that looks like a $50K custom build.',
  },
  {
    week: 'Week 3',
    title: 'Intelligence',
    subtitle: 'Content pipeline goes live.',
    items: [
      'Reddit channel strategy + first posts',
      'Content pipeline configuration',
      'Knowledge repository population',
      'Voice DNA refinement from session transcripts',
      'SEO audit + optimization pass',
    ],
    deliverable: 'Your content pipeline is flowing. Your Reddit presence exists.',
  },
  {
    week: 'Week 4',
    title: 'Launch',
    subtitle: 'Polish, train, hand off.',
    items: [
      'Final polish + cross-browser testing',
      'Full SEO/GEO audit',
      'Training session on managing the system',
      'Handoff documentation',
      'Choose: autonomous operation or human-in-the-loop',
    ],
    deliverable: 'Everything is live. You own every piece.',
  },
  {
    week: 'What You Own',
    title: 'No vendor lock. No monthly retainer trap.',
    subtitle: 'Everything built is yours.',
    items: [
      'Mac Mini (physical hardware, your property)',
      'Website source code (full repository)',
      'Database + all collected data',
      'Reddit channel (your account)',
      'Content pipeline (automated workflows)',
      'Voice DNA profile (your brand voice)',
      'Complete documentation',
    ],
  },
]

const proofCards = [
  {
    type: 'stat' as const,
    title: 'Reddit Results (30 days)',
    stats: [
      { value: '1,200+', label: 'Upvotes on first post' },
      { value: '290', label: 'Comments' },
      { value: '275K+', label: 'Combined views' },
      { value: '$0', label: 'Ad spend' },
    ],
    desc: 'Three Reddit posts for a NYC plumbing business. Zero dollars spent. Pure organic engagement from authentic content.',
  },
  {
    type: 'stat' as const,
    title: 'Website Traffic (30 days)',
    stats: [
      { value: '4,649', label: 'Visitors' },
      { value: '10,197', label: 'Page views' },
      { value: '2,205', label: 'Peak day visitors' },
      { value: '#1', label: 'Referrer: Reddit' },
    ],
    desc: 'theplumbernyc.com went from zero to thousands of visitors. Reddit drove 1,319 referrals. Google organic started indexing within weeks.',
  },
  {
    type: 'stat' as const,
    title: 'Real Business Results',
    stats: [
      { value: 'WNYC', label: 'Radio producer reached out' },
      { value: '50+', label: 'Direct messages' },
      { value: 'Page 1', label: 'Google "plumber nyc reddit"' },
      { value: '3', label: 'Posts dominating Google' },
    ],
    desc: 'A WNYC producer DM\'d asking to feature the plumber on air. Dozens of real leads in the inbox. Posts rank above paid Google ads.',
  },
]

/* Evidence images - served locally, not committed to public repo */
function EvidenceImage({ src, alt, fallback }: { src: string; alt: string; fallback: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div style={{
        width: '100%', aspectRatio: '16/9', background: `linear-gradient(135deg, ${NX.darkSubtle}, ${NX.darkCard})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: `1px solid ${NX.border}`,
      }}>
        <span style={{ fontSize: '13px', color: NX.textMuted, fontFamily: NX.mono, padding: '8px 16px', textAlign: 'center', lineHeight: 1.5 }}>
          {fallback}
        </span>
      </div>
    )
  }
  return <img src={src} alt={alt} style={{ width: '100%', height: 'auto', display: 'block' }} loading="lazy" onError={() => setFailed(true)} />
}

const faqItems = [
  {
    question: 'What tools do I need on my end?',
    answer: "Nothing beyond your phone and a computer. I handle all the technical setup. You'll get Claude Pro as part of the package for voice sessions and content work.",
  },
  {
    question: 'What if I want to run it myself after?',
    answer: "That's the entire point. Week 4 is dedicated to training and handoff. You'll have documentation, and the system is designed to run autonomously or with minimal input.",
  },
  {
    question: 'What happens after 30 days?',
    answer: "You own everything. The Mac Mini, the code, the data, the content pipeline. No ongoing retainer required. If you want continued support or expansion, we can discuss, but there's zero lock-in.",
  },
  {
    question: 'Do I really own everything?',
    answer: "Yes. The Mac Mini is shipped to you. The website repo is in your GitHub. The domain is in your Cloudflare. The Reddit channel is your account. Every piece of infrastructure is in your name.",
  },
  {
    question: 'How do the sessions work?',
    answer: "3-5 sessions over the 30 days, each about 30 minutes. We record transcripts (with your permission) and use them to train the AI on your voice. More sessions means a stronger voice profile, but the minimum gets the job done.",
  },
  {
    question: 'What is a Mac Mini intelligence node?',
    answer: "A Mac Mini M4 configured as your private, always-on server. It stores your data, runs your website locally for development, handles automated tasks like content scheduling, and gives you a residential IP that can't be blocked by platforms the way cloud servers can.",
  },
]

/* ─── Scoped CSS ─── */
const scopedCSS = `
  .nx-page * { box-sizing: border-box; }
  .nx-page a { transition: opacity 0.15s ease; }
  .nx-page a:hover { opacity: 0.85; }
  .nx-stat-value {
    font-size: clamp(28px, 5vw, 44px);
    font-weight: 700;
    color: ${NX.green};
    line-height: 1;
  }
  .nx-stat-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${NX.textMuted};
    margin-top: 6px;
  }
  @media (max-width: 768px) {
    .nx-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .nx-hero-title { font-size: clamp(28px, 7vw, 48px) !important; }
    .nx-cost-grid { grid-template-columns: 1fr !important; }
    .nx-case-grid { grid-template-columns: 1fr !important; }
    .nx-evidence-grid { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 480px) {
    .nx-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 20px !important; }
  }
`

/* ─── Helper Components ─── */

function NXSection({ children, background = NX.dark, style, noPad }: {
  children: React.ReactNode
  background?: string
  style?: React.CSSProperties
  noPad?: boolean
}) {
  return (
    <section className="full-bleed" style={{ background, padding: noPad ? '0 24px' : '80px 24px', ...style }}>
      <MotionReveal variant="fadeUp">
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>{children}</div>
      </MotionReveal>
    </section>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: '12px', fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.12em', color: NX.green, fontFamily: NX.font, marginBottom: 12,
    }}>{children}</div>
  )
}

function SectionTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{
        fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, color: NX.text,
        fontFamily: NX.font, lineHeight: 1.2, margin: 0,
      }}>{children}</h2>
      {subtitle && (
        <p style={{
          fontSize: '16px', color: NX.textSecondary, fontFamily: NX.font,
          marginTop: 10, lineHeight: 1.6, maxWidth: 640,
        }}>{subtitle}</p>
      )}
    </div>
  )
}

function NXAccordion({ items }: { items: typeof faqItems }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div
            key={i}
            style={{
              borderBottom: `1px solid ${NX.border}`,
              borderLeft: isOpen ? `2px solid ${NX.green}` : '2px solid transparent',
              transition: 'border-color 0.2s ease',
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: NX.font,
                fontSize: '16px',
                fontWeight: 600,
                color: NX.text,
                textAlign: 'left',
              }}
            >
              {item.question}
              <span style={{
                color: NX.green,
                fontSize: '20px',
                fontWeight: 400,
                transition: 'transform 0.2s ease',
                transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                flexShrink: 0,
                marginLeft: 16,
              }}>+</span>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <p style={{
                    padding: '0 16px 20px',
                    margin: 0,
                    fontSize: '15px',
                    lineHeight: 1.7,
                    color: NX.textSecondary,
                    fontFamily: NX.font,
                  }}>{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Checklist Item ─── */
function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
      <span style={{ color: NX.green, fontSize: '14px', lineHeight: '1.6', flexShrink: 0 }}>&#10003;</span>
      <span style={{ fontSize: '15px', color: NX.textSecondary, fontFamily: NX.font, lineHeight: 1.6 }}>{children}</span>
    </div>
  )
}

/* ─── Main Component ─── */
export function NexusProposalContent() {
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    if (Date.now() > PROPOSAL_CREATED + TTL_MS) {
      setExpired(true)
    }
  }, [])

  if (expired) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: NX.dark,
        fontFamily: NX.font, padding: 24, textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, color: NX.text, margin: '0 0 16px' }}>
          This proposal has expired.
        </h1>
        <p style={{ fontSize: '18px', color: NX.textSecondary, maxWidth: 480, lineHeight: 1.6, margin: '0 0 32px' }}>
          This was a time-limited, custom-built proposal. Reach out to discuss next steps.
        </p>
        <a
          href="mailto:shawn@shawnos.ai"
          style={{
            display: 'inline-block', padding: '14px 36px', fontSize: '15px',
            fontWeight: 600, color: '#fff', background: NX.green,
            border: `1px solid ${NX.green}`, borderRadius: 8, textDecoration: 'none',
          }}
        >Get in Touch</a>
      </div>
    )
  }

  return (
    <div className="nx-page" style={{ fontFamily: NX.font, background: NX.dark, color: NX.text, minHeight: '100vh' }}>
      <style>{scopedCSS}</style>

      {/* ── Section 1: Hero ── */}
      <section style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 24px',
        background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${NX.greenGlow}, ${NX.dark} 70%)`,
        position: 'relative',
      }}>
        <MotionReveal variant="fadeUp" delay={0.1}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 999,
            background: NX.greenGlow,
            border: `1px solid ${NX.greenBorder}`,
            marginBottom: 32,
            fontSize: '13px',
            fontWeight: 600,
            color: NX.greenLt,
            fontFamily: NX.font,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: NX.green,
            }} />
            Custom Proposal
          </div>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.2}>
          <h1 className="nx-hero-title" style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.1,
            margin: '0 0 24px',
            fontFamily: NX.font,
            color: NX.white,
          }}>
            Built for{' '}
            <span style={{ color: NX.green }}>Nexus Construction</span>
          </h1>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.35}>
          <p style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: NX.textSecondary,
            maxWidth: 640,
            margin: '0 auto 48px',
            lineHeight: 1.6,
            fontFamily: NX.font,
          }}>
            A 30-day build. One Mac Mini. A website, intelligence engine, and growth strategy from foundation to launch.
          </p>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.5}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <MagneticHover>
              <a href="#roadmap" style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: NX.green,
                color: NX.dark,
                fontWeight: 700,
                fontSize: '15px',
                borderRadius: 10,
                textDecoration: 'none',
                fontFamily: NX.font,
                border: 'none',
              }}>See the Roadmap</a>
            </MagneticHover>
            <MagneticHover>
              <a href="/for/nexus/preview" style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: 'transparent',
                color: NX.green,
                fontWeight: 700,
                fontSize: '15px',
                borderRadius: 10,
                textDecoration: 'none',
                fontFamily: NX.font,
                border: `1.5px solid ${NX.green}`,
              }}>See Your Website</a>
            </MagneticHover>
          </div>
        </MotionReveal>

        <div style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          color: NX.textMuted,
          fontSize: '24px',
          animation: 'nx-bounce 2s infinite',
        }}>&#8964;</div>
        <style>{`@keyframes nx-bounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }`}</style>
      </section>

      {/* ── Section 2: Stats Strip ── */}
      <NXSection
        background={NX.darkSubtle}
        style={{
          borderTop: `1px solid ${NX.border}`,
          borderBottom: `1px solid ${NX.border}`,
          padding: '48px 24px',
        }}
      >
        <SectionLabel>We did our homework</SectionLabel>
        <div
          className="nx-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
            gap: 32,
            marginTop: 24,
          }}
        >
          {stats.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div className="nx-stat-value">{stat.value}</div>
              <div className="nx-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </NXSection>

      {/* ── Section 3: Horizontal Scroll Roadmap ── */}
      <div id="roadmap">
        <HorizontalScrollSection>
          {/* Panel 1: Overview */}
          <HorizontalPanel style={{ background: NX.dark }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
              <div>
                <SectionLabel>The Roadmap</SectionLabel>
                <h2 style={{
                  fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: NX.text,
                  fontFamily: NX.font, lineHeight: 1.15, margin: '0 0 8px',
                }}>{roadmap[0].title}</h2>
                <p style={{
                  fontSize: '16px', color: NX.textSecondary, fontFamily: NX.font,
                  marginBottom: 28, lineHeight: 1.6,
                }}>{roadmap[0].subtitle}</p>
                {roadmap[0].items.map((item, i) => (
                  <CheckItem key={i}>{item}</CheckItem>
                ))}
              </div>
              <div style={{
                background: NX.darkCard,
                border: `1px solid ${NX.border}`,
                borderRadius: 14,
                padding: 28,
              }}>
                <div style={{
                  fontSize: '12px', fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.1em', color: NX.textMuted, marginBottom: 20,
                }}>Infrastructure Costs</div>
                {infrastructure.map((inf, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    padding: '12px 0',
                    borderBottom: i < infrastructure.length - 1 ? `1px solid ${NX.border}` : 'none',
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', color: NX.text, fontFamily: NX.font, fontWeight: 500 }}>{inf.item}</div>
                      <div style={{ fontSize: '12px', color: NX.textMuted, fontFamily: NX.font, marginTop: 2 }}>{inf.note}</div>
                    </div>
                    <div style={{ fontSize: '14px', color: NX.green, fontFamily: NX.mono, fontWeight: 600, flexShrink: 0, marginLeft: 16 }}>{inf.cost}</div>
                  </div>
                ))}
                <div style={{
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: `1px solid ${NX.borderLt}`,
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: '14px', color: NX.textSecondary, fontFamily: NX.font, marginBottom: 8,
                  }}>
                    <span>Services &amp; labor</span>
                    <span style={{ fontFamily: NX.mono, color: NX.textSecondary }}>~$8,511</span>
                  </div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    marginTop: 8,
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: NX.textMuted }}>Total Package</span>
                    <span style={{ fontSize: '28px', fontWeight: 700, color: NX.green, fontFamily: NX.font }}>$10,000</span>
                  </div>
                </div>
              </div>
            </div>
          </HorizontalPanel>

          {/* Panels 2-5: Weeks 1-4 */}
          {roadmap.slice(1, 5).map((week, i) => (
            <HorizontalPanel key={i} style={{ background: NX.dark }}>
              <div style={{ maxWidth: 680 }}>
                <div style={{
                  display: 'inline-block',
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: NX.greenGlow,
                  border: `1px solid ${NX.greenBorder}`,
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: NX.green,
                  fontFamily: NX.font,
                  marginBottom: 24,
                }}>{week.week}</div>
                <h2 style={{
                  fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: NX.text,
                  fontFamily: NX.font, lineHeight: 1.15, margin: '0 0 8px',
                }}>{week.title}</h2>
                <p style={{
                  fontSize: '16px', color: NX.textSecondary, fontFamily: NX.font,
                  marginBottom: 28, lineHeight: 1.6,
                }}>{week.subtitle}</p>
                {week.items.map((item, j) => (
                  <CheckItem key={j}>{item}</CheckItem>
                ))}
                {week.deliverable && (
                  <div style={{
                    marginTop: 32,
                    padding: '16px 20px',
                    borderLeft: `3px solid ${NX.amber}`,
                    background: NX.amberGlow,
                    borderRadius: '0 8px 8px 0',
                  }}>
                    <div style={{
                      fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
                      letterSpacing: '0.1em', color: NX.amber, marginBottom: 6,
                    }}>Deliverable</div>
                    <p style={{
                      margin: 0, fontSize: '15px', color: NX.amberLt,
                      fontFamily: NX.font, lineHeight: 1.6, fontStyle: 'italic',
                    }}>{week.deliverable}</p>
                  </div>
                )}
              </div>
            </HorizontalPanel>
          ))}

          {/* Panel 6: What You Own */}
          <HorizontalPanel style={{ background: NX.dark }}>
            <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
              <SectionLabel>Ownership</SectionLabel>
              <h2 style={{
                fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, color: NX.text,
                fontFamily: NX.font, lineHeight: 1.2, margin: '0 0 12px',
              }}>{roadmap[5].title}</h2>
              <p style={{
                fontSize: '16px', color: NX.textSecondary, fontFamily: NX.font,
                marginBottom: 36, lineHeight: 1.6,
              }}>{roadmap[5].subtitle}</p>
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center',
              }}>
                {roadmap[5].items.map((item, i) => (
                  <div key={i} style={{
                    padding: '12px 20px',
                    background: NX.darkCard,
                    border: `1px solid ${NX.border}`,
                    borderRadius: 10,
                    fontSize: '14px',
                    color: NX.text,
                    fontFamily: NX.font,
                    fontWeight: 500,
                  }}>{item}</div>
                ))}
              </div>
              <p style={{
                marginTop: 40,
                fontSize: '17px',
                color: NX.green,
                fontWeight: 600,
                fontFamily: NX.font,
              }}>
                No subscriptions. No vendor lock. No asking permission to use your own data.
              </p>
            </div>
          </HorizontalPanel>
        </HorizontalScrollSection>
      </div>

      {/* ── Section 4: Proof ── */}
      <NXSection>
        <SectionLabel>Case Study</SectionLabel>
        <SectionTitle subtitle="Same stack. Same process. Built for a 30-year NYC plumbing business in under 30 days.">
          Proof It Works
        </SectionTitle>

        {/* Stat cards */}
        <StaggerContainer>
          <div className="nx-case-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 48 }}>
            {proofCards.map((card, i) => (
              <StaggerItem key={i}>
                <div style={{
                  background: NX.darkCard, border: `1px solid ${NX.border}`,
                  borderRadius: 14, padding: 28, height: '100%',
                }}>
                  <h3 style={{
                    fontSize: '16px', fontWeight: 700, color: NX.text,
                    fontFamily: NX.font, margin: '0 0 20px',
                  }}>{card.title}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    {card.stats.map((s, j) => (
                      <div key={j}>
                        <div style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700, color: NX.green, lineHeight: 1 }}>{s.value}</div>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: NX.textMuted, marginTop: 4 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <p style={{
                    fontSize: '13px', color: NX.textSecondary, fontFamily: NX.font,
                    lineHeight: 1.6, margin: 0, borderTop: `1px solid ${NX.border}`, paddingTop: 16,
                  }}>{card.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {/* Screenshot evidence - featured layout */}
        <SectionLabel>The Receipts</SectionLabel>

        {/* Hero evidence: the 1.2K post */}
        <MotionReveal variant="fadeUp" delay={0.1}>
          <div style={{
            borderRadius: 14, overflow: 'hidden', marginTop: 16, marginBottom: 20,
            border: `1px solid ${NX.border}`, background: NX.darkCard,
          }}>
            <EvidenceImage
              src="/images/case-studies/plumber/reddit-asknyc-1200.png"
              alt="Reddit post with 1200 upvotes"
              fallback="Reddit post: r/AskNYC - 1.2K upvotes, 290 comments, 114K views"
            />
            <div style={{
              padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderTop: `1px solid ${NX.border}`,
            }}>
              <span style={{ fontSize: '14px', color: NX.text, fontFamily: NX.font, fontWeight: 600 }}>
                1.2K upvotes, 290 comments, 114K views
              </span>
              <span style={{
                fontSize: '12px', color: NX.green, fontFamily: NX.mono,
                padding: '4px 10px', background: NX.greenGlow, border: `1px solid ${NX.greenBorder}`,
                borderRadius: 6,
              }}>r/AskNYC</span>
            </div>
          </div>
        </MotionReveal>

        {/* Two-column evidence grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }} className="nx-evidence-grid">
          {[
            { src: '/images/case-studies/plumber/reddit-asknyc-493.png', caption: '493 upvotes, 48 comments, 73K views', tag: 'r/AskNYC' },
            { src: '/images/case-studies/plumber/reddit-nyc-apartments-378.png', caption: '378 upvotes, 24 comments, 88K views', tag: 'r/NYCApartments' },
          ].map((img, i) => (
            <MotionReveal key={i} variant="fadeUp" delay={0.15 + i * 0.1}>
              <div style={{
                borderRadius: 12, overflow: 'hidden',
                border: `1px solid ${NX.border}`, background: NX.darkCard,
              }}>
                <EvidenceImage src={img.src} alt={img.caption} fallback={img.caption} />
                <div style={{
                  padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderTop: `1px solid ${NX.border}`,
                }}>
                  <span style={{ fontSize: '13px', color: NX.textSecondary, fontFamily: NX.font }}>{img.caption}</span>
                  <span style={{ fontSize: '11px', color: NX.green, fontFamily: NX.mono }}>{img.tag}</span>
                </div>
              </div>
            </MotionReveal>
          ))}
        </div>

        {/* DMs + Google evidence */}
        <MotionReveal variant="fadeUp" delay={0.2}>
          <div style={{
            borderRadius: 14, overflow: 'hidden', marginBottom: 20,
            border: `1px solid ${NX.amberBorder}`, background: NX.darkCard,
          }}>
            <EvidenceImage
              src="/images/case-studies/plumber/reddit-dms-wnyc.png"
              alt="Reddit DMs including WNYC radio producer"
              fallback="Real DMs: WNYC producer, plumbing questions, phone numbers shared"
            />
            <div style={{
              padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderTop: `1px solid ${NX.amberBorder}`, background: NX.amberGlow,
            }}>
              <span style={{ fontSize: '14px', color: NX.text, fontFamily: NX.font, fontWeight: 600 }}>
                A WNYC radio producer reached out. Real DMs. Real leads.
              </span>
              <span style={{
                fontSize: '12px', color: NX.amber, fontFamily: NX.mono,
                padding: '4px 10px', background: NX.amberGlow, border: `1px solid ${NX.amberBorder}`,
                borderRadius: 6,
              }}>Inbound</span>
            </div>
          </div>
        </MotionReveal>

        {/* Google + Analytics side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="nx-evidence-grid">
          <MotionReveal variant="fadeUp" delay={0.25}>
            <div style={{
              borderRadius: 12, overflow: 'hidden',
              border: `1px solid ${NX.border}`, background: NX.darkCard,
            }}>
              <EvidenceImage
                src="/images/case-studies/plumber/google-plumber-nyc-1.png"
                alt="Google search results dominated"
                fallback="Google: 'plumber nyc reddit' - 3 posts on page 1, above paid ads"
              />
              <div style={{
                padding: '12px 16px', borderTop: `1px solid ${NX.border}`,
              }}>
                <span style={{ fontSize: '13px', color: NX.textSecondary, fontFamily: NX.font }}>
                  Dominating page 1 for &quot;plumber nyc reddit&quot;
                </span>
              </div>
            </div>
          </MotionReveal>
          <MotionReveal variant="fadeUp" delay={0.3}>
            <div style={{
              borderRadius: 12, overflow: 'hidden',
              border: `1px solid ${NX.border}`, background: NX.darkCard,
            }}>
              <EvidenceImage
                src="/images/case-studies/plumber/analytics-peak.png"
                alt="Analytics showing 2,205 visitors peak day"
                fallback="Vercel Analytics: 4,649 visitors, 10,197 page views, 2,205 peak day"
              />
              <div style={{
                padding: '12px 16px', borderTop: `1px solid ${NX.border}`,
              }}>
                <span style={{ fontSize: '13px', color: NX.textSecondary, fontFamily: NX.font }}>
                  2,205 visitors in a single day. Reddit as #1 referrer.
                </span>
              </div>
            </div>
          </MotionReveal>
        </div>
      </NXSection>

      {/* ── Section 5: Meta Proof ── */}
      <NXSection background={NX.darkSubtle} style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700,
          fontFamily: NX.font, lineHeight: 1.2, margin: '0 0 16px', color: NX.text,
        }}>
          This page is <span style={{ color: NX.green }}>the demo</span>.
        </h2>
        <p style={{
          fontSize: '18px', color: NX.textSecondary, fontFamily: NX.font,
          maxWidth: 560, margin: '0 auto', lineHeight: 1.6,
        }}>
          Custom-built for Nexus Construction. Deployed in hours using the same stack we'll build for you.
        </p>
      </NXSection>

      {/* ── Section 6: Sessions + FAQ ── */}
      <NXSection>
        <SectionLabel>How It Works</SectionLabel>
        <SectionTitle subtitle="3-5 sessions over 30 days. Each about 30 minutes. We extract your voice, refine the build, and train you on the system.">
          Sessions &amp; Support
        </SectionTitle>
        <p style={{
          fontSize: '15px', color: NX.textSecondary, fontFamily: NX.font,
          lineHeight: 1.7, maxWidth: 640, marginBottom: 40,
        }}>
          Every session is recorded (with your permission) and used to build your Voice DNA profile. This is how the AI learns to write like you, not like a generic marketing agency. The more sessions, the stronger the voice. But even the minimum gets the job done.
        </p>
        <NXAccordion items={faqItems} />
      </NXSection>

      {/* ── Section 7: CTA ── */}
      <NXSection
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 50%, ${NX.greenGlow}, ${NX.dark} 70%)`,
          padding: '100px 24px',
          textAlign: 'center',
        }}
      >
        <h2 style={{
          fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800,
          fontFamily: NX.font, color: NX.white, margin: '0 0 32px',
        }}>
          Let&apos;s build.
        </h2>
        <MagneticHover>
          <a href="#" style={{
            display: 'inline-block',
            padding: '16px 40px',
            background: NX.green,
            color: NX.dark,
            fontWeight: 700,
            fontSize: '16px',
            borderRadius: 10,
            textDecoration: 'none',
            fontFamily: NX.font,
            border: 'none',
          }}>Start the Conversation</a>
        </MagneticHover>
        <p style={{
          marginTop: 20,
          fontSize: '14px',
          color: NX.textMuted,
          fontFamily: NX.font,
        }}>or text (323) 628-3268</p>
      </NXSection>

      {/* ── Section 8: Footer ── */}
      <section style={{
        padding: '32px 24px',
        textAlign: 'center',
        background: NX.dark,
        borderTop: `1px solid ${NX.border}`,
      }}>
        <a
          href="https://shawnos.ai"
          style={{
            fontSize: '12px',
            color: NX.textMuted,
            fontFamily: NX.font,
            textDecoration: 'none',
          }}
        >
          Built with ShawnOS.ai
        </a>
      </section>
    </div>
  )
}
