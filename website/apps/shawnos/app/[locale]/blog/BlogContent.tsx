'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { PostCard, StaggerContainer, StaggerItem, ScrollRevealSection } from '@shawnos/shared/components'
import { Link } from '../../../i18n/navigation'
import { PageHero } from '../../components/PageHero'

/* ── types ────────────────────────────────────────── */

interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  readingTime?: number
  category?: string
  featured?: boolean
}

/* ── category config ──────────────────────────────── */

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  'gtm-engineering': { label: 'GTM Engineering', color: '#4EC373' },
  'methodology': { label: 'Methodology', color: '#58A6FF' },
  'ships': { label: 'Ships', color: '#D2A8FF' },
  'context-engineering': { label: 'Context Engineering', color: '#FF7B72' },
  'web-development': { label: 'Web Dev', color: '#FFA657' },
  'claude-daily': { label: 'Claude Daily', color: '#79C0FF' },
}

function getCategoryConfig(key?: string) {
  if (!key) return { label: key ?? '', color: 'var(--accent)' }
  return CATEGORY_CONFIG[key] ?? { label: key, color: 'var(--accent)' }
}

/* ── styles ────────────────────────────────────────── */

const sectionSpacing: React.CSSProperties = {
  marginBottom: '48px',
}

const sectionLabel: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  fontFamily: 'var(--font-mono)',
  marginBottom: '16px',
}

const featuredGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '16px',
}

const featuredCard: React.CSSProperties = {
  position: 'relative',
  padding: '24px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  transition: 'border-color 0.2s ease, transform 0.2s ease',
  cursor: 'pointer',
}

const featuredLabel: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  left: '12px',
  fontSize: '9px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--accent)',
  background: 'var(--canvas)',
  border: '1px solid var(--accent)',
  borderRadius: '3px',
  padding: '2px 8px',
  fontFamily: 'var(--font-mono)',
}

const featuredTitle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 600,
  color: 'var(--accent)',
  lineHeight: 1.3,
  marginTop: '20px',
}

const featuredExcerpt: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.5,
  color: 'var(--text-secondary)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}

const featuredMeta: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: 'auto',
  flexWrap: 'wrap',
}

const metaDate: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  fontFamily: 'var(--font-mono)',
  whiteSpace: 'nowrap',
}

const metaSeparator: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--text-muted)',
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

const searchWrap: React.CSSProperties = {
  position: 'relative',
  marginBottom: '12px',
}

const searchInput: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px 10px 36px',
  fontSize: '13px',
  fontFamily: 'var(--font-mono)',
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

const searchClear: React.CSSProperties = {
  position: 'absolute',
  right: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '11px',
  color: 'var(--text-muted)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'var(--font-mono)',
  padding: '2px 6px',
}

const filterRow: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  marginBottom: '16px',
}

const filterPill = (
  color: string,
  active: boolean,
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
  fontFamily: 'var(--font-mono)',
})

const pillCount: React.CSSProperties = {
  fontSize: '10px',
  opacity: 0.7,
}

const showingCount: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--text-muted)',
  marginBottom: '20px',
  fontFamily: 'var(--font-mono)',
}

const postGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
  gap: '0',
}

const gridCard: React.CSSProperties = {
  padding: '24px 20px',
  borderBottom: '1px solid var(--border)',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}

const gridTitle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  color: 'var(--text-primary)',
  lineHeight: 1.3,
  textDecoration: 'none',
  transition: 'color 0.15s ease',
}

const gridExcerpt: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.5,
  color: 'var(--text-secondary)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}

const gridMeta: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
}

const readMoreLink: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--accent)',
  textDecoration: 'none',
  fontFamily: 'var(--font-mono)',
  fontWeight: 600,
  marginTop: '4px',
  display: 'inline-block',
}

const emptyState: React.CSSProperties = {
  padding: '48px 32px',
  textAlign: 'center',
  color: 'var(--text-muted)',
  fontSize: '13px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  fontFamily: 'var(--font-mono)',
}

const clearAllLink: React.CSSProperties = {
  marginLeft: '8px',
  fontSize: '11px',
  color: 'var(--accent)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  textDecoration: 'underline',
  fontFamily: 'var(--font-mono)',
}

/* ── component ────────────────────────────────────── */

