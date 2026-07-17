'use client'

import React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartFrame } from './ChartFrame'

/**
 * The two ranked per-sub charts: calibration and conversation.
 *
 * They are one component because they are one argument seen twice. Views and
 * conversation are different products and the sub decides which you get, so
 * the pair only works if both are drawn the same way and read the same way.
 *
 * Every row carries its n. The exporter already refuses to rank a sub with
 * fewer than 3 posts, and the n still shows: a rate on 3 posts and a rate on
 * 48 are not the same fact, and the reader can only tell if the number is on
 * the row.
 */

type Row = { subreddit: string; value: number; n: number; fmt: string }

function Bars({ rows, compact }: { rows: Row[]; compact?: boolean }) {
  const data = rows.map((r) => ({
    name: `r/${r.subreddit}`,
    value: r.value,
    n: r.n,
    fmt: r.fmt,
    label: `${r.fmt}  n=${r.n}`,
  }))
  const max = Math.max(...data.map((d) => d.value))

  return (
    <ResponsiveContainer width="100%" height={compact ? 150 : Math.max(200, rows.length * 38)}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 4, right: 56, bottom: 4, left: 4 }}
        barCategoryGap={compact ? 3 : 8}
      >
        <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" horizontal={false} />
        <XAxis type="number" hide domain={[0, max * 1.3]} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: 'var(--rr-ink)', fontSize: compact ? 10 : 12 }}
          tickLine={false}
          axisLine={false}
          width={compact ? 92 : 132}
        />
        <Tooltip
          cursor={{ fill: 'var(--rr-accent)', fillOpacity: 0.06 }}
          contentStyle={{
            background: 'var(--canvas-subtle)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            fontSize: 13,
          }}
          formatter={(_v, _k, p) => [`${p.payload.fmt} · n=${p.payload.n} posts`, '']}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={compact ? 10 : 18}>
          {data.map((d, i) => (
            // the top row is the point; the rest is the spread it sits in
            <Cell
              key={d.name}
              fill={i === 0 ? 'var(--rr-accent)' : 'var(--text-secondary)'}
              fillOpacity={i === 0 ? 1 : 0.45}
            />
          ))}
          {/* the value AND its n. a rate on 3 posts and a rate on 48 are not
              the same fact, and a tooltip does not count as labelled: it is
              invisible on a phone and in a screenshot. */}
          <LabelList
            dataKey={compact ? 'fmt' : 'label'}
            position="right"
            style={{ fill: 'var(--rr-ink)', fontSize: compact ? 10 : 12, fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function CalibrationChart({
  rows,
  minPosts,
  asOf,
  compact = false,
}: {
  rows: { subreddit: string; posts: number; views: number; score: number; viewsPerUpvote: number }[]
  minPosts: number
  asOf: string
  compact?: boolean
}) {
  if (!rows?.length) return null
  const bars: Row[] = rows.map((r) => ({
    subreddit: r.subreddit,
    value: r.viewsPerUpvote,
    n: r.posts,
    fmt: Math.round(r.viewsPerUpvote).toLocaleString(),
  }))
  const top = rows[0]
  const bottom = rows[rows.length - 1]
  const spread = top.viewsPerUpvote / bottom.viewsPerUpvote

  if (compact) return <Bars rows={bars} compact />

  return (
    <ChartFrame
      title="views per upvote, by subreddit"
      asOf={asOf}
      caption={
        <>
          an upvote is not a unit. one in r/{top.subreddit} rides along with{' '}
          {Math.round(top.viewsPerUpvote).toLocaleString()} views; one in r/
          {bottom.subreddit} rides with {Math.round(bottom.viewsPerUpvote)}, a{' '}
          {spread.toFixed(1)}x spread, which is why comparing raw upvote counts
          across subs measures nothing. posts only: comments carry a score and
          never a view count, so folding them in would divide post views by
          post-and-comment karma. subs under {minPosts} posts are not ranked,
          and the n is on every row: r/{bottom.subreddit} is{' '}
          {bottom.posts} posts, not a law of nature.
        </>
      }
    >
      <Bars rows={bars} />
    </ChartFrame>
  )
}

export function ConversationChart({
  rows,
  minPosts,
  asOf,
  compact = false,
}: {
  rows: { subreddit: string; posts: number; comments: number; perPost: number }[]
  minPosts: number
  asOf: string
  compact?: boolean
}) {
  if (!rows?.length) return null
  const bars: Row[] = rows.map((r) => ({
    subreddit: r.subreddit,
    value: r.perPost,
    n: r.posts,
    // 2dp under 1: at one decimal r/saasbuild's 0.33 and r/ClaudeGTM's 0.25
    // both print "0.3", so two bars carry the same label in different rank
    // positions and the label contradicts the caption
    fmt: r.perPost < 1 ? r.perPost.toFixed(2) : r.perPost.toFixed(1),
  }))
  const top = rows[0]
  const bottom = rows[rows.length - 1]

  if (compact) return <Bars rows={bars} compact />

  return (
    <ChartFrame
      title="comments per post, by subreddit"
      asOf={asOf}
      caption={
        <>
          the same account, the same posts, {(top.perPost / bottom.perPost).toFixed(0)}x
          the conversation. r/{top.subreddit} answers back at {top.perPost.toFixed(1)}{' '}
          comments per post across {top.posts} posts; r/{bottom.subreddit} at{' '}
          {bottom.perPost.toFixed(2)} across {bottom.posts}. read it against the
          calibration chart rather than on its own. views and conversation are
          different products and the sub decides which one you get. subs under{' '}
          {minPosts} posts are not ranked. this counts every comment on the
          thread, mine and other people&apos;s.
        </>
      }
    >
      <Bars rows={bars} />
    </ChartFrame>
  )
}
