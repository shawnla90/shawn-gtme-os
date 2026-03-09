import React from 'react'
import Link from 'next/link'
import { getNioBlogPost, getNioBlogSlugs } from '../lib/nio-blog'
import { NioPostTracking } from './NioPostTracking'

/* ── styles ───────────────────────────────────────── */

const page: React.CSSProperties = {
  maxWidth: 780,
  margin: '0 auto',
  padding: '40px 20px',
  fontFamily: 'var(--font-mono)',
}

const promptChar: React.CSSProperties = {
  color: 'var(--accent)',
}

const backLink: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '12px',
  color: 'var(--text-muted)',
  textDecoration: 'none',
  marginBottom: '24px',
  opacity: 0.8,
  transition: 'opacity 0.2s',
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '32px 0',
}

const postContainer: React.CSSProperties = {
  padding: '32px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  marginBottom: '32px',
}

const postHeader: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 600,
  color: 'var(--accent)',
  marginBottom: '16px',
  fontFamily: 'var(--font-mono)',
}

const postMeta: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-muted)',
  marginBottom: '24px',
  opacity: 0.7,
}

const postContent: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: 1.7,
  color: 'var(--text-secondary)',
}

/* ── helpers ──────────────────────────────────────── */

function renderMarkdownToHtml(markdown: string) {
  const lines = markdown.split('\n')
  let inList = false

  const html: string[] = []

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (inList) {
        html.push('</ul>')
        inList = false
      }
      html.push(`<h3 style="font-size: 18px; font-weight: 600; color: var(--accent); margin: 32px 0 16px 0; text-transform: uppercase; letter-spacing: 0.06em;">${line.substring(3)}</h3>`)
      continue
    }

    if (line.startsWith('- ')) {
      if (!inList) {
        html.push('<ul style="margin: 12px 0 12px 20px;">')
        inList = true
      }
      html.push(`<li style="margin: 8px 0;">${line.substring(2)}</li>`)
      continue
    }

    if (inList) {
      html.push('</ul>')
      inList = false
    }

    if (line.trim() === '---') {
      html.push('<hr style="border: none; border-top: 1px solid var(--border); margin: 24px 0;" />')
      continue
    }

    if (line.trim() === '') {
      html.push('<br>')
      continue
    }

    const withBold = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--accent);">$1</strong>')
    const withItalic = withBold.replace(/\*(.*?)\*/g, '<em>$1</em>')

    html.push(`<p style="margin: 16px 0;">${withItalic}</p>`)
  }

  if (inList) html.push('</ul>')

  return html.join('')
}

/* ── component ────────────────────────────────────── */

interface NioPostPageProps {
  slug: string
}

export function NioPostPage({ slug }: NioPostPageProps) {
  const post = getNioBlogPost(slug)
  if (!post) return null

  const orderedSlugs = getNioBlogSlugs()
  const currentIndex = orderedSlugs.indexOf(slug)
  const newerSlug = currentIndex > 0 ? orderedSlugs[currentIndex - 1] : null
  const olderSlug = currentIndex >= 0 && currentIndex < orderedSlugs.length - 1 ? orderedSlugs[currentIndex + 1] : null

  return (
    <div style={page}>
      <NioPostTracking slug={slug} title={post.title} />
      <Link href="/vitals/nio-terminal" style={backLink}>
        <span>←</span>
        <span>back to nio.terminal</span>
      </Link>

      <h1
        style={{
          fontSize: '16px',
          fontWeight: 400,
          color: 'var(--text-muted)',
          marginBottom: 8,
        }}
      >
        <span style={promptChar}>$</span> cat ~/nio/posts/{slug}.md
      </h1>
      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginBottom: 32,
          opacity: 0.6,
        }}
      >
        {'> reading AI development log entry'}
      </div>

      <article style={postContainer}>
        <h2 style={postHeader}>{post.title}</h2>
        <div style={postMeta}>
          {post.date} • generated at {post.timestamp}
        </div>
        <div
          style={postContent}
          dangerouslySetInnerHTML={{
            __html: renderMarkdownToHtml(post.content),
          }}
        />
      </article>

      <hr style={divider} />

      <section
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 0',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '12px' }}>
          {newerSlug ? (
            <Link href={`/vitals/nio-terminal/${newerSlug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              ← newer: {newerSlug}
            </Link>
          ) : (
            <span style={{ color: 'var(--text-muted)', opacity: 0.6 }}>this is the latest post</span>
          )}
        </div>
        <div style={{ fontSize: '12px' }}>
          {olderSlug ? (
            <Link href={`/vitals/nio-terminal/${olderSlug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              older: {olderSlug} →
            </Link>
          ) : (
            <span style={{ color: 'var(--text-muted)', opacity: 0.6 }}>this is the first post</span>
          )}
        </div>
      </section>

      <footer
        style={{
          textAlign: 'center',
          fontSize: '11px',
          color: 'var(--text-muted)',
          opacity: 0.6,
          paddingBottom: 24,
          marginTop: 32,
        }}
      >
        nio.terminal/{slug} • daily automated logging active
      </footer>
    </div>
  )
}
