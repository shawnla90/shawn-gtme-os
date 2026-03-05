"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { useEffect } from "react"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest",
      person_profiles: "identified_only",
      autocapture: false,
      capture_pageview: true,
      session_recording: {
        maskAllInputs: true,
      },
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") ph.debug()

        // Tag internal users (Shawn's machines) so they can be filtered out
        const isInternal =
          window.location.hostname === "localhost" ||
          document.cookie.includes("shawnos_internal=1")
        if (isInternal) {
          ph.register({ internal_user: true })
        }
      },
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
