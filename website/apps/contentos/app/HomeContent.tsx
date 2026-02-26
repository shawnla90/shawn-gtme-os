'use client'

import Link from 'next/link'
import { LogCard, TypewriterHero, ScrambleCycler, AvatarBadge } from '@shawnos/shared/components'
import type { DailyLogSummary } from '@shawnos/shared/lib/logs'
import { VideoShowcase } from './VideoShowcase'
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
  MagneticHover,
  ScrollRevealSection,
} from './components/motion'

/* ── data ────────────────────────────────────────── */

const stats = [
  { value: '50', label: 'Wiki Entries' },
  { value: '38', label: 'How-To Guides' },
  { value: '6', label: 'Content Pillars' },
  { value: '3', label: 'Color Schemas' },
]

const featuredSections = [
  {
    title: 'Content Wiki',
    desc: 'The reference layer. 50 entries covering voice calibration, platform rules, content structures, and distribution patterns. Searchable, cross-linked, always growing.',
    href: '/content-wiki',
    command: 'cat ~/wiki --index',
  },
  {
    title: 'How-To Guides',
    desc: '38 step-by-step playbooks for real content tasks. From writing a first LinkedIn post to building recursive content loops. No theory -- just execution.',
    href: '/how-to',
    command: 'ls ~/how-to --all',
  },
  {
    title: 'React Lab',
    desc: 'Live component playground. Every UI element on this site is built here first. Terminal aesthetics, motion patterns, and data visualizations.',
    href: '/react-lab',
    command: 'run ~/lab --interactive',
  },
]

const tiers = [
  {
    level: '01',
    title: 'Voice DNA',
    desc: 'The foundation. Your cadence, vocabulary, energy patterns, and anti-patterns. The system learns how you sound so AI output matches you, not a template.',
    status: 'calibrated',
  },
  {
    level: '02',
    title: 'Context Playbooks',
    desc: 'Platform-specific rules encoded. LinkedIn, X, Substack, TikTok, Reddit. Each has its own playbook. Your voice adapts without getting lost.',
    status: 'loaded',
  },
  {
    level: '03',
    title: 'Content Ops',
    desc: 'The pipeline. Draft, refine, distribute, compound. Every post feeds the next one. Breadcrumbs, forward-references, recursive loops. The system grows itself.',
    status: 'active',
  },
]

const painPoints: string[] = [
  'You want to grow. But every platform rewrites your voice.',
  'LinkedIn has its rules. X has its rules. Substack, TikTok, Reddit. All different.',
  'People make it look easy. It\'s not. It takes real work.',
  'The energy it takes to adapt, engage, and thread across platforms -- that\'s the hidden cost nobody talks about.',
  'You shouldn\'t have to navigate a million tabs to be yourself everywhere.',
]

const bootLines = [
  { status: 'OK', label: 'voice engine ... calibrated' },
  { status: 'OK', label: 'content pipeline ... flowing' },
  { status: 'OK', label: 'pillar detection ... active' },
  { status: 'OK', label: 'recursive loop ... engaged' },
  { status: 'OK', label: 'platform playbooks ... loaded' },
  { status: 'OK', label: 'network link ... theGTMOS.ai' },
]

const ctaLinks = [
  { label: 'Browse the wiki', href: '/content-wiki', internal: true },
  { label: 'Read how-to guides', href: '/how-to', internal: true },
  { label: 'Explore the lab', href: '/react-lab', internal: true },
  { label: 'View GTM OS', href: 'https://thegtmos.ai', internal: false },
]

/* ── section headline helper ─────────────────────── */

