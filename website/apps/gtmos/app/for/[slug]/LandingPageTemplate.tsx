'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Script from 'next/script'
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
  MagneticHover,
} from '@shawnos/shared/components'
import type { PageData } from '@/lib/abm'

/* ── derive theme from PageData ──────────────────── */

function buildTheme(t: PageData['theme']) {
  return {
    color: t.primary,
    colorLt: t.primaryLight,
    colorGlow: t.primaryGlow,
    colorBorder: t.primaryLight.replace(')', ', 0.25)').replace('rgb', 'rgba'),
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
}

/* ── section wrapper ─────────────────────────────── */

function Section({
  children,
  background,
  style,
  noPad,
  theme,
}: {
  children: React.ReactNode
  background: string
  style?: React.CSSProperties
  noPad?: boolean
  theme: ReturnType<typeof buildTheme>
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

/* ── section headline helpers ────────────────────── */

function SectionLabel({
  children,
  theme,
}: {
  children: React.ReactNode
  theme: ReturnType<typeof buildTheme>
}) {
  return (
    <div
      style={{
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: theme.color,
        fontFamily: theme.font,
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
  theme,
}: {
  children: React.ReactNode
  subtitle?: string
  theme: ReturnType<typeof buildTheme>
}) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2
        style={{
          fontSize: 'clamp(26px, 4vw, 40px)',
          fontWeight: 700,
          color: theme.text,
          fontFamily: theme.font,
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
            color: theme.textSecondary,
            fontFamily: theme.font,
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

function Accordion({
  items,
  theme,
}: {
  items: PageData['faqItems']
  theme: ReturnType<typeof buildTheme>
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <MotionReveal key={i} variant="fadeUp" delay={i * 0.05}>
            <div
              style={{
                borderBottom: `1px solid ${theme.border}`,
                ...(i === 0 ? { borderTop: `1px solid ${theme.border}` } : {}),
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
                  fontFamily: theme.font,
                  fontSize: '16px',
                  color: theme.text,
                  textAlign: 'left',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ flex: 1, fontWeight: 500 }}>{item.question}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    color: theme.color,
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
                        borderLeft: `2px solid ${theme.color}`,
                        marginLeft: 0,
                        paddingLeft: 20,
                        fontSize: '15px',
                        lineHeight: 1.7,
                        color: theme.textSecondary,
                        fontFamily: theme.font,
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

/* ── main template ───────────────────────────────── */

export function LandingPageTemplate({ data, depersonalized = false }: { data: PageData; depersonalized?: boolean }) {
  const T = buildTheme(data.theme)
  const slug = data.slug
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

  // Resolve active contact from ?c= query param (ignored when depersonalized)
  const searchParams = useSearchParams()
  const contactParam = depersonalized ? null : searchParams.get('c')
  const activeContact = contactParam && data.contacts?.length
    ? data.contacts.find((c) => c.id === contactParam) ?? null
    : null
  const contactName = depersonalized ? '' : (activeContact?.name || data.contactName)
  const contactRole = depersonalized ? '' : (activeContact?.role || data.contactRole)

  const scopedCSS = `
    .abm-page-${slug} * {
      box-sizing: border-box;
    }
    .abm-page-${slug} a {
      transition: opacity 0.15s ease;
    }
    .abm-page-${slug} a:hover {
      opacity: 0.85;
    }
    .abm-stat-value {
      font-size: clamp(28px, 5vw, 44px);
      font-weight: 700;
      color: ${T.color};
      line-height: 1;
    }
    .abm-stat-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: ${T.textMuted};
      margin-top: 6px;
    }
    @media (max-width: 768px) {
      .abm-stats-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
      .abm-challenge-grid {
        grid-template-columns: 1fr !important;
      }
      .abm-deliverable-grid {
        grid-template-columns: 1fr !important;
      }
      .abm-hero-title {
        font-size: clamp(28px, 7vw, 48px) !important;
      }
    }
    @media (max-width: 480px) {
      .abm-stats-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 20px !important;
      }
    }
  `

  const calUrl = `https://cal.com/shawn-lead-alchemy/30min?overlayCalendar=true`
  const packagesUrl = `https://shawnos.ai/build#packages`
  const firstName = contactName.split(' ')[0]

  return (
    <div className={`abm-page-${slug}`} style={{ fontFamily: T.font }}>
      <style>{scopedCSS}</style>

      {/* ── PostHog ── */}
      {posthogKey && (
        <Script
          id="posthog-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onFeatureFlags onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('${posthogKey}', {
                api_host: '${posthogHost}',
                person_profiles: 'identified_only',
              });
              var _params = new URLSearchParams(window.location.search);
              if (!_params.get('preview')) {
                posthog.capture('abm_page_viewed', {
                  company_slug: '${data.slug}',
                  company_name: '${data.company}',
                  ${depersonalized ? '' : `contact_name: '${contactName}',`}
                  ${depersonalized ? '' : `contact_id: '${contactParam || 'default'}',`}
                  depersonalized: ${depersonalized},
                });
              }
            `,
          }}
        />
      )}

      {/* ── Lemlist visitor tracking ── */}
      {process.env.NEXT_PUBLIC_LEMLIST_TRACKING_ID && (
        <Script
          id="lemlist-tracking"
          strategy="afterInteractive"
          src={`https://app.lemlist.com/api/visitors/tracking?k=&t=${process.env.NEXT_PUBLIC_LEMLIST_TRACKING_ID}`}
        />
      )}

      {/* ── Hero ── */}
      <section
        className="full-bleed"
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${T.colorGlow}, ${T.dark} 70%)`,
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
              background: T.colorGlow,
              border: `1px solid ${T.colorBorder}`,
              borderRadius: 20,
              fontSize: '13px',
              fontWeight: 500,
              color: T.colorLt,
              fontFamily: T.font,
              marginBottom: 32,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.color }} />
            {depersonalized ? 'Company Brief' : 'Custom Proposal'}
          </div>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.2}>
          <h1
            className="abm-hero-title"
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 700,
              fontFamily: T.font,
              lineHeight: 1.1,
              margin: '0 0 24px',
              maxWidth: 800,
            }}
          >
            <span style={{ color: T.white }}>{data.headline.replace(data.company, '').trim()} </span>
            <span style={{ color: T.color }}>{data.company}</span>
          </h1>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.35}>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: T.textSecondary,
              fontFamily: T.font,
              lineHeight: 1.6,
              maxWidth: 580,
              margin: '0 auto 12px',
            }}
          >
            {data.subheadline}
          </p>
          <p
            style={{
              fontSize: 'clamp(14px, 1.6vw, 17px)',
              color: T.textMuted,
              fontFamily: T.font,
              lineHeight: 1.5,
              margin: '0 auto 48px',
            }}
          >
            {firstName ? `${firstName}, here's what we'd build.` : "Here's what we'd build."}
          </p>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.5}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <MagneticHover>
              <a
                href={calUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '14px 36px',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: T.font,
                  color: '#fff',
                  background: T.color,
                  border: `1px solid ${T.color}`,
                  borderRadius: 8,
                  textDecoration: 'none',
                  transition: 'background 0.15s ease',
                }}
              >
                Book a Call
              </a>
            </MagneticHover>
            <MagneticHover>
              <a
                href={packagesUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '14px 36px',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: T.font,
                  color: T.color,
                  background: 'transparent',
                  border: `1px solid ${T.colorBorder}`,
                  borderRadius: 8,
                  textDecoration: 'none',
                  transition: 'background 0.15s ease, border-color 0.15s ease',
                }}
              >
                See Packages
              </a>
            </MagneticHover>
          </div>
        </MotionReveal>

        {/* Scroll indicator */}
        <div
          className="scroll-indicator"
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            color: T.textMuted,
            fontSize: '24px',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          &#8964;
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <Section
        theme={T}
        background={T.darkSubtle}
        style={{
          borderTop: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
          padding: '48px 24px',
        }}
        noPad
      >
        <div
          className="abm-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${data.stats.length}, 1fr)`,
            gap: 32,
            textAlign: 'center',
          }}
        >
          {data.stats.map((s) => (
            <div key={s.label}>
              <div className="abm-stat-value">{s.value}</div>
              <div className="abm-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            textAlign: 'center',
            marginTop: 24,
            fontSize: '13px',
            color: T.textMuted,
            fontFamily: T.font,
          }}
        >
          We did our homework.
        </div>
      </Section>

      {/* ── The Challenge ── */}
      <Section theme={T} background={T.dark}>
        <SectionLabel theme={T}>The Challenge</SectionLabel>
        <SectionTitle
          theme={T}
          subtitle={`Scaling sales development at ${data.company} requires infrastructure, not just headcount.`}
        >
          What Keeps Growth Leaders Up at Night
        </SectionTitle>

        <StaggerContainer stagger={0.1}>
          <div
            className="abm-challenge-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 20,
            }}
          >
            {data.challenges.map((c) => (
              <StaggerItem key={c.icon}>
                <div
                  style={{
                    padding: '28px',
                    background: T.darkCard,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: T.color,
                      fontFamily: T.font,
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
                      color: T.text,
                      fontFamily: T.font,
                      marginBottom: 10,
                      lineHeight: 1.3,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: T.textSecondary,
                      fontFamily: T.font,
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
      </Section>

      {/* ── What I Build ── */}
      <Section theme={T} background={T.darkSubtle} style={{ scrollMarginTop: 80 }}>
        <div id="deliverables" style={{ position: 'absolute', marginTop: -100 }} />
        <SectionLabel theme={T}>The Solution</SectionLabel>
        <SectionTitle
          theme={T}
          subtitle={`Systems that integrate with your existing stack and make every rep more effective.`}
        >
          What I Build for You
        </SectionTitle>

        <StaggerContainer stagger={0.12}>
          <div
            className="abm-deliverable-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 20,
            }}
          >
            {data.deliverables.map((d) => (
              <StaggerItem key={d.title}>
                <motion.div
                  whileHover={{
                    borderColor: T.colorBorder,
                    scale: 1.01,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: '28px',
                    background: T.darkCard,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: T.text,
                      fontFamily: T.font,
                      marginBottom: 10,
                    }}
                  >
                    {d.title}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: T.textSecondary,
                      fontFamily: T.font,
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
                          fontFamily: T.font,
                          padding: '3px 10px',
                          borderRadius: 4,
                          background: T.colorGlow,
                          color: T.colorLt,
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
      </Section>

      {/* ── The Engagement ── */}
      <Section theme={T} background={T.dark} style={{ scrollMarginTop: 80 }}>
        <div id="engagement" style={{ position: 'absolute', marginTop: -100 }} />
        <SectionLabel theme={T}>The Engagement</SectionLabel>
        <SectionTitle
          theme={T}
          subtitle="3 months. Full infrastructure build and knowledge transfer. You own everything at the end."
        >
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
                background: `linear-gradient(to bottom, ${T.color}, ${T.colorBorder})`,
                opacity: 0.4,
              }}
            />

            {data.engagementSteps.map((step, i) => (
              <StaggerItem key={i}>
                <div
                  style={{
                    position: 'relative',
                    marginBottom: i < data.engagementSteps.length - 1 ? 56 : 0,
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
                      border: `2px solid ${T.color}`,
                      background: T.dark,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: T.color,
                      fontFamily: T.font,
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
                        color: T.color,
                        fontFamily: T.font,
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
                        color: T.text,
                        fontFamily: T.font,
                        marginBottom: 8,
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      style={{
                        fontSize: '15px',
                        color: T.textSecondary,
                        fontFamily: T.font,
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
      </Section>

      {/* ── The Meta Proof ── */}
      <Section
        theme={T}
        background={T.darkSubtle}
        style={{
          borderTop: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
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
                color: T.color,
                fontFamily: T.font,
                marginBottom: 20,
              }}
            >
              The Proof of Concept
            </div>
            <h2
              style={{
                fontSize: 'clamp(24px, 4vw, 38px)',
                fontWeight: 700,
                color: T.white,
                fontFamily: T.font,
                lineHeight: 1.25,
                margin: '0 0 20px',
              }}
            >
              This page is the demo.
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: T.textSecondary,
                fontFamily: T.font,
                lineHeight: 1.7,
                margin: '0 0 12px',
              }}
            >
              Custom-branded to {data.company}. Deeply researched - your valuation, your stack,
              your market position, your growth trajectory. Built and deployed using the same AI
              infrastructure I&apos;d build for your team.
            </p>
            <p
              style={{
                fontSize: '17px',
                color: T.text,
                fontFamily: T.font,
                lineHeight: 1.7,
                fontWeight: 600,
              }}
            >
              Now imagine what 3 months of focused work delivers.
            </p>
          </MotionReveal>
        </div>
      </Section>

      {/* ── Your Stack, Amplified ── */}
      {data.stackItems && data.stackItems.length > 0 && (
        <Section theme={T} background={T.dark}>
          <SectionLabel theme={T}>Stack Integration</SectionLabel>
          <SectionTitle
            theme={T}
            subtitle="Everything plugs into the tools your team already uses. No rip-and-replace."
          >
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
              {data.stackItems.map((tool) => (
                <StaggerItem key={tool.name}>
                  <div
                    style={{
                      padding: '24px 20px',
                      background: T.darkCard,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: T.text,
                        fontFamily: T.font,
                        marginBottom: 4,
                      }}
                    >
                      {tool.name}
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        color: T.textMuted,
                        fontFamily: T.font,
                      }}
                    >
                      {tool.role}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </Section>
      )}

      {/* ── FAQ ── */}
      <Section theme={T} background={T.darkSubtle}>
        <SectionLabel theme={T}>FAQ</SectionLabel>
        <SectionTitle theme={T}>Common Questions</SectionTitle>
        <Accordion items={data.faqItems} theme={T} />
      </Section>

      {/* ── CTA ── */}
      <Section theme={T} background={T.dark}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <MotionReveal variant="fadeUp">
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 700,
                color: T.white,
                fontFamily: T.font,
                lineHeight: 1.2,
                margin: '0 0 16px',
              }}
            >
              Let&apos;s explore what&apos;s possible.
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: T.textSecondary,
                fontFamily: T.font,
                lineHeight: 1.6,
                margin: '0 0 36px',
              }}
            >
              The infrastructure scales. The enablement compounds.
              Let&apos;s talk about building it for {data.company}.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <MagneticHover>
                <a
                  href={calUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '16px 44px',
                    fontSize: '16px',
                    fontWeight: 600,
                    fontFamily: T.font,
                    color: '#fff',
                    background: T.color,
                    border: `1px solid ${T.color}`,
                    borderRadius: 8,
                    textDecoration: 'none',
                    transition: 'background 0.15s ease',
                  }}
                >
                  Book a Call
                </a>
              </MagneticHover>
              <MagneticHover>
                <a
                  href={packagesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '16px 44px',
                    fontSize: '16px',
                    fontWeight: 600,
                    fontFamily: T.font,
                    color: T.color,
                    background: 'transparent',
                    border: `1px solid ${T.colorBorder}`,
                    borderRadius: 8,
                    textDecoration: 'none',
                    transition: 'background 0.15s ease, border-color 0.15s ease',
                  }}
                >
                  See Packages
                </a>
              </MagneticHover>
            </div>
            <div
              style={{
                marginTop: 20,
                fontSize: '13px',
                color: T.textMuted,
                fontFamily: T.font,
              }}
            >
              shawn@leadalchemy.co
            </div>
          </MotionReveal>
        </div>
      </Section>

      {/* ── Footer Attribution ── */}
      <Section
        theme={T}
        background={T.darkSubtle}
        style={{
          borderTop: `1px solid ${T.border}`,
          padding: '32px 24px',
        }}
        noPad
      >
        <div
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: T.textMuted,
            fontFamily: T.font,
          }}
        >
          Built with{' '}
          <a
            href="https://thegtmos.ai"
            style={{ color: T.textSecondary, textDecoration: 'none' }}
          >
            theGTMOS.ai
          </a>{' '}
           - the go-to-market operating system
        </div>
      </Section>
    </div>
  )
}
