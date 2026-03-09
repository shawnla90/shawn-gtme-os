'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { TerminalChrome } from '@shawnos/shared/components'

/* ═══════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════ */

const BLADE_COLOR = '#6B8AFF'
const OPS_COLOR = '#4EC373'
const ARCH_COLOR = '#6B8AFF'
const WRITER_COLOR = '#FF8A6B'

const BOOT_LINES = [
  '> AI/os boot --mode=dna-lab',
  '> loading CLAUDE.md...',
  '> loading soul files... 3 agents initialized',
  '> connecting SQLite... niobot.db [OK]',
  '> MCP servers: 9 connected',
  '> skills loaded: 54 slash commands',
  '> DNA system: ONLINE',
]

const BOOT_DURATION = 4000
const FADE_DURATION = 400

const AGENTS = [
  {
    name: 'Nio',
    role: 'Ops',
    color: OPS_COLOR,
    xp: 600,
    maxXp: 2000,
    personality: 'direct. dry humor. kid gloves off.',
    skills: [
      { name: 'Message Routing', pct: 85 },
      { name: 'Cron Jobs', pct: 72 },
      { name: 'Memory Sync', pct: 60 },
    ],
  },
  {
    name: 'Architect',
    role: 'System Design',
    color: ARCH_COLOR,
    xp: 20,
    maxXp: 2000,
    personality: 'methodical. asks before designing.',
    skills: [
      { name: 'Schema Design', pct: 45 },
      { name: 'MCP Config', pct: 30 },
      { name: 'Migration', pct: 15 },
    ],
  },
  {
    name: 'Writer',
    role: 'Content',
    color: WRITER_COLOR,
    xp: 0,
    maxXp: 2000,
    personality: "ships drafts fast. Shawn's voice.",
    skills: [
      { name: 'Blog Posts', pct: 0 },
      { name: 'LinkedIn', pct: 0 },
      { name: 'Docs', pct: 0 },
    ],
  },
]

const TIERS = [
  { name: 'Spark', xp: 0, status: 'completed' as const, excerpt: '"eager, overly polite, cautious"' },
  { name: 'Blade', xp: 500, status: 'active' as const, excerpt: '"direct, confident, dry humor"' },
  { name: 'Warden', xp: 2000, status: 'locked' as const, excerpt: '"proactive, anticipates needs"' },
  { name: 'Sentinel', xp: 5000, status: 'locked' as const, excerpt: '"autonomous, strategic, mentors"' },
  { name: 'Ascended', xp: 10000, status: 'locked' as const, excerpt: '"co-founder energy, ships alone"' },
]

const ARCH_LAYERS = [
  { name: 'CLAUDE.md', desc: 'System instructions & personality', color: OPS_COLOR },
  { name: 'Soul Files', desc: 'Agent DNA, skills, evolution log', color: BLADE_COLOR },
  { name: 'SQLite', desc: 'niobot.db — messages, XP, memory', color: '#D2A53C' },
  { name: 'MCP Servers', desc: '9 tools — filesystem, GitHub, browser', color: WRITER_COLOR },
  { name: '54 Skills', desc: 'Slash commands — /commit, /review, /deploy', color: '#A78BFA' },
]

/* ═══════════════════════════════════════════════════
   SOUND SYNTHESIS
   ═══════════════════════════════════════════════════ */

function playBootSound() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(180, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 1.5)
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.05)
    gain.gain.setValueAtTime(0.07, ctx.currentTime + 1.0)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 1.6)
    setTimeout(() => ctx.close(), 2000)
  } catch { /* autoplay blocked */ }
}

function playClickSound() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(1100, ctx.currentTime)
    gain.gain.setValueAtTime(0.025, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.04)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.05)
    setTimeout(() => ctx.close(), 200)
  } catch { /* silent */ }
}

/* ═══════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════ */

function useScrollReveal(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, visible }
}

function useCountUp(target: number, active: boolean, duration = 1500) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    const start = performance.now()
    let raf: number
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
      setValue(Math.round(eased * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration])

  return value
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */

