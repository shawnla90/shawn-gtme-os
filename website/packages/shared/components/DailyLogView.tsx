import React from 'react'
import type {
  DailyLog,
  Accomplishment,
  PipelineDraft,
  TokenEntry,
  Todo,
  PlatformBreakdown,
} from '../lib/logs'

/* ------------------------------------------------------------------ */
/*  Color constants — mapped from Pillow palette to CSS / inline      */
/* ------------------------------------------------------------------ */

const GREEN = '#4EC373'
const PURPLE = '#A078DC'
const AMBER = '#DCA83C'
const CYAN = '#50BEDC'
const RED = '#E05555'
const GOLD = '#FFC83C'
const MUTED = '#484F58'

/** Map letter grade to color. */
function gradeColor(grade: string): string {
  if (grade === 'S+') return '#FF6B35'   // Orange-gold for S+
  if (grade === 'S') return GOLD         // Gold for S
  if (grade.startsWith('A')) return GREEN
  if (grade.startsWith('B')) return CYAN
  if (grade.startsWith('C')) return AMBER
  return RED
}

/** Map accomplishment/pipeline type to a tag color. */
function typeColor(type: string): string {
  if (type.startsWith('linkedin')) return CYAN
  if (type.startsWith('x_') || type === 'x') return '#C9D1D9'
  if (type.startsWith('substack')) return PURPLE
  if (type.startsWith('reddit')) return '#FF6B35'
  if (type.startsWith('skill')) return GREEN
  if (type.startsWith('workflow')) return GREEN
  if (type.startsWith('lead_magnet')) return AMBER
  if (type === 'cursor_rule') return AMBER
  if (type === 'manual') return CYAN
  return '#8B949E'
}

/** Short label for accomplishment types. */
function typeLabel(type: string): string {
  const map: Record<string, string> = {
    linkedin_draft: 'LI draft',
    linkedin_final: 'LI FINAL',
    x_draft: 'X draft',
    x_final: 'X FINAL',
    substack_draft: 'SUB draft',
    substack_final: 'SUB FINAL',
    reddit_draft: 'RD draft',
    reddit_final: 'RD FINAL',
    skill_updated: 'Skill',
    workflow_updated: 'Workflow',
    lead_magnet: 'Lead magnet',
    cursor_rule: 'Rule',
    manual: 'Manual',
  }
  return map[type] ?? type.replace(/_/g, ' ')
}

/** Map platform breakdown keys to display label & color. */
function platformDisplay(key: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    linkedin: { label: 'LIN', color: CYAN },
    x: { label: 'X', color: '#C9D1D9' },
    substack: { label: 'SUB', color: PURPLE },
    reddit: { label: 'RED', color: '#FF6B35' },
    infra: { label: 'INF', color: GREEN },
    other: { label: 'OTH', color: '#8B949E' },
  }
  return map[key] ?? { label: key.toUpperCase().slice(0, 3), color: '#8B949E' }
}

/** Format YYYY-MM-DD as "Friday, Feb 13 2026". */
function formatDateLong(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Format large numbers with K/M suffix. */
function compactNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function GradeBadge({ grade }: { grade: string }) {
  const bg = gradeColor(grade)
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
        color: '#0D1117',
        fontWeight: 800,
        fontSize: '16px',
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {grade}
    </span>
  )
}

function StatBox({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div
      style={{
        flex: '1 1 0',
        minWidth: '80px',
        background: 'var(--canvas-subtle)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '12px 14px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '22px',
          fontWeight: 700,
          color: color ?? 'var(--text-primary)',
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
          textTransform: 'lowercase',
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </div>
    </div>
  )
}

function PlatformBar({ breakdown }: { breakdown: PlatformBreakdown }) {
  const keys = Object.keys(breakdown).sort(
    (a, b) => breakdown[b] - breakdown[a],
  )
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
        padding: '10px 0',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.03em',
      }}
    >
      {keys.map((k, i) => {
        const { label, color } = platformDisplay(k)
        return (
          <React.Fragment key={k}>
            {i > 0 && (
              <span style={{ color: MUTED, fontSize: '10px' }}>|</span>
            )}
            <span>
              <span style={{ color }}>{label}</span>
              <span style={{ color: 'var(--text-secondary)' }}>
                :{breakdown[k]}
              </span>
            </span>
          </React.Fragment>
        )
      })}
    </div>
  )
}

