import React from 'react'
import type { LogAggregates } from '../lib/logs'
import { AvatarBadge } from './AvatarBadge'
import type { RPGProfile } from '../lib/rpg'

interface LogHeroProps {
  aggregates: LogAggregates
  /**
   * When true, renders the AvatarBadge in compact size to the left of
   * the receipts header, creating a two-column hero (avatar | stats).
   * @default false
   */
  showAvatar?: boolean
  /** RPG profile data passed through to AvatarBadge. */
  profile?: RPGProfile | null
  /** Avatar image src passed through to AvatarBadge. */
  avatarSrc?: string | null
}

/** Format large numbers with K/M suffix. */
function compactNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

function AggregateStat({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div
      style={{
        flex: '1 1 0',
        minWidth: '90px',
        textAlign: 'center',
        padding: '14px 10px',
      }}
    >
      <div
        style={{
          fontSize: '26px',
          fontWeight: 700,
          color: 'var(--accent)',
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          marginTop: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </div>
    </div>
  )
}

/**
 * Terminal-styled hero section for the /log index page.
 * Provides narrative framing ("The Receipts") and aggregate stats
 * computed across all available daily logs.
 */
export function LogHero({
  aggregates,
  showAvatar = false,
  profile = null,
  avatarSrc = null,
}: LogHeroProps) {
  const { totalDays, totalShipped, totalWords, totalCommits, totalFinals } =
    aggregates

  return (
    <>
      <style>{`
        .log-hero-cursor {
          display: inline-block;
          width: 8px;
          height: 16px;
          background: var(--accent);
          vertical-align: text-bottom;
          margin-left: 2px;
          animation: log-hero-blink 1s step-end infinite;
        }
        @keyframes log-hero-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .log-hero-stat-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
        }
        .log-hero-stat-bar > div + div {
          border-left: 1px solid var(--border);
        }
        .log-hero-inner {
          display: flex;
          gap: 24px;
          align-items: flex-start;
          padding: 20px 24px 0;
        }
        .log-hero-avatar-col {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .log-hero-content-col {
          flex: 1 1 0;
          min-width: 0;
        }
        @media (max-width: 600px) {
          .log-hero-stat-bar > div + div {
            border-left: none;
          }
          .log-hero-stat-bar {
            gap: 0;
          }
          .log-hero-stat-bar > div {
            flex: 1 1 45% !important;
            min-width: 0 !important;
          }
          .log-hero-inner {
            flex-direction: column;
            align-items: stretch;
          }
          .log-hero-avatar-col {
            align-items: center;
          }
        }
      `}</style>

      <div
        style={{
          background: 'var(--canvas-subtle)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          overflow: 'hidden',
          fontFamily: 'var(--font-mono)',
          marginBottom: '32px',
        }}
      >
        {/* Terminal prompt header + optional avatar */}
        <div className="log-hero-inner">
          {/* Avatar column (only when showAvatar is true) */}
          {showAvatar && (
            <div className="log-hero-avatar-col">
              <AvatarBadge
                size="compact"
                profile={profile}
                avatarSrc={avatarSrc}
              />
            </div>
          )}

          {/* Content column */}
          <div className={showAvatar ? 'log-hero-content-col' : undefined}>
            <div
              style={{
                fontSize: '13px',
                color: 'var(--accent)',
                fontWeight: 400,
                letterSpacing: '0.5px',
                marginBottom: '16px',
              }}
            >
              $ cat ~/receipts
              <span className="log-hero-cursor" />
            </div>

            {/* Headline */}
            <h2
              style={{
                margin: '0 0 10px',
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '0.03em',
                lineHeight: 1.3,
              }}
            >
              The Receipts
            </h2>

            {/* Narrative copy */}
            <p
              style={{
                margin: '0 0 8px',
                fontSize: '14px',
                lineHeight: 1.65,
                color: 'var(--text-secondary)',
                maxWidth: '620px',
              }}
            >
              Everyone says they ship. This is the proof.
            </p>
            <p
              style={{
                margin: '0 0 20px',
                fontSize: '13px',
                lineHeight: 1.6,
                color: 'var(--text-muted)',
                maxWidth: '620px',
              }}
            >
              Every line auto-scanned from git commits, the content pipeline, and
              AI sessions. Not a screenshot. A live dashboard built into the
              codebase. Python + Pillow scans it daily. Each card below is a build
              receipt.
            </p>
          </div>
        </div>

        {/* Aggregate stats bar */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            background: 'var(--canvas)',
          }}
        >
          <div className="log-hero-stat-bar">
            <AggregateStat label="days tracked" value={totalDays} />
            <AggregateStat label="items shipped" value={totalShipped} />
            <AggregateStat label="finalized" value={totalFinals} />
            <AggregateStat label="words written" value={compactNum(totalWords)} />
            <AggregateStat label="commits" value={totalCommits} />
          </div>
        </div>
      </div>
    </>
  )
}
