'use client'

import Link from 'next/link'
import {
  MotionReveal,
  ScrollRevealSection,
  StaggerContainer,
  StaggerItem,
  SectionHeadline,
} from '@shawnos/shared/components'
import { useIsMobile } from '@shawnos/shared/hooks'
import { ShowcaseDemos } from './demos'

/* ── data ─────────────────────────────────────────── */

const stats = [
  { value: '10', label: 'Live Demos' },
  { value: '4', label: 'New Components' },
  { value: '0', label: 'External APIs' },
  { value: '20', label: 'Anti-Slop Rules' },
]

export function ShowcaseContent() {
  const isMobile = useIsMobile()
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="full-bleed"
        style={{
          minHeight: '70dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background:
            'radial-gradient(ellipse 800px 600px at 50% 30%, rgba(255, 105, 180, 0.12), transparent 60%), var(--canvas)',
          textAlign: 'center',
          padding: '80px 24px 60px',
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
            Interactive Demos
          </div>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.15}>
          <h1
            style={{
              fontSize: 'clamp(36px, 6vw, 56px)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.15,
              margin: '0 0 16px',
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>Content Tools,</span>{' '}
            <span style={{ color: 'var(--accent)' }}>Built in React</span>
          </h1>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.25}>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: 600,
              margin: '0 auto 40px',
            }}
          >
            Ten interactive components that demonstrate content operations as
            infrastructure. Every demo runs client-side. The React is the content.
          </p>
        </MotionReveal>

        {/* Stats */}
        <MotionReveal variant="fadeUp" delay={0.35}>
          <div
            style={{
              display: 'flex',
              gap: 32,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
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
                    color: 'var(--text-muted)',
                    marginTop: 4,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </MotionReveal>
      </section>

      {/* ── Featured: Anti-Slop Detector ── */}
      <ScrollRevealSection
        background="var(--canvas-subtle)"
        style={{
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 16 : 32,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: isMobile ? '1 1 100%' : '1 1 320px' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#E05555',
                background: 'rgba(224, 85, 85, 0.08)',
                border: '1px solid rgba(224, 85, 85, 0.2)',
                borderRadius: 4,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              Featured Tool
            </div>
            <h2
              style={{
                fontSize: 'clamp(24px, 3vw, 32px)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 12,
              }}
            >
              Anti-Slop Detector
            </h2>
            <p
              style={{
                fontSize: '15px',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: 20,
              }}
            >
              Paste any text and score it against 20 anti-slop rules.
              Corporate filler words, passive voice, and vague openers get
              flagged in real time. The full version includes educational breakdowns
              of each violation type.
            </p>
            <Link
              href="/anti-slop"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--canvas)',
                background: '#E05555',
                border: '1px solid #E05555',
                borderRadius: 6,
                textDecoration: 'none',
              }}
            >
              Try the full Anti-Slop Detector &rarr;
            </Link>
          </div>
          <div
            style={{
              flex: isMobile ? '1 1 100%' : '1 1 280px',
              padding: '24px',
              background: 'var(--canvas)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '64px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: '#E05555',
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              100
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#E05555',
                marginBottom: 4,
              }}
            >
              maximum slop
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              can your content pass?
            </div>
          </div>
        </div>
      </ScrollRevealSection>

      {/* ── Voice Tools ── */}
      <ScrollRevealSection background="var(--canvas)">
        <SectionHeadline
          label="VOICE TOOLS"
          subtitle="Demos 01-06: Core content infrastructure"
        >
          Core Demos
        </SectionHeadline>

        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div id="demo-01" style={{ scrollMarginTop: 80 }} />
          <div id="demo-02" style={{ scrollMarginTop: 80 }} />
          <div id="demo-03" style={{ scrollMarginTop: 80 }} />
          <div id="demo-04" style={{ scrollMarginTop: 80 }} />
          <div id="demo-05" style={{ scrollMarginTop: 80 }} />
          <div id="demo-06" style={{ scrollMarginTop: 80 }} />
        </div>
      </ScrollRevealSection>

      {/* ── All Demos ── */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <SectionHeadline
          label="ALL DEMOS"
          subtitle="All 10 interactive components"
        >
          Full Showcase
        </SectionHeadline>

        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <ShowcaseDemos />
        </div>
      </ScrollRevealSection>

      {/* ── CTA Nav ── */}
      <ScrollRevealSection background="var(--canvas)" variant="scale">
        <StaggerContainer stagger={0.1}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
            }}
          >
            {[
              { href: '/method', label: 'The Method', desc: 'The 3-tier system behind these tools.' },
              { href: '/anti-slop', label: 'Anti-Slop Detector', desc: 'Full version with educational breakdown.' },
              { href: '/react-lab', label: 'React Lab', desc: 'Component playground and experiments.' },
              { href: '/content-wiki', label: 'Content Wiki', desc: 'Voice systems and platform playbooks.' },
            ].map((link) => (
              <StaggerItem key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    display: 'block',
                    padding: '24px',
                    background: 'var(--canvas-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    textDecoration: 'none',
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--accent)',
                      marginBottom: 8,
                    }}
                  >
                    {link.label} &rarr;
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}
                  >
                    {link.desc}
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </ScrollRevealSection>
    </>
  )
}
