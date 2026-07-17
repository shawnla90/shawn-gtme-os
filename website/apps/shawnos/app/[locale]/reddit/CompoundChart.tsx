'use client'

import React from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Point = { date: string; views: number; posts: number }

/**
 * Views earned by posts that were ALREADY OLD when tracking started.
 *
 * The cohort split is the whole point. Every post in this series predates the
 * first snapshot, so nothing here is the normal new-post ramp — it is work
 * already done, still paying. Mixing in fresh posts would let a couple of them
 * carry the curve and turn a real claim into a flattering one.
 */
export function CompoundChart({
  series,
  windowStart,
}: {
  series: Point[]
  windowStart: string
}) {
  if (!series?.length) return null

  const base = series[0].views
  const data = series.map((p) => ({
    date: p.date.slice(5), // MM-DD
    gained: p.views - base,
    total: p.views,
  }))
  const gained = data[data.length - 1].gained

  const fmt = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n)

  return (
    <figure className="rr-chart">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
          <defs>
            <linearGradient id="rrFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--rr-accent)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--rr-accent)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="var(--border)"
            strokeDasharray="2 4"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
            minTickGap={24}
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <Tooltip
            cursor={{ stroke: 'var(--rr-accent)', strokeWidth: 1 }}
            contentStyle={{
              background: 'var(--canvas-subtle)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              fontSize: 13,
            }}
            labelStyle={{ color: 'var(--text-secondary)' }}
            formatter={(v) => [
              `+${Number(v).toLocaleString()} views`,
              'since tracking began',
            ]}
          />
          <Area
            type="monotone"
            dataKey="gained"
            stroke="var(--rr-accent)"
            strokeWidth={2}
            fill="url(#rrFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <figcaption className="rr-caption">
        every post in this chart was already published before {windowStart}, when
        snapshotting started. none of this is a new post finding its audience.
        it is {gained.toLocaleString()} views arriving on work that was already
        done, over 20 days, while I posted nothing new into it.
      </figcaption>
    </figure>
  )
}
