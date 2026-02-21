/**
 * ShawnOS — Proprietary System Architecture
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 */

import type { Metadata } from 'next'
import {
  getRPGProfile,
  getRPGProfileV2,
  resolveDataRoot,
  TITLE_TABLE,
  tierColor,
} from '@shawnos/shared/lib'
import type { RPGProfileV2, V2ScoringEntry } from '@shawnos/shared/lib'

const DATA_ROOT = resolveDataRoot()

export const metadata: Metadata = {
  title: 'v2 Lab | ShawnOS.ai',
  description:
    'Ghost comparison — v1 vs v2 progression engine side by side.',
  robots: { index: false, follow: false },
}

/* ── styles ──────────────────────────────────────── */

const page: React.CSSProperties = {
  maxWidth: 960,
  margin: '0 auto',
  padding: '48px 20px',
  fontFamily: 'var(--font-mono)',
}

const promptChar: React.CSSProperties = {
  color: 'var(--accent)',
}

const sectionHeading: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--accent)',
  marginBottom: 16,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '40px 0',
}

const card: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  padding: '20px',
  flex: 1,
  minWidth: 0,
}

const tableWrapper: React.CSSProperties = {
  overflowX: 'auto',
  border: '1px solid var(--border)',
  borderRadius: 6,
  background: 'var(--canvas-subtle)',
}

const th: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px 10px',
  borderBottom: '1px solid var(--border)',
  color: 'var(--accent)',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontSize: '10px',
  whiteSpace: 'nowrap',
}

const td: React.CSSProperties = {
  padding: '6px 10px',
  borderBottom: '1px solid var(--border)',
  color: 'var(--text-secondary)',
  whiteSpace: 'nowrap',
  fontSize: '12px',
}

const tdAccent: React.CSSProperties = {
  ...td,
  color: 'var(--accent)',
  fontWeight: 600,
}

/* ── helpers ──────────────────────────────────────── */

function formatXP(xp: number): string {
  return xp.toLocaleString()
}

function gradeColor(grade: string): string {
  switch (grade) {
    case 'S+': return '#FBBF24'
    case 'S':  return '#8B5CF6'
    case 'A+': return '#06B6D4'
    case 'A':  return '#10B981'
    case 'B':  return '#64748B'
    case 'C':  return '#94A3B8'
    default:   return '#475569'
  }
}

function pct(a: number, b: number): string {
  if (b === 0) return '0%'
  return `${Math.round((a / b) * 100)}%`
}

/* ── page ────────────────────────────────────────── */

