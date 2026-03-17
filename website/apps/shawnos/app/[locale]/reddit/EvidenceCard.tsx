'use client'

import React, { useState } from 'react'

interface EvidenceProps {
  title: string
  sub: string
  tag: string
  tagColor: string
  upvotes: number
  comments: number
  views: string
  image: string
  lesson: string
  body?: string
}

export function EvidenceCard({
  title,
  sub,
  tag,
  tagColor,
  upvotes,
  comments,
  views,
  image,
  lesson,
  body,
}: EvidenceProps) {
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

        <div style={statsRow}>
          <span style={stat}>
            <span style={statIcon}>↑</span> {upvotes}
          </span>
          <span style={stat}>
            <span style={statIcon}>💬</span> {comments}
          </span>
          <span style={stat}>
            <span style={statIcon}>👁</span> {views}
          </span>
        </div>

        <p style={lessonText}>{lesson}</p>

        <button
          onClick={() => setShowScreenshot(!showScreenshot)}
          style={toggleBtn}
        >
          {showScreenshot ? '▾ hide screenshot' : '▸ view screenshot'}
        </button>
      </div>

      {/* Screenshot — loads on demand */}
      {showScreenshot && (
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
  fontSize: '10px',
  fontWeight: 700,
  color,
  border: `1px solid ${color}44`,
  borderRadius: '4px',
  padding: '2px 8px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
})

const subLabel: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-secondary)',
}

const titleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  margin: '0 0 10px',
  lineHeight: 1.4,
}

const bodyText: React.CSSProperties = {
  fontSize: '14px',
  color: 'var(--text-secondary)',
  lineHeight: 1.65,
  margin: '0 0 14px',
}

const statsRow: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  marginBottom: '12px',
}

const stat: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text-primary)',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
}

const statIcon: React.CSSProperties = {
  fontSize: '12px',
  color: '#FF4500',
}

const lessonText: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
  fontStyle: 'italic',
  margin: '0 0 12px',
  paddingLeft: '12px',
  borderLeft: '2px solid #FF450044',
}

const toggleBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#FF4500',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  padding: '4px 0',
  fontFamily: 'var(--font-mono)',
  transition: 'opacity 0.15s',
}

const screenshotWrap: React.CSSProperties = {
  borderTop: '1px solid var(--border)',
  background: '#000',
}

const screenshotImg: React.CSSProperties = {
  width: '100%',
  display: 'block',
}
