"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

// Map a pathname to a coarse page_type so HogQL queries can filter without URL parsing.
function derivePageType(pathname: string): string {
  const withoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/")
  const segs = withoutLocale.split("/").filter(Boolean)
  if (segs.length === 0) return "home"
  return segs[0]
}

function deriveSlug(pathname: string): string | undefined {
  const withoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/")
  const segs = withoutLocale.split("/").filter(Boolean)
  if (segs.length >= 2) return segs[segs.length - 1]
  return undefined
}

function PostHogPageview() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname) return
    if (typeof window === "undefined") return
    const page_type = derivePageType(pathname)
    const slug = deriveSlug(pathname)
    const qs = searchParams?.toString() ?? ""
    const url = window.location.origin + pathname + (qs ? `?${qs}` : "")
    posthog.capture("$pageview", {
      $current_url: url,
      page_type,
      ...(slug ? { slug } : {}),
    })
  }, [pathname, searchParams])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      // Hit PostHog's origin directly. The /ingest rewrite fails with
      // Cloudflare Error 1000 because both shawnos.ai and posthog are behind CF
      // and the server-side proxy loop is blocked. Trade off: ad blockers will
      // catch direct hits. Re-enable the rewrite once the CF proxy is fixed.
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      ui_host: "https://us.posthog.com",
      person_profiles: "identified_only",
      autocapture: false,
      // Manual pageviews via <PostHogPageview /> below — keeps App Router
      // SPA transitions accurate and attaches page_type + slug.
      capture_pageview: false,
      capture_pageleave: true,
      session_recording: {
        maskAllInputs: true,
      },
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") ph.debug()

        // Set internal cookie via URL param (works on any device/browser)
        const params = new URLSearchParams(window.location.search)
        if (params.get("_shawnos") === "1") {
          document.cookie = "shawnos_internal=1; max-age=31536000; path=/; SameSite=Lax"
          params.delete("_shawnos")
          const clean = params.toString()
          window.history.replaceState({}, "", window.location.pathname + (clean ? "?" + clean : ""))
        }

        const isInternal =
          window.location.hostname === "localhost" ||
          document.cookie.includes("shawnos_internal=1")
        if (isInternal) {
          ph.register({ internal_user: true })
        }

        // Persist UTM params as super properties (carry across all events)
        const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const
        const utmProps: Record<string, string> = {}
        for (const key of utmKeys) {
          const val = params.get(key)
          if (val) utmProps[key] = val
        }
        if (Object.keys(utmProps).length > 0) {
          ph.register(utmProps)
        }
      },
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageview />
      </Suspense>
      {children}
    </PHProvider>
  )
}
