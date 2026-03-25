'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MotionReveal, StaggerContainer, StaggerItem, MagneticHover } from '@shawnos/shared/components'

/* ─── TTL: 48 hours from deploy ─── */
const PROPOSAL_CREATED = new Date('2026-03-25T06:00:00Z').getTime()
const TTL_MS = 48 * 60 * 60 * 1000

/* ─── Theme ─── */
const NC = {
  amber: '#D4872A',
  amberLt: '#E8A34C',
  amberGlow: 'rgba(212, 135, 42, 0.12)',
  amberBorder: 'rgba(212, 135, 42, 0.25)',
  amberDeep: '#B8701E',
  charcoal: '#1A1A1A',
  gunmetal: '#2C2F33',
  steel: '#404448',
  warmSilver: '#B8B2A8',
  dark: '#0D0D0D',
  darkSubtle: '#121212',
  darkCard: '#181818',
  border: '#2A2A2A',
  borderLt: '#383838',
  text: '#F0EDE8',
  textSecondary: '#A09888',
  textMuted: '#706858',
  white: '#FAF8F5',
  font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, 'Helvetica Neue', sans-serif",
} as const

/* ─── Data ─── */
const services = [
  { title: 'Roofing', desc: 'Residential and commercial installations, repairs, and inspections.', icon: 'roof' },
  { title: 'Kitchen Remodeling', desc: 'Custom designs from modern minimalist to classic luxury.', icon: 'kitchen' },
  { title: 'Bathroom Remodeling', desc: 'Full renovations with premium fixtures and finishes.', icon: 'bath' },
  { title: 'Fencing & Gates', desc: 'Security, privacy, and curb appeal in one installation.', icon: 'fence' },
  { title: 'Painting', desc: 'Interior and exterior with meticulous prep and lasting finish.', icon: 'paint' },
  { title: 'General Contracting', desc: 'Full-scale project management from permit to final walkthrough.', icon: 'build' },
]

const trustBadges = [
  { value: 'A', label: 'BBB Rating' },
  { value: '93', label: 'BuildZoom Score' },
  { value: '#1124270', label: 'License' },
  { value: '5', label: 'Counties' },
]

const projects = [
  { title: 'Kitchen Remodel', location: 'Beverly Hills', type: 'Residential' },
  { title: 'Full Home Renovation', location: 'Santa Monica', type: 'Residential' },
  { title: 'Commercial Roofing', location: 'Downtown LA', type: 'Commercial' },
  { title: 'Bathroom Suite', location: 'Brentwood', type: 'Residential' },
  { title: 'Exterior Restoration', location: 'Pasadena', type: 'Residential' },
  { title: 'Custom Fencing', location: 'Malibu', type: 'Residential' },
]

const processSteps = [
  { step: '01', title: 'Consultation', desc: 'We visit your property, understand your vision, and provide a detailed estimate with our Price Protection Guarantee.' },
  { step: '02', title: 'Design', desc: 'Our team creates a comprehensive project plan with materials, timeline, and milestones you approve before any work begins.' },
  { step: '03', title: 'Build', desc: 'Licensed craftsmen execute with precision. Direct communication with our team throughout, no middlemen, no surprises.' },
  { step: '04', title: 'Handoff', desc: 'Final walkthrough, quality inspection, and warranty documentation. Your space, transformed.' },
]

const testimonials = [
  { quote: 'Nexus transformed our kitchen beyond what we imagined. Professional from day one to final walkthrough.', name: 'Placeholder Name', project: 'Kitchen Remodel, Beverly Hills' },
  { quote: 'The roofing job was done faster than quoted and the crew left our property spotless. Highly recommend.', name: 'Placeholder Name', project: 'Roof Installation, Santa Monica' },
  { quote: 'We had three contractors quote us. Nexus was the only one who showed up with a detailed plan and stuck to the timeline.', name: 'Placeholder Name', project: 'Full Renovation, Brentwood' },
]

const counties = ['Los Angeles', 'Orange', 'Riverside', 'San Bernardino', 'Ventura']

/* ─── Scoped CSS ─── */
const scopedCSS = `
  .nc-page * { box-sizing: border-box; }
  .nc-page a { transition: opacity 0.15s ease; }
  .nc-page a:hover { opacity: 0.85; }
  @media (max-width: 768px) {
    .nc-services-grid { grid-template-columns: 1fr 1fr !important; }
    .nc-gallery-grid { grid-template-columns: 1fr 1fr !important; }
    .nc-trust-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .nc-hero-title { font-size: clamp(40px, 10vw, 56px) !important; }
    .nc-about-split { grid-template-columns: 1fr !important; }
    .nc-counties-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .nc-testimonials-grid { grid-template-columns: 1fr !important; }
    .nc-process-row { flex-direction: column !important; gap: 16px !important; }
    .nc-process-line { display: none !important; }
  }
  @media (max-width: 480px) {
    .nc-services-grid { grid-template-columns: 1fr !important; }
    .nc-gallery-grid { grid-template-columns: 1fr !important; }
    .nc-counties-grid { grid-template-columns: 1fr !important; }
  }
`

