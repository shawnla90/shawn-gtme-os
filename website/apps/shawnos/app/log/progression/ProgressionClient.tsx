'use client'

import Link from 'next/link'
import type { V3ScoringEntry, V3Meta } from '@shawnos/shared/lib/rpg-v3'
import type { RPGProfile, Milestone } from '@shawnos/shared/lib/rpg'
import type { DailyLogSummary } from '@shawnos/shared/lib/logs'

/* ------------------------------------------------------------------ */
/*  Color constants                                                     */
/* ------------------------------------------------------------------ */

function gradeColor(grade: string): string {
  if (grade === 'S+') return '#FBBF24'
  if (grade === 'S') return '#8B5CF6'
  if (grade === 'A+') return '#06B6D4'
  if (grade === 'A') return '#10B981'
  if (grade === 'B') return '#64748B'
  if (grade === 'C') return '#94A3B8'
  return '#475569'
}

const CLASS_COLORS: Record<string, string> = {
  builder: '#EAB308',
  scribe: '#A855F7',
  strategist: '#06B6D4',
  alchemist: '#F97316',
  polymath: '#22C55E',
}

const TARGET_MILESTONES = [
  { id: 'ascending_5', title: 'Rising Star', description: '5-day ascending score chain' },
  { id: 'commit_machine', title: 'Commit Machine', description: '20+ commits in a single day' },
  { id: 's_plus_day', title: 'Perfect Day', description: 'Achieved S+ grade on a daily log' },
  { id: 'first_10000xp', title: 'Power Level', description: 'Earned 10,000 XP' },
  { id: 'words_200k', title: 'Bibliophile', description: 'Wrote 200,000+ words across all days' },
]

/* ------------------------------------------------------------------ */
/*  Props                                                               */
/* ------------------------------------------------------------------ */

interface ProgressionClientProps {
  profile: RPGProfile
  avatarSrc: string | null
  tierColor: string
  scoringLog: V3ScoringEntry[]
  meta: V3Meta
  costMap: Record<string, number>
  logs: DailyLogSummary[]
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                      */
/* ------------------------------------------------------------------ */

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: 'var(--canvas-subtle)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '20px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        margin: '0 0 16px',
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'var(--accent)',
      }}
    >
      {children}
    </h3>
  )
}

function StatNum({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: color ?? 'var(--accent)', lineHeight: 1.2 }}>
        {value}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>
        {label}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Profile Hero                                                        */
/* ------------------------------------------------------------------ */

