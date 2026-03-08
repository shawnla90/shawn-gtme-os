'use client'

import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
  MagneticHover,
  ScrollRevealSection,
  ProcessSteps,
} from '@shawnos/shared/components'

/* ── data ─────────────────────────────────────────── */

const pricingTiers = [
  {
    name: 'foundation',
    price: '$4,500',
    tag: 'get started',
    features: [
      '5-8 page Next.js site',
      'mobile-optimized responsive design',
      'service area pages',
      'lead capture form',
      'Google Business Profile setup',
      'reviews section',
      'basic SEO + sitemap',
      '1 month support',
    ],
  },
  {
    name: 'growth',
    price: '$6,500',
    tag: 'recommended',
    recommended: true,
    features: [
      'everything in foundation',
      'AI chatbot integration',
      'booking system',
      'email automation setup',
      'content strategy (3 blog posts)',
      'analytics + conversion tracking',
      '3 months support',
    ],
  },
  {
    name: 'dominance',
    price: '$8,500',
    tag: 'full package',
    features: [
      'everything in growth',
      'local SEO audit + optimization',
      'schema markup for rich results',
      'multi-location support',
      'Google Ads consultation',
      'competitor analysis report',
      '6 months support',
    ],
  },
]

const vitalsComparison = [
  { metric: 'LCP (largest contentful paint)', wordpress: 4.2, nextjs: 1.1, unit: 's', threshold: 2.5, lower: true },
  { metric: 'INP (interaction to next paint)', wordpress: 380, nextjs: 85, unit: 'ms', threshold: 200, lower: true },
  { metric: 'CLS (cumulative layout shift)', wordpress: 0.25, nextjs: 0.02, unit: '', threshold: 0.1, lower: true },
]

const deliverables = [
  { icon: '>', title: 'custom design', desc: 'no templates. designed around your business, your brand, your customers.' },
  { icon: '~', title: 'performance-first', desc: 'sub-1-second load times. every page optimized for Core Web Vitals.' },
  { icon: '#', title: 'SEO built in', desc: 'structured data, meta tags, sitemaps, Google Business Profile - from day one.' },
  { icon: '$', title: 'lead capture', desc: 'forms, booking systems, chatbots. turn visitors into customers automatically.' },
  { icon: '!', title: 'analytics dashboard', desc: 'know exactly what is working. traffic, conversions, page performance - all tracked.' },
  { icon: '*', title: 'ongoing support', desc: 'we do not build and disappear. every package includes post-launch support.' },
]

const processSteps = [
  { title: 'free site audit', description: 'we run your current site through Google PageSpeed, check your Core Web Vitals, and show you exactly where you stand.' },
  { title: 'strategy call', description: 'we talk about your business, your customers, and what your website needs to do. no jargon. just a plan.' },
  { title: 'design & build', description: 'we build your site in Next.js with your feedback at every stage. most sites launch in 2-3 weeks.' },
  { title: 'launch & optimize', description: 'we deploy to production, verify performance, and set up your analytics. you see the numbers from day one.' },
  { title: 'ongoing support', description: 'we monitor, adjust, and improve. your site keeps getting better after launch.' },
]