function TypeTag({ type }: { type: string }) {
  const color = typeColor(type)
  const label = typeLabel(type)
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '10px',
        fontWeight: 600,
        color: '#0D1117',
        background: color,
        padding: '1px 6px',
        borderRadius: '3px',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        lineHeight: 1.5,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

function AccomplishmentRow({ item }: { item: Accomplishment }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '8px',
        padding: '4px 0',
        fontSize: '13px',
        lineHeight: 1.5,
      }}
    >
      <span
        style={{
          color: 'var(--text-muted)',
          fontSize: '11px',
          flexShrink: 0,
          width: '42px',
          textAlign: 'right',
        }}
      >
        {item.timestamp}
      </span>
      <TypeTag type={item.type} />
      <span
        style={{
          color: 'var(--text-primary)',
          flexShrink: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {item.title}
      </span>
      {item.words != null && (
        <span
          style={{
            color: 'var(--text-muted)',
            fontSize: '11px',
            flexShrink: 0,
            marginLeft: 'auto',
          }}
        >
          {item.words.toLocaleString()}w
        </span>
      )}
    </div>
  )
}

function PipelineRow({ item }: { item: PipelineDraft }) {
  const { label, color } = platformDisplay(item.platform)
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '8px',
        padding: '4px 0',
        fontSize: '13px',
        lineHeight: 1.5,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          fontSize: '10px',
          fontWeight: 600,
          color: '#0D1117',
          background: color,
          padding: '1px 6px',
          borderRadius: '3px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          lineHeight: 1.5,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: 'var(--text-primary)',
          flexShrink: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {item.title}
      </span>
      {item.target_date && (
        <span
          style={{
            color: 'var(--text-muted)',
            fontSize: '11px',
            flexShrink: 0,
          }}
        >
          {item.target_date.slice(5)}
        </span>
      )}
      {item.words != null && (
        <span
          style={{
            color: 'var(--text-muted)',
            fontSize: '11px',
            flexShrink: 0,
            marginLeft: 'auto',
          }}
        >
          {item.words.toLocaleString()}w
        </span>
      )}
    </div>
  )
}

