'use client'

import Link from 'next/link'
import { MotionReveal, StaggerContainer, StaggerItem, MagneticHover } from '../components/motion'
import { TechStackGrid } from './TechStackGrid'

const network = [
  {
    label: 'theGTMOS.ai',
    url: 'https://thegtmos.ai',
    accent: 'var(--gtmos-teal)',
    desc: 'The GTM operating system. Frameworks, playbooks, and live builds for go-to-market engineering.',
  },
  {
    label: 'theContentOS.ai',
    url: 'https://thecontentos.ai',
    accent: 'var(--contentos-purple)',
    desc: 'The content operating system. Voice-first publishing, repurpose pipelines, and content-as-code.',
  },
]

const socials = [
  { label: 'LinkedIn', url: 'https://linkedin.com/in/shawntenam' },
  { label: 'X / Twitter', url: 'https://x.com/shawntenam' },
  { label: 'Substack', url: 'https://shawntenam.substack.com' },
  { label: 'GitHub', url: 'https://github.com/shawnla90' },
]

const section: React.CSSProperties = { marginBottom: '48px' }
const sectionTitle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--accent)',
  marginBottom: '16px',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}
const paragraph: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.75,
  color: 'var(--text-primary)',
  marginBottom: '12px',
}
const mutedText: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
}

export function AboutContent() {
  return (
    <div
      style={{
        maxWidth: '680px',
        margin: '0 auto',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Terminal header */}
      <MotionReveal variant="fadeIn">
        <h1
          style={{
            fontSize: '16px',
            fontWeight: 400,
            color: 'var(--text-muted)',
            marginBottom: '32px',
          }}
        >
          <span style={{ color: 'var(--accent)' }}>$</span> cat ~/about.md
        </h1>
      </MotionReveal>

      {/* Identity */}
      <MotionReveal>
        <div style={section}>
          <h2 style={sectionTitle}>identity</h2>
          <p style={paragraph}>GTM engineer. builder. shipped from a monorepo.</p>
          <p style={paragraph}>
            I build AI-native pipelines, agent-driven workflows, and content
            systems that compound. every skill, every post, every campaign runs
            through a single codebase. the site you&apos;re on right now is the
            proof of work.
          </p>
        </div>
      </MotionReveal>

      {/* Tech Stack */}
      <MotionReveal>
        <div style={section}>
          <h2 style={sectionTitle}>tech stack</h2>
          <TechStackGrid />
        </div>
      </MotionReveal>

      {/* The Network */}
      <MotionReveal>
        <div style={section}>
          <h2 style={sectionTitle}>the network</h2>
          <p style={{ ...mutedText, marginBottom: '16px' }}>
            shawnos.ai is one node in a three-site system. each site owns a
            domain of the stack.
          </p>
          <StaggerContainer stagger={0.1} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {network.map((site) => (
              <StaggerItem key={site.label}>
                <MagneticHover strength={0.15} style={{ display: 'block' }}>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      padding: '16px',
                      background: 'var(--canvas-subtle)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'border-color 0.15s ease',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: site.accent,
                        marginBottom: '6px',
                      }}
                    >
                      {site.label} &rarr;
                    </span>
                    <span style={mutedText}>{site.desc}</span>
                  </a>
                </MagneticHover>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </MotionReveal>

      {/* Connect */}
      <MotionReveal>
        <div style={{ ...section, marginBottom: '24px' }}>
          <h2 style={sectionTitle}>connect</h2>
          <StaggerContainer stagger={0.06} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {socials.map((s) => (
              <StaggerItem key={s.label}>
                <MagneticHover>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '10px 18px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--accent)',
                      background: 'transparent',
                      border: '1px solid var(--accent)',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'background 0.15s ease, color 0.15s ease',
                      display: 'inline-block',
                    }}
                  >
                    {s.label}
                  </a>
                </MagneticHover>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </MotionReveal>

      {/* Showcase CTA */}
      <MotionReveal variant="scale">
        <div
          style={{
            background: 'var(--canvas-subtle)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '20px 24px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              see the components in action
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              live demos of every system — terminal UI, animations, RPG engine, video gen.
            </div>
          </div>
          <MagneticHover>
            <Link
              href="/showcase"
              style={{
                display: 'inline-block',
                padding: '8px 18px',
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent)',
                background: 'transparent',
                border: '1px solid var(--accent)',
                borderRadius: 6,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              component showcase &rarr;
            </Link>
          </MagneticHover>
        </div>
      </MotionReveal>

      {/* Arc CTA */}
      <MotionReveal variant="scale">
        <div
          style={{
            background: 'var(--canvas-subtle)',
            border: '1px solid var(--accent)',
            borderRadius: '8px',
            padding: '24px',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent)', marginBottom: '8px' }}>
            want the full story?
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: '16px' }}>
            plumber. SDR. GTM engineer. the layers, the thesis, and why three domains exist.
          </p>
          <MagneticHover>
            <Link
              href="/about/arc"
              style={{
                display: 'inline-block',
                padding: '10px 22px',
                fontSize: '13px',
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
              read the arc &rarr;
            </Link>
          </MagneticHover>
        </div>
      </MotionReveal>
    </div>
  )
}