const faqItems = [
  {
    q: 'how much does a website for a plumbing business cost?',
    a: 'our packages start at $4,500 for a 5-8 page Next.js site with mobile optimization, lead capture forms, and basic SEO. most service businesses choose the growth package at $6,500 which includes a booking system, analytics, and 3 months of support. the investment typically pays for itself within 1-2 months through new leads.',
  },
  {
    q: 'why Next.js instead of WordPress?',
    a: "WordPress sites average 4-6 seconds to load on mobile. Next.js sites load in under 1 second. after Google's February 2026 core update, page speed directly impacts your search rankings. a faster site means more visibility, more clicks, and more customers. Next.js also eliminates plugin vulnerabilities, requires no maintenance updates, and costs nothing to host on Vercel.",
  },
  {
    q: 'how long does it take to build a website?',
    a: 'most projects launch within 2-3 weeks. simple sites (foundation package) can be ready in as little as 1 week. we start with a strategy call, then move through design and development with your feedback at every stage.',
  },
  {
    q: 'do I need to know how to code?',
    a: 'no. we handle everything - design, development, deployment, and ongoing support. you focus on running your business. we build the site that brings you customers.',
  },
  {
    q: 'what happens after my site launches?',
    a: 'every package includes support (1-6 months depending on tier). we monitor your Core Web Vitals, track conversion metrics, and make adjustments to improve performance. you get a dashboard showing exactly how your site is performing.',
  },
  {
    q: 'can you help with Google Business Profile and local SEO?',
    a: 'yes. the foundation package includes Google Business Profile setup. the dominance package includes a full local SEO audit, schema markup for rich search results, and multi-location support. we make sure Google understands exactly what you do and where you do it.',
  },
  {
    q: 'what makes your approach different from other web developers?',
    a: "proof. every site we build comes with measurable performance data - Core Web Vitals scores, load times, conversion tracking. we do not just build a pretty site and walk away. we build a site that performs, prove it with data, and keep optimizing. this page you are reading right now is built with the same technology and scores 95+ on Google PageSpeed.",
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

/* ── Component ── */

export function WebDevContent() {
  return (
    <div style={{ fontFamily: 'var(--font-mono)' }}>

      {/* ── Hero ── */}
      <section style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        textAlign: 'center',
        position: 'relative',
      }}>
        <MotionReveal>
          <p style={{
            fontSize: 14,
            color: 'var(--accent)',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}>
            web development services
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
            does your website have proof?
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
            ours does.
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
            websites that load in under 1 second, rank on Google, and show you exactly what&apos;s working. every metric tracked. every result proven.
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
                see pricing
              </a>
            </MagneticHover>
            <MagneticHover>
              <a
                href="https://cal.com/shawntenam"
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
                get a free site audit
              </a>
            </MagneticHover>
          </div>
        </MotionReveal>

        {/* scroll indicator */}
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

      {/* ── The Problem ── */}
      <ScrollRevealSection style={{ backgroundColor: 'var(--canvas-subtle)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
          <SectionHeadline>your website is costing you customers</SectionHeadline>
          <SectionSub>
            most business websites are dead weight. slow, outdated, and invisible to Google.
          </SectionSub>

          <StaggerContainer>
            {[
              { stat: '4-6s', label: 'average WordPress load time on mobile' },
              { stat: '7%', label: 'conversions lost per second of load time' },
              { stat: '53%', label: 'of mobile users leave if a site takes 3+ seconds' },
              { stat: '0', label: 'analytics on most small business sites' },
            ].map((item) => (
              <StaggerItem key={item.label}>
                <div style={{
                  textAlign: 'center',
                  padding: '24px 16px',
                }}>
                  <div style={{
                    fontSize: 'clamp(32px, 5vw, 48px)',
                    fontWeight: 800,
                    color: 'var(--accent)',
                    letterSpacing: '-0.02em',
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
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <MotionReveal delay={0.2}>
            <p style={{
              textAlign: 'center',
              fontSize: 14,
              color: 'var(--text-muted)',
              marginTop: 32,
              lineHeight: 1.7,
            }}>
              Google&apos;s February 2026 core update raised the bar on performance. your competitors who upgraded are getting your customers.
            </p>
          </MotionReveal>
        </div>
      </ScrollRevealSection>

      {/* ── Performance Comparison ── */}
      <ScrollRevealSection>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
          <SectionHeadline>WordPress vs Next.js</SectionHeadline>
          <SectionSub>
            real Core Web Vitals benchmarks. not marketing claims - measurable performance.
          </SectionSub>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {vitalsComparison.map((v) => (
              <MotionReveal key={v.metric}>
                <div>
                  <div style={{
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    marginBottom: 12,
                    fontWeight: 500,
                  }}>
                    {v.metric}
                  </div>

                  {/* WordPress bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 80, flexShrink: 0 }}>
                      WordPress
                    </span>
                    <div style={{ flex: 1, height: 28, backgroundColor: 'var(--canvas-subtle)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.min((v.wordpress / (v.wordpress * 1.2)) * 100, 100)}%`,
                        height: '100%',
                        backgroundColor: '#E05555',
                        borderRadius: 4,
                        transition: 'width 1s ease',
                      }} />
                    </div>
                    <span style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#E05555',
                      width: 80,
                      textAlign: 'right',
                    }}>
                      {v.wordpress}{v.unit} FAIL
                    </span>
                  </div>

                  {/* Next.js bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 80, flexShrink: 0 }}>
                      Next.js
                    </span>
                    <div style={{ flex: 1, height: 28, backgroundColor: 'var(--canvas-subtle)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.min((v.nextjs / (v.wordpress * 1.2)) * 100, 100)}%`,
                        height: '100%',
                        backgroundColor: 'var(--accent)',
                        borderRadius: 4,
                        transition: 'width 1s ease',
                      }} />
                    </div>
                    <span style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--accent)',
                      width: 80,
                      textAlign: 'right',
                    }}>
                      {v.nextjs}{v.unit} PASS
                    </span>
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </ScrollRevealSection>

      {/* ── Pricing ── */}
      <ScrollRevealSection style={{ backgroundColor: 'var(--canvas-subtle)' }}>
        <div id="pricing" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
          <SectionHeadline>pricing</SectionHeadline>
          <SectionSub>
            transparent pricing. no surprises. every package includes deployment, analytics, and support.
          </SectionSub>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {pricingTiers.map((tier) => (
              <MotionReveal key={tier.name}>
                <div style={{
                  border: tier.recommended ? '2px solid var(--accent)' : '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 32,
                  backgroundColor: 'var(--canvas)',
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
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
                    }}>
                      recommended
                    </div>
                  )}

                  <div style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: 8,
                  }}>
                    {tier.tag}
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
                    marginBottom: 24,
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
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                      }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 600, flexShrink: 0 }}>+</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <MagneticHover>
                    <a
                      href="https://cal.com/shawntenam"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        padding: '14px 24px',
                        marginTop: 24,
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
                      get started
                    </a>
                  </MagneticHover>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </ScrollRevealSection>

      {/* ── What You Get ── */}
      <ScrollRevealSection>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px' }}>
          <SectionHeadline>what you get</SectionHeadline>
          <SectionSub>
            every site we build comes with these fundamentals. no add-on fees. no surprises.
          </SectionSub>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {deliverables.map((d) => (
              <MotionReveal key={d.title}>
                <div style={{
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 24,
                  backgroundColor: 'var(--canvas)',
                }}>
                  <div style={{
                    fontSize: 24,
                    color: 'var(--accent)',
                    fontWeight: 700,
                    marginBottom: 12,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {d.icon}
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
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </ScrollRevealSection>

      {/* ── How It Works ── */}
      <ScrollRevealSection style={{ backgroundColor: 'var(--canvas-subtle)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
          <SectionHeadline>how it works</SectionHeadline>
          <SectionSub>
            from first call to live site in 2-3 weeks. here is the process.
          </SectionSub>
          <ProcessSteps steps={processSteps} />
        </div>
      </ScrollRevealSection>

      {/* ── Meta Proof ── */}
      <ScrollRevealSection>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px' }}>
          <SectionHeadline>this page is the proof</SectionHeadline>
          <SectionSub>
            you are looking at a site built with the same technology we use for every client. run it through Google PageSpeed yourself.
          </SectionSub>

          <MotionReveal>
            <div style={{
              backgroundColor: 'var(--canvas-subtle)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 24,
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              lineHeight: 2,
            }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: 8 }}>$ performance-check --this-page</div>
              <div><span style={{ color: 'var(--accent)' }}>[PASS]</span> <span style={{ color: 'var(--text-secondary)' }}>framework:</span> <span style={{ color: 'var(--text-primary)' }}>Next.js 15</span></div>
              <div><span style={{ color: 'var(--accent)' }}>[PASS]</span> <span style={{ color: 'var(--text-secondary)' }}>hosting:</span> <span style={{ color: 'var(--text-primary)' }}>Vercel Edge Network</span></div>
              <div><span style={{ color: 'var(--accent)' }}>[PASS]</span> <span style={{ color: 'var(--text-secondary)' }}>LCP:</span> <span style={{ color: 'var(--text-primary)' }}>&lt; 1.0s</span></div>
              <div><span style={{ color: 'var(--accent)' }}>[PASS]</span> <span style={{ color: 'var(--text-secondary)' }}>INP:</span> <span style={{ color: 'var(--text-primary)' }}>&lt; 100ms</span></div>
              <div><span style={{ color: 'var(--accent)' }}>[PASS]</span> <span style={{ color: 'var(--text-secondary)' }}>CLS:</span> <span style={{ color: 'var(--text-primary)' }}>&lt; 0.05</span></div>
              <div><span style={{ color: 'var(--accent)' }}>[PASS]</span> <span style={{ color: 'var(--text-secondary)' }}>page weight:</span> <span style={{ color: 'var(--text-primary)' }}>&lt; 200KB</span></div>
              <div style={{ color: 'var(--text-muted)', marginTop: 8 }}>all checks passed. 6/6 green.</div>
            </div>
          </MotionReveal>
        </div>
      </ScrollRevealSection>

      {/* ── FAQ ── */}
      <ScrollRevealSection style={{ backgroundColor: 'var(--canvas-subtle)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
          <SectionHeadline>frequently asked questions</SectionHeadline>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {faqItems.map((item) => (
              <MotionReveal key={item.q}>
                <details className="faq-item" style={{
                  borderBottom: '1px solid var(--border)',
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

      {/* ── CTA ── */}
      <section style={{
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <MotionReveal>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}>
            ready to see the difference?
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
            book a free site audit. we will run your current site through PageSpeed, show you where you stand, and map out exactly what a new site would do for your business.
          </p>
        </MotionReveal>
        <MotionReveal delay={0.2}>
          <MagneticHover>
            <a
              href="https://cal.com/shawntenam"
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
              book a free site audit
            </a>
          </MagneticHover>
        </MotionReveal>
      </section>
    </div>
  )
}
