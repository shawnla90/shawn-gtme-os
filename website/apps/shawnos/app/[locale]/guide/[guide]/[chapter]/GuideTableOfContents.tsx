'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface TocHeading {
  id: string
  text: string
  level: number
}

interface GuideChapterInfo {
  slug: string
  title: string
  order: number
}

interface GuideTableOfContentsProps {
  html: string
  guideSlug: string
  currentChapterSlug: string
  allChapters: GuideChapterInfo[]
  mobileOnly?: boolean
  desktopOnly?: boolean
}

function extractHeadings(html: string): TocHeading[] {
  const matches = Array.from(
    html.matchAll(/<h([23])[^>]*id="([^"]+)"[^>]*>(.*?)<\/h[23]>/gi)
  )
  return matches.map((m) => ({
    level: parseInt(m[1], 10),
    id: m[2],
    text: m[3].replace(/<[^>]+>/g, ''),
  }))
}

export function GuideTableOfContents({
  html,
  guideSlug,
  currentChapterSlug,
  allChapters,
  mobileOnly,
  desktopOnly,
}: GuideTableOfContentsProps) {
  const headings = extractHeadings(html)
  const [activeId, setActiveId] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [showAllChapters, setShowAllChapters] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (headings.length === 0) return

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible.length > 0) {
        setActiveId(visible[0].target.id)
      }
    }

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: '0px 0px -60% 0px',
      threshold: 0,
    })

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current!.observe(el)
    })

    return () => {
      observerRef.current?.disconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    }
  }

  if (headings.length === 0) return null

  const sorted = [...allChapters].sort((a, b) => a.order - b.order)

  // Mobile
  if (mobileOnly) {
    return (
      <div
        className="toc-mobile"
        style={{
          marginBottom: 24,
          fontFamily: 'var(--font-mono)',
          border: '1px solid var(--border)',
          borderRadius: 4,
        }}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 14px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}
          aria-expanded={open}
        >
          <span>On this page</span>
          <span style={{ color: 'var(--accent)' }}>{open ? '\u25B2' : '\u25BC'}</span>
        </button>

        {open && (
          <nav aria-label="Table of contents" style={{ padding: '4px 14px 12px' }}>
            <TocList headings={headings} activeId={activeId} onClickItem={handleClick} />
          </nav>
        )}
      </div>
    )
  }

  // Desktop
  if (desktopOnly) {
    return (
      <aside
        className="toc-desktop"
        aria-label="Table of contents"
        style={{
          position: 'sticky',
          top: 80,
          alignSelf: 'flex-start',
          width: 220,
          flexShrink: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          lineHeight: 1.6,
        }}
      >
        <p
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            letterSpacing: '0.5px',
            marginBottom: 10,
            marginTop: 0,
            textTransform: 'uppercase',
          }}
        >
          On this page
        </p>
        <TocList headings={headings} activeId={activeId} onClickItem={handleClick} />

        <div style={{ marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <button
            onClick={() => setShowAllChapters((v) => !v)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              fontSize: '11px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            All chapters {showAllChapters ? '\u25B2' : '\u25BC'}
          </button>

          {showAllChapters && (
            <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}>
              {sorted.map((ch) => {
                const isCurrent = ch.slug === currentChapterSlug
                return (
                  <li key={ch.slug} style={{ marginBottom: 3 }}>
                    <Link
                      href={`/guide/${guideSlug}/${ch.slug}`}
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        color: isCurrent ? 'var(--accent)' : 'var(--text-secondary)',
                        fontWeight: isCurrent ? 600 : 400,
                        textDecoration: 'none',
                        lineHeight: 1.5,
                        display: 'block',
                      }}
                    >
                      {ch.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </aside>
    )
  }

  return null
}

function TocList({
  headings,
  activeId,
  onClickItem,
}: {
  headings: TocHeading[]
  activeId: string
  onClickItem: (id: string) => void
}) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {headings.map(({ id, text, level }) => {
        const isActive = id === activeId
        return (
          <li key={id} style={{ paddingLeft: level === 3 ? 12 : 0, marginBottom: 4 }}>
            <button
              onClick={() => onClickItem(id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                textAlign: 'left',
                lineHeight: 1.5,
                transition: 'color 0.15s',
              }}
            >
              {level === 3 && (
                <span style={{ marginRight: 4, color: 'var(--text-muted)' }}>{'\u2514'}</span>
              )}
              {text}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
