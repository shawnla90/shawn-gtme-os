'use client'

import React, { useState, useEffect, useRef } from 'react'
import { TITLE_TABLE, getAvatarUrlsForProfile } from '@shawnos/shared/lib/rpg'
import type { RPGProfile, RPGClass } from '@shawnos/shared/lib/rpg'
import { AvatarBadge } from '@shawnos/shared/components'
import { ALL_CLASSES, REVEAL_DURATION_MAX, REVEAL_DURATION_MIN, CLASS_COLORS } from './constants'

/* ── helpers (client-safe, duplicated from page) ── */

function mockProfileForTier(tierIdx: number): RPGProfile {
  const tier = TITLE_TABLE[tierIdx]!
  const nextTier = TITLE_TABLE[tierIdx + 1] ?? null
  return {
    name: 'Operator',
    title: tier.title,
    level: tier.level,
    xp_total: tier.xp_required,
    xp_next_level: nextTier ? nextTier.xp_required : 999999,
    class: ALL_CLASSES[tierIdx % ALL_CLASSES.length]!,
    avatar_tier: tier.avatar_tier,
    milestones: [],
    updated_at: new Date().toISOString(),
  }
}

function formatXP(xp: number): string {
  return xp.toLocaleString()
}

/* ── styles ──────────────────────────────────────── */

const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: 20,
}

const cardWrapper: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
}

const tierLabelStyle: React.CSSProperties = {
  fontSize: '10px',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  textAlign: 'center',
}

/* ── RevealableAvatar ────────────────────────────── */

type RevealPhase = 'locked' | 'glitch' | 'revealed' | 'fading'

interface RevealableAvatarProps {
  children: React.ReactNode
  isLocked: boolean
  rpgClass: RPGClass
  revealDuration: number
}

