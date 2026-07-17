'use client'

import React, { useState } from 'react'

import { stat, fmtViews } from './reportData'

interface EvidenceProps {
  /** reddit id — every number below is looked up from it. see reportData.stat(). */
  redditId?: string
  title: string
  sub: string
  tag: string
  tagColor: string
  image?: string
  lesson: string
  body?: string
}

export function EvidenceCard({
  redditId,
  title,
  sub,
  tag,
  tagColor,
  image,
  lesson,
  body,
}: EvidenceProps) {
  const s = stat(redditId)
  const [showScreenshot, setShowScreenshot] = useState(false)

  return (
    <div style={card}>
      {/* Text content — always rendered, SEO-friendly */}
      <div style={cardBody}>
        <div style={metaRow}>
          <span style={badge(tagColor)}>{tag}</span>
          <span style={subLabel}>{sub}</span>
        </div>

        <h3 style={titleStyle}>{title}</h3>

        {body && <p style={bodyText}>{body}</p>}

        {/* live from the db. a comment renders no views clause because reddit
            does not report them, not because we forgot. */}
        {s && (
          <div style={statsRow}>
            <span style={statCell}>
              <span style={statIcon}>↑</span> {s.score}
            </span>
            {s.comments != null && (
              <span style={statCell}>
                <span style={statIcon}>💬</span> {s.comments}
              </span>
            )}
            {s.views != null && (
              <span style={statCell}>
                <span style={statIcon}>👁</span> {fmtViews(s.views)}
              </span>
            )}
          </div>
        )}

        <p style={lessonText}>{lesson}</p>

        {image && (
          <button
            onClick={() => setShowScreenshot(!showScreenshot)}
            style={toggleBtn}
          >
            {showScreenshot ? '▾ hide screenshot' : '▸ view screenshot'}
          </button>
        )}
      </div>

      {/* Screenshot — loads on demand */}
      {image && showScreenshot && (
        <div style={screenshotWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={`Screenshot: ${title}`}
            style={screenshotImg}
            loading="lazy"
          />
        </div>
      )}
    </div>
  )
}

/* ── styles ─────────────────────────────────────────── */

const card: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  overflow: 'hidden',
  marginBottom: '20px',
  transition: 'border-color 0.2s',
}

const cardBody: React.CSSProperties = {
  padding: '20px 24px',
}

const metaRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '10px',
}

const badge = (color: string): React.CSSProperties => ({
  display: 'inline-block',
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '10px',
  fontWeight: 600,
  color,
  border: `1px solid ${color}44`,
  borderRadius: '4px',
  padding: '2px 8px',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
})

const subLabel: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '12px',
  fontWeight: 500,
  color: 'var(--text-secondary)',
}

const titleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '18px',
  fontWeight: 500,
  color: 'var(--text-primary)',
  margin: '0 0 12px',
  lineHeight: 1.35,
  letterSpacing: '-0.01em',
}

const bodyText: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '14px',
  fontWeight: 400,
  color: 'var(--text-secondary)',
  lineHeight: 1.65,
  margin: '0 0 14px',
}

const statsRow: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  marginBottom: '12px',
}

const statCell: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '13px',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  color: 'var(--text-primary)',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
}

const statIcon: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--rr-accent)',
}

const lessonText: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '14px',
  fontWeight: 400,
  color: 'var(--text-secondary)',
  lineHeight: 1.55,
  fontStyle: 'italic',
  margin: '0 0 12px',
  paddingLeft: '14px',
  borderLeft: '2px solid color-mix(in srgb, var(--rr-accent) 27%, transparent)',
}

const toggleBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--rr-accent)',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  padding: '4px 0',
  fontFamily: 'var(--font-editorial-body)',
  transition: 'opacity 0.15s',
  letterSpacing: '0.01em',
}

const screenshotWrap: React.CSSProperties = {
  borderTop: '1px solid var(--border)',
  background: '#000',
}

const screenshotImg: React.CSSProperties = {
  width: '100%',
  display: 'block',
}
