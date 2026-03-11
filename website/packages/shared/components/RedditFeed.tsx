'use client'

import { useState } from 'react'
import { StaggerContainer, StaggerItem } from './motion'
import type { RedditPost } from '../lib/reddit'

export type { RedditPost } from '../lib/reddit'

interface RedditFeedProps {
  posts: RedditPost[]
  subredditName?: string
  accentColor?: string
}

function timeAgo(utc: number): string {
  const seconds = Math.floor(Date.now() / 1000 - utc)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

function truncate(text: string, maxLen = 180): string {
  if (!text) return ''
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).trimEnd() + '...'
}

export function RedditFeed({
  posts,
  subredditName = 'GTMBuilders',
  accentColor = '#4ADE80',
}: RedditFeedProps) {
  const flairs = Array.from(new Set(posts.map((p) => p.flair).filter(Boolean))) as string[]
  const [activeFlair, setActiveFlair] = useState<string | null>(null)

  const filtered = activeFlair ? posts.filter((p) => p.flair === activeFlair) : posts

  return (
    <div style={{ padding: '0 0 48px' }}>
      {/* Flair filters */}
      {flairs.length > 1 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          <button
            onClick={() => setActiveFlair(null)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: `1px solid ${!activeFlair ? accentColor : 'rgba(255,255,255,0.15)'}`,
              background: !activeFlair ? `${accentColor}22` : 'transparent',
              color: !activeFlair ? accentColor : 'rgba(255,255,255,0.6)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            All
          </button>
          {flairs.map((flair) => (
            <button
              key={flair}
              onClick={() => setActiveFlair(flair === activeFlair ? null : flair)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: `1px solid ${activeFlair === flair ? accentColor : 'rgba(255,255,255,0.15)'}`,
                background: activeFlair === flair ? `${accentColor}22` : 'transparent',
                color: activeFlair === flair ? accentColor : 'rgba(255,255,255,0.6)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {flair}
            </button>
          ))}
        </div>
      )}

      {/* Post grid */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '64px 20px',
            color: 'rgba(255,255,255,0.4)',
            fontSize: 14,
          }}
        >
          No posts yet. Be the first to contribute on{' '}
          <a
            href={`https://reddit.com/r/${subredditName}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: accentColor }}
          >
            r/{subredditName}
          </a>
        </div>
      ) : (
        <StaggerContainer
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 16,
          }}
        >
          {filtered.map((post) => (
            <StaggerItem key={post.id}>
              <a
                href={`https://reddit.com${post.permalink}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  padding: 20,
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${accentColor}44`
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                }}
              >
                {/* Flair + time */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 10,
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.4)',
                  }}
                >
                  {post.flair && (
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: `${accentColor}22`,
                        color: accentColor,
                        fontWeight: 600,
                        fontSize: 10,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {post.flair}
                    </span>
                  )}
                  <span>{timeAgo(post.createdUtc)}</span>
                </div>

                {/* Title */}
                <h3
                  style={{
                    margin: '0 0 8px',
                    fontSize: 15,
                    fontWeight: 600,
                    lineHeight: 1.4,
                    color: 'rgba(255,255,255,0.9)',
                  }}
                >
                  {post.title}
                </h3>

                {/* Preview text */}
                {post.selftext && (
                  <p
                    style={{
                      margin: '0 0 14px',
                      fontSize: 13,
                      lineHeight: 1.5,
                      color: 'rgba(255,255,255,0.45)',
                    }}
                  >
                    {truncate(post.selftext)}
                  </p>
                )}

                {/* Footer: author, score, comments */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.35)',
                  }}
                >
                  <span style={{ fontWeight: 500 }}>u/{post.author}</span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2">
                      <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                    {post.score}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    {post.numComments}
                  </span>
                </div>
              </a>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  )
}
