'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

interface TocHeading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  html: string
  /** Render only the mobile collapsible strip */
  mobileOnly?: boolean
  /** Render only the desktop sticky sidebar */
  desktopOnly?: boolean
}

function extractHeadings(html: string): TocHeading[] {
  const matches = Array.from(
    html.matchAll(/<h([23])[^>]*id="([^"]+)"[^>]*>(.*?)<\/h[23]>/gi)
  )
  return matches.map((m) => ({
    level: parseInt(m[1], 10),
    id: m[2],
    // strip any inner HTML tags to get plain text
    text: m[3].replace(/<[^>]+>/g, ''),
  }))
}

export function TableOfContents({ html, mobileOnly, desktopOnly }: TableOfContentsProps) {
  const t = useTranslations('Blog')
  const headings = extractHeadings(html)
  const [activeId, setActiveId] = useState<string>('')
  const [open, setOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (headings.length === 0) return

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // find the topmost currently-intersecting heading
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

  if (headings.length === 0) return null

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    }
  }

  // --- Mobile collapsible strip ---
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
          <span>{t('toc')}</span>
          <span style={{ color: 'var(--accent)' }}>{open ? '▲' : '▼'}</span>
        </button>

        {open && (
          <nav
            aria-label="Table of contents"
            style={{ padding: '4px 14px 12px' }}
          >
            <TocList
              headings={headings}
              activeId={activeId}
              onClickItem={handleClick}
            />
          </nav>
        )}
      </div>
    )
  }

  // --- Desktop sticky sidebar ---
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
          {t('toc')}
        </p>
        <TocList
          headings={headings}
          activeId={activeId}
          onClickItem={handleClick}
        />
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
          <li
            key={id}
            style={{
              paddingLeft: level === 3 ? 12 : 0,
              marginBottom: 4,
            }}
          >
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
                <span style={{ marginRight: 4, color: 'var(--text-muted)' }}>{'└'}</span>
              )}
              {text}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
