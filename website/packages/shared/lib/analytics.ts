/**
 * ShawnOS — Shared Analytics Utility
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 *
 * Centralized PostHog event capture with typed helpers.
 * Safe no-op if PostHog is not loaded (SSR, missing key, etc.).
 */

import posthog from 'posthog-js'

/* ── types ─────────────────────────────────────────── */

export type SiteKey = 'shawnos' | 'gtmos' | 'contentos'

export interface ContentMeta {
  content_type: string
  content_slug: string
  content_title: string
  site: SiteKey
}

export interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

/* ── core capture (safe no-op) ────────────────────── */

export function capture(event: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  try {
    posthog.capture(event, properties)
  } catch {
    // PostHog not initialized — silently skip
  }
}

/* ── UTM extraction ───────────────────────────────── */

export function extractUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const utm: UTMParams = {}
  const keys: (keyof UTMParams)[] = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
  ]
  for (const key of keys) {
    const val = params.get(key)
    if (val) utm[key] = val
  }
  return utm
}

/* ── typed event helpers ──────────────────────────── */

export function trackContentView(
  meta: ContentMeta,
  extras?: Record<string, unknown>,
): void {
  const utm = extractUTMParams()
  capture('content_viewed', {
    ...meta,
    url: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    ...utm,
    ...extras,
  })
}

export function trackScrollDepth(
  meta: Pick<ContentMeta, 'content_type' | 'content_slug' | 'site'>,
  scrollDepth: 25 | 50 | 75 | 100,
): void {
  capture('content_scroll_depth', {
    ...meta,
    scroll_depth: scrollDepth,
  })
}

export function trackTimeOnPage(
  meta: Pick<ContentMeta, 'content_type' | 'content_slug' | 'site'>,
  durationSeconds: number,
): void {
  // Skip bounces under 2 seconds
  if (durationSeconds < 2) return
  capture('content_time_on_page', {
    ...meta,
    duration_seconds: Math.round(durationSeconds),
  })
}

export function trackOutboundClick(url: string, linkText?: string): void {
  capture('outbound_link_clicked', {
    url,
    link_text: linkText || '',
  })
}

export function trackCtaClick(
  ctaId: string,
  ctaLabel: string,
  meta?: Pick<ContentMeta, 'content_type' | 'site'>,
): void {
  capture('cta_clicked', {
    cta_id: ctaId,
    cta_label: ctaLabel,
    ...meta,
  })
}

export function trackNewsletterSignup(
  source: 'footer' | 'chat_gate' | 'inline',
): void {
  capture('newsletter_signup', {
    source,
    url: typeof window !== 'undefined' ? window.location.href : '',
  })
}

export function trackCrossSiteNav(
  fromSite: SiteKey,
  toSite: SiteKey,
  url: string,
): void {
  capture('cross_site_navigation', {
    from_site: fromSite,
    to_site: toSite,
    url,
  })
}
