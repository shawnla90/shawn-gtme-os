'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  MotionReveal,
  ScrollRevealSection,
  StaggerContainer,
  StaggerItem,
  TypewriterHero,
  ScrambleCycler,
  TerminalChrome,
  HorizontalScrollSection,
  HorizontalPanel,
  ProcessSteps,
  FAQAccordion,
  MagneticHover,
} from '@shawnos/shared/components'
import {
  techniques,
  principles,
  processSteps,
  faqItems,
  type MJTechnique,
  type MJPrompt,
} from './data'

/* ── Theme ───────────────────────────────────────────── */

const MJ = {
  accent: '#FF69B4',
  mjBlue: '#5B8DEF',
  gridBg: '#0A0E14',
  promptGreen: '#4EC373',
  dark: '#0D1117',
  darkSubtle: '#161B22',
  border: '#30363D',
  text: '#C9D1D9',
  textMuted: '#8B949E',
} as const

/* ── Difficulty colors ───────────────────────────────── */

const difficultyColors: Record<string, string> = {
  beginner: '#4EC373',
  intermediate: '#5B8DEF',
  advanced: '#FF69B4',
}

/* ── Floating Spirits ────────────────────────────────── */

interface SpiritState {
  x: number
  y: number
  vx: number
  vy: number
  scale: number
  clicked: boolean
  clickTimer: number
  trail: { x: number; y: number; opacity: number }[]
}

