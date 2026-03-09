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

/* ── data ─────────────────────────────────────────── */

const pricingTiers = [
  {
    name: 'Foundation',
    price: '$3,500',
    tag: 'Get Started',
    timeline: '1-2 weeks',
    supportPeriod: '1 month',
    features: [
      '5-7 page custom website',
      'Mobile-optimized responsive design',
      'Service area pages',
      'Lead capture forms',
      'Google Business Profile setup',
      'Reviews section',
      'Basic SEO + sitemap',
    ],
  },
  {
    name: 'Growth',
    price: '$5,500',
    tag: 'Most Popular',
    recommended: true,
    timeline: '2-3 weeks',
    supportPeriod: '3 months',
    features: [
      'Everything in Foundation',
      '8-12 pages',
      'English + Spanish (bilingual)',
      'AI chatbot integration',
      'Booking system',
      'Content strategy (3 blog posts)',
      'Analytics dashboard',
    ],
  },
  {
    name: 'Dominance',
    price: '$8,500',
    tag: 'Full Package',
    timeline: '3-4 weeks',
    supportPeriod: '6 months',
    features: [
      'Everything in Growth',
      '12-20 pages',
      '3+ languages supported',
      'Full SEO audit + schema markup',
      'Analytics dashboard + monthly reports',
      'Google Ads consultation',
      'Competitor analysis report',
    ],
  },
]

const vitalsComparison = [
  {
    metric: 'Page Load Speed',
    techName: 'LCP (Largest Contentful Paint)',
    wordpress: 4.2,
    nextjs: 1.1,
    unit: 's',
    threshold: 2.5,
    lower: true,
    whatItIs: 'How fast your page loads. Google penalizes anything over 2.5 seconds.',
    whatItMeans: 'WordPress makes customers wait 4+ seconds. Ours loads in about 1 second.',
  },
  {
    metric: 'Button Response Time',
    techName: 'INP (Interaction to Next Paint)',
    wordpress: 380,
    nextjs: 85,
    unit: 'ms',
    threshold: 200,
    lower: true,
    whatItIs: 'How fast buttons respond when tapped. Google penalizes anything over 200ms.',
    whatItMeans: 'On WordPress, tapping "Call Now" feels like nothing happened. Ours responds instantly.',
  },
  {
    metric: 'Layout Stability',
    techName: 'CLS (Cumulative Layout Shift)',
    wordpress: 0.25,
    nextjs: 0.02,
    unit: '',
    threshold: 0.1,
    lower: true,
    whatItIs: 'Does the page jump around while loading? Google penalizes scores over 0.1.',
    whatItMeans: 'WordPress shifts content as plugins load. Ours locks everything in place.',
  },
]

const deliverables = [
  { title: 'Custom Design', desc: 'No templates. Designed around your business, your brand, your customers.' },
  { title: 'Performance-First', desc: 'Sub-1-second load times. Every page optimized for speed and search rankings.' },
  { title: 'SEO Built In', desc: 'Structured data, meta tags, sitemaps, Google Business Profile - from day one.' },
  { title: 'Lead Capture', desc: 'Forms, booking systems, chatbots. Turn visitors into customers automatically.' },
  { title: 'Analytics Dashboard', desc: 'Know exactly what is working. Traffic, conversions, page performance - all tracked.' },
  { title: 'Ongoing Support', desc: 'We do not build and disappear. Every package includes post-launch support.' },
]

