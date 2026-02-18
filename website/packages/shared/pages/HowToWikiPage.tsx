'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'

/* ── types ─────────────────────────────────────────── */

export type HowToSiteName = 'shawnos' | 'gtmos' | 'contentos'

export interface HowToCategoryMeta {
  id: string
  label: string
  description: string
  prompt: string
}

export interface HowToEntryCard {
  id: string
  title: string
  subtitle: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  canonicalSite: HowToSiteName
}

export interface HowToWikiPageConfig {
  siteName: HowToSiteName
  siteUrl: string
  title: string
  description: string
  terminalCommand: string
  badge: string
  entries: HowToEntryCard[]
  categories: HowToCategoryMeta[]
  statOverride?: { label: string; value: string }
  navLinks: {
    left: { href: string; label: string }
    right: { href: string; label: string }
  }
}

/* ── constants ─────────────────────────────────────── */

const SITE_URLS: Record<HowToSiteName, string> = {
  shawnos: 'https://shawnos.ai',
  gtmos: 'https://thegtmos.ai',
  contentos: 'https://thecontentos.ai',
}

const SITE_LABELS: Record<HowToSiteName, string> = {
  shawnos: 'ShawnOS',
  gtmos: 'theGTMOS',
  contentos: 'theContentOS',
}

/* ── utils ─────────────────────────────────────────── */

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function difficultyColor(d: 'beginner' | 'intermediate' | 'advanced'): string {
  switch (d) {
    case 'beginner':
      return '#4ade80'
    case 'intermediate':
      return '#facc15'
    case 'advanced':
      return '#f87171'
  }
}

/* ── styles ────────────────────────────────────────── */

const outerWrap: React.CSSProperties = {
  maxWidth: 1080,
  margin: '0 auto',
  padding: '40px 20px 80px',
  fontFamily: 'var(--font-mono)',
}

const terminalHeaderStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  marginBottom: '24px',
}

const heroSection: React.CSSProperties = {
  marginBottom: '40px',
}

const heroTitle: React.CSSProperties = {
  fontSize: '32px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  lineHeight: 1.2,
  marginBottom: '16px',
}

const heroDesc: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.75,
  color: 'var(--text-secondary)',
  marginBottom: '24px',
  maxWidth: 640,
}

const statsRow: React.CSSProperties = {
  display: 'flex',
  gap: '24px',
  marginBottom: '32px',
  flexWrap: 'wrap',
}

const statBox: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
}

const statNum: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  color: 'var(--accent)',
}

const statLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--text-muted)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
}

const badgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--accent)',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  padding: '8px 16px',
  letterSpacing: '0.03em',
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '40px 0',
}

const twoCol: React.CSSProperties = {
  display: 'flex',
  gap: '48px',
  alignItems: 'flex-start',
}

const mainCol: React.CSSProperties = {
  flex: '1 1 0',
  minWidth: 0,
}

const tocSidebar: React.CSSProperties = {
  flex: '0 0 220px',
  position: 'sticky' as const,
  top: 80,
  maxHeight: 'calc(100vh - 120px)',
  overflowY: 'auto' as const,
  paddingBottom: 40,
}

const tocHeaderStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: '1px solid var(--border)',
}

const mobileTocToggle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '12px 16px',
  fontSize: '13px',
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  color: 'var(--accent)',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  cursor: 'pointer',
  marginBottom: '16px',
}

const categorySection: React.CSSProperties = {
  marginBottom: '48px',
}

const categoryPrompt: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  marginBottom: '8px',
}

const categoryTitleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '8px',
}

const categoryDescStyle: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.6,
  color: 'var(--text-secondary)',
  marginBottom: '20px',
  maxWidth: 640,
}

const cardGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '16px',
}

const cardBase: React.CSSProperties = {
  display: 'block',
  padding: '20px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  textDecoration: 'none',
  transition: 'border-color 0.15s ease, transform 0.1s ease',
}

const crossSiteCard: React.CSSProperties = {
  ...cardBase,
  opacity: 0.7,
  borderStyle: 'dashed',
}

const cardTitleStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '6px',
  lineHeight: 1.3,
}

const cardSubtitle: React.CSSProperties = {
  fontSize: '12px',
  lineHeight: 1.6,
  color: 'var(--text-secondary)',
  marginBottom: '12px',
}

const cardMeta: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
}

const diffBadge = (
  d: 'beginner' | 'intermediate' | 'advanced',
): React.CSSProperties => ({
  fontSize: '10px',
  fontWeight: 600,
  color: difficultyColor(d),
  border: `1px solid ${difficultyColor(d)}33`,
  borderRadius: '3px',
  padding: '2px 8px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
})

const siteBadgeStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  border: '1px solid var(--border)',
  borderRadius: '3px',
  padding: '2px 8px',
  letterSpacing: '0.03em',
}

const navRow: React.CSSProperties = {
  marginTop: '48px',
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '12px',
}

const navLinkStyle: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--accent)',
  textDecoration: 'none',
}

/* ── component ─────────────────────────────────────── */

export function HowToWikiPage({ config }: { config: HowToWikiPageConfig }) {
  const [activeId, setActiveId] = useState('')
  const [tocOpen, setTocOpen] = useState(false)

  const { siteName, entries, categories } = config

  const categoriesWithEntries = useMemo(() => {
    return categories.map((cat) => {
      const all = entries.filter((e) => e.category === cat.id)
      const canonical = all.filter((e) => e.canonicalSite === siteName)
      const crossSite = all.filter((e) => e.canonicalSite !== siteName)
      return { ...cat, canonical, crossSite, total: all.length }
    })
  }, [categories, entries, siteName])

  const entryCount = entries.length
  const localCount = entries.filter((e) => e.canonicalSite === siteName).length
  const categoryCount = categories.length

  /* scroll-spy */
  useEffect(() => {
    const headings = Array.from(document.querySelectorAll('[data-htw-id]'))
    if (headings.length === 0) return

    let raf = 0
    const update = () => {
      let id = ''
      for (const h of headings) {
        const rect = h.getBoundingClientRect()
        if (rect.top <= 100) {
          id = h.getAttribute('data-htw-id') || ''
        }
      }
      setActiveId(id)
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTocOpen(false)
    }
  }

  /* ── TOC renderer ─────────────────────────────── */

  const renderToc = () => (
    <nav>
      <div style={tocHeaderStyle}>categories</div>
      {categoriesWithEntries.map((cat) => {
        const catSlug = toSlug(cat.label)
        const isActive = activeId === catSlug

        return (
          <div key={cat.id} style={{ marginBottom: '4px' }}>
            <a
              href={`#${catSlug}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToId(catSlug)
              }}
              className="htw-toc-link"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                textDecoration: 'none',
                padding: '6px 0 6px 8px',
                borderLeft: isActive
                  ? '2px solid var(--accent)'
                  : '1px solid transparent',
                transition: 'color 0.15s ease, border-color 0.15s ease',
              }}
            >
              <span>{cat.label}</span>
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  opacity: 0.6,
                }}
              >
                {cat.total}
              </span>
            </a>
          </div>
        )
      })}

      {/* cross-site legend */}
      <div
        style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border)',
          fontSize: '11px',
          lineHeight: 1.6,
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ marginBottom: '6px', fontWeight: 600, letterSpacing: '0.05em' }}>
          legend
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: 'var(--canvas-subtle)',
              border: '1px solid var(--border)',
              flexShrink: 0,
            }}
          />
          <span>local entry</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: 'transparent',
              border: '1px dashed var(--border)',
              flexShrink: 0,
              opacity: 0.7,
            }}
          />
          <span>cross-site ↗</span>
        </div>
      </div>
    </nav>
  )

  /* ── render ────────────────────────────────────── */

  return (
    <>
      <style>{`
        .htw-blink {
          display: inline-block;
          width: 8px;
          height: 16px;
          background: var(--accent);
          vertical-align: text-bottom;
          margin-left: 2px;
          animation: htw-blink-kf 1s step-end infinite;
        }
        @keyframes htw-blink-kf {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        [data-htw-id] {
          scroll-margin-top: 90px;
        }
        .htw-toc-sidebar {
          display: block;
        }
        .htw-toc-mobile {
          display: none;
        }
        .htw-toc-sidebar::-webkit-scrollbar {
          width: 4px;
        }
        .htw-toc-sidebar::-webkit-scrollbar-track {
          background: transparent;
        }
        .htw-toc-sidebar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 2px;
        }
        @media (max-width: 900px) {
          .htw-toc-sidebar {
            display: none !important;
          }
          .htw-toc-mobile {
            display: block !important;
          }
          .htw-two-col {
            flex-direction: column !important;
          }
        }
        .htw-toc-link:hover {
          color: var(--accent) !important;
        }
        .htw-card:hover {
          border-color: var(--accent) !important;
          transform: translateY(-1px);
        }
        .htw-card-cross:hover {
          border-color: var(--text-muted) !important;
          opacity: 0.85 !important;
        }
      `}</style>

      <div style={outerWrap}>
        {/* Terminal header */}
        <h1 style={terminalHeaderStyle}>
          <span style={{ color: 'var(--accent)' }}>$</span>{' '}
          {config.terminalCommand}
          <span className="htw-blink" />
        </h1>

        {/* Hero */}
        <div style={heroSection}>
          <h2 style={heroTitle}>{config.title}</h2>
          <p style={heroDesc}>{config.description}</p>

          <div style={statsRow}>
            <div style={statBox}>
              <span style={statNum}>{entryCount}</span>
              <span style={statLabel}>Guides</span>
            </div>
            <div style={statBox}>
              <span style={statNum}>{categoryCount}</span>
              <span style={statLabel}>Categories</span>
            </div>
            {localCount < entryCount && (
              <div style={statBox}>
                <span style={statNum}>{localCount}</span>
                <span style={statLabel}>On This Site</span>
              </div>
            )}
            {config.statOverride && (
              <div style={statBox}>
                <span style={statNum}>{config.statOverride.value}</span>
                <span style={statLabel}>{config.statOverride.label}</span>
              </div>
            )}
          </div>

          <div style={badgeStyle}>
            <span style={{ fontSize: '16px' }}>&#9670;</span>
            {config.badge}
          </div>
        </div>

        <hr style={divider} />

        {/* Mobile TOC */}
        <div className="htw-toc-mobile">
          <button
            onClick={() => setTocOpen(!tocOpen)}
            style={mobileTocToggle}
            type="button"
          >
            <span>categories</span>
            <span style={{ fontSize: '10px' }}>
              {tocOpen ? '\u25B2' : '\u25BC'}
            </span>
          </button>
          {tocOpen && (
            <div
              style={{
                background: 'var(--canvas-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '16px',
                marginBottom: '24px',
              }}
            >
              {renderToc()}
            </div>
          )}
        </div>

        {/* Two-column layout */}
        <div className="htw-two-col" style={twoCol}>
          {/* Main content */}
          <div style={mainCol}>
            {categoriesWithEntries.map((cat) => {
              const catSlug = toSlug(cat.label)
              const hasEntries = cat.canonical.length > 0 || cat.crossSite.length > 0
              if (!hasEntries) return null

              return (
                <div key={cat.id} style={categorySection}>
                  <div style={categoryPrompt}>{cat.prompt}</div>
                  <h3
                    id={catSlug}
                    data-htw-id={catSlug}
                    style={categoryTitleStyle}
                  >
                    {cat.label}
                  </h3>
                  <p style={categoryDescStyle}>{cat.description}</p>

                  <div style={cardGrid}>
                    {/* Canonical entries — full interactive cards */}
                    {cat.canonical.map((entry) => (
                      <Link
                        key={entry.id}
                        href={`/how-to/${entry.id}`}
                        className="htw-card"
                        style={cardBase}
                      >
                        <div style={cardTitleStyle}>{entry.title}</div>
                        <div style={cardSubtitle}>{entry.subtitle}</div>
                        <div style={cardMeta}>
                          <span style={diffBadge(entry.difficulty)}>
                            {entry.difficulty}
                          </span>
                        </div>
                      </Link>
                    ))}

                    {/* Cross-site entries — dashed border, dimmed, external link */}
                    {cat.crossSite.map((entry) => (
                      <a
                        key={entry.id}
                        href={`${SITE_URLS[entry.canonicalSite]}/how-to/${entry.id}`}
                        className="htw-card-cross"
                        style={crossSiteCard}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div
                          style={{
                            ...cardTitleStyle,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <span>{entry.title}</span>
                          <span
                            style={{
                              fontSize: '11px',
                              color: 'var(--text-muted)',
                              flexShrink: 0,
                            }}
                          >
                            ↗
                          </span>
                        </div>
                        <div style={cardSubtitle}>{entry.subtitle}</div>
                        <div style={cardMeta}>
                          <span style={diffBadge(entry.difficulty)}>
                            {entry.difficulty}
                          </span>
                          <span style={siteBadgeStyle}>
                            {SITE_LABELS[entry.canonicalSite]}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Navigation */}
            <div style={navRow}>
              <Link href={config.navLinks.left.href} style={navLinkStyle}>
                &larr; {config.navLinks.left.label}
              </Link>
              <Link href={config.navLinks.right.href} style={navLinkStyle}>
                {config.navLinks.right.label} &rarr;
              </Link>
            </div>
          </div>

          {/* TOC sidebar (desktop) */}
          <div className="htw-toc-sidebar" style={tocSidebar}>
            {renderToc()}
          </div>
        </div>
      </div>
    </>
  )
}
