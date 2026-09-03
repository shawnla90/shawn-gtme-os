import React from 'react'

/**
 * Same contract as the Reddit report's frame: every chart carries its asOf
 * stamp and a caption that says what the chart does NOT prove. A flattering
 * chart without that line is the thing this page exists to avoid.
 */
export function ChartFrame({
  title,
  caption,
  asOf,
  children,
}: {
  title: string
  caption: React.ReactNode
  asOf: string
  children: React.ReactNode
}) {
  return (
    <figure className="tk-chart">
      <div className="tk-chart-head">
        <p className="tk-chart-title">{title}</p>
        <span className="tk-chart-asof">as of {asOf}</span>
      </div>
      {children}
      <figcaption className="tk-caption">{caption}</figcaption>
    </figure>
  )
}