function ProfileHero({
  profile,
  avatarSrc,
  tierColor: tc,
}: {
  profile: RPGProfile
  avatarSrc: string | null
  tierColor: string
}) {
  const xpPct = profile.xp_next_level > 0
    ? Math.min((profile.xp_total / profile.xp_next_level) * 100, 100)
    : 0

  return (
    <Card style={{ borderColor: tc }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
        {avatarSrc && (
          <div style={{ flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc}
              alt={profile.title}
              width={80}
              height={80}
              style={{ borderRadius: '6px', imageRendering: 'pixelated' }}
            />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent)' }}>
              {profile.title}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              LVL {profile.level}
            </span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Class: <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{profile.class}</span>
          </div>
          {/* XP bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <span>{profile.xp_total.toLocaleString()} / {profile.xp_next_level.toLocaleString()} XP</span>
            <span>{xpPct.toFixed(1)}%</span>
          </div>
          <div style={{ height: '10px', background: 'var(--border)', borderRadius: '5px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${xpPct}%`,
                backgroundColor: tc,
                borderRadius: '5px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  XP Graph                                                            */
/* ------------------------------------------------------------------ */

function XPGraph({ scoringLog }: { scoringLog: V3ScoringEntry[] }) {
  if (scoringLog.length === 0) return null
  const maxXP = Math.max(...scoringLog.map((e) => e.v3_xp))

  return (
    <Card>
      <SectionTitle>XP Earned Per Day</SectionTitle>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '160px' }}>
        {scoringLog.map((entry) => {
          const heightPct = maxXP > 0 ? (entry.v3_xp / maxXP) * 100 : 0
          const color = gradeColor(entry.v3_grade)
          return (
            <Link
              key={entry.date}
              href={`/log/${entry.date}`}
              style={{
                flex: '1 1 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '100%',
                  borderRadius: '3px 3px 0 0',
                  backgroundColor: color,
                  height: `${heightPct}%`,
                  minHeight: '4px',
                  transition: 'opacity 0.15s ease',
                }}
              />
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  marginTop: '4px',
                  transform: 'rotate(-45deg)',
                  transformOrigin: 'top left',
                  whiteSpace: 'nowrap',
                }}
              >
                {entry.date.slice(5)}
              </div>
            </Link>
          )
        })}
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '28px', fontSize: '10px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
        {scoringLog.map((e) => (
          <span key={e.date} style={{ color: gradeColor(e.v3_grade) }}>
            {e.date.slice(8)}: {e.v3_xp} XP
          </span>
        ))}
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Grade Table                                                         */
/* ------------------------------------------------------------------ */

function GradeTable({ scoringLog }: { scoringLog: V3ScoringEntry[] }) {
  if (scoringLog.length === 0) return null

  const th: React.CSSProperties = {
    padding: '8px 6px',
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    borderBottom: '1px solid var(--border)',
    whiteSpace: 'nowrap',
  }

  const td: React.CSSProperties = {
    padding: '6px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    whiteSpace: 'nowrap',
  }

  const fmtBonus = (v: number) => (v > 0 ? `+${(v * 100).toFixed(1)}%` : '—')

  return (
    <Card>
      <SectionTitle>Scoring Log</SectionTitle>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)' }}>
          <thead>
            <tr>
              <th style={{ ...th, textAlign: 'left' }}>Date</th>
              <th style={{ ...th, textAlign: 'right' }}>Raw</th>
              <th style={{ ...th, textAlign: 'right' }}>Base</th>
              <th style={{ ...th, textAlign: 'center' }}>Grade</th>
              <th style={{ ...th, textAlign: 'center' }}>Mom</th>
              <th style={{ ...th, textAlign: 'right' }}>Strk</th>
              <th style={{ ...th, textAlign: 'right' }}>Qual</th>
              <th style={{ ...th, textAlign: 'right' }}>Eff</th>
              <th style={{ ...th, textAlign: 'right' }}>Vel</th>
              <th style={{ ...th, textAlign: 'right' }}>Ship</th>
              <th style={{ ...th, textAlign: 'right' }}>Mult</th>
              <th style={{ ...th, textAlign: 'right' }}>XP</th>
            </tr>
          </thead>
          <tbody>
            {scoringLog.map((e) => (
              <tr key={e.date}>
                <td style={{ ...td, textAlign: 'left' }}>
                  <Link href={`/log/${e.date}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                    {e.date}
                  </Link>
                </td>
                <td style={{ ...td, textAlign: 'right' }}>{e.raw_score}</td>
                <td style={{ ...td, textAlign: 'right' }}>{e.base_score.toFixed(0)}</td>
                <td style={{ ...td, textAlign: 'center', fontWeight: 700, color: gradeColor(e.v3_grade) }}>
                  {e.v3_grade}
                </td>
                <td style={{ ...td, textAlign: 'center', color: 'var(--accent)' }}>
                  {e.momentum_mult.toFixed(2)}x
                </td>
                <td style={{ ...td, textAlign: 'right' }}>{e.streak_days}d</td>
                <td style={{ ...td, textAlign: 'right' }}>{fmtBonus(e.quality_bonus)}</td>
                <td style={{ ...td, textAlign: 'right' }}>{fmtBonus(e.efficiency_bonus)}</td>
                <td style={{ ...td, textAlign: 'right' }}>{fmtBonus(e.velocity_bonus)}</td>
                <td style={{ ...td, textAlign: 'right' }}>{fmtBonus(e.ship_bonus)}</td>
                <td style={{ ...td, textAlign: 'right', color: 'var(--accent)', fontWeight: 600 }}>
                  {e.total_mult.toFixed(2)}x
                </td>
                <td style={{ ...td, textAlign: 'right', fontWeight: 700, color: gradeColor(e.v3_grade) }}>
                  {e.v3_xp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Chain / Momentum Viz                                                */
/* ------------------------------------------------------------------ */

function ChainViz({ meta, scoringLog }: { meta: V3Meta; scoringLog: V3ScoringEntry[] }) {
  const maxChain = Math.max(...scoringLog.map((e) => e.ascending_chain), 1)

  return (
    <Card>
      <SectionTitle>Momentum</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
        <StatNum label="Chain" value={meta.current_ascending_chain} />
        <StatNum label="Streak" value={`${meta.current_streak}d`} />
        <StatNum label="Momentum" value={`${meta.momentum_mult.toFixed(2)}x`} />
        <StatNum label="Best Chain" value={meta.longest_chain} />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '80px' }}>
        {scoringLog.map((e) => {
          const heightPct = (e.ascending_chain / maxChain) * 100
          return (
            <div
              key={e.date}
              style={{
                flex: '1 1 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%',
              }}
            >
              <div
                style={{
                  width: '100%',
                  borderRadius: '3px 3px 0 0',
                  backgroundColor: e.ascending_chain > 1 ? 'var(--accent)' : 'var(--border)',
                  height: `${heightPct}%`,
                  minHeight: '4px',
                }}
              />
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {e.date.slice(8)}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Class Breakdown                                                     */
/* ------------------------------------------------------------------ */

function ClassBreakdown({ currentClass, meta }: { currentClass: string; meta: V3Meta }) {
  const breakdown = meta.class_breakdown

  return (
    <Card>
      <SectionTitle>Class Distribution ({meta.class_window} window)</SectionTitle>
      <div style={{ fontSize: '22px', fontWeight: 700, color: CLASS_COLORS[currentClass.toLowerCase()] ?? 'var(--accent)', marginBottom: '12px' }}>
        {currentClass}
      </div>
      {/* Stacked bar */}
      <div style={{ display: 'flex', height: '20px', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
        {Object.entries(breakdown)
          .filter(([, pct]) => pct > 0)
          .map(([cls, pct]) => (
            <div
              key={cls}
              style={{
                width: `${pct * 100}%`,
                backgroundColor: CLASS_COLORS[cls] ?? '#64748B',
              }}
              title={`${cls}: ${(pct * 100).toFixed(0)}%`}
            />
          ))}
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
        {Object.entries(breakdown).map(([cls, pct]) => (
          <span key={cls} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: CLASS_COLORS[cls] ?? '#64748B',
              }}
            />
            <span style={{ textTransform: 'capitalize' }}>{cls}</span>: {(pct * 100).toFixed(0)}%
          </span>
        ))}
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Milestones                                                          */
/* ------------------------------------------------------------------ */

function Milestones({ milestones }: { milestones: Milestone[] }) {
  const unlockedIds = new Set(milestones.map((m) => m.id))
  const targets = TARGET_MILESTONES.filter((t) => !unlockedIds.has(t.id))

  const unlockedStyle: React.CSSProperties = {
    border: '1px solid var(--accent)',
    borderRadius: '8px',
    padding: '12px',
    background: 'rgba(16, 185, 129, 0.05)',
  }

  const lockedStyle: React.CSSProperties = {
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '12px',
    opacity: 0.4,
  }

  return (
    <Card>
      <SectionTitle>Milestones</SectionTitle>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '10px',
        }}
      >
        {milestones.map((m) => (
          <div key={m.id} style={unlockedStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ color: 'var(--accent)', fontSize: '13px' }}>&#10003;</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>{m.title}</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{m.description}</p>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              {new Date(m.unlocked_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        ))}
        {targets.map((t) => (
          <div key={t.id} style={lockedStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>&#9679;</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t.title}</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{t.description}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Token Efficiency                                                    */
/* ------------------------------------------------------------------ */

function TokenEfficiency({
  scoringLog,
  costMap,
}: {
  scoringLog: V3ScoringEntry[]
  costMap: Record<string, number>
}) {
  const effData = scoringLog.map((e) => {
    const cost = costMap[e.date] ?? 0
    const ptsDollar = cost > 0 ? e.raw_score / cost : 0
    return { date: e.date, ptsDollar, cost, score: e.raw_score, xp: e.v3_xp }
  })

  const totalCost = effData.reduce((s, d) => s + d.cost, 0)
  const totalScore = effData.reduce((s, d) => s + d.score, 0)
  const maxPtsDollar = Math.max(...effData.map((d) => d.ptsDollar), 1)
  const maxCost = Math.max(...effData.map((d) => d.cost), 1)

  return (
    <Card>
      <SectionTitle>Token Efficiency</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <StatNum label="Total Spend" value={`$${totalCost.toFixed(2)}`} />
        <StatNum
          label="Avg Pts/$"
          value={totalCost > 0 ? (totalScore / totalCost).toFixed(0) : '—'}
        />
        <StatNum
          label="Avg/Day"
          value={`$${effData.length > 0 ? (totalCost / effData.length).toFixed(2) : '0'}`}
        />
      </div>

      {/* pts/$ chart */}
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
        Points per Dollar
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '80px', marginBottom: '20px' }}>
        {effData.map((d) => {
          const heightPct = maxPtsDollar > 0 ? (d.ptsDollar / maxPtsDollar) * 100 : 0
          return (
            <div
              key={d.date}
              style={{
                flex: '1 1 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%',
              }}
            >
              <div
                style={{
                  width: '100%',
                  borderRadius: '3px 3px 0 0',
                  backgroundColor: '#06B6D4',
                  height: `${heightPct}%`,
                  minHeight: '2px',
                }}
              />
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {d.date.slice(8)}
              </div>
            </div>
          )
        })}
      </div>

      {/* Daily cost chart */}
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
        Daily Cost
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '60px' }}>
        {effData.map((d) => {
          const heightPct = maxCost > 0 ? (d.cost / maxCost) * 100 : 0
          return (
            <div
              key={d.date}
              style={{
                flex: '1 1 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%',
              }}
            >
              <div
                style={{
                  width: '100%',
                  borderRadius: '3px 3px 0 0',
                  backgroundColor: '#EAB308',
                  height: `${heightPct}%`,
                  minHeight: '2px',
                }}
              />
            </div>
          )
        })}
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Main export                                                         */
/* ------------------------------------------------------------------ */

export default function ProgressionClient({
  profile,
  avatarSrc,
  tierColor: tc,
  scoringLog,
  meta,
  costMap,
  logs,
}: ProgressionClientProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <ProfileHero profile={profile} avatarSrc={avatarSrc} tierColor={tc} />
      <XPGraph scoringLog={scoringLog} />
      <GradeTable scoringLog={scoringLog} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        <ChainViz meta={meta} scoringLog={scoringLog} />
        <ClassBreakdown currentClass={profile.class} meta={meta} />
      </div>
      <Milestones milestones={profile.milestones} />
      <TokenEfficiency scoringLog={scoringLog} costMap={costMap} />
    </div>
  )
}
