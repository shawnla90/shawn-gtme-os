'use client'

import React, { useState } from 'react'

/* -- types --------------------------------------------------------- */

interface InspiredBy {
  author: string
  summary: string
  url: string
  engagement: { likes?: number; comments?: number }
}

export interface RemixVariant {
  label: string
  hook: string
  body: string
  cta: string
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
  remixes?: RemixVariant[]
  tones?: { builder: string; advisor: string; provocateur: string }
  platforms?: { linkedin: string; x: string; newsletter: string }
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

const controlBar: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
  alignItems: 'center',
  marginBottom: '12px',
  paddingBottom: '10px',
  borderBottom: '1px solid var(--border)',
}

const controlGroup: React.CSSProperties = {
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
}

const controlLabel: React.CSSProperties = {
  fontSize: '9px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--text-muted)',
  marginRight: '4px',
}

const controlPill = (active: boolean): React.CSSProperties => ({
  padding: '3px 8px',
  fontSize: '10px',
  fontWeight: active ? 700 : 400,
  color: active ? 'var(--accent)' : 'var(--text-muted)',
  background: active ? 'rgba(var(--accent-rgb, 249, 115, 22), 0.12)' : 'transparent',
  border: `1px solid ${active ? 'rgba(var(--accent-rgb, 249, 115, 22), 0.3)' : 'var(--border)'}`,
  borderRadius: '3px',
  cursor: 'pointer',
  fontFamily: 'var(--font-mono)',
  transition: 'all 0.15s ease',
})

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
  const [viewMode, setViewMode] = useState<Record<number, string>>({})

  const setMode = (postId: number, mode: string) => {
    setViewMode(prev => ({ ...prev, [postId]: prev[postId] === mode ? 'original' : mode }))
  }

  const getDisplayContent = (post: PostEntry) => {
    const mode = viewMode[post.id] || 'original'
    let hook = post.hook
    let body = post.body
    let cta = post.cta

    if (mode.startsWith('remix-')) {
      const idx = parseInt(mode.split('-')[1])
      const remix = post.remixes?.[idx]
      if (remix) { hook = remix.hook; body = remix.body; cta = remix.cta }
    } else if (mode.startsWith('tone-')) {
      const tone = mode.split('-')[1] as 'builder' | 'advisor' | 'provocateur'
      body = post.tones?.[tone] || post.body
    } else if (mode.startsWith('platform-')) {
      const plat = mode.split('-')[1] as 'linkedin' | 'x' | 'newsletter'
      body = post.platforms?.[plat] || post.body
    }
    return { hook, body, cta }
  }

  const handleCopy = async (post: PostEntry) => {
    const { body, cta } = getDisplayContent(post)
    const text = `${body}\n\n${cta}`
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
      {/* Disclaimer */}
      <div style={{
        padding: '14px 16px',
        marginBottom: '20px',
        background: 'rgba(var(--accent-rgb, 249, 115, 22), 0.06)',
        border: '1px solid rgba(var(--accent-rgb, 249, 115, 22), 0.15)',
        borderRadius: '6px',
        fontSize: '12px',
        lineHeight: 1.6,
        color: 'var(--text-secondary)',
      }}>
        <span style={{ fontWeight: 700, color: 'var(--accent)' }}>heads up:</span>{' '}
        these posts are AI-generated creative fiction. the angles, stories, and numbers are fabricated
        from trending topics, not real events. they blend voice patterns and narrative structures to
        spark ideas. don&apos;t copy-paste verbatim. use them as raw material, spin them your own way,
        or just browse for fun.
      </div>

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
        const mode = viewMode[post.id] || 'original'
        const { hook: displayHook, body: displayBody, cta: displayCta } = getDisplayContent(post)
        const isExpanded = expandedId === post.id
        const bodyPreview = displayBody.length > 300 && !isExpanded
          ? displayBody.slice(0, 300) + '...'
          : displayBody
        const hasVariations = !!(post.remixes?.length || post.tones || post.platforms)

        return (
          <div key={post.id} style={cardStyle}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Post #{post.id}
                {mode !== 'original' && (
                  <span style={{ marginLeft: '8px', color: 'var(--accent)', fontSize: '9px' }}>
                    [{mode.replace('-', ': ')}]
                  </span>
                )}
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

            {/* Variation controls */}
            {hasVariations && (
              <div style={controlBar}>
                {post.remixes && post.remixes.length > 0 && (
                  <div style={controlGroup}>
                    <span style={controlLabel}>remix</span>
                    <button style={controlPill(mode === 'original' || mode.startsWith('tone-') || mode.startsWith('platform-'))} onClick={() => setMode(post.id, 'original')}>original</button>
                    {post.remixes.map((r, i) => (
                      <button key={i} style={controlPill(mode === `remix-${i}`)} onClick={() => setMode(post.id, `remix-${i}`)}>
                        {r.label || `remix ${i + 1}`}
                      </button>
                    ))}
                  </div>
                )}
                {post.tones && (
                  <div style={controlGroup}>
                    <span style={controlLabel}>tone</span>
                    {(['builder', 'advisor', 'provocateur'] as const).map(t => (
                      <button
                        key={t}
                        style={controlPill(t === 'builder' ? !mode.startsWith('tone-') && !mode.startsWith('remix-') && !mode.startsWith('platform-') : mode === `tone-${t}`)}
                        onClick={() => setMode(post.id, t === 'builder' ? 'original' : `tone-${t}`)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
                {post.platforms && (
                  <div style={controlGroup}>
                    <span style={controlLabel}>format</span>
                    {(['linkedin', 'x', 'newsletter'] as const).map(p => (
                      <button
                        key={p}
                        style={controlPill(p === 'linkedin' ? !mode.startsWith('platform-') && !mode.startsWith('remix-') && !mode.startsWith('tone-') : mode === `platform-${p}`)}
                        onClick={() => setMode(post.id, p === 'linkedin' ? 'original' : `platform-${p}`)}
                      >
                        {p === 'x' ? '\ud835\udd4f' : p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Hook */}
            <div style={hookStyle}>{displayHook}</div>

            {/* Body */}
            <div style={bodyStyle}>{bodyPreview}</div>

            {displayBody.length > 300 && !isExpanded && (
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
            {displayCta && <div style={ctaStyle}>{displayCta}</div>}

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