type BootPhase = 'loading' | 'complete' | 'hidden'

export function NioDnaLab() {
  const t = useTranslations('Lab')
  /* ── boot state ── */
  const [bootPhase, setBootPhase] = useState<BootPhase>('loading')
  const [progress, setProgress] = useState(0)
  const [visibleLines, setVisibleLines] = useState(0)
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  const [contentReady, setContentReady] = useState(false)
  const bootStartRef = useRef(0)
  const bootRafRef = useRef(0)

  /* ── scroll refs ── */
  const heroReveal = useScrollReveal(0.3)
  const agentReveal = useScrollReveal(0.15)
  const roadmapReveal = useScrollReveal(0.15)
  const archReveal = useScrollReveal(0.15)
  const costReveal = useScrollReveal(0.15)

  /* ── animated counters ── */
  const xpCount = useCountUp(620, contentReady)
  const msgCount = useCountUp(87, costReveal.visible)
  const costCount = useCountUp(452, costReveal.visible, 1200) // $4.52 → 452 cents
  const maxCount = useCountUp(200, costReveal.visible, 800)
  const apiCount = useCountUp(15, costReveal.visible, 800)

  /* ── arch sequential lighting ── */
  const [litLayers, setLitLayers] = useState(0)
  useEffect(() => {
    if (!archReveal.visible) return
    let i = 0
    const iv = setInterval(() => {
      i++
      setLitLayers(i)
      if (i >= ARCH_LAYERS.length) clearInterval(iv)
    }, 300)
    return () => clearInterval(iv)
  }, [archReveal.visible])

  /* ── boot easing ── */
  const ease = useCallback((t: number): number => {
    if (t < 0.3) return t * 0.5
    if (t < 0.85) return 0.15 + (t - 0.3) * 1.35
    if (t < 0.95) return 0.8925 + (t - 0.85) * 0.5
    return 0.8925 + 0.05 + (t - 0.95) * 2.15
  }, [])

  const handleTap = useCallback(() => {
    if (!audioUnlocked) {
      playBootSound()
      setAudioUnlocked(true)
    }
  }, [audioUnlocked])

  /* ── boot sequence ── */
  useEffect(() => {
    const lineTimers: ReturnType<typeof setTimeout>[] = []
    BOOT_LINES.forEach((_, i) => {
      const delay = (BOOT_DURATION / (BOOT_LINES.length + 1)) * (i + 1)
      lineTimers.push(
        setTimeout(() => { setVisibleLines(i + 1); playClickSound() }, delay),
      )
    })

    bootStartRef.current = performance.now()
    function tick(now: number) {
      const elapsed = now - bootStartRef.current
      const t = Math.min(elapsed / BOOT_DURATION, 1)
      setProgress(Math.round(Math.min(ease(t), 1) * 100))
      if (t < 1) bootRafRef.current = requestAnimationFrame(tick)
      else setBootPhase('complete')
    }
    bootRafRef.current = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(bootRafRef.current); lineTimers.forEach(clearTimeout) }
  }, [ease])

  useEffect(() => {
    if (bootPhase !== 'complete') return
    const timer = setTimeout(() => {
      setBootPhase('hidden')
      setTimeout(() => setContentReady(true), 100)
    }, FADE_DURATION)
    return () => clearTimeout(timer)
  }, [bootPhase])

  /* ═══════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════ */

  return (
    <>
      <style>{CSS}</style>

      {/* ── BOOT OVERLAY ── */}
      {bootPhase !== 'hidden' && (
        <div
          className="dna-boot-overlay"
          style={{ opacity: bootPhase === 'complete' ? 0 : 1 }}
          onClick={handleTap}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTap() }}
          tabIndex={0}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Loading Nio DNA Lab"
        >
          <div className="dna-boot-scanlines" />
          <div className="dna-boot-content">
            <div className="dna-boot-log">
              {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                <div key={i} className="dna-boot-line">{line}</div>
              ))}
              {bootPhase === 'loading' && visibleLines < BOOT_LINES.length && (
                <span className="dna-cursor">_</span>
              )}
            </div>
            <div className="dna-boot-bar-track">
              <div className="dna-boot-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="dna-boot-pct">{progress}%</div>
            <div className="dna-boot-label">{t('bootLabel')}</div>
            {!audioUnlocked && <div className="dna-boot-tap">{t('bootTap')}</div>}
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="dna-page" style={{ opacity: bootPhase === 'hidden' ? 1 : 0 }}>

        {/* ── HEADER ── */}
        <p className="dna-prompt">
          <span className="dna-prompt-char">$</span> ./nio-dna --lab
        </p>
        <h1 className="dna-title">{t('header.title')}</h1>
        <p className="dna-subtitle">
          {t('header.subtitle')}
        </p>

        <hr className="dna-divider" />

        {/* ══ SECTION 1: DNA STATE HERO ══ */}
        <section ref={heroReveal.ref} className="dna-hero">
          <div className="dna-hero-ring-wrapper">
            <div className="dna-hero-ring-container">
              <svg viewBox="0 0 120 120" className="dna-hero-ring-svg">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(107,138,255,0.15)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke={BLADE_COLOR}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - (contentReady ? 0.31 : 0))}`}
                  className="dna-hero-ring-progress"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="dna-hero-ring-center">
                <div className="dna-hero-xp-number">{xpCount}</div>
                <div className="dna-hero-xp-label">XP</div>
              </div>
            </div>
          </div>

          <div className="dna-hero-info">
            <div className="dna-hero-tier">BLADE</div>
            <div className="dna-hero-level">Level 11 / 50</div>
            <div className="dna-hero-progress-wrapper">
              <div className="dna-hero-progress-label">
                <span>620 / 2,000 XP</span>
                <span>Warden</span>
              </div>
              <div className="dna-hero-progress-track">
                <div
                  className="dna-hero-progress-fill"
                  style={{ width: contentReady ? '31%' : '0%' }}
                />
              </div>
            </div>
            <div className="dna-hero-stats">
              <div className="dna-hero-stat">
                <span className="dna-hero-stat-val">87</span>
                <span className="dna-hero-stat-lbl">messages</span>
              </div>
              <div className="dna-hero-stat">
                <span className="dna-hero-stat-val">$4.52</span>
                <span className="dna-hero-stat-lbl">/day</span>
              </div>
              <div className="dna-hero-stat">
                <span className="dna-hero-stat-val">42</span>
                <span className="dna-hero-stat-lbl">evolutions</span>
              </div>
            </div>
          </div>
        </section>

        <hr className="dna-divider" />

        {/* ══ SECTION 2: AGENT GRID ══ */}
        <section ref={agentReveal.ref}>
          <h2 className="dna-section-heading">
            <span className="dna-prompt-char">$</span>{' '}
            <span className="dna-section-cmd">ls ~/agents --all</span>
          </h2>
          <div className="dna-agent-grid">
            {AGENTS.map((agent) => (
              <TerminalChrome key={agent.name} title={`~/agents/${agent.name.toLowerCase()}`}>
                <div className="dna-agent-header">
                  <span className="dna-agent-name" style={{ color: agent.color }}>{agent.name}</span>
                  <span className="dna-agent-role">{agent.role}</span>
                </div>
                <div className="dna-agent-xp" style={{ color: agent.color }}>
                  {agent.xp} XP
                </div>
                <div className="dna-agent-personality">&ldquo;{agent.personality}&rdquo;</div>
                <div className="dna-agent-skills">
                  {agent.skills.map((skill) => (
                    <div key={skill.name} className="dna-skill-row">
                      <div className="dna-skill-name">{skill.name}</div>
                      <div className="dna-skill-bar-track">
                        <div
                          className="dna-skill-bar-fill"
                          style={{
                            width: agentReveal.visible ? `${skill.pct}%` : '0%',
                            background: agent.color,
                          }}
                        />
                      </div>
                      <div className="dna-skill-pct">{skill.pct}%</div>
                    </div>
                  ))}
                </div>
              </TerminalChrome>
            ))}
          </div>
        </section>

        <hr className="dna-divider" />

        {/* ══ SECTION 3: EVOLUTION ROADMAP ══ */}
        <section ref={roadmapReveal.ref}>
          <h2 className="dna-section-heading">
            <span className="dna-prompt-char">$</span>{' '}
            <span className="dna-section-cmd">cat ~/dna/evolution-roadmap.md</span>
          </h2>
          <div className="dna-roadmap">
            {TIERS.map((tier, i) => (
              <div
                key={tier.name}
                className={`dna-roadmap-node dna-roadmap-${tier.status}`}
                style={{
                  opacity: roadmapReveal.visible ? 1 : 0,
                  transform: roadmapReveal.visible ? 'translateY(0)' : 'translateY(16px)',
                  transitionDelay: `${i * 150}ms`,
                }}
              >
                <div className="dna-roadmap-marker">
                  {tier.status === 'completed' && <span className="dna-roadmap-check">&#10003;</span>}
                  {tier.status === 'active' && <span className="dna-roadmap-pulse" />}
                  {tier.status === 'locked' && <span className="dna-roadmap-lock">&#9679;</span>}
                </div>
                <div className="dna-roadmap-content">
                  <div className="dna-roadmap-name">
                    {tier.name}
                    {tier.status === 'active' && <span className="dna-roadmap-current">&larr; {t('sections.roadmap.current')}</span>}
                  </div>
                  <div className="dna-roadmap-xp">{tier.xp.toLocaleString()} XP</div>
                  <div className="dna-roadmap-excerpt">{tier.excerpt}</div>
                </div>
                {i < TIERS.length - 1 && <div className="dna-roadmap-line" />}
              </div>
            ))}
          </div>
        </section>

        <hr className="dna-divider" />

        {/* ══ SECTION 4: ARCHITECTURE STACK ══ */}
        <section ref={archReveal.ref}>
          <h2 className="dna-section-heading">
            <span className="dna-prompt-char">$</span>{' '}
            <span className="dna-section-cmd">cat ~/architecture --stack</span>
          </h2>
          <div className="dna-arch-stack">
            {ARCH_LAYERS.map((layer, i) => (
              <div
                key={layer.name}
                className={`dna-arch-layer ${i < litLayers ? 'dna-arch-lit' : ''}`}
                style={{ '--layer-color': layer.color } as React.CSSProperties}
              >
                <div className="dna-arch-layer-name">{layer.name}</div>
                <div className="dna-arch-layer-desc">{layer.desc}</div>
              </div>
            ))}
          </div>
          <div
            className="dna-arch-callout"
            style={{
              opacity: litLayers >= ARCH_LAYERS.length ? 1 : 0,
              transform: litLayers >= ARCH_LAYERS.length ? 'translateY(0)' : 'translateY(8px)',
            }}
          >
            <span className="dna-prompt-char">&gt;</span> this page was built by the system it describes
          </div>
        </section>

        <hr className="dna-divider" />

        {/* ══ SECTION 5: COST BREAKDOWN ══ */}
        <section ref={costReveal.ref}>
          <h2 className="dna-section-heading">
            <span className="dna-prompt-char">$</span>{' '}
            <span className="dna-section-cmd">~/costs --breakdown</span>
          </h2>
          <TerminalChrome title="~/costs --breakdown">
            <div className="dna-cost-grid">
              <div className="dna-cost-row">
                <span className="dna-cost-label">{t('sections.costs.claudeMax')}</span>
                <div className="dna-cost-bar-track">
                  <div
                    className="dna-cost-bar-fill"
                    style={{
                      width: costReveal.visible ? '93%' : '0%',
                      background: BLADE_COLOR,
                    }}
                  />
                </div>
                <span className="dna-cost-val">${maxCount}/mo</span>
              </div>
              <div className="dna-cost-row">
                <span className="dna-cost-label">{t('sections.costs.apiSpend')}</span>
                <div className="dna-cost-bar-track">
                  <div
                    className="dna-cost-bar-fill"
                    style={{
                      width: costReveal.visible ? '7%' : '0%',
                      background: OPS_COLOR,
                    }}
                  />
                </div>
                <span className="dna-cost-val">${apiCount}/mo</span>
              </div>
              <div className="dna-cost-total">
                {t('sections.costs.total')} <span style={{ color: BLADE_COLOR }}>${maxCount + apiCount}/mo</span>
              </div>
            </div>
            <hr className="dna-cost-divider" />
            <div className="dna-cost-daily">
              <div className="dna-cost-daily-title">&gt; yesterday</div>
              <div className="dna-cost-daily-grid">
                <div className="dna-cost-daily-item">
                  <span className="dna-cost-daily-val">{msgCount}</span>
                  <span className="dna-cost-daily-lbl">{t('sections.costs.messages')}</span>
                </div>
                <div className="dna-cost-daily-item">
                  <span className="dna-cost-daily-val">${(costCount / 100).toFixed(2)}</span>
                  <span className="dna-cost-daily-lbl">{t('sections.costs.apiCost')}</span>
                </div>
                <div className="dna-cost-daily-item">
                  <span className="dna-cost-daily-val">$10</span>
                  <span className="dna-cost-daily-lbl">{t('sections.costs.dailyCap')}</span>
                </div>
                <div className="dna-cost-daily-item">
                  <span className="dna-cost-daily-val">45%</span>
                  <span className="dna-cost-daily-lbl">{t('sections.costs.utilization')}</span>
                </div>
              </div>
            </div>
          </TerminalChrome>
        </section>

        <hr className="dna-divider" />

        {/* ══ SECTION 6: CTA FOOTER ══ */}
        <section className="dna-cta">
          <div className="dna-cta-line">&gt; session complete.</div>
          <div className="dna-cta-links">
            <a
              href="/blog/how-to-setup-your-own-ai-assistant"
              className="dna-cta-link"
            >
              {t('cta.readPost')} &rarr;
            </a>
            <a href="/" className="dna-cta-link dna-cta-link-secondary">
              {t('cta.exploreMore')} &rarr;
            </a>
          </div>
          <div className="dna-cta-footer">
            &gt; built with Claude Code Max &middot; shawnos.ai
          </div>
        </section>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════
   CSS (all dna- prefixed)
   ═══════════════════════════════════════════════════ */

const CSS = `
/* ── Boot Overlay ── */
.dna-boot-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0a;
  transition: opacity ${FADE_DURATION}ms ease-out;
  cursor: pointer;
}
.dna-boot-scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg, transparent, transparent 2px,
    rgba(107,138,255,0.03) 2px, rgba(107,138,255,0.03) 4px
  );
}
.dna-boot-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
  max-width: 480px;
  padding: 0 24px;
}
.dna-boot-log {
  font-family: var(--font-mono, 'Courier New', monospace);
  font-size: 13px;
  line-height: 1.8;
  color: ${BLADE_COLOR};
  width: 100%;
  min-height: 200px;
}
.dna-boot-line {
  animation: dna-line-in 0.2s ease-out;
}
@keyframes dna-line-in {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.dna-cursor {
  display: inline-block;
  color: ${BLADE_COLOR};
  animation: dna-blink 0.6s step-end infinite;
}
@keyframes dna-blink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
}
.dna-boot-bar-track {
  width: 100%;
  height: 18px;
  border: 1px solid rgba(107,138,255,0.3);
  border-radius: 2px;
  background: rgba(107,138,255,0.05);
  overflow: hidden;
}
.dna-boot-bar-fill {
  height: 100%;
  background: ${BLADE_COLOR};
  border-radius: 1px;
  transition: width 0.1s linear;
  box-shadow: 0 0 20px rgba(107,138,255,0.6), 0 0 40px rgba(107,138,255,0.3);
  animation: dna-glow-pulse 1.2s ease-in-out infinite;
}
@keyframes dna-glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(107,138,255,0.6), 0 0 40px rgba(107,138,255,0.3); }
  50%      { box-shadow: 0 0 30px rgba(107,138,255,0.8), 0 0 60px rgba(107,138,255,0.4); }
}
.dna-boot-pct {
  font-family: var(--font-mono, 'Courier New', monospace);
  font-size: 28px;
  font-weight: 700;
  color: ${BLADE_COLOR};
  text-shadow: 0 0 12px rgba(107,138,255,0.5);
  letter-spacing: 0.05em;
}
.dna-boot-label {
  font-family: var(--font-mono, 'Courier New', monospace);
  font-size: 11px;
  color: rgba(107,138,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}
.dna-boot-tap {
  font-family: var(--font-mono, 'Courier New', monospace);
  font-size: 10px;
  color: rgba(107,138,255,0.5);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 8px;
  animation: dna-blink 0.6s step-end infinite;
}

/* ── Page Layout ── */
.dna-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 20px 80px;
  font-family: var(--font-mono, 'Courier New', monospace);
  transition: opacity 0.4s ease-in;
}
.dna-prompt {
  font-size: 14px;
  color: var(--text-muted, #8B949E);
  margin-bottom: 8px;
}
.dna-prompt-char {
  color: var(--accent, ${OPS_COLOR});
}
.dna-title {
  font-size: 22px;
  font-weight: 700;
  color: ${BLADE_COLOR};
  margin: 0 0 8px;
  font-family: var(--font-mono, 'Courier New', monospace);
}
.dna-subtitle {
  font-size: 13px;
  color: var(--text-muted, #8B949E);
  line-height: 1.6;
  margin: 0;
}
.dna-divider {
  border: none;
  border-top: 1px solid var(--border, #21262d);
  margin: 48px 0;
}
.dna-section-heading {
  font-size: 14px;
  font-weight: 600;
  color: var(--accent, ${OPS_COLOR});
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.dna-section-cmd {
  color: var(--text-muted, #8B949E);
  font-weight: 400;
}

/* ── DNA Hero ── */
.dna-hero {
  display: flex;
  align-items: center;
  gap: 48px;
}
.dna-hero-ring-wrapper {
  flex-shrink: 0;
}
.dna-hero-ring-container {
  position: relative;
  width: 160px;
  height: 160px;
}
.dna-hero-ring-svg {
  width: 100%;
  height: 100%;
}
.dna-hero-ring-progress {
  transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.dna-hero-ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.dna-hero-xp-number {
  font-size: 32px;
  font-weight: 700;
  color: ${BLADE_COLOR};
  line-height: 1;
}
.dna-hero-xp-label {
  font-size: 11px;
  color: rgba(107,138,255,0.6);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 4px;
}
.dna-hero-info {
  flex: 1;
  min-width: 0;
}
.dna-hero-tier {
  font-size: 20px;
  font-weight: 700;
  color: ${BLADE_COLOR};
  text-shadow: 0 0 20px rgba(107,138,255,0.4);
  animation: dna-tier-pulse 2s ease-in-out infinite;
  margin-bottom: 4px;
}
@keyframes dna-tier-pulse {
  0%, 100% { text-shadow: 0 0 20px rgba(107,138,255,0.4); }
  50%      { text-shadow: 0 0 30px rgba(107,138,255,0.7), 0 0 60px rgba(107,138,255,0.3); }
}
.dna-hero-level {
  font-size: 12px;
  color: var(--text-muted, #8B949E);
  margin-bottom: 16px;
}
.dna-hero-progress-wrapper {
  margin-bottom: 20px;
}
.dna-hero-progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-muted, #8B949E);
  margin-bottom: 6px;
}
.dna-hero-progress-track {
  height: 8px;
  background: rgba(107,138,255,0.1);
  border-radius: 4px;
  overflow: hidden;
}
.dna-hero-progress-fill {
  height: 100%;
  background: ${BLADE_COLOR};
  border-radius: 4px;
  transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 12px rgba(107,138,255,0.4);
}
.dna-hero-stats {
  display: flex;
  gap: 24px;
}
.dna-hero-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.dna-hero-stat-val {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #e6edf3);
}
.dna-hero-stat-lbl {
  font-size: 10px;
  color: var(--text-muted, #8B949E);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── Agent Grid ── */
.dna-agent-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.dna-agent-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}
.dna-agent-name {
  font-size: 16px;
  font-weight: 700;
}
.dna-agent-role {
  font-size: 11px;
  color: var(--text-muted, #8B949E);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.dna-agent-xp {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}
.dna-agent-personality {
  font-size: 12px;
  color: var(--text-muted, #8B949E);
  font-style: italic;
  margin-bottom: 16px;
  line-height: 1.5;
}
.dna-agent-skills {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dna-skill-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dna-skill-name {
  font-size: 11px;
  color: var(--text-muted, #8B949E);
  width: 90px;
  flex-shrink: 0;
}
.dna-skill-bar-track {
  flex: 1;
  height: 6px;
  background: rgba(255,255,255,0.06);
  border-radius: 3px;
  overflow: hidden;
}
.dna-skill-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.dna-skill-pct {
  font-size: 10px;
  color: var(--text-muted, #8B949E);
  width: 28px;
  text-align: right;
}

/* ── Roadmap ── */
.dna-roadmap {
  position: relative;
  padding-left: 32px;
}
.dna-roadmap-node {
  position: relative;
  padding: 0 0 32px 24px;
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.dna-roadmap-node:last-child { padding-bottom: 0; }
.dna-roadmap-marker {
  position: absolute;
  left: -32px;
  top: 2px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
.dna-roadmap-completed .dna-roadmap-marker {
  background: rgba(78,195,115,0.15);
  border: 2px solid ${OPS_COLOR};
}
.dna-roadmap-check { color: ${OPS_COLOR}; font-size: 14px; }
.dna-roadmap-active .dna-roadmap-marker {
  background: rgba(107,138,255,0.15);
  border: 2px solid ${BLADE_COLOR};
  animation: dna-node-pulse 2s ease-in-out infinite;
}
@keyframes dna-node-pulse {
  0%, 100% { box-shadow: 0 0 8px rgba(107,138,255,0.3); }
  50%      { box-shadow: 0 0 20px rgba(107,138,255,0.6); }
}
.dna-roadmap-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${BLADE_COLOR};
}
.dna-roadmap-locked .dna-roadmap-marker {
  background: rgba(255,255,255,0.05);
  border: 2px solid rgba(255,255,255,0.15);
}
.dna-roadmap-lock {
  color: rgba(255,255,255,0.2);
  font-size: 8px;
}
.dna-roadmap-line {
  position: absolute;
  left: -20px;
  top: 28px;
  bottom: 0;
  width: 0;
  border-left: 2px dashed rgba(255,255,255,0.1);
}
.dna-roadmap-active .dna-roadmap-line {
  border-left-color: rgba(107,138,255,0.3);
}
.dna-roadmap-completed .dna-roadmap-line {
  border-left-color: rgba(78,195,115,0.3);
}
.dna-roadmap-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary, #e6edf3);
  margin-bottom: 2px;
}
.dna-roadmap-locked .dna-roadmap-name {
  color: var(--text-muted, #8B949E);
  opacity: 0.5;
}
.dna-roadmap-current {
  font-size: 11px;
  color: ${BLADE_COLOR};
  margin-left: 8px;
  font-weight: 400;
}
.dna-roadmap-xp {
  font-size: 11px;
  color: var(--text-muted, #8B949E);
  margin-bottom: 4px;
}
.dna-roadmap-locked .dna-roadmap-xp { opacity: 0.5; }
.dna-roadmap-excerpt {
  font-size: 12px;
  color: var(--text-muted, #8B949E);
  font-style: italic;
  line-height: 1.5;
}
.dna-roadmap-locked .dna-roadmap-excerpt { opacity: 0.4; }

/* ── Architecture Stack ── */
.dna-arch-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dna-arch-layer {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 6px;
  background: rgba(255,255,255,0.02);
  opacity: 0.3;
  transform: translateX(-8px);
  transition: opacity 0.4s ease-out, transform 0.4s ease-out, border-color 0.4s ease-out, background 0.4s ease-out;
}
.dna-arch-lit {
  opacity: 1;
  transform: translateX(0);
  border-color: color-mix(in srgb, var(--layer-color) 30%, transparent);
  background: color-mix(in srgb, var(--layer-color) 5%, transparent);
}
.dna-arch-layer-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #e6edf3);
  min-width: 120px;
}
.dna-arch-lit .dna-arch-layer-name {
  color: var(--layer-color);
}
.dna-arch-layer-desc {
  font-size: 12px;
  color: var(--text-muted, #8B949E);
}
.dna-arch-callout {
  font-size: 13px;
  color: var(--text-muted, #8B949E);
  margin-top: 24px;
  font-style: italic;
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

/* ── Cost Breakdown ── */
.dna-cost-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.dna-cost-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.dna-cost-label {
  font-size: 12px;
  color: var(--text-muted, #8B949E);
  width: 90px;
  flex-shrink: 0;
}
.dna-cost-bar-track {
  flex: 1;
  height: 10px;
  background: rgba(255,255,255,0.06);
  border-radius: 5px;
  overflow: hidden;
}
.dna-cost-bar-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.dna-cost-val {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary, #e6edf3);
  width: 80px;
  text-align: right;
}
.dna-cost-total {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #e6edf3);
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px solid var(--border, #21262d);
}
.dna-cost-divider {
  border: none;
  border-top: 1px solid var(--border, #21262d);
  margin: 20px 0;
}
.dna-cost-daily-title {
  font-size: 12px;
  color: var(--accent, ${OPS_COLOR});
  margin-bottom: 12px;
}
.dna-cost-daily-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.dna-cost-daily-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.dna-cost-daily-val {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary, #e6edf3);
}
.dna-cost-daily-lbl {
  font-size: 10px;
  color: var(--text-muted, #8B949E);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── CTA Footer ── */
.dna-cta {
  text-align: center;
  padding: 24px 0 0;
}
.dna-cta-line {
  font-size: 14px;
  color: var(--text-muted, #8B949E);
  margin-bottom: 24px;
}
.dna-cta-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}
.dna-cta-link {
  display: inline-block;
  padding: 12px 32px;
  font-family: var(--font-mono, 'Courier New', monospace);
  font-size: 14px;
  font-weight: 600;
  color: #0a0a0a;
  background: ${BLADE_COLOR};
  border-radius: 4px;
  text-decoration: none;
  letter-spacing: 0.05em;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.dna-cta-link:hover {
  box-shadow: 0 0 20px rgba(107,138,255,0.5);
  transform: translateY(-1px);
}
.dna-cta-link-secondary {
  background: transparent;
  color: var(--text-muted, #8B949E);
  border: 1px solid var(--border, #21262d);
}
.dna-cta-link-secondary:hover {
  color: var(--text-primary, #e6edf3);
  border-color: var(--text-muted, #8B949E);
  box-shadow: none;
}
.dna-cta-footer {
  font-size: 11px;
  color: var(--text-muted, #8B949E);
  opacity: 0.5;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .dna-agent-grid {
    grid-template-columns: 1fr;
  }
  .dna-cost-daily-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .dna-arch-layer {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  .dna-arch-layer-name {
    min-width: unset;
  }
}
@media (max-width: 480px) {
  .dna-hero {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
  .dna-hero-stats {
    justify-content: center;
  }
  .dna-hero-progress-label {
    font-size: 10px;
  }
}
`