const faqItems = [
  {
    q: 'How much does a website for a service business cost?',
    a: 'Our packages start at $3,500 for a 5-7 page custom site with mobile optimization, lead capture forms, and basic SEO. Most service businesses choose the Growth package at $5,500 which adds a booking system, bilingual support, analytics, and 3 months of support. The investment typically pays for itself within 1-2 months through new leads.',
  },
  {
    q: 'Why not just use WordPress like everyone else?',
    a: 'WordPress sites average 4-6 seconds to load on mobile. Our sites load in under 1 second. After Google\'s February 2026 core update, page speed directly impacts your search rankings. A faster site means more visibility, more clicks, and more customers. Our approach also eliminates plugin vulnerabilities, requires no maintenance updates, and costs nothing to host.',
  },
  {
    q: 'How long does it take to build?',
    a: 'Foundation sites launch in 1-2 weeks. Growth sites take 2-3 weeks. Dominance projects run 3-4 weeks. We start with a strategy call, then move through design and development with your feedback at every stage.',
  },
  {
    q: 'Do I need to know anything about technology?',
    a: 'No. We handle everything - design, development, hosting, and ongoing support. You focus on running your business. We build the site that brings you customers.',
  },
  {
    q: 'What does "support" actually mean?',
    a: 'During your support period, we monitor your site speed, fix any issues, make content updates, track your analytics, and optimize for better results. You can reach us directly for changes. It is not a call center - it is the same team that built your site.',
  },
  {
    q: 'What happens after my support period ends?',
    a: 'Your site keeps running exactly as it was. Hosting is free, so there are no ongoing costs unless you want them. You can upgrade to our Managed plan for ongoing optimization, or self-manage. The site is yours.',
  },
  {
    q: 'Do you build sites in other languages?',
    a: 'Yes. The Growth package includes bilingual support (English + Spanish). The Dominance package supports 3 or more languages. Every language gets its own optimized pages - not just a translation plugin.',
  },
  {
    q: 'Can you help with Google Business Profile and local search?',
    a: 'Yes. The Foundation package includes Google Business Profile setup. The Dominance package includes a full local SEO audit, schema markup for rich search results, and multi-location support. We make sure Google understands exactly what you do and where you do it.',
  },
  {
    q: 'How much does ongoing management cost?',
    a: 'Our Managed plan runs $500-$1,000/month depending on scope. It includes ongoing content updates, SEO optimization, analytics reporting, and priority support. Most businesses start with a build package and add Managed later once they see results.',
  },
  {
    q: 'What makes you different from other web developers?',
    a: 'Proof. Every site we build comes with measurable performance data - load times, search rankings, conversion tracking. We do not just build a site and walk away. We build a site that performs, prove it with data, and keep optimizing. This page you are reading right now is built with the same technology.',
  },
]

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
}: {
  value: number
  maxValue: number
  label: string
  pass: boolean
  unit: string
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
  const circumference = Math.PI * radius // half-circle
  const fillPercent = Math.min(value / maxValue, 1)
  const offset = visible ? circumference * (1 - fillPercent) : circumference
  const color = pass ? 'var(--accent)' : '#E05555'

  return (
    <div style={{ textAlign: 'center', flex: '1 1 140px', minWidth: 120 }}>
      <svg ref={ref} width="140" height="90" viewBox="0 0 120 70" style={{ display: 'block', margin: '0 auto' }}>
        {/* Background arc */}
        <path
          d="M 10 65 A 50 50 0 0 1 110 65"
          fill="none"
          stroke="var(--canvas-subtle)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Filled arc */}
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
        {/* Value text */}
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
        {pass ? 'GOOD' : 'NEEDS WORK'}
      </div>
      <div style={{
        fontSize: 10,
        color: 'var(--text-muted)',
        marginTop: 2,
      }}>
        {pass ? 'Meets Google\'s standard' : 'Google may lower your ranking'}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontWeight: 600 }}>{label}</div>
    </div>
  )
}

/* ── Component ── */

