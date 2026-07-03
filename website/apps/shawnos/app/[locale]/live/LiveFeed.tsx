'use client'

import { useState } from 'react'
import { StaggerContainer, StaggerItem } from '@shawnos/shared/components'
import type { RedditPost } from '@shawnos/shared/lib/reddit'

interface NewsItem {
  title: string
  url: string
  author: string
  source: string
  summary: string
  category: string
  thumbnailUrl: string
  engagement: string
  discoveredAt: string
  hnUrl?: string
  language?: string | null
  siteName?: string
  ogDescription?: string
}

interface LiveFeedProps {
  newsItems: NewsItem[]
  redditPosts: RedditPost[]
  subredditName: string
}

type Tab = 'ai-news' | 'community'

const CATEGORY_STYLES: Record<string, { color: string; label: string }> = {
  'ai-news': { color: '#60a5fa', label: 'AI News' },
  'builder-tools': { color: '#c084fc', label: 'Builder Tools' },
  'repos': { color: '#4ade80', label: 'Repos' },
  'shipped': { color: '#fb923c', label: 'Shipped' },
}

const SOURCE_ICONS: Record<string, string> = {
  x: '𝕏',
  github: '⊙',
  hn: '⌸',
  web: '◎',
  producthunt: '▲',
}

function timeAgo(utcOrIso: number | string): string {
  const seconds = typeof utcOrIso === 'number'
    ? Math.floor(Date.now() / 1000 - utcOrIso)
    : Math.floor((Date.now() - new Date(utcOrIso).getTime()) / 1000)
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

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function NewsCard({ item }: { item: NewsItem }) {
  const cat = CATEGORY_STYLES[item.category] || CATEGORY_STYLES['ai-news']
  const sourceIcon = SOURCE_ICONS[item.source] || '◎'
  const sourceName = item.source === 'github' ? 'GitHub' : item.source === 'hn' ? 'Hacker News' : item.source === 'web' ? (item.siteName || getDomain(item.url)) : item.source
  const hasThumbnail = !!item.thumbnailUrl

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="live-news-card"
      style={{
        display: 'block',
        borderRadius: 12,
        border: '1px solid var(--border)',
        background: 'var(--canvas-subtle)',
        textDecoration: 'none',
        color: 'inherit',
        overflow: 'hidden',
      }}
    >
      {/* OG Thumbnail embed */}
      {hasThumbnail && (
        <div
          style={{
            width: '100%',
            aspectRatio: '1.91/1',
            background: 'var(--canvas)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.thumbnailUrl}
            alt=""
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            onError={(e) => {
              (e.currentTarget.parentElement as HTMLElement).style.display = 'none'
            }}
          />
        </div>
      )}

      <div style={{ padding: '16px 20px 20px' }}>
        {/* Source bar — site name + category + time */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 10,
            fontSize: 11,
            color: 'var(--text-muted)',
          }}
        >
          <span style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 13 }}>{sourceIcon}</span>
            {sourceName}
          </span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span
            style={{
              padding: '1px 6px',
              borderRadius: 3,
              background: `${cat.color}18`,
              color: cat.color,
              fontWeight: 600,
              fontSize: 9,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {cat.label}
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 10 }}>{timeAgo(item.discoveredAt)}</span>
        </div>

        {/* Title */}
        <h3
          style={{
            margin: '0 0 8px',
            fontSize: 15,
            fontWeight: 700,
            lineHeight: 1.4,
            color: 'var(--text-primary)',
          }}
        >
          {item.title}
        </h3>

        {/* Summary — the "why it matters" brief */}
        {item.summary && (
          <p
            style={{
              margin: '0 0 12px',
              fontSize: 13,
              lineHeight: 1.55,
              color: 'var(--text-secondary)',
            }}
          >
            {truncate(item.summary, 220)}
          </p>
        )}

        {/* Footer: author + engagement + language + HN link */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 11,
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontWeight: 500 }}>{item.author}</span>
          {item.engagement && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <span style={{ fontSize: 9, opacity: 0.5 }}>|</span>
              {item.engagement}
            </span>
          )}
          {item.language && (
            <span
              style={{
                padding: '1px 6px',
                borderRadius: 3,
                background: 'var(--canvas)',
                fontSize: 9,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
              }}
            >
              {item.language}
            </span>
          )}
          {item.hnUrl && (
            <span
              style={{
                marginLeft: 'auto',
                fontSize: 11,
                color: '#fb923c',
                fontWeight: 600,
              }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.open(item.hnUrl, '_blank')
              }}
              onKeyDown={() => {}}
              role="link"
              tabIndex={0}
            >
              HN discussion &rarr;
            </span>
          )}
        </div>
      </div>
    </a>
  )
}

