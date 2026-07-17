'use client'

import React, { useEffect, useRef, useState } from 'react'

/**
 * The report's sticky section nav, plus a reading-progress bar.
 *
 * The plain <a> list was fine at 8 sections and stopped being fine at 13: the
 * strip scrolls horizontally with a deliberately hidden scrollbar, so on a
 * phone a reader sees about four labels, has no active state to orient by, and
 * no signal that nine more exist. Scroll-spy fixes both — the current section
 * is marked, and the strip scrolls itself to keep that mark in view, which is
 * what makes the overflow discoverable.
 *
 * Scroll-spy pattern is the one already used by blog/[slug]/TableOfContents.
 */
export function ReportNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '')
  const [progress, setProgress] = useState(0)
  const navRef = useRef<HTMLElement | null>(null)

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

  // keep the active pill in view without hijacking the page's own scroll
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const link = nav.querySelector<HTMLAnchorElement>(`a[href="#${activeId}"]`)
    link?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [activeId])

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

  return (
    <>
      <div
        className="rr-progress"
        style={{ width: `${progress * 100}%` }}
        role="progressbar"
        aria-label="reading progress"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      <nav className="rr-nav" aria-label="report sections" ref={navRef}>
        <div className="rr-nav-inner">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={s.id === activeId ? 'true' : undefined}
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  )
}