function RevealableAvatar({ children, isLocked, rpgClass, revealDuration }: RevealableAvatarProps) {
  const [phase, setPhase] = useState<RevealPhase>('locked')
  const [timeLeft, setTimeLeft] = useState(0)
  const [showFlash, setShowFlash] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const colors = CLASS_COLORS[rpgClass]
  const classKey = rpgClass.toLowerCase()

  /* ── Click handler: locked → glitch → revealed ── */
  const handleClick = () => {
    if (!isLocked || phase !== 'locked') return
    setPhase('glitch')
    setShowFlash(true)
    setTimeout(() => {
      setPhase('revealed')
      setTimeLeft(revealDuration)
    }, 300)
    setTimeout(() => setShowFlash(false), 800)
  }

  /* ── Countdown timer during revealed phase ── */
  useEffect(() => {
    if (phase !== 'revealed') return
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setPhase('fading')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [phase])

  /* ── Auto-close after fade-out ── */
  useEffect(() => {
    if (phase !== 'fading') return
    const timeout = setTimeout(() => setPhase('locked'), 500)
    return () => clearTimeout(timeout)
  }, [phase])

  /* ── Unlocked tiers render normally ── */
  if (!isLocked) return <>{children}</>

  /* ── Compute filter based on phase ── */
  const filterMap: Record<RevealPhase, string> = {
    locked: 'grayscale(1) brightness(0.3) blur(3px)',
    glitch: 'brightness(2) saturate(0) blur(2px)',
    revealed: 'none',
    fading: 'grayscale(1) brightness(0.3) blur(3px)',
  }

  const transitionMap: Record<RevealPhase, string> = {
    locked: 'filter 0.3s ease',
    glitch: 'filter 0.15s ease',
    revealed: 'filter 0.3s ease',
    fading: 'filter 0.5s ease',
  }

  const isRevealed = phase === 'revealed' || phase === 'fading'

  return (
    <div style={{ position: 'relative' }}>
      {/* ── Badge content with phase-driven filters ── */}
      <div
        style={{
          filter: filterMap[phase],
          transition: transitionMap[phase],
          cursor: phase === 'locked' ? 'pointer' : 'default',
        }}
        onClick={handleClick}
      >
        {children}
      </div>

      {/* ── Locked overlay with class-tinted icon ── */}
      {phase === 'locked' && (
        <div
          className="revealable-locked-overlay"
          role="button"
          tabIndex={0}
          aria-label={`Click to preview locked ${rpgClass} tier`}
          onClick={handleClick}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(10, 10, 10, 0.85)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            zIndex: 2,
            cursor: 'pointer',
          }}
        >
          {/* Scanline effect */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              borderRadius: '8px',
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                ${colors.shadow} 2px,
                ${colors.shadow} 4px
              )`,
            }}
          />
          {/* Lock / "?" silhouette — class-tinted */}
          <div
            style={{
              fontSize: '28px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: `${colors.primary}80`,
              textShadow: `0 0 8px ${colors.shadow}`,
              lineHeight: 1,
            }}
          >
            ?
          </div>
          {/* Click prompt with pulse animation */}
          <div
            className="revealable-pulse-text"
            style={{
              fontSize: '9px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Click to Preview
          </div>
        </div>
      )}

      {/* ── Class-specific flash overlay on reveal ── */}
      {showFlash && (
        <div
          className={`class-flash class-flash-${classKey}`}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '8px',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />
      )}

      {/* ── Class-colored glow border during reveal ── */}
      {isRevealed && (
        <div
          className={`revealable-glow-border class-glow-${classKey}`}
          style={{
            position: 'absolute',
            inset: -2,
            borderRadius: '10px',
            border: `1px solid ${colors.primary}`,
            pointerEvents: 'none',
            zIndex: 2,
            opacity: phase === 'fading' ? 0 : 1,
            transition: 'opacity 0.5s ease',
          }}
        />
      )}

      {/* ── Class-colored countdown bar ── */}
      {isRevealed && (
        <div
          style={{
            marginTop: 6,
            opacity: phase === 'fading' ? 0 : 1,
            transition: 'opacity 0.5s ease',
          }}
        >
          <div
            style={{
              height: 3,
              background: 'rgba(0, 0, 0, 0.35)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(timeLeft / revealDuration) * 100}%`,
                background: colors.primary,
                borderRadius: 2,
                transition: 'width 1s linear',
                boxShadow: `0 0 6px ${colors.glow}`,
              }}
            />
          </div>
          <div
            style={{
              fontSize: '9px',
              color: 'var(--text-muted)',
              textAlign: 'center',
              marginTop: 2,
              fontFamily: 'var(--font-mono)',
              opacity: 0.6,
            }}
          >
            {timeLeft}s
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Easter egg CSS: per-class flash + glow animations ── */

const EASTER_EGG_CSS = `
  .revealable-pulse-text {
    animation: revealable-pulse 2s ease-in-out infinite;
  }
  @keyframes revealable-pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.9; }
  }
  .revealable-locked-overlay {
    animation: revealable-border-pulse 3s ease-in-out infinite;
  }
  @keyframes revealable-border-pulse {
    0%, 100% { border-color: rgba(100, 116, 139, 0.2); }
    50% { border-color: rgba(100, 116, 139, 0.5); }
  }

  /* ── Flash overlay ── */
  .class-flash { animation: class-flash-fade 0.8s ease-out forwards; }
  @keyframes class-flash-fade {
    0%   { opacity: 0.7; }
    100% { opacity: 0; }
  }

  /* ── Builder: Forge spark ── */
  .class-flash-builder { background: radial-gradient(circle, rgba(245,158,11,0.45) 0%, transparent 70%); }
  .class-glow-builder { box-shadow: 0 0 12px rgba(245,158,11,0.2), 0 0 4px rgba(245,158,11,0.15); animation: glow-builder 2s ease-out; }
  @keyframes glow-builder {
    0%   { box-shadow: 0 0 30px rgba(245,158,11,0.6), 0 0 60px rgba(245,158,11,0.2); }
    40%  { box-shadow: 0 0 18px rgba(245,158,11,0.35), 0 0 30px rgba(245,158,11,0.1); }
    100% { box-shadow: 0 0 12px rgba(245,158,11,0.2), 0 0 4px rgba(245,158,11,0.15); }
  }

  /* ── Scribe: Ink wash ── */
  .class-flash-scribe { background: linear-gradient(180deg, rgba(6,182,212,0.4) 0%, transparent 100%); }
  .class-glow-scribe { box-shadow: 0 0 12px rgba(6,182,212,0.2), 0 0 4px rgba(6,182,212,0.15); animation: glow-scribe 2s ease-out; }
  @keyframes glow-scribe {
    0%   { box-shadow: 0 0 25px rgba(6,182,212,0.5), 0 0 50px rgba(6,182,212,0.2); }
    50%  { box-shadow: 0 0 15px rgba(6,182,212,0.3), 0 5px 20px rgba(6,182,212,0.15); }
    100% { box-shadow: 0 0 12px rgba(6,182,212,0.2), 0 0 4px rgba(6,182,212,0.15); }
  }

  /* ── Strategist: Lightning double-flash ── */
  .class-flash-strategist { background: radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 60%); }
  .class-glow-strategist { box-shadow: 0 0 12px rgba(59,130,246,0.2), 0 0 4px rgba(59,130,246,0.15); animation: glow-strategist 1.5s ease-out; }
  @keyframes glow-strategist {
    0%, 8%   { box-shadow: 0 0 40px rgba(59,130,246,0.7), 0 0 80px rgba(59,130,246,0.3); }
    16%      { box-shadow: 0 0 6px rgba(59,130,246,0.1); }
    24%, 36% { box-shadow: 0 0 35px rgba(59,130,246,0.5), 0 0 60px rgba(59,130,246,0.2); }
    100%     { box-shadow: 0 0 12px rgba(59,130,246,0.2), 0 0 4px rgba(59,130,246,0.15); }
  }

  /* ── Alchemist: Bubbling pulse ── */
  .class-flash-alchemist { background: radial-gradient(ellipse at bottom, rgba(168,85,247,0.45) 0%, transparent 70%); }
  .class-glow-alchemist { box-shadow: 0 0 12px rgba(168,85,247,0.2), 0 0 4px rgba(168,85,247,0.15); animation: glow-alchemist 3s ease-in-out; }
  @keyframes glow-alchemist {
    0%   { box-shadow: 0 0 20px rgba(168,85,247,0.5); }
    25%  { box-shadow: 0 0 30px rgba(168,85,247,0.6), 0 -5px 20px rgba(168,85,247,0.3); }
    50%  { box-shadow: 0 0 15px rgba(168,85,247,0.3); }
    75%  { box-shadow: 0 0 25px rgba(168,85,247,0.5), 0 -3px 15px rgba(168,85,247,0.25); }
    100% { box-shadow: 0 0 12px rgba(168,85,247,0.2), 0 0 4px rgba(168,85,247,0.15); }
  }

  /* ── Polymath: Spectrum shimmer ── */
  .class-flash-polymath { background: conic-gradient(from 0deg, rgba(245,158,11,0.25), rgba(6,182,212,0.25), rgba(59,130,246,0.25), rgba(168,85,247,0.25), rgba(0,255,65,0.25)); }
  .class-glow-polymath { animation: glow-polymath 3s linear; }
  @keyframes glow-polymath {
    0%   { box-shadow: 0 0 20px rgba(0,255,65,0.4);   border-color: #00ff41; }
    20%  { box-shadow: 0 0 20px rgba(245,158,11,0.4); border-color: #f59e0b; }
    40%  { box-shadow: 0 0 20px rgba(6,182,212,0.4);  border-color: #06b6d4; }
    60%  { box-shadow: 0 0 20px rgba(59,130,246,0.4); border-color: #3b82f6; }
    80%  { box-shadow: 0 0 20px rgba(168,85,247,0.4); border-color: #a855f7; }
    100% { box-shadow: 0 0 12px rgba(0,255,65,0.2);   border-color: #00ff41; }
  }
`

/* ── TierProgressionGrid ─────────────────────────── */

interface TierProgressionGridProps {
  currentAvatarTier: number
}

export function TierProgressionGrid({ currentAvatarTier }: TierProgressionGridProps) {
  const lockedIndices = TITLE_TABLE
    .map((t, i) => ({ i, locked: t.avatar_tier > currentAvatarTier }))
    .filter(x => x.locked)
    .map(x => x.i)

  function getRevealDuration(idx: number): number {
    const pos = lockedIndices.indexOf(idx)
    if (pos === -1) return REVEAL_DURATION_MAX
    if (lockedIndices.length === 1) return REVEAL_DURATION_MIN
    const t = pos / (lockedIndices.length - 1)
    return Math.round((REVEAL_DURATION_MAX - t * (REVEAL_DURATION_MAX - REVEAL_DURATION_MIN)) * 10) / 10
  }

  return (
    <>
      <style>{EASTER_EGG_CSS}</style>

      <div style={grid}>
        {TITLE_TABLE.map((tier, idx) => {
          const profile = mockProfileForTier(idx)
          const nextTier = TITLE_TABLE[idx + 1] ?? null
          const urls = getAvatarUrlsForProfile(profile)
          const variant =
            idx % 2 === 1 || tier.avatar_tier === 6 ? 'advanced' : 'early'
          const isLocked = tier.avatar_tier > currentAvatarTier
          const rpgClass = ALL_CLASSES[idx % ALL_CLASSES.length]!

          return (
            <div key={tier.level} style={cardWrapper}>
              <RevealableAvatar isLocked={isLocked} rpgClass={rpgClass} revealDuration={getRevealDuration(idx)}>
                <AvatarBadge
                  size="compact"
                  profile={profile}
                  avatarSrc={urls.static}
                  avatarIdleSrc={urls.idle}
                  avatarActionSrc={urls.action}
                />
              </RevealableAvatar>
              <div style={tierLabelStyle}>
                {rpgClass} · {variant} · {formatXP(tier.xp_required)} XP
              </div>
              {nextTier && (
                <div style={{ ...tierLabelStyle, opacity: 0.5 }}>
                  next → LVL {nextTier.level}
                </div>
              )}
              {!nextTier && (
                <div style={{ ...tierLabelStyle, color: 'var(--accent)' }}>
                  ★ MAX RANK
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
