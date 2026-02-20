'use client'

import { useState } from 'react'
import Link from 'next/link'

/* ── types ────────────────────────────────────────── */

export interface SearchItem {
  title: string
  description: string
  href: string
  type: string
}

/* ── styles ────────────────────────────────────────── */

const searchWrap: React.CSSProperties = {
  position: 'relative',
  marginBottom: '24px',
}

const searchInput: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px 12px 36px',
  fontSize: '14px',
  fontFamily: 'inherit',
  color: 'var(--text-primary)',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  outline: 'none',
  transition: 'border-color 0.15s ease',
  boxSizing: 'border-box' as const,
}

const searchIcon: React.CSSProperties = {
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '14px',
  color: 'var(--text-muted)',
  pointerEvents: 'none',
}

const clearBtn: React.CSSProperties = {
  position: 'absolute',
  right: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '11px',
  color: 'var(--text-muted)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  padding: '2px 6px',
}

const resultCount: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--text-muted)',
  marginBottom: '16px',
}

const groupHeading: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--accent)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  marginBottom: '8px',
  marginTop: '24px',
}

const resultCard: React.CSSProperties = {
  display: 'block',
  padding: '12px 16px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  textDecoration: 'none',
  transition: 'border-color 0.15s ease',
  marginBottom: '4px',
}

const resultTitle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text-primary)',
  lineHeight: 1.3,
  marginBottom: '4px',
}

const resultDesc: React.CSSProperties = {
  fontSize: '12px',
  lineHeight: 1.5,
  color: 'var(--text-secondary)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical' as const,
}

const emptyState: React.CSSProperties = {
  padding: '32px',
  textAlign: 'center',
  color: 'var(--text-muted)',
  fontSize: '13px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
}

const hintText: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-muted)',
  lineHeight: 1.6,
}

/* ── component ────────────────────────────────────── */

export default function SearchContent({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState('')

  const q = query.toLowerCase().trim()

  const filtered = q
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      )
    : []

  /* group results by type */
  const grouped: Record<string, SearchItem[]> = {}
  for (const item of filtered) {
    if (!grouped[item.type]) grouped[item.type] = []
    grouped[item.type].push(item)
  }

  return (
    <>
      {/* Search input */}
      <div style={searchWrap}>
        <span style={searchIcon}>&#8981;</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search everything..."
          style={searchInput}
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery('')} style={clearBtn}>
            clear
          </button>
        )}
      </div>

      {/* Results or hint */}
      {!q ? (
        <div style={hintText}>
          <p>
            search across {items.length} entries — how-to guides, knowledge
            terms, wiki entries, blog posts, and daily logs.
          </p>
          <p style={{ marginTop: '8px' }}>start typing to find anything.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={emptyState}>
          no results for &ldquo;{query}&rdquo;
        </div>
      ) : (
        <>
          <div style={resultCount}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </div>

          {Object.entries(grouped).map(([type, results]) => (
            <div key={type}>
              <div style={groupHeading}>
                {type} ({results.length})
              </div>
              {results.map((item) => (
                <Link key={item.href} href={item.href} style={resultCard}>
                  <div style={resultTitle}>{item.title}</div>
                  <div style={resultDesc}>{item.description}</div>
                </Link>
              ))}
            </div>
          ))}
        </>
      )}
    </>
  )
}