export function WebDevContent() {
  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>

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
          <p style={{
            fontSize: 14,
            color: 'var(--accent)',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 24,
            fontFamily: 'var(--font-mono)',
          }}>
            WEB DEVELOPMENT FOR SERVICE BUSINESSES
          </p>
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
            Your Website Looks Fine.{' '}
            <span style={{ display: 'block' }}>It&apos;s Losing You Money.</span>
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
            We can prove it.
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
            Most service business websites load too slow, rank too low, and track nothing. We build sites that load in under 1 second, show up on Google, and tell you exactly where your next customer came from.
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
                See Pricing
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
                Get a Free Site Audit
              </a>
            </MagneticHover>
          </div>
          <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
            or text us at{' '}
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
          scroll
        </div>
      </section>

      <SectionDivider />

      {/* ── 2. TransformationFlow ── */}
      <section style={{ position: 'relative', backgroundColor: 'var(--canvas-subtle)' }}>
        <GraphGrid opacity={0.12} />
        <TransformationFlow />
      </section>

      <SectionDivider />

      {/* ── 3. The Problem (warm golden bg) ── */}
      <ScrollRevealSection style={{ backgroundColor: 'var(--canvas-warm-subtle)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
          <SectionHeadline>Your Website Is Costing You Customers</SectionHeadline>
          <SectionSub>
            Most business websites are dead weight. Slow, outdated, and invisible to Google.
          </SectionSub>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16,
          }}>
            {[
              { stat: '4-6s', label: 'Average WordPress load time on mobile' },
              { stat: '7%', label: 'Conversions lost per second of load time' },
              { stat: '53%', label: 'Of mobile users leave if a site takes 3+ seconds' },
              { stat: '0', label: 'Analytics on most small business sites' },
            ].map((item) => (
              <MotionReveal key={item.label}>
                <DashedCard warm style={{ textAlign: 'center', borderLeft: '3px solid var(--accent)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
              Google&apos;s February 2026 core update raised the bar on performance. Your competitors who upgraded are getting your customers.
            </p>
          </MotionReveal>
        </div>
      </ScrollRevealSection>

      {/* ── 4. DarkInterlude ── */}
      <DarkInterlude
        title="Still Running on WordPress?"
        subtitle="Most businesses don't know their site is losing them customers."
      />

      <SectionDivider />

      {/* ── 5. Performance Comparison - Three Column ── */}
      <ScrollRevealSection>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px', position: 'relative' }}>
          <GraphGrid opacity={0.1} />
          <SectionHeadline>WordPress vs Next.js</SectionHeadline>
          <SectionSub>
            Real performance benchmarks. Not marketing claims - measurable results that affect your Google ranking.
          </SectionSub>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {vitalsComparison.map((v) => (
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
                    {/* Left: What it is */}
                    <div className="vitals-context" style={{
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      padding: '12px 16px',
                      backgroundColor: 'var(--canvas-subtle)',
                      borderRadius: 8,
                      border: '1px dashed var(--border-dashed)',
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>What it is</div>
                      {v.whatItIs}
                    </div>

                    {/* Center: Gauges */}
                    <div className="gauge-row" style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
                      <PerformanceGauge
                        value={v.wordpress}
                        maxValue={v.wordpress * 1.2}
                        label="WordPress"
                        pass={false}
                        unit={v.unit}
                      />
                      <PerformanceGauge
                        value={v.nextjs}
                        maxValue={v.wordpress * 1.2}
                        label="Next.js"
                        pass={true}
                        unit={v.unit}
                      />
                    </div>

                    {/* Right: What it means */}
                    <div className="vitals-context" style={{
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      padding: '12px 16px',
                      backgroundColor: 'var(--canvas-subtle)',
                      borderRadius: 8,
                      border: '1px dashed var(--border-dashed)',
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>What it means for you</div>
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
          <SectionHeadline>What You Get</SectionHeadline>
          <SectionSub>
            Every site we build comes with these fundamentals. No add-on fees. No surprises.
          </SectionSub>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {deliverables.map((d, i) => {
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

      {/* ── 7. How It Works - Interactive Accordion ── */}
      <ScrollRevealSection style={{ position: 'relative' }}>
        <GraphGrid opacity={0.1} />
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px' }}>
          <SectionHeadline>How It Works</SectionHeadline>
          <SectionSub>
            From first call to live site in 1-4 weeks. Here is the process.
          </SectionSub>
          <InteractiveSteps />
        </div>
      </ScrollRevealSection>

      <SectionDivider />

      {/* ── 8. Pricing - 4 Tiers ── */}
      <ScrollRevealSection style={{ backgroundColor: 'var(--canvas-subtle)' }}>
        <div id="pricing" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
          <SectionHeadline>Pricing</SectionHeadline>
          <SectionSub>
            Transparent pricing. No surprises. Every package includes deployment, hosting, and support.
          </SectionSub>

          {/* 3-column grid for first 3 tiers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {pricingTiers.map((tier) => (
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
                  {/* Accent top bar for recommended */}
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
                      Most Popular
                    </div>
                  )}

                  {/* Timeline badge */}
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

                  {/* Support explanation */}
                  <div style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    marginTop: 16,
                    lineHeight: 1.5,
                    padding: '8px 12px',
                    backgroundColor: 'var(--canvas-subtle)',
                    borderRadius: 6,
                  }}>
                    <strong>{tier.supportPeriod} support included.</strong> After that, your site keeps running - upgrade to Managed or self-manage.
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
                      Get Started
                    </a>
                  </MagneticHover>
                </DashedCard>
              </MotionReveal>
            ))}
          </div>

          {/* Managed tier - full width */}
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
                    After any package
                  </div>

                  <div style={{
                    fontSize: 'clamp(24px, 3vw, 32px)',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    marginBottom: 4,
                    letterSpacing: '-0.02em',
                  }}>
                    Managed
                  </div>
                  <div style={{
                    fontSize: 'clamp(20px, 3vw, 28px)',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    marginBottom: 16,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    $500-$1,000<span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 400 }}>/month</span>
                  </div>
                  <p style={{
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    maxWidth: 500,
                    margin: 0,
                  }}>
                    Ongoing content updates, SEO optimization, monthly analytics reports, priority support, and Google Ads management. The same team that built your site keeps improving it.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {['Ongoing content updates', 'SEO optimization', 'Monthly performance reports', 'Priority support', 'Google Ads included'].map((f) => (
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
                      Book a Call
                    </a>
                  </MagneticHover>
                </div>
              </div>
            </DashedCard>
          </MotionReveal>
        </div>
      </ScrollRevealSection>

      <SectionDivider />

      {/* ── 9. This Page Is the Proof - Tech Stack ── */}
      <ScrollRevealSection>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px' }}>
          <SectionHeadline>This Page Is the Proof</SectionHeadline>
          <SectionSub>
            You are looking at a site built with the same tools we use for every client.
          </SectionSub>
          <TechStackProof />
        </div>
      </ScrollRevealSection>

      {/* ── 10. Not the Right Fit ── */}
      <DarkInterlude
        title="Heads Up: We're Not the Right Fit If You..."
        subtitle="We'd rather be honest upfront than waste your time."
      />
      <NotRightFit />

      <SectionDivider />

      {/* ── 11. FAQ ── */}
      <ScrollRevealSection style={{ backgroundColor: 'var(--canvas-subtle)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
          <SectionHeadline>Frequently Asked Questions</SectionHeadline>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {faqItems.map((item) => (
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
                    <span style={{ color: 'var(--accent)', fontSize: 18, flexShrink: 0, marginLeft: 16 }}>+</span>
                  </summary>
                  <p style={{
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    marginTop: 12,
                    paddingRight: 32,
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
          Learn More
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Google Core Web Vitals Documentation', href: 'https://web.dev/articles/vitals' },
            { label: 'Google PageSpeed Insights', href: 'https://pagespeed.web.dev/' },
            { label: 'Google Structured Data Guide', href: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data' },
          ].map((link) => (
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
            Ready to See the Difference?
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
            Book a free site audit. We will run your current site through PageSpeed, show you where you stand, and map out exactly what a new site would do for your business.
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
                Book a Free Site Audit
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
                Text Us: (347) 452-0467
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
          text-align: left;
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
      `}</style>
    </div>
  )
}
