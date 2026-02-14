'use client'

import React, { useState } from 'react'
import { TITLE_TABLE, tierColor } from '../lib/rpg'
import type { RPGProfile } from '../lib/rpg'

/* ── types ────────────────────────────────────────── */

export interface AvatarBadgeProps {
  /**
   * `compact` (~72px avatar) for landing-page heroes.
   * `full` (~160px avatar) for log pages.
   * @default 'compact'
   */
  size?: 'compact' | 'full'
  /**
   * RPG profile data. Pass `null` (or omit) to render the
   * "initializing..." placeholder / boot-sequence state.
   */
  profile?: RPGProfile | null
  /**
   * `src` for the static avatar PNG. Used as fallback when GIFs
   * are unavailable. Pass `null` to render the blinking-cursor
   * placeholder instead.
   */
  avatarSrc?: string | null
  /**
   * `src` for the idle animation GIF (looping breathing/pulse).
   * Shown by default when available. Falls back to `avatarSrc`.
   */
  avatarIdleSrc?: string | null
  /**
   * `src` for the action animation GIF (sword slash, spell cast, etc.).
   * Shown on hover when available. Falls back to idle → static → placeholder.
   */
  avatarActionSrc?: string | null
}

/* ── size constants ───────────────────────────────── */

const SIZES = {
  compact: {
    avatar: 72,
    padding: 12,
    titleFont: 11,
    levelFont: 9,
    promptFont: 10,
    gap: 8,
  },
  full: {
    avatar: 160,
    padding: 20,
    titleFont: 15,
    levelFont: 12,
    promptFont: 14,
    gap: 14,
  },
} as const

/* ── component ────────────────────────────────────── */

/**
 * Terminal-aesthetic badge showing the RPG avatar, level, and title.
 *
 * When no profile or avatar image is available (progression engine hasn't
 * run yet), renders a cryptic "boot sequence" placeholder — a blinking
 * green cursor on black with `> initializing...`.
 *
 * This is a **client component** (`'use client'`) because it tracks
 * hover state for the idle → action GIF swap. Props are still passed
 * from server page components.
 */