export default function V2LabPage() {
  const v1 = getRPGProfile(DATA_ROOT)
  const v2 = getRPGProfileV2(DATA_ROOT)

  if (!v1 || !v2) {
    return (
      <div style={page}>
        <p style={{ color: 'var(--text-muted)' }}>
          <span style={promptChar}>$</span> ./progression-lab --compare v1 v2
        </p>
        <p style={{ color: '#ef4444', marginTop: 16 }}>
          Error: missing profile data. Run both engines first:
        </p>
        <pre style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 8 }}>
          {`python3 scripts/progression_engine.py --skip-avatar\npython3 scripts/progression_engine_v2.py`}
        </pre>
      </div>
    )
  }

  const meta = v2.v2_meta
  const scoringLog = meta.scoring_log
  const xpDelta = meta.xp_delta
  const levelDelta = v2.level - v1.level

  const v2NextTier = TITLE_TABLE.find((t) => t.xp_required > v2.xp_total)
  const xpToNext = v2NextTier
    ? v2NextTier.xp_required - v2.xp_total
    : 0
  const xpProgress = v2NextTier
    ? Math.round((v2.xp_total / v2NextTier.xp_required) * 1000) / 10
    : 100

  // Milestones: find v2-only milestones not in v1
  const v1Ids = new Set(v1.milestones.map((m) => m.id))
  const v2OnlyMilestones = v2.milestones.filter((m) => !v1Ids.has(m.id))
  // Target milestones not yet achieved
  const possibleTargets = [
    { id: 'ascending_3', title: 'Ascending Chain', description: '3-day ascending score chain' },
    { id: 'ascending_5', title: 'Unstoppable', description: '5-day ascending score chain' },
    { id: 'efficiency_king', title: 'Efficiency King', description: 'Day with >100 pts/$' },
    { id: 'commit_machine', title: 'Commit Machine', description: 'Day with 25+ commits' },
    { id: 'polymath_day', title: 'Renaissance Day', description: 'Accomplishments in all 3 categories' },
    { id: 's_plus_day', title: 'Legendary', description: 'First S+ grade day (v2 thresholds)' },
  ]
  const achievedIds = new Set(v2.milestones.map((m) => m.id))
  const targetMilestones = possibleTargets.filter((m) => !achievedIds.has(m.id))

  return (
    <div style={page}>
      {/* ── Header ── */}
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: 8 }}>
        <span style={promptChar}>$</span> ./progression-lab --compare v1 v2
      </p>
      <h1
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--accent)',
          marginBottom: 4,
          fontFamily: 'var(--font-mono)',
        }}
      >
        Progression Engine v2 Lab
      </h1>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 0, lineHeight: 1.6 }}>
        Ghost comparison. Recalibrated grades, ascending chain multiplier, bonus scoring.
        Not in production yet.
      </p>

      <hr style={divider} />

      {/* ── Section 1: Side-by-Side Profile Cards ── */}
      <section>
        <h2 style={sectionHeading}>
          <span style={promptChar}>$</span>{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            diff profile.json profile-v2.json
          </span>
        </h2>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {/* v1 Card */}
          <div style={{ ...card, borderColor: tierColor(v1.avatar_tier) }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              v1 — current (live)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <img
                src={`/progression/avatars/tier-${v1.avatar_tier}-idle.gif`}
                alt="v1 avatar"
                width={48}
                height={48}
                style={{ imageRendering: 'pixelated', borderRadius: 4, border: '1px solid var(--border)' }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: tierColor(v1.avatar_tier) }}>
                  {v1.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  LVL {v1.level} &middot; {v1.class}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              XP: <strong style={{ color: 'var(--text-primary)' }}>{formatXP(v1.xp_total)}</strong>
              <br />
              Next: {formatXP(v1.xp_next_level)} XP
            </div>
          </div>

          {/* Delta Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            minWidth: 80,
            gap: 4,
          }}>
            <div style={{
              fontSize: 14,
              fontWeight: 700,
              color: xpDelta >= 0 ? '#10B981' : '#ef4444',
            }}>
              {xpDelta >= 0 ? '+' : ''}{formatXP(xpDelta)} XP
            </div>
            {levelDelta !== 0 && (
              <div style={{
                fontSize: 12,
                color: levelDelta > 0 ? '#10B981' : '#ef4444',
              }}>
                {levelDelta > 0 ? '+' : ''}{levelDelta} LVL
              </div>
            )}
          </div>

          {/* v2 Card */}
          <div style={{ ...card, borderColor: tierColor(v2.avatar_tier) }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              v2 — experimental
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <img
                src={`/progression/avatars/tier-${v2.avatar_tier}-idle.gif`}
                alt="v2 avatar"
                width={48}
                height={48}
                style={{ imageRendering: 'pixelated', borderRadius: 4, border: '1px solid var(--border)' }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: tierColor(v2.avatar_tier) }}>
                  {v2.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  LVL {v2.level} &middot; {v2.class}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              XP: <strong style={{ color: 'var(--text-primary)' }}>{formatXP(v2.xp_total)}</strong>
              <br />
              Next: {formatXP(v2.xp_next_level)} XP
            </div>
          </div>
        </div>
      </section>

      <hr style={divider} />

      {/* ── Section 2: Grade Comparison Table ── */}
      <section>
        <h2 style={sectionHeading}>
          <span style={promptChar}>$</span>{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            cat scoring_log --format table
          </span>
        </h2>

        <div style={tableWrapper}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
            <thead>
              <tr>
                <th style={th}>Date</th>
                <th style={th}>Raw</th>
                <th style={th}>v1</th>
                <th style={th}>v2</th>
                <th style={th}>Chain</th>
                <th style={{ ...th, textAlign: 'right' }}>Chain&times;</th>
                <th style={{ ...th, textAlign: 'right' }}>Eff</th>
                <th style={{ ...th, textAlign: 'right' }}>Vel</th>
                <th style={{ ...th, textAlign: 'right' }}>Ship</th>
                <th style={{ ...th, textAlign: 'right' }}>Total&times;</th>
                <th style={{ ...th, textAlign: 'right' }}>v2 XP</th>
              </tr>
            </thead>
            <tbody>
              {scoringLog.map((e: V2ScoringEntry) => {
                const gradesDiffer = e.v1_grade !== e.v2_grade
                return (
                  <tr
                    key={e.date}
                    style={gradesDiffer ? { background: 'rgba(239, 68, 68, 0.06)' } : undefined}
                  >
                    <td style={tdAccent}>{e.date}</td>
                    <td style={td}>{e.raw_score}</td>
                    <td style={{ ...td, color: gradeColor(e.v1_grade), fontWeight: 600 }}>
                      {e.v1_grade}
                    </td>
                    <td style={{ ...td, color: gradeColor(e.v2_grade), fontWeight: 600 }}>
                      {e.v2_grade}
                    </td>
                    <td style={td}>
                      {e.chain_length > 1 ? (
                        <span style={{ color: '#10B981' }}>
                          {'|'.repeat(e.chain_length)}
                        </span>
                      ) : (
                        <span style={{ color: '#475569' }}>1</span>
                      )}
                    </td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      {e.chain_mult > 1 ? (
                        <span style={{ color: '#10B981' }}>{e.chain_mult.toFixed(1)}x</span>
                      ) : (
                        <span style={{ color: '#475569' }}>1.0x</span>
                      )}
                    </td>
                    <td style={{ ...td, textAlign: 'right', color: e.efficiency_bonus > 0 ? '#06B6D4' : '#475569' }}>
                      {e.efficiency_bonus > 0 ? `+${(e.efficiency_bonus * 100).toFixed(0)}%` : '-'}
                    </td>
                    <td style={{ ...td, textAlign: 'right', color: e.velocity_bonus > 0 ? '#F59E0B' : '#475569' }}>
                      {e.velocity_bonus > 0 ? `+${(e.velocity_bonus * 100).toFixed(0)}%` : '-'}
                    </td>
                    <td style={{ ...td, textAlign: 'right', color: e.ship_bonus > 0 ? '#8B5CF6' : '#475569' }}>
                      {e.ship_bonus > 0 ? `+${(e.ship_bonus * 100).toFixed(0)}%` : '-'}
                    </td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 600, color: e.total_mult > 1 ? '#10B981' : 'var(--text-secondary)' }}>
                      {e.total_mult.toFixed(2)}x
                    </td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {formatXP(e.v2_xp)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <hr style={divider} />

      {/* ── Section 3: Ascending Chain Visualization ── */}
      <section>
        <h2 style={sectionHeading}>
          <span style={promptChar}>$</span>{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            graph --ascending-chains
          </span>
        </h2>

        <div style={{
          display: 'flex',
          gap: 16,
          marginBottom: 16,
          fontSize: 12,
          color: 'var(--text-muted)',
        }}>
          <span>Current chain: <strong style={{ color: 'var(--accent)' }}>{meta.current_ascending_chain}</strong></span>
          <span>Multiplier: <strong style={{ color: '#10B981' }}>{meta.chain_multiplier}x</strong></span>
          <span>Longest: <strong style={{ color: '#F59E0B' }}>{meta.longest_chain}</strong></span>
        </div>

        {/* Bar chart */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 4,
          height: 140,
          padding: '0 4px',
          borderBottom: '1px solid var(--border)',
          marginBottom: 8,
        }}>
          {scoringLog.map((e: V2ScoringEntry) => {
            const maxScore = Math.max(...scoringLog.map((s: V2ScoringEntry) => s.raw_score), 1)
            const heightPct = (e.raw_score / maxScore) * 100
            const isAscending = e.chain_length > 1
            return (
              <div
                key={e.date}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: isAscending ? '#10B981' : 'var(--text-muted)',
                    fontWeight: isAscending ? 600 : 400,
                  }}
                >
                  {e.raw_score}
                </div>
                <div
                  style={{
                    width: '100%',
                    maxWidth: 50,
                    height: `${heightPct}%`,
                    minHeight: 4,
                    borderRadius: '3px 3px 0 0',
                    background: isAscending
                      ? `linear-gradient(to top, #10B981, #34D399)`
                      : 'var(--border)',
                    transition: 'height 0.3s ease',
                  }}
                />
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 4, padding: '0 4px' }}>
          {scoringLog.map((e: V2ScoringEntry) => (
            <div key={e.date} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: 'var(--text-muted)' }}>
              {e.date.slice(5)}
            </div>
          ))}
        </div>
      </section>

      <hr style={divider} />

      {/* ── Section 4: Class Breakdown ── */}
      <section>
        <h2 style={sectionHeading}>
          <span style={promptChar}>$</span>{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            cat class_breakdown --window 7d
          </span>
        </h2>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {/* v1 all-time */}
          <div style={card}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
              v1 — all-time
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>
              {v1.class}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              Computed from entire log history
            </div>
          </div>

          {/* v2 rolling 7d */}
          <div style={card}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
              v2 — 7-day window
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>
              {v2.class}
            </div>
            {/* Breakdown bar */}
            <div style={{
              display: 'flex',
              width: '100%',
              height: 8,
              borderRadius: 4,
              overflow: 'hidden',
              marginTop: 10,
              marginBottom: 6,
            }}>
              <div style={{ width: pct(meta.class_breakdown.builder ?? 0, 1), background: '#F59E0B' }} />
              <div style={{ width: pct(meta.class_breakdown.scribe ?? 0, 1), background: '#8B5CF6' }} />
              <div style={{ width: pct(meta.class_breakdown.strategist ?? 0, 1), background: '#06B6D4' }} />
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 10, color: 'var(--text-muted)' }}>
              <span style={{ color: '#F59E0B' }}>Builder {Math.round((meta.class_breakdown.builder ?? 0) * 100)}%</span>
              <span style={{ color: '#8B5CF6' }}>Scribe {Math.round((meta.class_breakdown.scribe ?? 0) * 100)}%</span>
              <span style={{ color: '#06B6D4' }}>Strategist {Math.round((meta.class_breakdown.strategist ?? 0) * 100)}%</span>
            </div>
          </div>
        </div>
      </section>

      <hr style={divider} />

      {/* ── Section 5: XP Progress Detail ── */}
      <section>
        <h2 style={sectionHeading}>
          <span style={promptChar}>$</span>{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            progress --v2 --detail
          </span>
        </h2>

        <div style={{ background: 'var(--canvas-subtle)', border: '1px solid var(--border)', borderRadius: 6, padding: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
            <strong style={{ color: 'var(--text-primary)', fontSize: 18 }}>{formatXP(v2.xp_total)}</strong>
            {' / '}
            <span>{formatXP(v2.xp_next_level)} XP</span>
            <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--accent)' }}>({xpProgress}%)</span>
          </div>

          {/* XP bar */}
          <div style={{
            width: '100%',
            height: 10,
            background: 'rgba(0, 0, 0, 0.35)',
            borderRadius: 6,
            overflow: 'hidden',
            marginBottom: 10,
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, xpProgress)}%`,
              background: `linear-gradient(to right, ${tierColor(v2.avatar_tier)}, color-mix(in srgb, ${tierColor(v2.avatar_tier)} 65%, white))`,
              boxShadow: `0 0 8px ${tierColor(v2.avatar_tier)}40`,
              borderRadius: 6,
              transition: 'width 0.6s ease',
            }} />
          </div>

          {v2NextTier && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {formatXP(xpToNext)} XP to <strong style={{ color: 'var(--accent)' }}>{v2NextTier.title}</strong> (LVL {v2NextTier.level})
              {' · '}
              <a href="/rpg-preview" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                full tier guide &rarr;
              </a>
            </div>
          )}
        </div>
      </section>

      <hr style={divider} />

      {/* ── Section 6: New Milestones ── */}
      <section>
        <h2 style={sectionHeading}>
          <span style={promptChar}>$</span>{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            ls milestones --v2-only
          </span>
        </h2>

        {v2OnlyMilestones.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
              Unlocked in v2
            </div>
            {v2OnlyMilestones.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 0',
                  borderBottom: '1px solid var(--border)',
                  fontSize: 12,
                }}
              >
                <span style={{ color: '#10B981', fontSize: 14 }}>&#10003;</span>
                <strong style={{ color: 'var(--accent)' }}>{m.title}</strong>
                <span style={{ color: 'var(--text-muted)' }}>{m.description}</span>
              </div>
            ))}
          </div>
        )}

        {targetMilestones.length > 0 && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
              Targets (not yet achieved)
            </div>
            {targetMilestones.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 0',
                  borderBottom: '1px solid var(--border)',
                  fontSize: 12,
                  opacity: 0.4,
                }}
              >
                <span style={{ fontSize: 14 }}>&#9744;</span>
                <strong>{m.title}</strong>
                <span style={{ color: 'var(--text-muted)' }}>{m.description}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Footer ── */}
      <div
        style={{
          marginTop: 48,
          paddingTop: 16,
          borderTop: '1px solid var(--border)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          opacity: 0.5,
        }}
      >
        &gt; progression engine v2 lab &middot; experimental &middot; not in nav &middot; updated {v2.updated_at.slice(0, 10)}_
      </div>
    </div>
  )
}