export function BlogContent({ posts }: { posts: Post[] }) {
  const t = useTranslations('Blog')
  const [query, setQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())

  const q = query.toLowerCase().trim()
  const isSearching = q.length > 0
  const isFiltering = activeFilters.size > 0
  const hasActiveControls = isSearching || isFiltering

  // Featured posts: top 3 most recent with featured: true
  const featuredPosts = useMemo(() => {
    return posts
      .filter((p) => p.featured)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
  }, [posts])

  const featuredSlugs = useMemo(
    () => new Set(featuredPosts.map((p) => p.slug)),
    [featuredPosts],
  )

  // Category counts (all posts)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const post of posts) {
      const cat = post.category ?? 'uncategorized'
      counts[cat] = (counts[cat] ?? 0) + 1
    }
    return counts
  }, [posts])

  // Build category list from known categories that have posts
  const categoryList = useMemo(() => {
    const list: { key: string; label: string; color: string; count: number }[] = []
    for (const [key, config] of Object.entries(CATEGORY_CONFIG)) {
      if (categoryCounts[key]) {
        list.push({ key, ...config, count: categoryCounts[key] })
      }
    }
    // Add any unknown categories
    for (const [key, count] of Object.entries(categoryCounts)) {
      if (!CATEGORY_CONFIG[key]) {
        list.push({ key, label: key, color: 'var(--accent)', count })
      }
    }
    return list
  }, [categoryCounts])

  // Filtered posts for the grid
  const filteredPosts = useMemo(() => {
    let pool: Post[]

    if (hasActiveControls) {
      // When searching or filtering, pull from all posts
      pool = posts
    } else {
      // Default: exclude featured posts from grid
      pool = posts.filter((p) => !featuredSlugs.has(p.slug))
    }

    return pool.filter((p) => {
      if (isFiltering && (!p.category || !activeFilters.has(p.category))) return false
      if (isSearching) {
        const match = p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [posts, featuredSlugs, hasActiveControls, isFiltering, isSearching, activeFilters, q])

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) => {
      if (prev.has(key) && prev.size === 1) {
        // Clicking the only active filter deselects it (back to All)
        return new Set()
      }
      // Single-select: clicking any category shows only that category
      return new Set([key])
    })
  }

  const clearAll = () => {
    setActiveFilters(new Set())
    setQuery('')
  }

  if (posts.length === 0) {
    return (
      <>
        <PageHero compact title={t('hero.title')} subtitle={t('hero.subtitle')} />
        <ScrollRevealSection background="var(--canvas)">
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {t('emptyState')}
          </p>
        </ScrollRevealSection>
      </>
    )
  }

  return (
    <>
      <PageHero compact title={t('hero.title')} subtitle={t('hero.subtitle')} />

      <ScrollRevealSection background="var(--canvas)">
        {/* ── Featured section ── */}
        {!hasActiveControls && featuredPosts.length > 0 && (
          <div style={sectionSpacing}>
            <div style={sectionLabel}>Featured</div>
            <div style={featuredGrid}>
              {featuredPosts.map((post) => {
                const cat = getCategoryConfig(post.category)
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    style={featuredCard}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = 'var(--accent)'
                      el.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = 'var(--border)'
                      el.style.transform = 'translateY(0)'
                    }}
                  >
                    <span style={featuredLabel}>featured</span>
                    <div style={featuredTitle}>{post.title}</div>
                    <div style={featuredExcerpt}>{post.excerpt}</div>
                    <div style={featuredMeta}>
                      <time dateTime={post.date} style={metaDate}>
                        {post.date}
                      </time>
                      {post.readingTime !== undefined && (
                        <>
                          <span style={metaSeparator}>&middot;</span>
                          <span style={metaDate}>
                            {t('minRead', { minutes: post.readingTime })}
                          </span>
                        </>
                      )}
                      {post.category && (
                        <span style={catBadge(cat.color)}>{cat.label}</span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Search bar ── */}
        <div style={searchWrap}>
          <span style={searchIcon}>&#8981;</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts..."
            style={searchInput}
          />
          {query && (
            <button onClick={() => setQuery('')} style={searchClear}>
              clear
            </button>
          )}
        </div>

        {/* ── Category filter pills ── */}
        <div style={filterRow}>
          <button
            onClick={() => setActiveFilters(new Set())}
            style={filterPill('var(--accent)', activeFilters.size === 0)}
          >
            All <span style={pillCount}>{posts.length}</span>
          </button>
          {categoryList.map((cat) => (
            <button
              key={cat.key}
              onClick={() => toggleFilter(cat.key)}
              style={filterPill(cat.color, activeFilters.has(cat.key))}
            >
              {cat.label} <span style={pillCount}>{cat.count}</span>
            </button>
          ))}
        </div>

        {/* ── Result count ── */}
        <div style={showingCount}>
          showing {filteredPosts.length} of {hasActiveControls ? posts.length : posts.length - featuredPosts.length} posts
          {hasActiveControls && (
            <button onClick={clearAll} style={clearAllLink}>
              clear all
            </button>
          )}
        </div>

        {/* ── Post grid ── */}
        {filteredPosts.length === 0 ? (
          <div style={emptyState}>
            No posts found{q ? ` for "${query}"` : ' for the current filters'}.{' '}
            <button
              onClick={clearAll}
              style={{
                color: 'var(--accent)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
              }}
            >
              Reset
            </button>
          </div>
        ) : (
          <StaggerContainer stagger={0.06}>
            <div style={postGrid}>
              {filteredPosts.map((post) => {
                const cat = getCategoryConfig(post.category)
                return (
                  <StaggerItem key={post.slug}>
                    <article style={gridCard}>
                      <div style={gridMeta}>
                        <time dateTime={post.date} style={metaDate}>
                          {post.date}
                        </time>
                        {post.readingTime !== undefined && (
                          <>
                            <span style={metaSeparator}>&middot;</span>
                            <span style={metaDate}>
                              {t('minRead', { minutes: post.readingTime })}
                            </span>
                          </>
                        )}
                        {post.category && (
                          <span style={catBadge(cat.color)}>{cat.label}</span>
                        )}
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        style={gridTitle}
                        onMouseEnter={(e) => {
                          ;(e.currentTarget as HTMLElement).style.color = 'var(--accent)'
                        }}
                        onMouseLeave={(e) => {
                          ;(e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
                        }}
                      >
                        {post.title}
                      </Link>
                      <div style={gridExcerpt}>{post.excerpt}</div>
                      <Link href={`/blog/${post.slug}`} style={readMoreLink}>
                        {t('readMore')} &rarr;
                      </Link>
                    </article>
                  </StaggerItem>
                )
              })}
            </div>
          </StaggerContainer>
        )}
      </ScrollRevealSection>
    </>
  )
}
