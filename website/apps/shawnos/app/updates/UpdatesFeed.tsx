'use client'

import { useState } from 'react'
import Link from 'next/link'

/* ── types ────────────────────────────────────────── */

export interface FeedEntry {
  id: string
  title: string
  description: string
  href: string
  date: string
  categoryKey: string
  categoryLabel: string
  categoryColor: string
}

export interface CategoryFilter {
  key: string
  label: string
  color: string
  count: number
}

/* ── styles ────────────────────────────────────────── */

const filterRow: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  marginBottom: '20px',
}

const filterPill = (
  color: string,
  active: boolean
): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '11px',
  fontWeight: 600,
  color: active ? '#000' : color,
  background: active ? color : 'transparent',
  border: `1px solid ${active ? color : `${color}44`}`,
  borderRadius: '20px',
  padding: '4px 12px',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  letterSpacing: '0.03em',
  whiteSpace: 'nowrap',
})

const pillCount: React.CSSProperties = {
  fontSize: '10px',
  opacity: 0.7,
}

const feedList: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
}

const feedItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  padding: '14px 16px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  textDecoration: 'none',
  transition: 'border-color 0.15s ease',
}

const feedItemContent: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
}

const feedItemTitle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text-primary)',
  lineHeight: 1.3,
  marginBottom: '4px',
}

const feedItemDesc: React.CSSProperties = {
  fontSize: '12px',
  lineHeight: 1.5,
  color: 'var(--text-secondary)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}

const feedItemMeta: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '6px',
}

const feedItemDate: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  whiteSpace: 'nowrap',
}

const catBadge = (color: string): React.CSSProperties => ({
  display: 'inline-block',
  fontSize: '9px',
  fontWeight: 700,
  color,
  border: `1px solid ${color}44`,
  borderRadius: '3px',
  padding: '1px 6px',
  letterSpacing: '0.06em',
  whiteSpace: 'nowrap',
})

const emptyState: React.CSSProperties = {
  padding: '32px',
  textAlign: 'center',
  color: 'var(--text-muted)',
  fontSize: '13px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
}

const showingCount: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--text-muted)',
  marginBottom: '12px',
}

/* ── component ────────────────────────────────────── */

export default function UpdatesFeed({
  entries,
  categories,
}: {
  entries: FeedEntry[]
  categories: CategoryFilter[]
}) {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const filtered =
    activeFilters.size === 0
      ? entries
      : entries.filter((e) => activeFilters.has(e.categoryKey))

  return (
    <>
      {/* Filter pills */}
      <div style={filterRow}>
        <button
          onClick={() => setActiveFilters(new Set())}
          style={filterPill('var(--accent)', activeFilters.size === 0)}
        >
          All <span style={pillCount}>{entries.length}</span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => toggleFilter(cat.key)}
            style={filterPill(cat.color, activeFilters.has(cat.key))}
          >
            {cat.label} <span style={pillCount}>{cat.count}</span>
          </button>
        ))}
      </div>

      {/* Result count */}
      <div style={showingCount}>
        {filtered.length} of {entries.length} items
        {activeFilters.size > 0 && (
          <button
            onClick={() => setActiveFilters(new Set())}
            style={{
              marginLeft: '8px',
              fontSize: '11px',
              color: 'var(--accent)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontFamily: 'inherit',
            }}
          >
            clear filters
          </button>
        )}
      </div>

      {/* Feed list */}
      <div style={feedList}>
        {filtered.length === 0 ? (
          <div style={emptyState}>No content matches the current filters.</div>
        ) : (
          filtered.map((entry) => (
            <Link key={entry.id} href={entry.href} style={feedItemStyle}>
              <div style={feedItemContent}>
                <div style={feedItemTitle}>{entry.title}</div>
                <div style={feedItemDesc}>{entry.description}</div>
                <div style={feedItemMeta}>
                  <span style={catBadge(entry.categoryColor)}>
                    {entry.categoryLabel}
                  </span>
                  <span style={feedItemDate}>{entry.date}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  )
}
