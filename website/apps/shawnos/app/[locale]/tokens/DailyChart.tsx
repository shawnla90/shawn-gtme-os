'use client'

import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { fmtDate, fmtInt, fmtTok, fmtUsd, PLAN_TONE, type Day, type Plan } from './tokensData'

type Mode = 'claude' | 'codex'

type Point = {
  d: string
  plan: string
  cache: number | null
  other: number | null
  nonCache: number | null
  codex: number | null
  prompts: number | null
  usd: number | null
  gap: boolean
  turns: number | null
  codexTurns: number | null
}

export function DailyChart({ daily, plans, gap }: { daily: Day[]; plans: Plan[]; gap: { start: string; end: string } }) {
  const [mode, setMode] = useState<Mode>('claude')
  const data = useMemo<Point[]>(
    () =>
      daily.map((r) => ({
        d: r.d,
        plan: r.plan,
        cache: r.cache_read,
        other: r.tokens != null && r.cache_read != null ? r.tokens - r.cache_read : null,
        nonCache: r.non_cache,
        codex: r.codex_tokens,
        prompts: r.prompts,
        usd: r.api_usd,
        gap: r.gap,
        turns: r.turns,
        codexTurns: r.codex_turns,
      })),
    [daily],
  )
  const monthStarts = data.filter((p) => p.d.endsWith('-01')).map((p) => p.d)
  const first = data[0]?.d
  const last = data[data.length - 1]?.d

  return (
    <div className="tk-daily">
      <div className="tk-toggle" role="tablist" aria-label="Tool">
        {(['claude', 'codex'] as Mode[]).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            className={mode === m ? 'is-on' : ''}
            onClick={() => setMode(m)}
            type="button"
          >
            {m === 'claude' ? 'Claude Code' : 'Codex'}
          </button>
        ))}
        <span className="tk-toggle-note">
          {mode === 'claude'
            ? 'stacked: cache reads under everything else. Before Jul 16 only the thin line (input + output) exists.'
            : 'Codex rollouts, cached input included. Logs start Jul 16.'}
        </span>
      </div>
      <div className="tk-chart-scroll">
        <div className="tk-chart-min">
          <ResponsiveContainer width="100%" height={360}>
            <AreaChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="tkCache" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--aura)" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="var(--aura)" stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="color-mix(in srgb, var(--text-primary) 10%, transparent)" />
              {plans.map((p) => (
                <ReferenceArea
                  key={p.plan}
                  x1={p.start < (first ?? p.start) ? first : p.start}
                  x2={p.end > (last ?? p.end) ? last : p.end}
                  fill={PLAN_TONE[p.plan] ?? 'rgba(109,94,233,0.1)'}
                  fillOpacity={0.35}
                  strokeOpacity={0}
                  label={{ value: p.plan, position: 'insideTopLeft', fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                />
              ))}
              <ReferenceArea
                x1={gap.start}
                x2={gap.end}
                fill="color-mix(in srgb, var(--text-primary) 12%, transparent)"
                strokeOpacity={0}
                label={{ value: 'no data', position: 'insideBottom', fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
              />
              <XAxis
                dataKey="d"
                ticks={monthStarts}
                tickFormatter={(v: string) => fmtDate(v).replace(/ \d+$/, '')}
                tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis
                tickFormatter={(v: number) => fmtTok(v)}
                tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <Tooltip content={<Tip mode={mode} />} cursor={{ stroke: 'var(--text-muted)', strokeDasharray: '3 3' }} />
              {mode === 'claude' ? (
                <>
                  <Area type="monotone" dataKey="cache" stackId="t" stroke="var(--aura)" strokeWidth={1.2} fill="url(#tkCache)" connectNulls={false} isAnimationActive={false} />
                  <Area
                    type="monotone"
                    dataKey="other"
                    stackId="t"
                    stroke="var(--text-primary)"
                    strokeWidth={1}
                    fill="color-mix(in srgb, var(--text-primary) 35%, transparent)"
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="nonCache"
                    stroke="var(--text-secondary)"
                    strokeWidth={1}
                    strokeDasharray="2 3"
                    fill="transparent"
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                </>
              ) : (
                <Area type="monotone" dataKey="codex" stroke="var(--text-primary)" strokeWidth={1.2} fill="color-mix(in srgb, var(--text-primary) 25%, transparent)" connectNulls={false} isAnimationActive={false} />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function Tip({ active, payload, mode }: { active?: boolean; payload?: { payload: Point }[]; mode: Mode }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  const total = p.cache != null && p.other != null ? p.cache + p.other : null
  return (
    <div className="tk-tip">
      <p className="tk-tip-date">
        {fmtDate(p.d)} <span>{p.plan}</span>
      </p>
      {mode === 'claude' ? (
        <>
          {total != null ? (
            <>
              <p>
                <b>{fmtTok(total)}</b> tokens · {fmtUsd(p.usd)} at list
              </p>
              <p>{p.cache != null && total ? `${((p.cache / total) * 100).toFixed(0)}% cache reads` : ''} · {fmtInt(p.turns)} turns</p>
            </>
          ) : p.gap ? (
            <p>no token data for this day</p>
          ) : (
            <p>
              <b>{fmtTok(p.nonCache)}</b> input + output (cache not tracked before Jul 16)
            </p>
          )}
          {p.prompts != null && <p>{fmtInt(p.prompts)} prompts typed</p>}
        </>
      ) : p.codex != null ? (
        <p>
          <b>{fmtTok(p.codex)}</b> Codex tokens · {fmtInt(p.codexTurns)} turns
        </p>
      ) : (
        <p>no Codex activity</p>
      )}
    </div>
  )
}
