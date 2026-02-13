import React from 'react'

interface PostCardProps {
  title: string
  date: string
  excerpt: string
  slug: string
}

export function PostCard({ title, date, excerpt, slug }: PostCardProps) {
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
      <time
        dateTime={date}
        style={{
          display: 'block',
          marginTop: '6px',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}
      >
        {date}
      </time>
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
