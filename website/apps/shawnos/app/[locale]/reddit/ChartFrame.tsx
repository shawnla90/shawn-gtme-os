import React from 'react'

/**
 * The wrapper every chart on this page uses.
 *
 * One frame so the four charts read as one instrument, and so the two things
 * a chart on this page must carry are structural rather than remembered: the
 * asOf stamp, and a caption stating what the chart does NOT prove — its n,
 * its window, its cohort. The compound chart's cohort note is the standard to
 * match: it exists because the same chart without it would have been a
 * flattering one.
 *
 * A figure takes at most one figcaption, so the head is a plain div.
 */
export function ChartFrame({
  title,
  caption,
  asOf,
  children,
}: {
  title: string
  /** what it does not prove, not a restatement of the title */
  caption: React.ReactNode
  asOf: string
  children: React.ReactNode
}) {
  return (
    <figure className="rr-chart">
      <div className="rr-chart-head">
        <p className="rr-chart-title">{title}</p>
        <span className="rr-chart-asof">as of {asOf}</span>
      </div>
      {children}
      <figcaption className="rr-caption">{caption}</figcaption>
    </figure>
  )
}
