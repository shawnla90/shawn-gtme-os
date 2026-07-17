'use client'

import React from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartFrame } from './ChartFrame'

type Week = { weekStart: string; comments: number; posts: number }
type Era = { era: string; comments: number; posts: number }

/**
 * Weekly comments vs posts. The flagship: it proves the section it sits in.
 *
 * "Comments first, posts later" is the claim the whole ramp section rests on,
 * and this is that claim as a shape. Week one is 30 comments and no posts at
 * all. The ratio walks from there.
 *
 * The caption does not say the ratio inverted and stayed inverted, because it
 * did not: it touches 0.1:1 for one week in late June and comes back. Stating
 * the trend as permanent would be the flattering read, not the true one.
 */
export function RampChart({
  series,
  eras,
  clearboxFrom,
  asOf,
  compact = false,
}: {
  series: Week[]
  eras: Era[]
  clearboxFrom: string | null
  asOf: string
  compact?: boolean
}) {
  if (!series?.length) return null

  const data = series.map((w) => ({
    week: w.weekStart.slice(5), // MM-DD
    full: w.weekStart,
    comments: w.comments,
    posts: w.posts,
  }))

  const first = series[0]
  const karma = eras.find((e) => e.era === 'karma-building')
  const clearbox = eras.find((e) => e.era === 'clearbox')
  const ratio = (e?: Era) =>
    e && e.posts ? `${(e.comments / e.posts).toFixed(1)}:1` : null

  // the era boundary lands inside a week; mark the week that contains it
  const boundaryWeek = clearboxFrom
    ? [...series].reverse().find((w) => w.weekStart <= clearboxFrom)
    : undefined

  const chart = (
    <ResponsiveContainer width="100%" height={compact ? 150 : 320}>
      <AreaChart
        data={data}
        margin={{ top: 8, right: 12, bottom: 4, left: compact ? -18 : 4 }}
      >
        <defs>
          <linearGradient id="rrRampC" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--rr-accent)" stopOpacity={0.34} />
            <stop offset="100%" stopColor="var(--rr-accent)" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
        <XAxis
          dataKey="week"
          tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
          minTickGap={compact ? 40 : 20}
        />
        <YAxis
          tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={compact ? 28 : 40}
        />
        {boundaryWeek && !compact && (
          <ReferenceLine
            x={boundaryWeek.weekStart.slice(5)}
            stroke="var(--text-secondary)"
            strokeDasharray="3 3"
            label={{
              value: 'clearbox era',
              position: 'insideTopRight',
              fill: 'var(--text-secondary)',
              fontSize: 11,
            }}
          />
        )}
        <Tooltip
          cursor={{ stroke: 'var(--rr-accent)', strokeWidth: 1 }}
          contentStyle={{
            background: 'var(--canvas-subtle)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            fontSize: 13,
          }}
          labelStyle={{ color: 'var(--text-secondary)' }}
          labelFormatter={(l) => `week of ${l}`}
        />
        <Area
          type="monotone"
          dataKey="comments"
          stackId="1"
          stroke="var(--rr-accent)"
          strokeWidth={2}
          fill="url(#rrRampC)"
          name="comments"
        />
        <Area
          type="monotone"
          dataKey="posts"
          stackId="1"
          stroke="var(--text-secondary)"
          strokeWidth={1.5}
          fill="var(--text-secondary)"
          fillOpacity={0.16}
          name="posts"
        />
      </AreaChart>
    </ResponsiveContainer>
  )

  if (compact) return chart

  return (
    <ChartFrame
      title="comments vs posts, by week"
      asOf={asOf}
      caption={
        <>
          week one, {first.weekStart}: {first.comments} comments and{' '}
          {first.posts} posts. across the karma-building era the account ran{' '}
          {karma?.comments} comments to {karma?.posts} posts ({ratio(karma)}),
          and across the clearbox era {clearbox?.comments} to {clearbox?.posts}{' '}
          ({ratio(clearbox)}). what this does not show is a clean inversion: the
          ratio dips to 0.1:1 in the week of 2026-06-23 and returns to 1.7:1 the
          week after. the eras are the trend, the weeks are noisy.
        </>
      }
    >
      {chart}
    </ChartFrame>
  )
}
