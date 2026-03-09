'use client'

import { useEffect, useRef, useState } from 'react'
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
  MagneticHover,
  ScrollRevealSection,
  GraphGrid,
  DashedCard,
  DarkInterlude,
} from '@shawnos/shared/components'
import { TransformationFlow } from './TransformationFlow'
import { NotRightFit } from './NotRightFit'
import { InteractiveSteps } from './InteractiveSteps'
import { TechStackProof } from './TechStackProof'
import { LanguageToggle } from './LanguageToggle'
import { LanguageBanner } from './LanguageBanner'
import type { WebDevTranslations, Locale } from './i18n/types'

/* ── SVG Icons for deliverables ── */

function LayersIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}

function LightningIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function SearchPlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function BarChartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

const deliverableIcons = [LayersIcon, LightningIcon, SearchPlusIcon, UsersIcon, BarChartIcon, BellIcon]

/* ── helpers ── */

function SectionHeadline({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontSize: 'clamp(28px, 4vw, 40px)',
      fontWeight: 700,
      color: 'var(--text-primary)',
      textAlign: 'center',
      marginBottom: 16,
      letterSpacing: '-0.02em',
    }}>
      {children}
    </h2>
  )
}

function SectionSub({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 'clamp(14px, 2vw, 16px)',
      color: 'var(--text-secondary)',
      textAlign: 'center',
      maxWidth: 600,
      margin: '0 auto 48px',
      lineHeight: 1.7,
    }}>
      {children}
    </p>
  )
}

function SectionDivider() {
  return (
    <div style={{
      height: 1,
      margin: '0 auto',
      maxWidth: 600,
      background: 'linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%)',
      opacity: 0.3,
    }} />
  )
}

/* ── SVG Gauge ── */

function PerformanceGauge({
  value,
  maxValue,
  label,
  pass,
  unit,
  gaugeGood,
  gaugeNeedsWork,
  gaugeMeetsStandard,
  gaugeMayLower,
}: {
  value: number
  maxValue: number
  label: string
  pass: boolean
  unit: string
  gaugeGood: string
  gaugeNeedsWork: string
  gaugeMeetsStandard: string
  gaugeMayLower: string
}) {
  const ref = useRef<SVGSVGElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const radius = 50
  const circumference = Math.PI * radius
  const fillPercent = Math.min(value / maxValue, 1)
  const offset = visible ? circumference * (1 - fillPercent) : circumference
  const color = pass ? 'var(--accent)' : '#E05555'

  return (
    <div style={{ textAlign: 'center', flex: '1 1 140px', minWidth: 120 }}>
      <svg ref={ref} width="140" height="90" viewBox="0 0 120 70" style={{ display: 'block', margin: '0 auto' }}>
        <path
          d="M 10 65 A 50 50 0 0 1 110 65"
          fill="none"
          stroke="var(--canvas-subtle)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M 10 65 A 50 50 0 0 1 110 65"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
        />
        <text x="60" y="55" textAnchor="middle" fill={color} fontSize="18" fontWeight="700" fontFamily="var(--font-mono)">
          {value}{unit}
        </text>
      </svg>
      <div style={{
        fontSize: 12,
        fontWeight: 600,
        color,
        marginTop: 4,
        fontFamily: 'var(--font-mono)',
      }}>
        {pass ? gaugeGood : gaugeNeedsWork}
      </div>
      <div style={{
        fontSize: 10,
        color: 'var(--text-muted)',
        marginTop: 2,
      }}>
        {pass ? gaugeMeetsStandard : gaugeMayLower}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontWeight: 600 }}>{label}</div>
    </div>
  )
}

/* ── Component ── */

interface WebDevContentProps {
  t: WebDevTranslations
  locale: Locale
}

