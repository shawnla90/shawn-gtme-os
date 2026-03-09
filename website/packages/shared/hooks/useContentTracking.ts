'use client'

import { useEffect, useRef } from 'react'
import type { ContentMeta } from '../lib/analytics'
import {
  trackContentView,
  trackScrollDepth,
  trackTimeOnPage,
} from '../lib/analytics'

/**
 * One-line content tracking hook.
 * Fires content_viewed on mount, tracks scroll depth at 25/50/75/100%,
 * and reports time-on-page on unmount or visibility-hidden.
 */
export function useContentTracking(meta: ContentMeta): void {
  const startTimeRef = useRef<number>(0)
  const scrollMilestonesRef = useRef<Set<25 | 50 | 75 | 100>>(new Set())

  useEffect(() => {
    // Fire content view
    trackContentView(meta)
    startTimeRef.current = Date.now()

    // Scroll depth tracking
    const thresholds = [25, 50, 75, 100] as const
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return

      const pct = Math.round((scrollTop / docHeight) * 100)
      const shortMeta = {
        content_type: meta.content_type,
        content_slug: meta.content_slug,
        site: meta.site,
      }

      for (const t of thresholds) {
        if (pct >= t && !scrollMilestonesRef.current.has(t)) {
          scrollMilestonesRef.current.add(t)
          trackScrollDepth(shortMeta, t)
        }
      }
    }

    // Time-on-page reporting
    const reportTime = () => {
      if (!startTimeRef.current) return
      const seconds = (Date.now() - startTimeRef.current) / 1000
      trackTimeOnPage(
        {
          content_type: meta.content_type,
          content_slug: meta.content_slug,
          site: meta.site,
        },
        seconds,
      )
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        reportTime()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Check initial scroll position (e.g. anchor links)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      reportTime()
    }
    // Only fire once per mount — stable meta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.content_slug])
}
