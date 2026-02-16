'use client'

import React, { useState } from 'react'
import type { NioProgress } from '../lib/vitals'
import { getNioAvatarUrls, formatNumber } from '../lib/vitals'

/* ── types ────────────────────────────────────────── */

export interface NioAvatarProps {
  tier: number
  tierName: string
  totalScore: number
  progress: NioProgress
  /** @default 'full' */
  size?: 'compact' | 'full'
}

/* ── size constants ───────────────────────────────── */

const SIZES = {
  compact: {
    avatar: 72,
    padding: 12,
    titleFont: 12,
    labelFont: 10,
    gap: 8,
  },
  full: {
    avatar: 128,
    padding: 20,
    titleFont: 16,
    labelFont: 12,
    gap: 14,
  },
} as const

/* ── Nio green palette ────────────────────────────── */

const NIO_GREEN = '#4EC373'
const NIO_GREEN_DIM = '#2A8B4E'

/* ── component ────────────────────────────────────── */

export function NioAvatar({
  tier,
  tierName,
  totalScore,
  progress,
  size = 'full',
}: NioAvatarProps) {
  const s = SIZES[size]
  const urls = getNioAvatarUrls(tier)
  const [imgError, setImgError] = useState(false)

  return (
    <>
      <style>{`
        @keyframes nio-glow {
          0%, 100% { box-shadow: 0 0 12px ${NIO_GREEN}40, 0 0 24px ${NIO_GREEN}20; }
          50% { box-shadow: 0 0 20px ${NIO_GREEN}60, 0 0 40px ${NIO_GREEN}30; }
        }
        @keyframes nio-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .nio-avatar-wrap {
          animation: nio-glow 3s ease-in-out infinite;
        }
        .nio-xp-track {
          width: 100%;
          height: 8px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid ${NIO_GREEN}30;
        }
        .nio-xp-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.8s ease;
          background: linear-gradient(to right, ${NIO_GREEN_DIM}, ${NIO_GREEN});
          box-shadow: 0 0 8px ${NIO_GREEN}60;
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: s.gap,
          padding: s.padding,
          fontFamily: 'var(--font-mono)',
        }}
      >
        {/* Avatar image */}
        <div
          className="nio-avatar-wrap"
          style={{
            width: s.avatar,
            height: s.avatar,
            borderRadius: '8px',
            border: `2px solid ${NIO_GREEN}`,
            overflow: 'hidden',
            background: '#0a0a0a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!imgError ? (
            <img
              src={urls.idle}
              alt={`Nio — Tier ${tier} ${tierName}`}
              width={s.avatar}
              height={s.avatar}
              style={{
                objectFit: 'cover',
                display: 'block',
                imageRendering: 'pixelated',
              }}
              onError={() => setImgError(true)}
            />
          ) : (
            <span
              style={{
                fontSize: s.titleFont,
                color: NIO_GREEN,
                fontWeight: 700,
              }}
            >
              NIO
            </span>
          )}
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: s.titleFont,
              fontWeight: 700,
              color: NIO_GREEN,
              letterSpacing: '0.02em',
            }}
          >
            Nio // {tierName}
          </div>
          <div
            style={{
              fontSize: s.labelFont,
              color: 'var(--text-muted)',
              marginTop: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Tier {tier} · Website Guardian
          </div>
        </div>

        {/* XP Bar */}
        <div style={{ width: '100%', maxWidth: 240 }}>
          <div className="nio-xp-track">
            <div
              className="nio-xp-fill"
              style={{ width: `${Math.min(100, progress.percent)}%` }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 4,
              fontSize: Math.max(s.labelFont - 1, 9),
              color: 'var(--text-muted)',
            }}
          >
            <span>{formatNumber(progress.current)} / {formatNumber(progress.needed)}</span>
            <span style={{ color: NIO_GREEN }}>{progress.percent.toFixed(1)}%</span>
          </div>
          <div
            style={{
              textAlign: 'center',
              fontSize: Math.max(s.labelFont - 1, 9),
              color: 'var(--text-muted)',
              marginTop: 2,
              opacity: 0.7,
            }}
          >
            {'> next: Tier '}
            {progress.next_tier} — {progress.next_tier_name}
          </div>
        </div>
      </div>
    </>
  )
}
