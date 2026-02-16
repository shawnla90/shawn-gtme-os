'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/* ── Boot log lines ─────────────────────────────── */

const BOOT_LINES = [
  '> Initializing progression engine...',
  '> Loading tier data [11 tiers]...',
  '> Resolving class profiles [5 classes]...',
  '> Rendering avatar sprites...',
  '> Calibrating XP thresholds...',
  '> System ready.',
]

const TOTAL_DURATION = 3500
const FADE_DURATION = 400

/* ── Sound synthesis ────────────────────────────── */

function playBootSound() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 1.5)

    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05)
    gain.gain.setValueAtTime(0.08, ctx.currentTime + 1.0)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 1.6)

    setTimeout(() => ctx.close(), 2000)
  } catch {
    /* autoplay blocked — loading works silently */
  }
}

function playClickSound() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(1200, ctx.currentTime)

    gain.gain.setValueAtTime(0.03, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.04)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.05)

    setTimeout(() => ctx.close(), 200)
  } catch {
    /* silent fallback */
  }
}

/* ── Component ──────────────────────────────────── */

type LoadingPhase = 'loading' | 'complete' | 'hidden'

export function RPGLoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<LoadingPhase>('loading')
  const [progress, setProgress] = useState(0)
  const [visibleLines, setVisibleLines] = useState(0)
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  const startRef = useRef<number>(0)
  const rafRef = useRef<number>(0)

  /* eased progress: slow start, accelerate, pause near 90%, snap to 100% */
  const ease = useCallback((t: number): number => {
    if (t < 0.3) return t * 0.5
    if (t < 0.85) return 0.15 + (t - 0.3) * 1.35
    if (t < 0.95) return 0.8925 + (t - 0.85) * 0.5
    return 0.8925 + 0.05 + (t - 0.95) * 2.15
    /* final value at t=1 → 1.0 */
  }, [])

  const handleTapToStart = useCallback(() => {
    if (!audioUnlocked) {
      playBootSound()
      setAudioUnlocked(true)
    }
  }, [audioUnlocked])

  useEffect(() => {
    /* reveal boot lines on staggered timers */
    const lineTimers: ReturnType<typeof setTimeout>[] = []
    BOOT_LINES.forEach((_, i) => {
      const delay = (TOTAL_DURATION / (BOOT_LINES.length + 1)) * (i + 1)
      lineTimers.push(
        setTimeout(() => {
          setVisibleLines(i + 1)
          playClickSound()
        }, delay),
      )
    })

    /* progress bar via rAF */
    startRef.current = performance.now()

    function tick(now: number) {
      const elapsed = now - startRef.current
      const t = Math.min(elapsed / TOTAL_DURATION, 1)
      const eased = Math.min(ease(t), 1)
      setProgress(Math.round(eased * 100))

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setPhase('complete')
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      lineTimers.forEach(clearTimeout)
    }
  }, [ease])

  /* fade out after complete */
  useEffect(() => {
    if (phase !== 'complete') return
    const timer = setTimeout(() => {
      setPhase('hidden')
      onComplete()
    }, FADE_DURATION)
    return () => clearTimeout(timer)
  }, [phase, onComplete])

  if (phase === 'hidden') return null

  return (
    <>
      <style>{CSS_TEXT}</style>
      <div
        className="rpg-loading-overlay"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Loading RPG preview"
        style={{ opacity: phase === 'complete' ? 0 : 1 }}
        onClick={handleTapToStart}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTapToStart() }}
        tabIndex={0}
      >
        {/* scanline overlay */}
        <div className="rpg-loading-scanlines" />

        <div className="rpg-loading-content">
          {/* boot log */}
          <div className="rpg-loading-log">
            {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
              <div key={i} className="rpg-loading-line">
                {line}
              </div>
            ))}
            {phase === 'loading' && visibleLines < BOOT_LINES.length && (
              <span className="rpg-loading-cursor">_</span>
            )}
          </div>

          {/* progress bar */}
          <div className="rpg-loading-bar-track">
            <div className="rpg-loading-bar-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="rpg-loading-pct">{progress}%</div>

          {/* system label */}
          <div className="rpg-loading-label">LOADING SYSTEM v1.0</div>
          {!audioUnlocked && (
            <div className="rpg-loading-tap-prompt">Tap to start</div>
          )}
        </div>
      </div>
    </>
  )
}

/* ── CSS ─────────────────────────────────────────── */

const CSS_TEXT = `
  .rpg-loading-overlay {
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

  .rpg-loading-scanlines {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 255, 65, 0.03) 2px,
      rgba(0, 255, 65, 0.03) 4px
    );
  }

  .rpg-loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    width: 100%;
    max-width: 480px;
    padding: 0 24px;
  }

  .rpg-loading-log {
    font-family: var(--font-mono, 'Courier New', monospace);
    font-size: 13px;
    line-height: 1.8;
    color: #00ff41;
    width: 100%;
    min-height: 180px;
  }

  .rpg-loading-line {
    animation: rpg-line-in 0.2s ease-out;
  }

  @keyframes rpg-line-in {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .rpg-loading-cursor {
    display: inline-block;
    color: #00ff41;
    animation: rpg-blink 0.6s step-end infinite;
  }

  @keyframes rpg-blink {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0; }
  }

  .rpg-loading-bar-track {
    width: 100%;
    height: 18px;
    border: 1px solid rgba(0, 255, 65, 0.3);
    border-radius: 2px;
    background: rgba(0, 255, 65, 0.05);
    overflow: hidden;
    position: relative;
  }

  .rpg-loading-bar-fill {
    height: 100%;
    background: #00ff41;
    border-radius: 1px;
    transition: width 0.1s linear;
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.6), 0 0 40px rgba(0, 255, 65, 0.3);
    animation: rpg-glow-pulse 1.2s ease-in-out infinite;
  }

  @keyframes rpg-glow-pulse {
    0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 65, 0.6), 0 0 40px rgba(0, 255, 65, 0.3); }
    50%      { box-shadow: 0 0 30px rgba(0, 255, 65, 0.8), 0 0 60px rgba(0, 255, 65, 0.4); }
  }

  .rpg-loading-pct {
    font-family: var(--font-mono, 'Courier New', monospace);
    font-size: 28px;
    font-weight: 700;
    color: #00ff41;
    text-shadow: 0 0 12px rgba(0, 255, 65, 0.5);
    letter-spacing: 0.05em;
  }

  .rpg-loading-label {
    font-family: var(--font-mono, 'Courier New', monospace);
    font-size: 11px;
    color: rgba(0, 255, 65, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.15em;
  }

  .rpg-loading-tap-prompt {
    font-family: var(--font-mono, 'Courier New', monospace);
    font-size: 10px;
    color: rgba(0, 255, 65, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 8px;
    animation: rpg-blink 0.6s step-end infinite;
  }
`
