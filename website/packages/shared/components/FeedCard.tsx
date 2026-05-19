'use client'

import Image from 'next/image'
import type { CSSProperties, MouseEvent } from 'react'
import type { TimelineItem } from '../lib/timeline'
import { GlowingEffect } from './ui/glowing-effect'
import { RelativeTime } from './RelativeTime'
import { SourceBadge } from './SourceBadge'

interface FeedCardProps {
  item: TimelineItem
}

const ExternalArrow = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    style={{ marginLeft: 6, opacity: 0.5, flexShrink: 0 }}
  >
    <path d="M7 17L17 7" />
    <path d="M8 7h9v9" />
  </svg>
)

export function FeedCard({ item }: FeedCardProps) {
  const card: CSSProperties = {
    position: 'relative',
    display: 'block',
    padding: '18px 20px',
    borderRadius: 16,
    border: '1px solid var(--canvas-border, var(--border, rgba(255,255,255,0.10)))',
    background: 'var(--canvas-subtle)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'border-color 0.2s ease, background 0.2s ease',
    overflow: 'hidden',
  }

  const onEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.borderColor = 'var(--accent)'
  }
  const onLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.borderColor =
      'var(--canvas-border, var(--border, rgba(255,255,255,0.10)))'
  }

  const externalProps = item.isExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <a
      href={item.href}
      {...externalProps}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={card}
    >
      {item.isFresh && (
        <GlowingEffect variant="silver" disabled={false} spread={32} proximity={64} />
      )}

      <header
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          marginBottom: 10,
        }}
      >
        <Image
          src={item.author.avatar}
          alt={item.author.name}
          width={40}
          height={40}
          style={{
            borderRadius: '50%',
            border: '1px solid var(--canvas-border, var(--border, rgba(255,255,255,0.10)))',
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexWrap: 'wrap',
              lineHeight: 1.2,
            }}
          >
            <span
              style={{
                fontWeight: 600,
                fontSize: 14,
                color: 'var(--text-primary)',
              }}
            >
              {item.author.name}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              {item.author.handle}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>·</span>
            <RelativeTime timestamp={item.timestamp} />
          </div>
        </div>
        <SourceBadge label={item.badge.label} source={item.badge.source} />
      </header>

      <h3
        style={{
          margin: '0 0 6px',
          fontSize: 16,
          fontWeight: 600,
          lineHeight: 1.35,
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        <span style={{ flex: 1 }}>{item.title}</span>
        {item.isExternal && ExternalArrow}
      </h3>

      {item.body && (
        <p
          style={{
            margin: '0 0 12px',
            fontSize: 14,
            lineHeight: 1.55,
            color: 'var(--text-secondary, var(--text-muted))',
          }}
        >
          {item.body}
        </p>
      )}

      {item.meta && (
        <footer
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 12,
            color: 'var(--text-muted)',
            paddingTop: 6,
          }}
        >
          {typeof item.meta.readingTime === 'number' && (
            <span>{item.meta.readingTime} min read</span>
          )}
          {typeof item.meta.karma === 'number' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
              {item.meta.karma}
            </span>
          )}
          {typeof item.meta.comments === 'number' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              {item.meta.comments}
            </span>
          )}
        </footer>
      )}
    </a>
  )
}
