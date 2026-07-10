"use client"

import { useEffect, useState } from "react"
import { usePostHog } from "posthog-js/react"
import { AuraPipeline, type SceneFormat } from "./scenes/aura-pipeline"
import { PulsatingButton } from "../../../components/magicui/pulsating-button"
import { InteractiveHoverButton } from "../../../components/magicui/interactive-hover-button"

// UTM-tagged so a planted Claude Code Daily backlink's traffic → Clearbox is measurable.
// TODO(shawn): point at a /signup or /trial path if one exists.
const BASE_URL =
  "https://clearbox.to/?utm_source=claude-code-daily&utm_medium=blog-cta&utm_campaign=reddit-pipeline"
const TRIAL_URL = `${BASE_URL}&utm_content=trial`
const TRY_URL = `${BASE_URL}&utm_content=try`

// Force the scene's dark palette on this subtree so the dark-authored nodes/cards
// render correctly (and consistent with the always-dark claude-daily terminal
// banner) regardless of the site theme. shawnos utilities (bg-card/text-foreground…)
// map via @theme inline to these --canvas*/--text-* tokens.
const DARK_VARS = {
  ["--canvas"]: "oklch(0.145 0 0)",
  ["--canvas-card"]: "oklch(0.205 0 0)",
  ["--text-primary"]: "oklch(0.985 0 0)",
  ["--text-secondary"]: "oklch(0.708 0 0)",
  ["--border"]: "oklch(1 0 0 / 10%)",
} as React.CSSProperties

function useIsNarrow() {
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)")
    const sync = () => setNarrow(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])
  return narrow
}

export function ClearboxPipelineFinale() {
  const posthog = usePostHog()
  const narrow = useIsNarrow()
  const format: SceneFormat = narrow ? "vertical" : "wide"

  return (
    <section
      id="clearbox-finale"
      className="full-bleed"
      style={{
        ...DARK_VARS,
        // Soft fade from the page into a subtle dark — no hard pasted band.
        background:
          "linear-gradient(180deg, transparent 0%, oklch(0.145 0 0 / 0.55) 14%, oklch(0.145 0 0 / 0.85) 100%)",
        padding: "64px 0 72px",
        marginTop: 40,
      }}
    >
      {/* lead-in */}
      <div style={{ maxWidth: 760, margin: "0 auto 8px", padding: "0 24px", textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(0.708 0 0)",
            marginBottom: 14,
          }}
        >
          the pipeline behind this page
        </div>
        <h2
          style={{
            fontSize: "clamp(24px, 3.6vw, 38px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "oklch(0.985 0 0)",
            lineHeight: 1.14,
            margin: "0 0 12px",
          }}
        >
          A scraper hands you 3,000 maybes. This hands you the 12 that matter.
        </h2>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.6,
            color: "oklch(0.708 0 0)",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          Clearbox reads the same subreddits, scores every thread by buyer intent,
          and pipes the winners straight into your agent — leads, content, copy.
        </p>
      </div>

      {/* the pipeline — full viewport width, native size (no scale-box) */}
      <div
        style={{
          width: "100%",
          height: narrow ? "auto" : 600,
          margin: "8px 0 24px",
        }}
      >
        <AuraPipeline format={format} />
      </div>

      {/* CTA — the "okay, they get it" moment */}
      <div
        style={{
          display: "flex",
          gap: 18,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          padding: "0 24px",
          fontFamily: "var(--font-mono)",
          fontSize: 15,
        }}
      >
        <PulsatingButton
          href={TRIAL_URL}
          onClick={() =>
            posthog?.capture("clearbox_cta_clicked", { source: "claude-daily-blog", cta: "trial" })
          }
        >
          Start your 7-day free trial
        </PulsatingButton>
        <InteractiveHoverButton
          href={TRY_URL}
          onClick={() =>
            posthog?.capture("clearbox_cta_clicked", { source: "claude-daily-blog", cta: "try" })
          }
        >
          Try Clearbox
        </InteractiveHoverButton>
      </div>
    </section>
  )
}