function FloatingSpirits() {
  const containerRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [spirits, setSpirits] = useState<SpiritState[]>([
    {
      x: 0.15,
      y: 0.3,
      vx: 0.3,
      vy: 0.2,
      scale: 1,
      clicked: false,
      clickTimer: 0,
      trail: [],
    },
    {
      x: 0.85,
      y: 0.6,
      vx: -0.25,
      vy: 0.35,
      scale: 1,
      clicked: false,
      clickTimer: 0,
      trail: [],
    },
  ])
  const spiritsRef = useRef(spirits)
  spiritsRef.current = spirits

  /* Track mouse position */
  useEffect(() => {
    function handleMouse(e: MouseEvent) {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  /* Animation loop */
  useEffect(() => {
    let prev = performance.now()

    function tick(now: number) {
      const dt = Math.min((now - prev) / 1000, 0.05)
      prev = now

      setSpirits((prev) =>
        prev.map((s) => {
          let { x, y, vx, vy, scale, clicked, clickTimer, trail } = {
            ...s,
            trail: [...s.trail],
          }

          /* Gentle mouse attraction */
          const mx = mouseRef.current.x
          const my = mouseRef.current.y
          const dx = mx - x
          const dy = my - y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist > 0.05 && dist < 0.5) {
            const pull = 0.15 / (dist + 0.1)
            vx += dx * pull * dt
            vy += dy * pull * dt
          }

          /* Bounce off edges */
          if (x < 0.05 || x > 0.95) vx *= -0.8
          if (y < 0.05 || y > 0.95) vy *= -0.8

          /* Damping */
          vx *= 0.995
          vy *= 0.995

          /* Speed limit */
          const speed = Math.sqrt(vx * vx + vy * vy)
          if (speed > 0.8) {
            vx = (vx / speed) * 0.8
            vy = (vy / speed) * 0.8
          }

          /* Idle drift */
          vx += (Math.random() - 0.5) * 0.3 * dt
          vy += (Math.random() - 0.5) * 0.3 * dt

          x += vx * dt
          y += vy * dt
          x = Math.max(0.02, Math.min(0.98, x))
          y = Math.max(0.02, Math.min(0.98, y))

          /* Click effect decay */
          if (clicked) {
            clickTimer -= dt
            scale = 1 + Math.max(0, clickTimer) * 0.5
            if (clickTimer <= 0) {
              clicked = false
              clickTimer = 0
              scale = 1
            }
          }

          /* Trail */
          trail.unshift({ x, y, opacity: 0.6 })
          trail = trail.slice(0, 8).map((t, i) => ({
            ...t,
            opacity: 0.6 * (1 - i / 8),
          }))

          return { x, y, vx, vy, scale, clicked, clickTimer, trail }
        }),
      )

      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  /* Click handler - burst effect */
  const handleClick = useCallback((index: number) => {
    setSpirits((prev) =>
      prev.map((s, i) => {
        if (i !== index) return s
        /* Burst: randomize velocity + scale pop */
        const angle = Math.random() * Math.PI * 2
        return {
          ...s,
          vx: Math.cos(angle) * 1.2,
          vy: Math.sin(angle) * 1.2,
          clicked: true,
          clickTimer: 0.6,
          scale: 1.5,
        }
      }),
    )
  }, [])

  const images = ['/midjourney/muse-wireframe.apng', '/midjourney/spirit-jellyfish.apng']
  const glowColors = ['rgba(255, 7, 58, 0.4)', 'rgba(255, 7, 58, 0.35)']
  const sizes = [120, 100]

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {spirits.map((s, i) => (
        <div key={i}>
          {/* Trail particles */}
          {s.trail.map((t, ti) => (
            <div
              key={ti}
              style={{
                position: 'absolute',
                left: `${t.x * 100}%`,
                top: `${t.y * 100}%`,
                width: 4 + ti * 0.5,
                height: 4 + ti * 0.5,
                borderRadius: '50%',
                background: `rgba(255, 7, 58, ${t.opacity * 0.3})`,
                transform: 'translate(-50%, -50%)',
                transition: 'left 0.1s linear, top 0.1s linear',
              }}
            />
          ))}

          {/* Spirit */}
          <div
            style={{
              position: 'absolute',
              left: `${s.x * 100}%`,
              top: `${s.y * 100}%`,
              transform: `translate(-50%, -50%) scale(${s.scale})`,
              transition: 'transform 0.15s ease-out',
              pointerEvents: 'auto',
              cursor: 'pointer',
              filter: `drop-shadow(0 0 20px ${glowColors[i]}) drop-shadow(0 0 40px ${glowColors[i]})`,
            }}
            onClick={() => handleClick(i)}
          >
            <img
              src={images[i]}
              alt={i === 0 ? 'Muse spirit' : 'Ethereal spirit'}
              style={{
                width: sizes[i],
                height: sizes[i],
                objectFit: 'contain',
                userSelect: 'none',
              }}
              draggable={false}
            />

            {/* Click burst particles */}
            {s.clicked && (
              <>
                {Array.from({ length: 6 }).map((_, pi) => (
                  <div
                    key={pi}
                    className="spirit-burst"
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#FF073A',
                      boxShadow: '0 0 8px #FF073A',
                      transform: `translate(-50%, -50%) rotate(${pi * 60}deg) translateX(${30 + Math.random() * 40}px)`,
                      opacity: s.clickTimer,
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── PromptBlock ─────────────────────────────────────── */

function PromptBlock({ prompt }: { prompt: MJPrompt }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(prompt.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* Highlight parameters in the prompt text */
  function renderPromptText(text: string) {
    const parts = text.split(/(--\w+\s+\S+)/g)
    return parts.map((part, i) =>
      part.startsWith('--') ? (
        <span key={i} style={{ color: MJ.mjBlue, fontWeight: 600 }}>
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      ),
    )
  }

  return (
    <div style={{ marginBottom: 24 }}>
      {prompt.label && (
        <div
          style={{
            fontSize: 12,
            color: MJ.textMuted,
            marginBottom: 8,
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {prompt.label}
        </div>
      )}
      <TerminalChrome title="midjourney">
        <div style={{ position: 'relative' }}>
          <button
            onClick={handleCopy}
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              background: copied
                ? 'rgba(78, 195, 115, 0.15)'
                : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${copied ? MJ.promptGreen : MJ.border}`,
              borderRadius: 6,
              padding: '4px 12px',
              fontSize: 11,
              color: copied ? MJ.promptGreen : MJ.textMuted,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              transition: 'all 0.2s',
            }}
          >
            {copied ? 'copied' : 'copy'}
          </button>
          <code
            style={{
              display: 'block',
              color: MJ.promptGreen,
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              paddingRight: 60,
            }}
          >
            <span style={{ color: MJ.textMuted, userSelect: 'none' }}>
              /imagine{' '}
            </span>
            {renderPromptText(prompt.text)}
          </code>
        </div>
      </TerminalChrome>

      {prompt.parameters && prompt.parameters.length > 0 && (
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {prompt.parameters.map((param) => (
            <div
              key={param.key}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 12px',
                background: 'rgba(91, 141, 239, 0.08)',
                border: `1px solid rgba(91, 141, 239, 0.2)`,
                borderRadius: 6,
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span style={{ color: MJ.mjBlue, fontWeight: 600 }}>
                {param.key} {param.value}
              </span>
              <span style={{ color: MJ.textMuted }}>{param.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── ImageCompare (placeholder-ready) ────────────────── */

function ImageCompare({
  images,
}: {
  images: MJTechnique['images']
}) {
  if (images.length === 0) return null

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
        gap: 16,
        marginTop: 24,
      }}
    >
      {images.map((img, i) => (
        <div key={i}>
          {img.src ? (
            <img
              src={img.src}
              alt={img.alt}
              style={{
                width: '100%',
                borderRadius: 8,
                border: `1px solid ${MJ.border}`,
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: 8,
                border: `1px solid ${MJ.border}`,
                background: `linear-gradient(135deg, ${MJ.gridBg}, ${MJ.darkSubtle})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: MJ.textMuted,
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
              }}
            >
              image coming soon
            </div>
          )}
          {img.label && (
            <div
              style={{
                fontSize: 12,
                color: MJ.textMuted,
                marginTop: 8,
                fontFamily: 'var(--font-mono)',
                textAlign: 'center',
              }}
            >
              {img.label}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ── TechniqueSection ────────────────────────────────── */

function TechniqueSection({
  technique,
  index,
}: {
  technique: MJTechnique
  index: number
}) {
  const bg = index % 2 === 0 ? MJ.dark : MJ.darkSubtle

  return (
    <section
      className="full-bleed"
      style={{ background: bg }}
      id={technique.id}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          padding: '80px 24px',
        }}
      >
        <MotionReveal variant="fadeUp">
          {/* Badges */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                fontSize: 11,
                fontWeight: 600,
                color: difficultyColors[technique.difficulty],
                background: `${difficultyColors[technique.difficulty]}14`,
                border: `1px solid ${difficultyColors[technique.difficulty]}33`,
                borderRadius: 999,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {technique.difficulty}
            </span>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                fontSize: 11,
                fontWeight: 600,
                color: MJ.textMuted,
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${MJ.border}`,
                borderRadius: 999,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {technique.category}
            </span>
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
              margin: '0 0 8px',
              lineHeight: 1.2,
            }}
          >
            {technique.title}
          </h2>
          <p
            style={{
              fontSize: 16,
              color: MJ.mjBlue,
              fontFamily: 'var(--font-mono)',
              margin: '0 0 20px',
            }}
          >
            {technique.subtitle}
          </p>
          <p
            style={{
              fontSize: 16,
              color: MJ.text,
              lineHeight: 1.7,
              maxWidth: 800,
              margin: '0 0 32px',
            }}
          >
            {technique.description}
          </p>
        </MotionReveal>

        {/* Prompts */}
        <MotionReveal variant="fadeUp" delay={0.15}>
          {technique.prompts.map((prompt, i) => (
            <PromptBlock key={i} prompt={prompt} />
          ))}
        </MotionReveal>

        {/* Images */}
        <ImageCompare images={technique.images} />

        {/* Tips */}
        <MotionReveal variant="fadeUp" delay={0.25}>
          <div
            style={{
              marginTop: 32,
              padding: 24,
              background: 'rgba(78, 195, 115, 0.04)',
              border: `1px solid rgba(78, 195, 115, 0.15)`,
              borderRadius: 12,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: MJ.promptGreen,
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 12,
              }}
            >
              Pro Tips
            </div>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {technique.tips.map((tip, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 14,
                    color: MJ.text,
                    lineHeight: 1.7,
                    marginBottom: 6,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </MotionReveal>

        {/* Tags */}
        <MotionReveal variant="fadeUp" delay={0.3}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: 24,
            }}
          >
            {technique.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '4px 10px',
                  fontSize: 11,
                  color: MJ.textMuted,
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${MJ.border}`,
                  borderRadius: 6,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </MotionReveal>
      </div>
    </section>
  )
}

/* ── Main Export ──────────────────────────────────────── */

export function MidJourneyContent() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="full-bleed"
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: `radial-gradient(ellipse 900px 700px at 50% 35%, rgba(255, 105, 180, 0.10), transparent 60%), ${MJ.dark}`,
          textAlign: 'center',
          padding: '80px 24px 60px',
          position: 'relative',
        }}
      >
        <FloatingSpirits />

        <MotionReveal variant="fadeUp" delay={0.05}>
          <div
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              fontSize: 12,
              fontWeight: 600,
              color: MJ.accent,
              background: 'rgba(255, 105, 180, 0.08)',
              border: '1px solid rgba(255, 105, 180, 0.2)',
              borderRadius: 999,
              marginBottom: 24,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Interactive Guide
          </div>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.15}>
          <TypewriterHero
            siteName="MidJourney Mastery"
            sequences={[
              { text: 'master midjourney', pauseAfter: 3000 },
              { text: 'build characters', pauseAfter: 3000 },
              { text: 'create worlds', pauseAfter: 3000 },
              { text: 'ship production art', pauseAfter: 3000 },
            ]}
            typeSpeed={35}
            deleteSpeed={20}
            maxWidth={640}
          />
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.35}>
          <div style={{ marginTop: 16, marginBottom: 40 }}>
            <ScrambleCycler
              phrases={[
                'CREF - Character Reference',
                'OREF - Object Reference',
                'SREF - Style Reference',
                'Prompt Engineering',
                'Aspect Ratios & Composition',
              ]}
              holdMs={2500}
              scrambleSpeed={25}
              resolveSpeed={40}
            />
          </div>
        </MotionReveal>

        {/* Stats */}
        <MotionReveal variant="fadeUp" delay={0.45}>
          <div
            style={{
              display: 'flex',
              gap: 40,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {[
              { value: '5', label: 'Techniques' },
              { value: '8', label: 'Prompt Templates' },
              { value: '6', label: 'Parameters' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: MJ.accent,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: MJ.textMuted,
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </MotionReveal>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: MJ.textMuted,
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            scroll
          </span>
          <div
            style={{
              width: 1,
              height: 32,
              background: `linear-gradient(to bottom, ${MJ.textMuted}, transparent)`,
            }}
          />
        </div>
      </section>

      {/* ── Technique Sections ── */}
      {techniques.map((tech, i) => (
        <TechniqueSection key={tech.id} technique={tech} index={i} />
      ))}

      {/* ── Horizontal Scroll: 5 Prompting Principles ── */}
      <section
        className="full-bleed"
        style={{ background: MJ.gridBg }}
      >
        <div
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            padding: '60px 24px 20px',
          }}
        >
          <MotionReveal variant="fadeUp">
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: MJ.accent,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'var(--font-mono)',
                marginBottom: 8,
              }}
            >
              Framework
            </div>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              5 Prompting Principles
            </h2>
          </MotionReveal>
        </div>

        <HorizontalScrollSection>
          {principles.map((p) => (
            <HorizontalPanel key={p.number}>
              <div style={{ textAlign: 'left', maxWidth: 640 }}>
                <div
                  style={{
                    fontSize: 64,
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: MJ.accent,
                    lineHeight: 1,
                    marginBottom: 16,
                    opacity: 0.3,
                  }}
                >
                  {p.number}
                </div>
                <h3
                  style={{
                    fontSize: 'clamp(24px, 3.5vw, 36px)',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-primary)',
                    margin: '0 0 16px',
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontSize: 17,
                    color: MJ.text,
                    lineHeight: 1.7,
                    margin: '0 0 24px',
                  }}
                >
                  {p.description}
                </p>
                <div
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(78, 195, 115, 0.06)',
                    border: `1px solid rgba(78, 195, 115, 0.15)`,
                    borderRadius: 8,
                    fontSize: 14,
                    color: MJ.promptGreen,
                    fontFamily: 'var(--font-mono)',
                    lineHeight: 1.6,
                  }}
                >
                  {p.example}
                </div>
              </div>
            </HorizontalPanel>
          ))}
        </HorizontalScrollSection>
      </section>

      {/* ── Process Steps ── */}
      <section className="full-bleed" style={{ background: MJ.darkSubtle }}>
        <div
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            padding: '80px 24px',
          }}
        >
          <MotionReveal variant="fadeUp">
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: MJ.accent,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'var(--font-mono)',
                marginBottom: 8,
              }}
            >
              Workflow
            </div>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                margin: '0 0 40px',
              }}
            >
              The MidJourney Pipeline
            </h2>
          </MotionReveal>

          <ProcessSteps steps={processSteps} />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="full-bleed" style={{ background: MJ.dark }}>
        <div
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            padding: '80px 24px',
          }}
        >
          <MotionReveal variant="fadeUp">
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: MJ.accent,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'var(--font-mono)',
                marginBottom: 8,
              }}
            >
              Common Questions
            </div>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                margin: '0 0 40px',
              }}
            >
              FAQ
            </h2>
          </MotionReveal>

          <FAQAccordion items={faqItems} />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="full-bleed" style={{ background: MJ.darkSubtle }}>
        <div
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            padding: '80px 24px',
            textAlign: 'center',
          }}
        >
          <MotionReveal variant="scale">
            <h2
              style={{
                fontSize: 'clamp(24px, 3.5vw, 36px)',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                margin: '0 0 16px',
              }}
            >
              Ready to see the results?
            </h2>
            <p
              style={{
                fontSize: 16,
                color: MJ.textMuted,
                margin: '0 0 32px',
                lineHeight: 1.6,
              }}
            >
              Browse the gallery to see these techniques in action, build your
              own prompts, or explore the content wiki.
            </p>
            <div
              style={{
                display: 'flex',
                gap: 16,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <MagneticHover>
                <Link
                  href="/midjourney/gallery"
                  style={{
                    display: 'inline-block',
                    padding: '14px 28px',
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    color: MJ.dark,
                    background: MJ.accent,
                    borderRadius: 8,
                    textDecoration: 'none',
                    letterSpacing: '0.02em',
                  }}
                >
                  Gallery & Prompt Builder
                </Link>
              </MagneticHover>
              <MagneticHover>
                <Link
                  href="/content-wiki/neobot-avatar-creation"
                  style={{
                    display: 'inline-block',
                    padding: '14px 28px',
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    color: MJ.text,
                    background: 'transparent',
                    border: `1px solid ${MJ.border}`,
                    borderRadius: 8,
                    textDecoration: 'none',
                    letterSpacing: '0.02em',
                  }}
                >
                  NeoBot Avatar Pipeline
                </Link>
              </MagneticHover>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* ── Scoped styles ── */}
      <style>{`
        @media (max-width: 768px) {
          .mj-param-table {
            display: none;
          }
        }
      `}</style>
    </>
  )
}
