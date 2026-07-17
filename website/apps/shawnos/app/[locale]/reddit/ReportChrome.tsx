'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

/**
 * The report's chrome: reading progress, the section nav in both its shapes,
 * and the right rail.
 *
 * All four need the same answer to "which section am I in", so the scroll-spy
 * runs once here and the pieces read it off context. The nav strip and the
 * vertical rail are the same links twice, shown by breakpoint: below 1100px
 * the strip, above it the rail.
 *
 * Scroll-spy pattern is the one already used by blog/[slug]/TableOfContents.
 */

type Section = { id: string; label: string }

type Chrome = {
  sections: Section[]
  activeId: string
  activeIndex: number
  progress: number
}

const ChromeCtx = createContext<Chrome | null>(null)

const useChrome = () => {
  const c = useContext(ChromeCtx)
  if (!c) throw new Error('report chrome used outside ChromeProvider')
  return c
}

export function ChromeProvider({
  sections,
  children,
}: {
  sections: Section[]
  children: React.ReactNode
}) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      // bias to the upper band so the active item flips when a heading reaches
      // reading position, not when the section merely touches the viewport
      { rootMargin: '0px 0px -60% 0px', threshold: 0 }
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sections])

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const value = useMemo<Chrome>(
    () => ({
      sections,
      activeId,
      activeIndex: Math.max(
        0,
        sections.findIndex((s) => s.id === activeId)
      ),
      progress,
    }),
    [sections, activeId, progress]
  )

  return <ChromeCtx.Provider value={value}>{children}</ChromeCtx.Provider>
}

export function ProgressBar() {
  const { progress } = useChrome()
  return (
    <div
      className="rr-progress"
      style={{ width: `${progress * 100}%` }}
      role="progressbar"
      aria-label="reading progress"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  )
}

/**
 * The horizontal strip. 13 sections do not fit a phone and the scrollbar is
 * hidden, so without an active mark the reader cannot tell where they are or
 * that more exists: the strip scrolls itself to keep the mark in view, which
 * is what makes the overflow discoverable. Hidden at 1100px, where the rail
 * takes over and can show all 13 at once.
 */
export function NavStrip() {
  const { sections, activeId } = useChrome()
  const navRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    // only chase the active pill while the strip is the visible nav
    if (window.matchMedia('(min-width: 1100px)').matches) return
    const link = nav.querySelector<HTMLAnchorElement>(`a[href="#${activeId}"]`)
    link?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [activeId])

  return (
    <nav className="rr-nav" aria-label="report sections" ref={navRef}>
      <div className="rr-nav-inner">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} aria-current={s.id === activeId ? 'true' : undefined}>
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  )
}

/** The same nav, stood up in the left rail. All 13 visible, no overflow. */
export function NavRail() {
  const { sections, activeId } = useChrome()
  return (
    <nav className="rr-railnav" aria-label="report sections">
      {sections.map((s, i) => (
        <a key={s.id} href={`#${s.id}`} aria-current={s.id === activeId ? 'true' : undefined}>
          <span className="rr-railnav-n">{String(i + 1).padStart(2, '0')}</span>
          {s.label}
        </a>
      ))}
    </nav>
  )
}

/**
 * The right rail. Each section can declare an exhibit; the one for the section
 * in view is shown. Sections without one get "where you are" rather than a
 * blank column or filler: the position in the report, the reading progress,
 * and the asOf stamp are real context, and the stamp is worth carrying
 * everywhere anyway.
 */
export function RightRail({
  rails,
  asOf,
}: {
  rails: Record<string, { head: string; body: React.ReactNode }>
  asOf: string
}) {
  const { sections, activeId, activeIndex, progress } = useChrome()
  const rail = rails[activeId]

  if (rail) {
    return (
      <aside className="rr-rail-r" aria-label="section exhibit">
        <p className="rr-rail-head">{rail.head}</p>
        {rail.body}
      </aside>
    )
  }

  return (
    <aside className="rr-rail-r" aria-label="where you are">
      <p className="rr-rail-head">where you are</p>
      <div className="rr-rail-card">
        <p className="rr-rail-where-n">
          {String(activeIndex + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
          {'  '}
          {sections[activeIndex]?.label}
        </p>
        <div className="rr-rail-where-bar">
          <div className="rr-rail-where-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <p className="rr-rail-where">
          {Math.round(progress * 100)}% read · every number in this report is
          generated from the journey db, as of {asOf}.
        </p>
      </div>
    </aside>
  )
}