/* ─── Service Icons ─── */
function ServiceIcon({ type }: { type: string }) {
  const stroke = NC.amber
  const props = {
    width: 40,
    height: 40,
    viewBox: '0 0 40 40',
    fill: 'none',
    stroke,
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (type) {
    case 'roof':
      return (
        <svg {...props}>
          <path d="M5 22L20 8L35 22" />
          <path d="M9 19V33H31V19" />
        </svg>
      )
    case 'kitchen':
      return (
        <svg {...props}>
          <rect x="5" y="18" width="30" height="15" rx="1" />
          <path d="M5 23H35" />
          <path d="M15 8V18" />
          <circle cx="15" cy="6" r="2" />
          <path d="M25 12V18" />
          <circle cx="25" cy="10" r="2" />
        </svg>
      )
    case 'bath':
      return (
        <svg {...props}>
          <path d="M5 20H35" />
          <path d="M8 20V30C8 32 10 34 14 34H26C30 34 32 32 32 30V20" />
          <path d="M10 20V10C10 8 12 6 14 6H16" />
        </svg>
      )
    case 'fence':
      return (
        <svg {...props}>
          <path d="M5 14V32" />
          <path d="M15 10V32" />
          <path d="M25 14V32" />
          <path d="M35 10V32" />
          <path d="M5 18H35" />
          <path d="M5 26H35" />
          <path d="M5 12L10 8L15 12" />
          <path d="M25 12L30 8L35 12" />
        </svg>
      )
    case 'paint':
      return (
        <svg {...props}>
          <rect x="14" y="6" width="18" height="12" rx="2" />
          <path d="M18 18V28" />
          <rect x="12" y="28" width="12" height="6" rx="1" />
        </svg>
      )
    case 'build':
      return (
        <svg {...props}>
          <path d="M20 8L20 28" />
          <path d="M14 28H26" />
          <path d="M14 8H26L28 12H12L14 8Z" />
        </svg>
      )
    default:
      return null
  }
}

/* ─── Section Wrapper ─── */
function NCSection({
  children,
  background = NC.dark,
  style,
  noPad,
  id,
}: {
  children: React.ReactNode
  background?: string
  style?: React.CSSProperties
  noPad?: boolean
  id?: string
}) {
  return (
    <section id={id} style={{ background, padding: noPad ? '0 24px' : '120px 24px', ...style }}>
      <MotionReveal variant="fadeUp">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>{children}</div>
      </MotionReveal>
    </section>
  )
}

/* ─── Section Label ─── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: NC.amber,
        marginBottom: 16,
        fontFamily: NC.font,
      }}
    >
      {children}
    </div>
  )
}

/* ─── Section Title ─── */
function SectionTitle({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h2
      style={{
        fontSize: 'clamp(28px, 4vw, 42px)',
        fontWeight: 700,
        color: NC.white,
        margin: '0 0 56px',
        lineHeight: 1.2,
        fontFamily: NC.font,
        ...style,
      }}
    >
      {children}
    </h2>
  )
}

/* ─── Main Component ─── */
export function NexusPreviewContent() {
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
        alignItems: 'center', justifyContent: 'center', background: NC.dark,
        fontFamily: NC.font, padding: 24, textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, color: NC.text, margin: '0 0 16px' }}>
          This preview has expired.
        </h1>
        <p style={{ fontSize: '18px', color: NC.textSecondary, maxWidth: 480, lineHeight: 1.6, margin: '0 0 32px' }}>
          This was a time-limited website preview. Reach out to discuss building yours.
        </p>
        <a
          href="mailto:shawn@shawnos.ai"
          style={{
            display: 'inline-block', padding: '14px 36px', fontSize: '15px',
            fontWeight: 600, color: NC.dark, background: NC.amber,
            border: `1px solid ${NC.amber}`, borderRadius: 8, textDecoration: 'none',
          }}
        >Get in Touch</a>
      </div>
    )
  }

  return (
    <div
      className="nc-page"
      style={{
        fontFamily: NC.font,
        background: NC.dark,
        color: NC.text,
        minHeight: '100dvh',
        overflowX: 'hidden',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: scopedCSS }} />

      {/* ─── Preview Banner ─── */}
      <div
        style={{
          position: 'fixed',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          background: 'rgba(13, 13, 13, 0.9)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `1px solid ${NC.border}`,
          borderRadius: 100,
          padding: '8px 20px',
          fontSize: 13,
          color: NC.textSecondary,
          whiteSpace: 'nowrap',
        }}
      >
        This is a preview built by{' '}
        <a
          href="/for/nexus"
          style={{ color: NC.amber, textDecoration: 'none', fontWeight: 500 }}
        >
          ShawnOS.ai
        </a>
      </div>

      {/* ─── Section 1: Hero ─── */}
      <section
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px',
          position: 'relative',
          background: `radial-gradient(ellipse 80% 50% at 50% 60%, rgba(212, 135, 42, 0.06), ${NC.dark} 70%)`,
        }}
      >
        <MotionReveal variant="fadeUp" delay={0.1}>
          <h1
            className="nc-hero-title"
            style={{
              fontSize: 'clamp(48px, 12vw, 120px)',
              letterSpacing: '0.15em',
              fontWeight: 800,
              color: NC.white,
              margin: 0,
              lineHeight: 1,
              fontFamily: NC.font,
            }}
          >
            NEXUS
          </h1>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.2}>
          <div
            style={{
              fontSize: 'clamp(12px, 2vw, 18px)',
              letterSpacing: '0.3em',
              color: NC.amber,
              fontWeight: 500,
              marginTop: 12,
              fontFamily: NC.font,
            }}
          >
            CONSTRUCTION & DESIGN
          </div>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.3}>
          <p
            style={{
              fontSize: 20,
              color: NC.textSecondary,
              marginTop: 20,
              fontWeight: 400,
              fontFamily: NC.font,
            }}
          >
            Exceptional Craftsmanship. Seamless Experience.
          </p>
        </MotionReveal>

        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '200px' }}
          transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
          style={{ height: 1, background: NC.amber, margin: '32px auto 48px' }}
        />

        <MotionReveal variant="fadeUp" delay={0.7}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a
              href="#work"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: NC.amber,
                color: NC.dark,
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 8,
                textDecoration: 'none',
                border: 'none',
                fontFamily: NC.font,
                letterSpacing: '0.02em',
              }}
            >
              View Our Work
            </a>
            <a
              href="#quote"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: 'transparent',
                color: NC.amber,
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 8,
                textDecoration: 'none',
                border: `1px solid ${NC.amber}`,
                fontFamily: NC.font,
                letterSpacing: '0.02em',
              }}
            >
              Get a Quote
            </a>
          </div>
        </MotionReveal>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{
              width: 24,
              height: 40,
              border: `1px solid ${NC.borderLt}`,
              borderRadius: 12,
              display: 'flex',
              justifyContent: 'center',
              paddingTop: 8,
            }}
          >
            <motion.div
              style={{
                width: 3,
                height: 8,
                borderRadius: 3,
                background: NC.textMuted,
              }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Section 2: Services Grid ─── */}
      <NCSection>
        <SectionLabel>WHAT WE BUILD</SectionLabel>
        <SectionTitle>Full-Service Construction</SectionTitle>
        <div
          className="nc-services-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}
        >
          {services.map((s) => (
            <motion.div
              key={s.title}
              whileHover={{ borderColor: NC.amberBorder, y: -2 }}
              transition={{ duration: 0.2 }}
              style={{
                background: NC.darkCard,
                border: `1px solid ${NC.border}`,
                borderRadius: 12,
                padding: 32,
                cursor: 'default',
              }}
            >
              <div style={{ marginBottom: 20 }}>
                <ServiceIcon type={s.icon} />
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: NC.text,
                  margin: '0 0 8px',
                  fontFamily: NC.font,
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: NC.textSecondary,
                  margin: 0,
                  lineHeight: 1.6,
                  fontFamily: NC.font,
                }}
              >
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </NCSection>

      {/* ─── Section 3: About / Trust ─── */}
      <NCSection background={NC.darkSubtle}>
        <div
          className="nc-about-split"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: 64,
            alignItems: 'start',
          }}
        >
          <div>
            <SectionLabel>ABOUT NEXUS</SectionLabel>
            <SectionTitle style={{ marginBottom: 24 }}>
              20+ years of family-owned craftsmanship serving Southern California.
            </SectionTitle>
            <p
              style={{
                fontSize: 16,
                color: NC.textSecondary,
                lineHeight: 1.8,
                margin: '0 0 20px',
                fontFamily: NC.font,
              }}
            >
              What started as a family trade is now a full-service construction firm trusted across
              five counties. We believe in direct communication, transparent pricing, and work that
              speaks for itself. No middlemen. No surprises. Just quality you can see and feel.
            </p>
            <p
              style={{
                fontSize: 16,
                color: NC.textSecondary,
                lineHeight: 1.8,
                margin: 0,
                fontFamily: NC.font,
              }}
            >
              Licensed, insured, and committed to delivering on every promise.
            </p>
          </div>

          <div
            className="nc-trust-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 16,
            }}
          >
            {trustBadges.map((b) => (
              <div
                key={b.label}
                style={{
                  background: NC.darkCard,
                  border: `1px solid ${NC.border}`,
                  borderRadius: 12,
                  padding: '28px 20px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: 'clamp(32px, 4vw, 48px)',
                    fontWeight: 700,
                    color: NC.amber,
                    lineHeight: 1.1,
                    fontFamily: NC.font,
                  }}
                >
                  {b.value}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: NC.textMuted,
                    marginTop: 8,
                    fontFamily: NC.font,
                  }}
                >
                  {b.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </NCSection>

      {/* ─── Section 4: Project Gallery ─── */}
      <NCSection>
        <div id="work">
          <SectionLabel>OUR WORK</SectionLabel>
          <SectionTitle>Projects Across Southern California</SectionTitle>
        </div>
        <div
          className="nc-gallery-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}
        >
          {projects.map((p) => (
            <motion.div
              key={p.title}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.25 }}
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  paddingBottom: '75%',
                  background: `linear-gradient(135deg, ${NC.charcoal}, ${NC.gunmetal})`,
                  position: 'relative',
                }}
              >
                {/* Placeholder text */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: NC.textMuted,
                    fontSize: 14,
                    fontFamily: NC.font,
                  }}
                >
                  [Project Photo]
                </div>

                {/* Type badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'rgba(13, 13, 13, 0.8)',
                    backdropFilter: 'blur(8px)',
                    color: NC.amber,
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontFamily: NC.font,
                  }}
                >
                  {p.type}
                </div>

                {/* Bottom overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '40px 16px 16px',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: NC.white,
                      fontFamily: NC.font,
                    }}
                  >
                    {p.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: NC.textSecondary,
                      marginTop: 2,
                      fontFamily: NC.font,
                    }}
                  >
                    {p.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </NCSection>

      {/* ─── Section 5: Process Timeline ─── */}
      <NCSection background={NC.darkSubtle}>
        <SectionLabel>OUR PROCESS</SectionLabel>
        <SectionTitle>From Vision to Reality</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {processSteps.map((s, i) => (
            <MotionReveal key={s.step} variant="fadeUp" delay={i * 0.1}>
              <div
                className="nc-process-row"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 32,
                  alignItems: 'flex-start',
                  position: 'relative',
                  paddingBottom: i < processSteps.length - 1 ? 48 : 0,
                }}
              >
                {/* Number + connecting line */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      border: `2px solid ${NC.amber}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      fontWeight: 700,
                      color: NC.amber,
                      fontFamily: NC.font,
                      flexShrink: 0,
                    }}
                  >
                    {s.step}
                  </div>
                  {i < processSteps.length - 1 && (
                    <div
                      className="nc-process-line"
                      style={{
                        width: 1,
                        flex: 1,
                        minHeight: 48,
                        background: `linear-gradient(to bottom, ${NC.amber}, transparent)`,
                        marginTop: 8,
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div style={{ paddingTop: 4 }}>
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: NC.white,
                      margin: '0 0 8px',
                      fontFamily: NC.font,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      color: NC.textSecondary,
                      margin: 0,
                      lineHeight: 1.7,
                      maxWidth: 560,
                      fontFamily: NC.font,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            </MotionReveal>
          ))}
        </div>
      </NCSection>

      {/* ─── Section 6: Testimonials ─── */}
      <NCSection>
        <SectionLabel>CLIENT STORIES</SectionLabel>
        <SectionTitle>What Our Clients Say</SectionTitle>
        <div
          className="nc-testimonials-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                background: NC.darkCard,
                border: `1px solid ${NC.border}`,
                borderRadius: 12,
                padding: 32,
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  color: NC.amber,
                  fontFamily: 'Georgia, serif',
                  lineHeight: 1,
                  marginBottom: 12,
                }}
              >
                &ldquo;
              </div>
              <p
                style={{
                  fontSize: 16,
                  color: NC.text,
                  lineHeight: 1.7,
                  fontStyle: 'italic',
                  margin: 0,
                  fontFamily: NC.font,
                }}
              >
                {t.quote}
              </p>
              <div
                style={{
                  width: '100%',
                  height: 1,
                  background: NC.border,
                  margin: '20px 0 16px',
                }}
              />
              <div
                style={{
                  fontSize: 14,
                  color: NC.textSecondary,
                  fontFamily: NC.font,
                }}
              >
                {t.name}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: NC.textMuted,
                  marginTop: 2,
                  fontFamily: NC.font,
                }}
              >
                {t.project}
              </div>
            </div>
          ))}
        </div>
      </NCSection>

      {/* ─── Section 7: Service Area ─── */}
      <NCSection
        background={`linear-gradient(180deg, ${NC.darkSubtle}, ${NC.dark})`}
        style={{ textAlign: 'center' }}
      >
        <SectionLabel>SERVING SOUTHERN CALIFORNIA</SectionLabel>
        <SectionTitle style={{ marginBottom: 40 }}>Five Counties. One Standard.</SectionTitle>
        <div
          className="nc-counties-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 16,
            maxWidth: 800,
            margin: '0 auto',
          }}
        >
          {counties.map((c) => (
            <div
              key={c}
              style={{
                background: NC.darkCard,
                border: `1px solid ${NC.amberBorder}`,
                borderRadius: 10,
                padding: '12px 24px',
                color: NC.amber,
                fontSize: 16,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: NC.font,
              }}
            >
              {c}
            </div>
          ))}
        </div>
      </NCSection>

      {/* ─── Section 8: CTA ─── */}
      <NCSection
        id="quote"
        background={`radial-gradient(ellipse 70% 50% at 50% 50%, rgba(212, 135, 42, 0.08), ${NC.dark} 70%)`}
        style={{ textAlign: 'center' }}
      >
        <MotionReveal variant="fadeUp">
          <h2
            style={{
              fontSize: 'clamp(36px, 6vw, 56px)',
              fontWeight: 700,
              color: NC.white,
              margin: '0 0 16px',
              lineHeight: 1.15,
              fontFamily: NC.font,
            }}
          >
            Ready to Build?
          </h2>
        </MotionReveal>
        <MotionReveal variant="fadeUp" delay={0.1}>
          <p
            style={{
              fontSize: 18,
              color: NC.textSecondary,
              margin: '0 0 40px',
              fontFamily: NC.font,
            }}
          >
            Free consultation. Transparent pricing. No obligation.
          </p>
        </MotionReveal>
        <MotionReveal variant="fadeUp" delay={0.2}>
          <MagneticHover>
            <a
              href="#"
              style={{
                display: 'inline-block',
                padding: '16px 40px',
                background: NC.amber,
                color: NC.dark,
                fontWeight: 700,
                fontSize: 16,
                borderRadius: 10,
                textDecoration: 'none',
                fontFamily: NC.font,
                letterSpacing: '0.02em',
              }}
            >
              Get Your Free Estimate
            </a>
          </MagneticHover>
        </MotionReveal>
        <MotionReveal variant="fadeUp" delay={0.3}>
          <div style={{ marginTop: 32 }}>
            <div
              style={{
                fontSize: 18,
                color: NC.textSecondary,
                fontFamily: NC.font,
                fontWeight: 500,
              }}
            >
              (323) 628-3268
            </div>
            <div
              style={{
                fontSize: 14,
                color: NC.textMuted,
                marginTop: 8,
                fontFamily: NC.font,
              }}
            >
              License #1124270
            </div>
          </div>
        </MotionReveal>
      </NCSection>

      {/* ─── Section 9: Footer ─── */}
      <footer
        style={{
          borderTop: `1px solid ${NC.border}`,
          padding: '60px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: NC.white,
              fontFamily: NC.font,
            }}
          >
            NEXUS
          </div>
          <div
            style={{
              fontSize: 13,
              color: NC.textMuted,
              marginTop: 4,
              fontFamily: NC.font,
            }}
          >
            Construction & Design, Inc.
          </div>
          <div
            style={{
              fontSize: 13,
              color: NC.textMuted,
              marginTop: 20,
              fontFamily: NC.font,
            }}
          >
            &copy; 2026 Nexus Construction & Design, Inc. All rights reserved.
          </div>
          <div
            style={{
              fontSize: 13,
              color: NC.textMuted,
              marginTop: 4,
              fontFamily: NC.font,
            }}
          >
            CA License #1124270
          </div>
          <div
            style={{
              fontSize: 12,
              color: NC.textMuted,
              marginTop: 20,
              fontFamily: NC.font,
            }}
          >
            Website by{' '}
            <a
              href="https://shawnos.ai"
              style={{ color: NC.textMuted, textDecoration: 'underline' }}
            >
              ShawnOS.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
