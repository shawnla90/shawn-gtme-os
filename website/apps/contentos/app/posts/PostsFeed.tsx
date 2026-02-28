'use client'

import React, { useState } from 'react'

/* -- types --------------------------------------------------------- */

interface InspiredBy {
  author: string
  summary: string
  url: string
  engagement: { likes?: number; comments?: number }
}

export interface PostEntry {
  id: number
  title: string
  hook: string
  body: string
  cta: string
  tags: string[]
  inspired_by: InspiredBy | null
  anti_slop_score: number
  platform: string
}

export interface PostsData {
  date: string
  generated_count: number
  avg_anti_slop_score: number
  posts: PostEntry[]
}

interface PostsFeedProps {
  data: PostsData
  availableDates: string[]
}

/* -- styles -------------------------------------------------------- */

const cardStyle: React.CSSProperties = {
  padding: '20px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  marginBottom: '16px',
  transition: 'border-color 0.15s ease',
}

const hookStyle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  lineHeight: 1.4,
  marginBottom: '12px',
}

const bodyStyle: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.7,
  color: 'var(--text-secondary)',
  marginBottom: '12px',
  whiteSpace: 'pre-wrap',
}

const ctaStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--accent)',
  marginBottom: '12px',
  fontStyle: 'italic',
}

const tagPill: React.CSSProperties = {
  display: 'inline-block',
  padding: '2px 8px',
  fontSize: '10px',
  color: 'var(--accent)',
  background: 'rgba(var(--accent-rgb, 249, 115, 22), 0.1)',
  border: '1px solid rgba(var(--accent-rgb, 249, 115, 22), 0.2)',
  borderRadius: '4px',
  marginRight: '6px',
  marginBottom: '4px',
}

const sourceStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--text-muted)',
  marginTop: '8px',
  paddingTop: '8px',
  borderTop: '1px solid var(--border)',
}

const copyBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 10px',
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--accent)',
  background: 'transparent',
  border: '1px solid var(--accent)',
  borderRadius: '4px',
  cursor: 'pointer',
  fontFamily: 'var(--font-mono)',
  transition: 'background 0.15s ease',
}

const slopBadge = (score: number): React.CSSProperties => ({
  display: 'inline-block',
  fontSize: '10px',
  fontWeight: 700,
  color: score >= 90 ? '#4ade80' : score >= 70 ? '#facc15' : '#f87171',
  border: `1px solid ${score >= 90 ? '#4ade8044' : score >= 70 ? '#facc1544' : '#f8717144'}`,
  borderRadius: '3px',
  padding: '1px 6px',
  letterSpacing: '0.04em',
})

const dateNavStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
  marginBottom: '24px',
}

const dateBtnStyle = (active: boolean): React.CSSProperties => ({
  padding: '6px 12px',
  fontSize: '12px',
  fontWeight: active ? 700 : 400,
  color: active ? 'var(--accent)' : 'var(--text-muted)',
  background: active ? 'rgba(var(--accent-rgb, 249, 115, 22), 0.1)' : 'transparent',
  border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
  borderRadius: '4px',
  cursor: 'pointer',
  fontFamily: 'var(--font-mono)',
  textDecoration: 'none',
})

/* -- component ----------------------------------------------------- */

export function PostsFeed({ data, availableDates }: PostsFeedProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const handleCopy = async (post: PostEntry) => {
    const text = `${post.body}\n\n${post.cta}`
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(post.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopiedId(post.id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  return (
    <div>
      {/* Date navigation */}
      {availableDates.length > 1 && (
        <div style={dateNavStyle}>
          {availableDates.slice(0, 7).map((d) => (
            <a
              key={d}
              href={`/posts?date=${d}`}
              style={dateBtnStyle(d === data.date)}
            >
              {d}
            </a>
          ))}
        </div>
      )}

      {/* Posts */}
      {data.posts.map((post) => {
        const isExpanded = expandedId === post.id
        const bodyPreview = post.body.length > 300 && !isExpanded
          ? post.body.slice(0, 300) + '...'
          : post.body

        return (
          <div key={post.id} style={cardStyle}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Post #{post.id}
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={slopBadge(post.anti_slop_score)}>
                  {post.anti_slop_score}% clean
                </span>
                <button
                  style={copyBtn}
                  onClick={() => handleCopy(post)}
                >
                  {copiedId === post.id ? 'copied' : 'copy'}
                </button>
              </div>
            </div>

            {/* Hook */}
            <div style={hookStyle}>{post.hook}</div>

            {/* Body */}
            <div style={bodyStyle}>{bodyPreview}</div>

            {post.body.length > 300 && !isExpanded && (
              <button
                onClick={() => setExpandedId(post.id)}
                style={{
                  ...copyBtn,
                  marginBottom: '12px',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                }}
              >
                show full post
              </button>
            )}

            {isExpanded && (
              <button
                onClick={() => setExpandedId(null)}
                style={{
                  ...copyBtn,
                  marginBottom: '12px',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                }}
              >
                collapse
              </button>
            )}

            {/* CTA */}
            {post.cta && <div style={ctaStyle}>{post.cta}</div>}

            {/* Tags */}
            <div style={{ marginBottom: '4px' }}>
              {post.tags.map((tag) => (
                <span key={tag} style={tagPill}>{tag}</span>
              ))}
            </div>

            {/* Source attribution */}
            {post.inspired_by && (
              <div style={sourceStyle}>
                Inspired by {post.inspired_by.author}
                {post.inspired_by.summary && `: "${post.inspired_by.summary.slice(0, 60)}..."`}
                {post.inspired_by.url && (
                  <>
                    {' '}
                    <a
                      href={post.inspired_by.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--accent)', textDecoration: 'none' }}
                    >
                      source
                    </a>
                  </>
                )}
                {(post.inspired_by.engagement.likes ?? 0) > 0 && (
                  <span style={{ marginLeft: '8px' }}>
                    {post.inspired_by.engagement.likes} likes, {post.inspired_by.engagement.comments ?? 0} comments
                  </span>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