function SectionHeadline({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2
        style={{
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          lineHeight: 1.2,
          margin: 0,
        }}
      >
        {children}
      </h2>
      {subtitle && (
        <p
          style={{
            fontSize: 'clamp(14px, 1.5vw, 16px)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            marginTop: 8,
            margin: '8px 0 0',
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

/* ── types ────────────────────────────────────────── */

interface HomeContentProps {
  latestLog: DailyLogSummary | null
}

/* ── component ───────────────────────────────────── */

export function HomeContent({ latestLog }: HomeContentProps) {
  return (
    <>
      {/* ── Hero -- 100dvh, centered, bold ── */}
      <section
        className="full-bleed"
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'var(--canvas)',
          position: 'relative',
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        <MotionReveal variant="fadeUp" delay={0.1}>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              marginBottom: 24,
            }}
          >
            <span style={{ color: 'var(--accent)' }}>$</span> ./boot theContentOS.ai
          </p>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.2}>
          <h1
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.15,
              margin: '0 0 24px',
              maxWidth: 900,
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>the</span>{' '}
            <span style={{ color: 'var(--accent)' }}>Content OS</span>
          </h1>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.35}>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.6,
              maxWidth: 640,
              margin: '0 auto 16px',
            }}
          >
            One voice across every platform. AI-powered content that sounds like you, not AI slop.
          </p>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.45}>
          <div style={{ marginBottom: 40 }}>
            <ScrambleCycler
              phrases={[
                'Create. Orchestrate. Ship.',
                'one voice. every platform.',
                'draft > ship > compound > repeat',
                'voice engine + platform playbooks + content ops',
              ]}
              holdMs={3000}
              scrambleSpeed={30}
              resolveSpeed={50}
            />
          </div>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.55}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <MagneticHover>
              <Link
                href="/content-wiki"
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--canvas)',
                  background: 'var(--accent)',
                  border: '1px solid var(--accent)',
                  borderRadius: 6,
                  textDecoration: 'none',
                  transition: 'opacity 0.15s ease',
                }}
              >
                explore the wiki &rarr;
              </Link>
            </MagneticHover>
            <MagneticHover>
              <Link
                href="/how-to"
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent)',
                  background: 'transparent',
                  border: '1px solid var(--accent)',
                  borderRadius: 6,
                  textDecoration: 'none',
                  transition: 'background 0.15s ease, color 0.15s ease',
                }}
              >
                how-to guides
              </Link>
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
            color: 'var(--text-muted)',
            fontSize: '24px',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          &#8964;
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <ScrollRevealSection
        background="var(--canvas-subtle)"
        style={{
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          paddingTop: 48,
          paddingBottom: 48,
        }}
      >
        <StatsStrip />
      </ScrollRevealSection>

      {/* ── Highlight Reel ── */}
      <ScrollRevealSection background="var(--canvas)">
        <SectionHeadline subtitle="Recent builds, shipped live">Highlight Reel</SectionHeadline>
        <VideoShowcase />
      </ScrollRevealSection>

      {/* ── The Problem ── */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <SectionHeadline subtitle="The hidden cost of multi-platform content">The Problem</SectionHeadline>
        <div
          style={{
            padding: '24px',
            background: 'var(--canvas)',
            border: '1px solid var(--border)',
            borderRadius: 6,
          }}
        >
          <StaggerContainer stagger={0.06}>
            {painPoints.map((point, i) => (
              <StaggerItem key={i}>
                <p
                  style={{
                    fontSize: '14px',
                    lineHeight: 2,
                    color: 'var(--text-secondary)',
                    margin: 0,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>&gt;</span> {point}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <div
            style={{
              marginTop: 16,
              paddingTop: 12,
              borderTop: '1px solid var(--border)',
              fontSize: '14px',
              color: 'var(--accent)',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
            }}
          >
            there has to be a better way.
          </div>
        </div>
      </ScrollRevealSection>

      {/* ── Featured Sections ── */}
      <ScrollRevealSection background="var(--canvas)">
        <SectionHeadline subtitle="The core modules of the content operating system">Explore the System</SectionHeadline>

        <StaggerContainer stagger={0.12}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            {featuredSections.map((section) => (
              <StaggerItem key={section.title}>
                <Link
                  href={section.href}
                  style={{
                    display: 'block',
                    padding: '24px',
                    background: 'var(--canvas-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    textDecoration: 'none',
                    transition: 'border-color 0.15s ease',
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                      marginBottom: 12,
                    }}
                  >
                    <span style={{ color: 'var(--accent)' }}>$</span> {section.command}
                  </div>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--accent)',
                      fontFamily: 'var(--font-mono)',
                      marginBottom: 8,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {section.title} &rarr;
                  </h3>
                  <p
                    style={{
                      fontSize: '13px',
                      lineHeight: 1.7,
                      color: 'var(--text-secondary)',
                      margin: 0,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {section.desc}
                  </p>
                </Link>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </ScrollRevealSection>

      {/* ── System Architecture -- 3-Tier Breakdown ── */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <SectionHeadline subtitle="Three tiers that compound">System Architecture</SectionHeadline>

        <StaggerContainer stagger={0.15}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {tiers.map((tier, i) => (
              <StaggerItem key={tier.level}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr auto',
                    gap: 20,
                    alignItems: 'start',
                    padding: '24px',
                    background: 'var(--canvas)',
                    border: '1px solid var(--border)',
                    borderRadius: i === 0 ? '6px 6px 0 0' : i === tiers.length - 1 ? '0 0 6px 6px' : 0,
                  }}
                >
                  {/* Tier number */}
                  <div
                    style={{
                      fontSize: 'clamp(28px, 4vw, 36px)',
                      fontWeight: 700,
                      color: 'var(--accent)',
                      fontFamily: 'var(--font-mono)',
                      lineHeight: 1,
                      opacity: 0.6,
                    }}
                  >
                    {tier.level}
                  </div>

                  {/* Tier content */}
                  <div>
                    <h3
                      style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        marginBottom: 6,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {tier.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '13px',
                        lineHeight: 1.7,
                        color: 'var(--text-secondary)',
                        margin: 0,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {tier.desc}
                    </p>
                  </div>

                  {/* Status badge */}
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--accent)',
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      padding: '4px 10px',
                      border: '1px solid var(--accent)',
                      borderRadius: 4,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tier.status}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {/* Connection arrows */}
        <MotionReveal variant="fadeIn" delay={0.6}>
          <div
            style={{
              textAlign: 'center',
              marginTop: 24,
              fontSize: '13px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            voice DNA &rarr; context playbooks &rarr; content ops &rarr; <span style={{ color: 'var(--accent)' }}>compound</span>
          </div>
        </MotionReveal>
      </ScrollRevealSection>

      {/* ── Latest Log ── */}
      {latestLog && (
        <ScrollRevealSection background="var(--canvas)">
          <SectionHeadline subtitle="Today's build log">Latest Log</SectionHeadline>

          <LogCard {...latestLog} basePath="/log" />

          <div style={{ marginTop: 24 }}>
            <Link
              href="/log"
              style={{
                fontSize: '15px',
                color: 'var(--accent)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              view all logs &rarr;
            </Link>
          </div>
        </ScrollRevealSection>
      )}

      {/* ── Boot Log -- terminal flavor ── */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <h2
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--accent)',
            marginBottom: 16,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          system status
        </h2>

        <div
          style={{
            padding: '20px 24px',
            background: 'var(--canvas)',
            border: '1px solid var(--border)',
            borderRadius: 6,
          }}
        >
          <StaggerContainer stagger={0.05}>
            {bootLines.map((line) => (
              <StaggerItem key={line.label}>
                <div
                  style={{
                    fontSize: '13px',
                    lineHeight: 2,
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  [<span style={{ color: 'var(--accent)', fontWeight: 600 }}>{line.status}</span>] {line.label}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <div
            style={{
              marginTop: 16,
              paddingTop: 12,
              borderTop: '1px solid var(--border)',
              fontSize: '13px',
              color: 'var(--accent)',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
            }}
          >
            &gt; all systems operational_
          </div>
        </div>
      </ScrollRevealSection>

      {/* ── CTA -- Explore the System ── */}
      <ScrollRevealSection background="var(--canvas)" variant="scale">
        <div
          style={{
            padding: '40px 32px',
            background: 'var(--canvas-subtle)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(24px, 3.5vw, 36px)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
              margin: '0 0 8px',
            }}
          >
            Explore the System
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              margin: '0 0 32px',
            }}
          >
            Pick a module and start reading.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              maxWidth: 800,
              margin: '0 auto',
            }}
          >
            {ctaLinks.map((item) => {
              const LinkEl = item.internal ? Link : 'a'
              return (
                <LinkEl
                  key={item.label}
                  href={item.href}
                  {...(!item.internal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  style={{
                    display: 'block',
                    padding: '20px 16px',
                    background: 'var(--canvas)',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    textDecoration: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: 'var(--accent)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {item.label} &rarr;
                  </div>
                </LinkEl>
              )
            })}
          </div>
        </div>
      </ScrollRevealSection>
    </>
  )
}

/* ── Stats Strip (inline) ───────────────────────── */

function StatsStrip() {
  return (
    <>
      <style>{`
        @keyframes stats-count-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cos-stats-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--border);
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .cos-stats-strip {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>

      <StaggerContainer stagger={0.08}>
        <div className="cos-stats-strip">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div
                style={{
                  padding: '32px 24px',
                  background: 'var(--canvas-subtle)',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <div
                  style={{
                    fontSize: 'clamp(32px, 5vw, 48px)',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    marginTop: 8,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </>
  )
}
