'use client'

import { useState } from 'react'
import Link from 'next/link'

/* ── types ────────────────────────────────────────── */

export interface SearchItem {
  title: string
  description: string
  href: string
  type: string
  category: string
  keywords: string[]
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

const categoryBadge: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '10px',
  fontFamily: 'inherit',
  color: 'var(--accent)',
  border: '1px solid var(--accent)',
  borderRadius: '3px',
  padding: '1px 6px',
  marginTop: '6px',
  letterSpacing: '0.03em',
  textTransform: 'lowercase' as const,
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

const countRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '12px',
  color: 'var(--text-secondary)',
  padding: '4px 0',
  borderBottom: '1px solid var(--border)',
}

const countLabel: React.CSSProperties = {
  color: 'var(--text-secondary)',
}

const countValue: React.CSSProperties = {
  color: 'var(--accent)',
  fontWeight: 600,
}

/* ── component ────────────────────────────────────── */

export default function SearchContent({
  items,
  categoryCounts,
}: {
  items: SearchItem[]
  categoryCounts: Record<string, number>
}) {
  const [query, setQuery] = useState('')

  const q = query.toLowerCase().trim()

  const filtered = q
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.toLowerCase().includes(q)),
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
          placeholder="search content wiki and how-to guides..."
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
          <p style={{ marginBottom: '16px' }}>
            search across {items.length} entries — content wiki and how-to
            guides.
          </p>
          <div
            style={{
              background: 'var(--canvas-subtle)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '12px 16px',
              marginBottom: '16px',
            }}
          >
            {Object.entries(categoryCounts).map(([label, count]) => (
              <div key={label} style={countRow}>
                <span style={countLabel}>{label}</span>
                <span style={countValue}>{count}</span>
              </div>
            ))}
          </div>
          <p>start typing to search.</p>
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
                  <span style={categoryBadge}>{item.category}</span>
                </Link>
              ))}
            </div>
          ))}
        </>
      )}
    </>
  )
}