export function WebDevContent({ t, locale }: WebDevContentProps) {
  const isRtl = t.dir === 'rtl'

  return (
    <div dir={t.dir} style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ── Language Banner ── */}
      <LanguageBanner locale={locale} />

      {/* ── 1. Hero ── */}
      <section style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        textAlign: 'center',
        position: 'relative',
        background: 'radial-gradient(ellipse at 50% 0%, var(--canvas-warm-subtle) 0%, var(--canvas) 70%)',
      }}>
        <GraphGrid opacity={0.15} />

        <MotionReveal>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <p style={{
              fontSize: 14,
              color: 'var(--accent)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
              margin: 0,
            }}>
              {t.hero.eyebrow}
            </p>
            <LanguageToggle locale={locale} />
          </div>
        </MotionReveal>

        <MotionReveal delay={0.1}>
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: 8,
            maxWidth: 800,
          }}>
            {t.hero.headlineLine1}{' '}
            <span style={{ display: 'block' }}>{t.hero.headlineLine2}</span>
          </h1>
        </MotionReveal>

        <MotionReveal delay={0.2}>
          <p style={{
            fontSize: 'clamp(24px, 4vw, 48px)',
            fontWeight: 700,
            color: 'var(--accent)',
            lineHeight: 1.2,
            marginBottom: 24,
          }}>
            {t.hero.subheadline}
          </p>
        </MotionReveal>

        <MotionReveal delay={0.3}>
          <p style={{
            fontSize: 'clamp(14px, 2vw, 18px)',
            color: 'var(--text-secondary)',
            maxWidth: 640,
            lineHeight: 1.7,
            marginBottom: 40,
          }}>
            {t.hero.description}
          </p>
        </MotionReveal>

        <MotionReveal delay={0.4}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <MagneticHover>
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
                  transition: 'transform 0.15s',
                }}
              >
                {t.hero.ctaPrimary}
              </a>
            </MagneticHover>
            <MagneticHover>
              <a
                href="https://cal.com/shawn-lead-alchemy/30min?overlayCalendar=true"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: 'none',
                  transition: 'border-color 0.15s',
                }}
              >
                {t.hero.ctaSecondary}
              </a>
            </MagneticHover>
          </div>
          <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
            {t.hero.textUs}{' '}
            <a
              href="sms:+13474520467"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none', borderBottom: '1px dashed var(--border-dashed)' }}
            >
              (347) 452-0467
            </a>
          </div>
        </MotionReveal>

        <div style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'var(--text-muted)',
          fontSize: 12,
          animation: 'float 2s ease-in-out infinite',
        }}>
          {t.hero.scroll}
        </div>
      </section>

      <SectionDivider />

      {/* ── 2. TransformationFlow ── */}
      <section style={{ position: 'relative', backgroundColor: 'var(--canvas-subtle)' }}>
        <GraphGrid opacity={0.12} />
        <TransformationFlow steps={t.transformationFlow.steps} />
      </section>

      <SectionDivider />

      {/* ── 3. The Problem (warm golden bg) ── */}
      <ScrollRevealSection style={{ backgroundColor: 'var(--canvas-warm-subtle)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
          <SectionHeadline>{t.problem.headline}</SectionHeadline>
          <SectionSub>{t.problem.sub}</SectionSub>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16,
          }}>
            {t.problem.stats.map((item) => (
              <MotionReveal key={item.label}>
                <DashedCard warm style={{ textAlign: 'center', borderLeft: isRtl ? undefined : '3px solid var(--accent)', borderRight: isRtl ? '3px solid var(--accent)' : undefined, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{
                    fontSize: 'clamp(28px, 4vw, 40px)',
                    fontWeight: 800,
                    color: 'var(--accent)',
                    letterSpacing: '-0.02em',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {item.stat}
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    marginTop: 8,
                    lineHeight: 1.5,
                  }}>
                    {item.label}
                  </div>
                </DashedCard>
              </MotionReveal>
            ))}
          </div>

          <MotionReveal delay={0.2}>
            <p style={{
              textAlign: 'center',
              fontSize: 14,
              color: 'var(--text-muted)',
              marginTop: 32,
              lineHeight: 1.7,
            }}>
              {t.problem.footnote}
            </p>
          </MotionReveal>
        </div>
      </ScrollRevealSection>

      {/* ── 4. DarkInterlude ── */}
      <DarkInterlude
        title={t.interlude.title}
        subtitle={t.interlude.subtitle}
      />

      <SectionDivider />

      {/* ── 5. Performance Comparison ── */}
      <ScrollRevealSection>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px', position: 'relative' }}>
          <GraphGrid opacity={0.1} />
          <SectionHeadline>{t.performance.headline}</SectionHeadline>
          <SectionSub>{t.performance.sub}</SectionSub>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {t.performance.vitals.map((v) => (
              <MotionReveal key={v.metric}>
                <div>
                  <div style={{
                    fontSize: 16,
                    color: 'var(--text-primary)',
                    marginBottom: 4,
                    fontWeight: 700,
                    textAlign: 'center',
                  }}>
                    {v.metric}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    marginBottom: 20,
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {v.techName}
                  </div>

                  <div className="vitals-row">
                    <div className="vitals-context" style={{
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      padding: '12px 16px',
                      backgroundColor: 'var(--canvas-subtle)',
                      borderRadius: 8,
                      border: '1px dashed var(--border-dashed)',
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                        {locale === 'he' ? 'מה זה' : locale === 'es' ? 'Qu\u00e9 es' : 'What it is'}
                      </div>
                      {v.whatItIs}
                    </div>

                    <div className="gauge-row" style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
                      <PerformanceGauge
                        value={v.wordpress}
                        maxValue={v.wordpress * 1.2}
                        label="WordPress"
                        pass={false}
                        unit={v.unit}
                        gaugeGood={t.performance.gaugeGood}
                        gaugeNeedsWork={t.performance.gaugeNeedsWork}
                        gaugeMeetsStandard={t.performance.gaugeMeetsStandard}
                        gaugeMayLower={t.performance.gaugeMayLower}
                      />
                      <PerformanceGauge
                        value={v.nextjs}
                        maxValue={v.wordpress * 1.2}
                        label="Next.js"
                        pass={true}
                        unit={v.unit}
                        gaugeGood={t.performance.gaugeGood}
                        gaugeNeedsWork={t.performance.gaugeNeedsWork}
                        gaugeMeetsStandard={t.performance.gaugeMeetsStandard}
                        gaugeMayLower={t.performance.gaugeMayLower}
                      />
                    </div>

                    <div className="vitals-context" style={{
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      padding: '12px 16px',
                      backgroundColor: 'var(--canvas-subtle)',
                      borderRadius: 8,
                      border: '1px dashed var(--border-dashed)',
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                        {locale === 'he' ? 'מה זה אומר בשבילך' : locale === 'es' ? 'Qu\u00e9 significa para ti' : 'What it means for you'}
                      </div>
                      {v.whatItMeans}
                    </div>
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </ScrollRevealSection>

      <SectionDivider />

      {/* ── 6. What You Get (warm golden bg) ── */}
      <ScrollRevealSection style={{ backgroundColor: 'var(--canvas-warm)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px' }}>
          <SectionHeadline>{t.deliverables.headline}</SectionHeadline>
          <SectionSub>{t.deliverables.sub}</SectionSub>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {t.deliverables.items.map((d, i) => {
              const IconComponent = deliverableIcons[i]
              return (
                <MotionReveal key={d.title}>
                  <DashedCard style={{ height: '100%' }}>
                    <div style={{
                      color: 'var(--accent)',
                      marginBottom: 12,
                    }}>
                      <IconComponent />
                    </div>
                    <div style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: 8,
                    }}>
                      {d.title}
                    </div>
                    <div style={{
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}>
                      {d.desc}
                    </div>
                  </DashedCard>
                </MotionReveal>
              )
            })}
          </div>
        </div>
      </ScrollRevealSection>

      <SectionDivider />

      {/* ── 7. How It Works ── */}
      <ScrollRevealSection style={{ position: 'relative' }}>
        <GraphGrid opacity={0.1} />
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px' }}>
          <SectionHeadline>{t.howItWorks.headline}</SectionHeadline>
          <SectionSub>{t.howItWorks.sub}</SectionSub>
          <InteractiveSteps steps={t.howItWorks.steps} />
        </div>
      </ScrollRevealSection>

      <SectionDivider />

      {/* ── 8. Pricing ── */}
      <ScrollRevealSection style={{ backgroundColor: 'var(--canvas-subtle)' }}>
        <div id="pricing" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
          <SectionHeadline>{t.pricing.headline}</SectionHeadline>
          <SectionSub>{t.pricing.sub}</SectionSub>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {t.pricing.tiers.map((tier) => (
              <MotionReveal key={tier.name}>
                <DashedCard style={{
                  padding: 32,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderColor: tier.recommended ? 'var(--accent)' : undefined,
                  borderWidth: tier.recommended ? 2 : undefined,
                  borderStyle: tier.recommended ? 'dashed' : undefined,
                  position: 'relative',
                  borderTop: tier.recommended
                    ? undefined
                    : '3px solid var(--border-dashed)',
                  overflow: 'hidden',
                }}>
                  {tier.recommended && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: `linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 60%, white))`,
                    }} />
                  )}

                  {tier.recommended && (
                    <div style={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--accent)',
                      color: 'var(--text-on-accent)',
                      padding: '4px 16px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}>
                      {tier.tag}
                    </div>
                  )}

                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '3px 10px',
                    borderRadius: 20,
                    backgroundColor: 'var(--canvas-subtle)',
                    border: '1px dashed var(--border-dashed)',
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 12,
                    alignSelf: 'flex-start',
                  }}>
                    {tier.timeline}
                  </div>

                  <div style={{
                    fontSize: 'clamp(24px, 3vw, 32px)',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    marginBottom: 4,
                    letterSpacing: '-0.02em',
                  }}>
                    {tier.name}
                  </div>

                  <div style={{
                    fontSize: 'clamp(28px, 4vw, 36px)',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    marginBottom: 16,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {tier.price}
                  </div>

                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    flex: 1,
                  }}>
                    {tier.features.map((f) => (
                      <li key={f} style={{
                        fontSize: 14,
                        color: 'var(--text-secondary)',
                        padding: '8px 0',
                        borderBottom: '1px dashed var(--border-dashed)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                      }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 600, flexShrink: 0 }}>+</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    marginTop: 16,
                    lineHeight: 1.5,
                    padding: '8px 12px',
                    backgroundColor: 'var(--canvas-subtle)',
                    borderRadius: 6,
                  }}>
                    <strong>{tier.supportPeriod} {t.pricing.supportNote}</strong> {locale === 'he' ? 'אחרי שהתמיכה מסתיימת, האתר ממשיך לפעול - שדרגו לניהול או נהלו בעצמכם.' : locale === 'es' ? 'Despues, su sitio sigue funcionando - actualice a Managed o adminstrelo usted mismo.' : 'After that, your site keeps running - upgrade to Managed or self-manage.'}
                  </div>

                  <MagneticHover>
                    <a
                      href="https://cal.com/shawn-lead-alchemy/30min?overlayCalendar=true"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        padding: '14px 24px',
                        marginTop: 16,
                        backgroundColor: tier.recommended ? 'var(--accent)' : 'transparent',
                        color: tier.recommended ? 'var(--text-on-accent)' : 'var(--accent)',
                        border: tier.recommended ? 'none' : '1px solid var(--accent)',
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 14,
                        textDecoration: 'none',
                        transition: 'transform 0.15s',
                      }}
                    >
                      {t.pricing.getStarted}
                    </a>
                  </MagneticHover>
                </DashedCard>
              </MotionReveal>
            ))}
          </div>

          {/* Managed tier */}
          <MotionReveal>
            <DashedCard style={{
              marginTop: 24,
              padding: 32,
              borderTop: '3px solid var(--accent)',
            }}>
              <div className="managed-tier-inner">
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '3px 10px',
                    borderRadius: 20,
                    backgroundColor: 'var(--canvas-subtle)',
                    border: '1px dashed var(--border-dashed)',
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 12,
                  }}>
                    {t.pricing.managed.badge}
                  </div>

                  <div style={{
                    fontSize: 'clamp(24px, 3vw, 32px)',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    marginBottom: 4,
                    letterSpacing: '-0.02em',
                  }}>
                    {t.pricing.managed.name}
                  </div>
                  <div style={{
                    fontSize: 'clamp(20px, 3vw, 28px)',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    marginBottom: 16,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {t.pricing.managed.price}<span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 400 }}>{t.pricing.managed.priceUnit}</span>
                  </div>
                  <p style={{
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    maxWidth: 500,
                    margin: 0,
                  }}>
                    {t.pricing.managed.description}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {t.pricing.managed.features.map((f) => (
                      <div key={f} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>+</span>
                        {f}
                      </div>
                    ))}
                  </div>
                  <MagneticHover>
                    <a
                      href="https://cal.com/shawn-lead-alchemy/30min?overlayCalendar=true"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        padding: '14px 32px',
                        backgroundColor: 'var(--accent)',
                        color: 'var(--text-on-accent)',
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 14,
                        textDecoration: 'none',
                        transition: 'transform 0.15s',
                        marginTop: 8,
                      }}
                    >
                      {t.pricing.managed.cta}
                    </a>
                  </MagneticHover>
                </div>
              </div>
            </DashedCard>
          </MotionReveal>
        </div>
      </ScrollRevealSection>

      <SectionDivider />

      {/* ── 9. Tech Stack Proof ── */}
      <ScrollRevealSection>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px' }}>
          <SectionHeadline>{t.techStack.headline}</SectionHeadline>
          <SectionSub>{t.techStack.sub}</SectionSub>
          <TechStackProof tools={t.techStack.tools} verifyLink={t.techStack.verifyLink} />
        </div>
      </ScrollRevealSection>

      {/* ── 10. Not the Right Fit ── */}
      <DarkInterlude
        title={t.notRightFit.title}
        subtitle={t.notRightFit.subtitle}
      />
      <NotRightFit cards={t.notRightFit.cards} />

      <SectionDivider />

      {/* ── 11. FAQ ── */}
      <ScrollRevealSection style={{ backgroundColor: 'var(--canvas-subtle)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
          <SectionHeadline>{t.faq.headline}</SectionHeadline>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {t.faq.items.map((item) => (
              <MotionReveal key={item.q}>
                <details className="faq-item" style={{
                  borderBottom: '1px dashed var(--border-dashed)',
                  padding: '20px 0',
                }}>
                  <summary style={{
                    cursor: 'pointer',
                    fontSize: 15,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    listStyle: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    {item.q}
                    <span style={{ color: 'var(--accent)', fontSize: 18, flexShrink: 0, marginLeft: isRtl ? 0 : 16, marginRight: isRtl ? 16 : 0 }}>+</span>
                  </summary>
                  <p style={{
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    marginTop: 12,
                    paddingRight: isRtl ? 0 : 32,
                    paddingLeft: isRtl ? 32 : 0,
                  }}>
                    {item.a}
                  </p>
                </details>
              </MotionReveal>
            ))}
          </div>
        </div>
      </ScrollRevealSection>

      {/* ── 12. Sources ── */}
      <section style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: '40px 24px',
      }}>
        <div style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}>
          {t.sources.headline}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {t.sources.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 13,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                borderBottom: '1px dashed var(--border-dashed)',
                paddingBottom: 2,
                display: 'inline-block',
                alignSelf: 'flex-start',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>

      {/* ── 13. CTA ── */}
      <section style={{
        padding: '80px 24px',
        textAlign: 'center',
        backgroundColor: 'var(--canvas-warm-subtle)',
        position: 'relative',
      }}>
        <GraphGrid opacity={0.1} />
        <MotionReveal>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}>
            {t.cta.headline}
          </h2>
        </MotionReveal>
        <MotionReveal delay={0.1}>
          <p style={{
            fontSize: 'clamp(14px, 2vw, 16px)',
            color: 'var(--text-secondary)',
            maxWidth: 500,
            margin: '0 auto 32px',
            lineHeight: 1.7,
          }}>
            {t.cta.description}
          </p>
        </MotionReveal>
        <MotionReveal delay={0.2}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <MagneticHover>
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
                  transition: 'transform 0.15s',
                }}
              >
                {t.cta.ctaPrimary}
              </a>
            </MagneticHover>
            <MagneticHover>
              <a
                href="sms:+13474520467"
                style={{
                  display: 'inline-block',
                  padding: '16px 40px',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: 'none',
                  transition: 'border-color 0.15s',
                }}
              >
                {t.cta.ctaSecondary}
              </a>
            </MagneticHover>
          </div>
        </MotionReveal>
      </section>

      <style>{`
        .gauge-row {
          flex-wrap: wrap;
        }
        .vitals-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          align-items: center;
        }
        .vitals-context {
          text-align: ${isRtl ? 'right' : 'left'};
        }
        .managed-tier-inner {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        @media (min-width: 768px) {
          .vitals-row {
            grid-template-columns: 1fr auto 1fr;
            gap: 24px;
          }
          .managed-tier-inner {
            flex-direction: row;
            gap: 48px;
          }
        }
        @media (max-width: 480px) {
          .gauge-row {
            flex-direction: column;
            align-items: center;
            gap: 24px !important;
          }
        }
        [dir="rtl"] .notfit-grid .notfit-card {
          border-left: none;
          border-right: 3px solid #E05555;
        }
      `}</style>
    </div>
  )
}