function TodoRow({ item }: { item: Todo }) {
  const done = item.status === 'done'
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '8px',
        padding: '3px 0',
        fontSize: '13px',
        color: done ? 'var(--text-muted)' : 'var(--text-primary)',
        textDecoration: done ? 'line-through' : 'none',
      }}
    >
      <span style={{ flexShrink: 0 }}>{done ? '\u2713' : '\u25CB'}</span>
      <span>{item.task}</span>
      {item.priority === 'high' && (
        <span style={{ color: RED, fontSize: '11px', fontWeight: 600 }}>
          HIGH
        </span>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Token Usage Panel                                                  */
/* ------------------------------------------------------------------ */

function TokenUsagePanel({ entries }: { entries: TokenEntry[] }) {
  // Aggregate totals
  const totalInput = entries.reduce((s, e) => s + e.input_tokens, 0)
  const totalOutput = entries.reduce((s, e) => s + e.output_tokens, 0)
  const totalCacheRead = entries.reduce((s, e) => s + e.cache_read_tokens, 0)
  const totalCacheWrite = entries.reduce((s, e) => s + e.cache_write_tokens, 0)
  const totalAll = totalInput + totalOutput + totalCacheRead + totalCacheWrite
  const totalCost = entries.reduce((s, e) => s + (e.cost ?? 0), 0)
  const sessions = entries.length

  // Model breakdown
  const byModel: Record<string, number> = {}
  for (const e of entries) {
    const key = e.model
    byModel[key] =
      (byModel[key] ?? 0) +
      e.input_tokens +
      e.output_tokens +
      e.cache_read_tokens +
      e.cache_write_tokens
  }

  return (
    <div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
        {entries.filter((e) => e.source === 'claude-code').length} exact |{' '}
        {entries.filter((e) => e.source === 'cursor-estimate').length} est
      </div>

      <TokenStat label="Sessions" value={String(sessions)} />
      <TokenStat label="Input" value={compactNum(totalInput)} color={GREEN} />
      <TokenStat label="Output" value={compactNum(totalOutput)} color={PURPLE} />
      <TokenStat
        label="Cache"
        value={`${compactNum(totalCacheRead)} / ${compactNum(totalCacheWrite)}`}
        color={CYAN}
      />
      <TokenStat label="Total" value={compactNum(totalAll)} color="var(--text-primary)" />
      <TokenStat
        label="Cost"
        value={`$${totalCost.toFixed(2)}`}
        color={AMBER}
      />

      {/* Model breakdown */}
      <div
        style={{
          marginTop: '14px',
          paddingTop: '10px',
          borderTop: `1px solid var(--border)`,
          fontSize: '11px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        BY MODEL
      </div>
      {Object.entries(byModel).map(([model, tokens]) => (
        <div
          key={model}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            padding: '2px 0',
          }}
        >
          <span style={{ color: PURPLE, textTransform: 'uppercase' }}>
            {model}
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>
            {compactNum(tokens)}
          </span>
        </div>
      ))}

      {/* Session log */}
      <div
        style={{
          marginTop: '14px',
          paddingTop: '10px',
          borderTop: `1px solid var(--border)`,
          fontSize: '11px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        SESSION LOG
      </div>
      {entries.map((e, i) => (
        <div
          key={i}
          style={{
            fontSize: '11px',
            padding: '2px 0',
            color: 'var(--text-secondary)',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>
            {e.source === 'cursor-estimate' ? '<cursor estimate>' : e.context ?? e.source}
          </span>
          {' '}
          <span style={{ color: e.model === 'opus' ? PURPLE : CYAN }}>
            {e.model}
          </span>
          {e.cost != null && (
            <span style={{ color: AMBER }}> ${e.cost.toFixed(2)}</span>
          )}
        </div>
      ))}
    </div>
  )
}

function TokenStat({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color?: string
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '2px 0',
        fontSize: '13px',
      }}
    >
      <span style={{ color: 'var(--text-secondary)' }}>{label}:</span>
      <span style={{ fontWeight: 600, color: color ?? 'var(--text-primary)' }}>
        {value}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Panel wrapper                                                      */
/* ------------------------------------------------------------------ */

function Panel({
  title,
  count,
  children,
}: {
  title: string
  count?: number
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        background: 'var(--canvas-subtle)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '16px 18px',
        flex: '1 1 0',
        minWidth: '280px',
        overflow: 'hidden',
      }}
    >
      <h3
        style={{
          margin: '0 0 12px',
          fontSize: '13px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--text-primary)',
        }}
      >
        {title}
        {count != null && (
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            {' '}
            ({count})
          </span>
        )}
      </h3>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface DailyLogViewProps {
  log: DailyLog
  /** Previous / next date strings for navigation. */
  prevDate?: string | null
  nextDate?: string | null
  /** Base path, e.g. "/log" */
  basePath?: string
}

export function DailyLogView({
  log,
  prevDate,
  nextDate,
  basePath = '/log',
}: DailyLogViewProps) {
  const { stats, accomplishments, pipeline, todos, token_usage, git_summary } =
    log
  const gc = gradeColor(stats.letter_grade)

  // Compute some derived stats
  const totalTokens =
    token_usage.reduce(
      (s, e) =>
        s +
        e.input_tokens +
        e.output_tokens +
        e.cache_read_tokens +
        e.cache_write_tokens,
      0,
    )
  const totalCost = token_usage.reduce((s, e) => s + (e.cost ?? 0), 0)

  return (
    <>
      <style>{`
        .dlv-nav-link {
          color: var(--accent);
          font-size: 13px;
          text-decoration: none;
          transition: opacity 0.15s ease;
        }
        .dlv-nav-link:hover { opacity: 0.8; }
        .dlv-panels {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        @media (max-width: 900px) {
          .dlv-panels { flex-direction: column; }
        }
        .dlv-stat-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
      `}</style>

      <div
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-primary)',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* ============ HEADER ============ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <h1
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
              }}
            >
              DAILY TRACKER
            </h1>
            <GradeBadge grade={stats.letter_grade} />
            <span
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: gc,
              }}
            >
              {stats.output_score} pts
            </span>
          </div>

          <time
            dateTime={log.date}
            style={{
              fontSize: '16px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
            }}
          >
            {formatDateLong(log.date)}
          </time>
        </div>

        {/* ============ STAT BOXES ============ */}
        <div className="dlv-stat-row" style={{ marginBottom: '10px' }}>
          <StatBox label="shipped" value={accomplishments.length} color={GREEN} />
          <StatBox label="finalized" value={stats.finals_count} color={stats.finals_count > 0 ? GREEN : undefined} />
          <StatBox
            label="pending"
            value={todos.filter((t) => t.status === 'pending').length}
            color={todos.filter((t) => t.status === 'pending').length > 0 ? AMBER : undefined}
          />
          <StatBox label="in pipeline" value={pipeline.drafts_active.length} />
          <StatBox label="words today" value={stats.words_today.toLocaleString()} color={CYAN} />
          <StatBox label="commits" value={git_summary.commits_today} />
          <StatBox label="files touched" value={git_summary.files_touched ?? 0} />
          <StatBox label="tokens" value={compactNum(totalTokens)} color={PURPLE} />
          <StatBox
            label="est. cost"
            value={`$${totalCost.toFixed(2)}`}
            color={PURPLE}
          />
          {stats.roi_multiplier != null && (
            <StatBox label="ROI" value={`${stats.roi_multiplier.toLocaleString()}x`} color={GOLD} />
          )}
          {stats.ship_rate != null && (
            <StatBox label="ship rate" value={`${stats.ship_rate}%`} color={GREEN} />
          )}
        </div>

        {/* ============ PLATFORM BAR ============ */}
        <PlatformBar breakdown={stats.platform_breakdown} />

        {/* ============ SCORE BREAKDOWN (small) ============ */}
        <div
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            marginBottom: '16px',
          }}
        >
          {stats.score_breakdown
            .filter((s) => s.points >= 10)
            .map((s) => `${s.title} +${s.points}`)
            .join(' \u00B7 ')}
          {stats.score_breakdown.filter((s) => s.points >= 10).length > 0 &&
            ' \u00B7 '}
          ...{' '}
          <span style={{ color: gc }}>
            = {stats.output_score} pts
          </span>
        </div>

        {/* ============ THREE-COLUMN PANELS ============ */}
        <div className="dlv-panels">
          {/* --- Accomplishments --- */}
          <Panel title="Accomplishments" count={accomplishments.length}>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {accomplishments.map((a, i) => (
                <AccomplishmentRow key={i} item={a} />
              ))}
            </div>
          </Panel>

          {/* --- Next Up (Pipeline + TODOs) --- */}
          <Panel title="Next Up">
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                marginBottom: '8px',
              }}
            >
              PIPELINE ({pipeline.drafts_active.length} drafts,{' '}
              {stats.pipeline_words.toLocaleString()}w)
            </div>
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {pipeline.drafts_active.map((d, i) => (
                <PipelineRow key={i} item={d} />
              ))}
            </div>

            {pipeline.finalized_today.length > 0 && (
              <>
                <div
                  style={{
                    fontSize: '11px',
                    color: GREEN,
                    fontWeight: 600,
                    margin: '12px 0 6px',
                    textTransform: 'uppercase',
                  }}
                >
                  Finalized Today
                </div>
                {pipeline.finalized_today.map((d, i) => (
                  <PipelineRow key={i} item={d} />
                ))}
              </>
            )}

            {todos.length > 0 && (
              <>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    margin: '14px 0 6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  TODOs
                </div>
                {todos.map((t) => (
                  <TodoRow key={t.id} item={t} />
                ))}
              </>
            )}
          </Panel>

          {/* --- Analytics (Economics + Efficiency + Token Usage) --- */}
          <Panel title={stats.agent_cost != null ? 'Analytics' : 'Token Usage'}>
            {stats.agent_cost != null && (
              <>
                {/* ---- ECONOMICS ---- */}
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                    fontWeight: 600,
                  }}
                >
                  ECONOMICS
                </div>

                <TokenStat
                  label="Agent cost"
                  value={`$${stats.agent_cost.toFixed(2)}`}
                  color={PURPLE}
                />
                {stats.dev_equivalent_cost != null && (
                  <TokenStat
                    label="Dev equivalent"
                    value={`$${stats.dev_equivalent_cost.toLocaleString()}`}
                    color={GREEN}
                  />
                )}
                {stats.cost_savings != null && (
                  <TokenStat
                    label="Savings"
                    value={`$${stats.cost_savings.toLocaleString()}`}
                    color={GREEN}
                  />
                )}
                {stats.roi_multiplier != null && (
                  <TokenStat
                    label="ROI"
                    value={`${stats.roi_multiplier.toLocaleString()}x`}
                    color={GOLD}
                  />
                )}

                {/* LOC breakdown */}
                {(stats.code_loc != null ||
                  stats.content_loc != null ||
                  stats.data_loc != null) && (
                  <div
                    style={{
                      marginTop: '10px',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '4px',
                      }}
                    >
                      OUTPUT BREAKDOWN
                    </div>
                    {stats.code_loc != null && (
                      <TokenStat
                        label="Code LOC"
                        value={stats.code_loc.toLocaleString()}
                        color={CYAN}
                      />
                    )}
                    {stats.content_loc != null && (
                      <TokenStat
                        label="Content words"
                        value={stats.content_loc.toLocaleString()}
                        color={CYAN}
                      />
                    )}
                    {stats.data_loc != null && (
                      <TokenStat
                        label="Data LOC"
                        value={stats.data_loc.toLocaleString()}
                        color={CYAN}
                      />
                    )}
                  </div>
                )}

                {/* ---- EFFICIENCY ---- */}
                <div
                  style={{
                    marginTop: '14px',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border)',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                    fontWeight: 600,
                  }}
                >
                  EFFICIENCY
                </div>

                {stats.ship_rate != null && (
                  <TokenStat
                    label="Ship rate"
                    value={`${stats.ship_rate}%`}
                    color={GREEN}
                  />
                )}
                {stats.agent_cost > 0 && (
                  <>
                    <TokenStat
                      label="pts/$"
                      value={(stats.output_score / stats.agent_cost).toFixed(1)}
                      color={AMBER}
                    />
                    <TokenStat
                      label="words/$"
                      value={Math.round(
                        stats.words_today / stats.agent_cost,
                      ).toLocaleString()}
                      color={AMBER}
                    />
                    {(stats.code_loc != null || stats.data_loc != null) && (
                      <TokenStat
                        label="LOC/$"
                        value={Math.round(
                          ((stats.code_loc ?? 0) + (stats.data_loc ?? 0)) /
                            stats.agent_cost,
                        ).toLocaleString()}
                        color={AMBER}
                      />
                    )}
                    {accomplishments.length > 0 && (
                      <TokenStat
                        label="cost/item"
                        value={`$${(stats.agent_cost / accomplishments.length).toFixed(2)}`}
                        color={AMBER}
                      />
                    )}
                  </>
                )}

                {/* ---- TOKEN USAGE section header ---- */}
                <div
                  style={{
                    marginTop: '14px',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border)',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                    fontWeight: 600,
                  }}
                >
                  TOKEN USAGE
                </div>
              </>
            )}
            <TokenUsagePanel entries={token_usage} />
          </Panel>
        </div>

        {/* ============ SUMMARY LINE ============ */}
        {stats.agent_cost != null && (
          <div
            style={{
              marginTop: '18px',
              padding: '10px 14px',
              background: 'var(--canvas-subtle)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              textAlign: 'center',
              letterSpacing: '0.02em',
            }}
          >
            <span style={{ color: CYAN }}>
              {stats.words_today.toLocaleString()}w
            </span>
            {' + '}
            <span style={{ color: CYAN }}>
              {((stats.code_loc ?? 0) + (stats.data_loc ?? 0)).toLocaleString()} LOC
            </span>
            {' + '}
            <span style={{ color: gc }}>
              {stats.output_score} pts
            </span>
            {' for '}
            <span style={{ color: PURPLE }}>
              ${stats.agent_cost.toFixed(2)}
            </span>
            {stats.dev_equivalent_cost != null && (
              <>
                {' (dev equiv: '}
                <span style={{ color: GREEN }}>
                  ${stats.dev_equivalent_cost.toLocaleString()}
                </span>
                {stats.roi_multiplier != null && (
                  <>
                    {' | '}
                    <span style={{ color: GOLD }}>
                      {stats.roi_multiplier.toLocaleString()}x ROI
                    </span>
                  </>
                )}
                {')'}
              </>
            )}
          </div>
        )}

        {/* ============ FOOTER ============ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border)',
            fontSize: '11px',
            color: 'var(--text-muted)',
          }}
        >
          {/* Prev / Next nav */}
          <div style={{ display: 'flex', gap: '16px' }}>
            {prevDate ? (
              <a href={`${basePath}/${prevDate}`} className="dlv-nav-link">
                &larr; {prevDate}
              </a>
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                &larr; oldest
              </span>
            )}
            {nextDate ? (
              <a href={`${basePath}/${nextDate}`} className="dlv-nav-link">
                {nextDate} &rarr;
              </a>
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                latest &rarr;
              </span>
            )}
          </div>

          {/* Generation info */}
          <div>
            generated {log.generated_at.slice(0, 16).replace('T', ' ')} | v
            {log.version} auto-tokens + scoring | built with Cursor + Claude
            Code
          </div>

          {/* Active window */}
          {stats.first_activity && stats.last_activity && (
            <div>
              active {stats.first_activity} &ndash; {stats.last_activity}
              {stats.efficiency_rating != null && (
                <span style={{ color: GREEN }}>
                  {' '}
                  | efficiency: {stats.efficiency_rating} pts/s
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