export function AvatarBadge({
  size = 'compact',
  profile = null,
  avatarSrc = null,
  avatarIdleSrc = null,
  avatarActionSrc = null,
}: AvatarBadgeProps) {
  const s = SIZES[size]
  const hasProfile = profile !== null && profile.level > 0
  const [hovered, setHovered] = useState(false)
  const accent = hasProfile
    ? tierColor(profile?.avatar_tier ?? 0)
    : 'var(--accent)'

  /* ── Fallback chain: idle GIF → static PNG → null (placeholder) ── */
  const idleSrc = avatarIdleSrc ?? avatarSrc ?? null
  const actionSrc = avatarActionSrc ?? idleSrc
  const hasAvatar = idleSrc !== null

  return (
    <>
      {/* Scoped keyframes */}
      <style>{`
        .avatar-badge-blink {
          display: inline-block;
          width: 8px;
          height: ${s.promptFont + 2}px;
          background: var(--accent);
          vertical-align: text-bottom;
          margin-left: 2px;
          animation: avatar-badge-blink-kf 1s step-end infinite;
        }
        @keyframes avatar-badge-blink-kf {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .avatar-badge-scanline {
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
          border-radius: 6px;
        }
        .avatar-badge-xp-track {
          width: 100%;
          height: 6px;
          background: rgba(0, 0, 0, 0.35);
          border-radius: 4px;
          overflow: hidden;
          margin-top: 6px;
        }
        .avatar-badge-xp-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.6s ease;
          box-sizing: border-box;
        }
      `}</style>

      <div
        style={{
          position: 'relative',
          background: 'var(--canvas)',
          border: `1px solid ${accent}`,
          borderRadius: '8px',
          padding: s.padding,
          fontFamily: 'var(--font-mono)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: s.gap,
          maxWidth: s.avatar + s.padding * 2 + 40,
        }}
      >
        {/* Scanline overlay */}
        <div className="avatar-badge-scanline" />

        {/* ── Avatar or Placeholder ── */}
        {hasAvatar ? (
          <div
            style={{
              position: 'relative',
              width: s.avatar,
              height: s.avatar,
              borderRadius: '6px',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              cursor: actionSrc !== idleSrc ? 'pointer' : 'default',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Idle GIF / static PNG — visible by default */}
            <img
              src={idleSrc!}
              alt={
                hasProfile
                  ? `${profile!.title}, Level ${profile!.level}`
                  : 'Avatar'
              }
              width={s.avatar}
              height={s.avatar}
              style={{
                objectFit: 'cover',
                display: 'block',
                imageRendering: 'pixelated',
                opacity: hovered && actionSrc !== idleSrc ? 0 : 1,
                transition: 'opacity 0.15s ease',
              }}
            />
            {/* Action GIF — visible on hover (only rendered if distinct) */}
            {actionSrc && actionSrc !== idleSrc && (
              <img
                src={actionSrc}
                alt={
                  hasProfile
                    ? `${profile!.title} action, Level ${profile!.level}`
                    : 'Avatar action'
                }
                width={s.avatar}
                height={s.avatar}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  objectFit: 'cover',
                  display: 'block',
                  imageRendering: 'pixelated',
                  opacity: hovered ? 1 : 0,
                  transition: 'opacity 0.15s ease',
                }}
              />
            )}
          </div>
        ) : (
          /* Placeholder: black box with blinking cursor */
          <div
            style={{
              width: s.avatar,
              height: s.avatar,
              borderRadius: '6px',
              border: '1px solid var(--border)',
              background: '#0a0a0a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: s.promptFont,
                color: 'var(--accent)',
                whiteSpace: 'nowrap',
              }}
            >
              {'> '}
              <span className="avatar-badge-blink" />
            </span>
          </div>
        )}

        {/* ── Profile info or "initializing..." ── */}
        {hasProfile ? (
          <div style={{ textAlign: 'center', width: '100%' }}>
            {/* Title */}
            <div
              style={{
                fontSize: s.titleFont,
                fontWeight: 600,
                color: accent,
                lineHeight: 1.3,
                letterSpacing: '0.02em',
              }}
            >
              {profile!.title}
            </div>

            {/* Level + class */}
            <div
              style={{
                fontSize: s.levelFont,
                color: 'var(--text-muted)',
                marginTop: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              LVL {profile!.level} · {profile!.class}
            </div>

            {/* XP progress bar — glow + gradient fill */}
            {profile!.xp_next_level > 0 && (
              <div className="avatar-badge-xp-track">
                <div
                  className="avatar-badge-xp-fill"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (profile!.xp_total / profile!.xp_next_level) * 100,
                      ),
                    )}%`,
                    background: `linear-gradient(to right, ${accent}, color-mix(in srgb, ${accent} 65%, white))`,
                    boxShadow: `0 0 8px ${accent}40, inset 0 1px 0 rgba(255,255,255,0.15)`,
                  }}
                />
              </div>
            )}

            {/* Next level indicator */}
            {(() => {
              const nextTier = TITLE_TABLE.find(
                (t) => t.level > (profile!.level ?? 0),
              )
              if (!nextTier) return null
              return (
                <div
                  style={{
                    fontSize: Math.max(s.levelFont - 1, 8),
                    color: 'var(--text-muted)',
                    opacity: 0.6,
                    marginTop: 4,
                    letterSpacing: '0.03em',
                  }}
                >
                  {'> next: '}
                  {nextTier.title} (LVL {nextTier.level})
                </div>
              )
            })()}
          </div>
        ) : (
          /* Boot-sequence placeholder text */
          <div
            style={{
              textAlign: 'center',
              fontSize: s.promptFont,
              color: 'var(--accent)',
              lineHeight: 1.5,
              opacity: 0.85,
            }}
          >
            {'> initializing...'}
            <span className="avatar-badge-blink" />
          </div>
        )}
      </div>
    </>
  )
}
