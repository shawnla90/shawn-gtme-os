import React from 'react'

interface PostCardProps {
  title: string
  date: string
  excerpt: string
  slug: string
  readingTime?: number
  category?: string
}

export function PostCard({ title, date, excerpt, slug, readingTime, category }: PostCardProps) {
  return (
    <article
      style={{
        padding: '20px 0',
        borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <a
        href={`/blog/${slug}`}
        style={{
          color: 'var(--accent)',
          fontSize: '18px',
          fontWeight: 600,
          textDecoration: 'none',
          lineHeight: 1.3,
        }}
      >
        {title}
      </a>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '6px',
          flexWrap: 'wrap',
        }}
      >
        <time
          dateTime={date}
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          {date}
        </time>

        {readingTime !== undefined && (
          <>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>·</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {readingTime} min read
            </span>
          </>
        )}

        {category && (
          <span
            style={{
              fontSize: '11px',
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
              borderRadius: '3px',
              padding: '1px 6px',
              letterSpacing: '0.4px',
              opacity: 0.75,
            }}
          >
            {category}
          </span>
        )}
      </div>

      <p
        style={{
          marginTop: '8px',
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}
      >
        {excerpt}
      </p>
      <a
        href={`/blog/${slug}`}
        style={{
          fontSize: '13px',
          color: 'var(--accent)',
          textDecoration: 'none',
        }}
      >
        read more &rarr;
      </a>
    </article>
  )
}