function CommunityCard({ post, accentColor }: { post: RedditPost; accentColor: string }) {
  return (
    <a
      href={`https://reddit.com${post.permalink}`}
      target="_blank"
      rel="noopener noreferrer"
      className="live-news-card"
      style={{
        display: 'block',
        padding: 20,
        borderRadius: 10,
        border: '1px solid var(--border)',
        background: 'var(--canvas-subtle)',
        textDecoration: 'none',
        color: 'inherit',
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
          color: 'var(--text-muted)',
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
        {post.stickied && (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 4,
              background: 'rgba(251, 146, 60, 0.15)',
              color: '#fb923c',
              fontWeight: 600,
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Pinned
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
          color: 'var(--text-primary)',
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
            color: 'var(--text-secondary)',
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
          color: 'var(--text-muted)',
        }}
      >
        <span style={{ fontWeight: 500 }}>u/{post.author}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          {post.score}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          {post.numComments}
        </span>
      </div>
    </a>
  )
}

export default function LiveFeed({ newsItems, redditPosts, subredditName }: LiveFeedProps) {
  const [activeTab, setActiveTab] = useState<Tab>('ai-news')
  const accentColor = '#4ADE80'

  const tabStyle = (tab: Tab): React.CSSProperties => ({
    padding: '8px 20px',
    borderRadius: 20,
    border: `1px solid ${activeTab === tab ? 'var(--accent)' : 'var(--border)'}`,
    background: activeTab === tab ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'transparent',
    color: activeTab === tab ? 'var(--accent)' : 'var(--text-secondary)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'var(--font-mono)',
    whiteSpace: 'nowrap' as const,
  })

  return (
    <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>
      {/* Sticky tabs */}
      <div className="live-tabs">
        <div
          style={{
            display: 'flex',
            gap: 8,
            maxWidth: 960,
            margin: '0 auto',
          }}
        >
          <button onClick={() => setActiveTab('ai-news')} style={tabStyle('ai-news')}>
            AI News{newsItems.length > 0 && ` (${newsItems.length})`}
          </button>
          <button onClick={() => setActiveTab('community')} style={tabStyle('community')}>
            Community{redditPosts.length > 0 && ` (${redditPosts.length})`}
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div style={{ paddingTop: 24 }}>
        {activeTab === 'ai-news' && (
          <>
            {newsItems.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '64px 20px',
                  color: 'var(--text-muted)',
                  fontSize: 14,
                }}
              >
                No AI news items yet. The scout runs every 6 hours.
              </div>
            ) : (
              <StaggerContainer
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: 16,
                }}
              >
                {newsItems.map((item, i) => (
                  <StaggerItem key={item.url || i}>
                    <NewsCard item={item} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </>
        )}

        {activeTab === 'community' && (
          <>
            {redditPosts.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '64px 20px',
                  color: 'var(--text-muted)',
                  fontSize: 14,
                }}
              >
                No community posts yet. Be the first to contribute on{' '}
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
                {redditPosts.map((post) => (
                  <StaggerItem key={post.id}>
                    <CommunityCard post={post} accentColor={accentColor} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </>
        )}
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: 64,
          textAlign: 'center',
          padding: '48px 24px',
          borderRadius: 12,
          border: '1px dashed var(--border)',
          background: 'var(--canvas-subtle)',
        }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: '0 0 24px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          Builder-led growth starts here.
        </h2>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href={`https://reddit.com/r/${subredditName}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              borderRadius: 8,
              border: '1px solid var(--accent)',
              background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
              color: 'var(--accent)',
              fontWeight: 700,
              fontSize: 14,
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              transition: 'all 0.2s',
            }}
          >
            Join r/{subredditName}
          </a>
          <a
            href={`https://reddit.com/r/${subredditName}/submit`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              transition: 'all 0.2s',
            }}
          >
            Post on Reddit
          </a>
        </div>
      </div>
    </section>
  )
}
