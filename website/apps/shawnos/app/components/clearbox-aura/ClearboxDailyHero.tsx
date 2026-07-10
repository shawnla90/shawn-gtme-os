"use client"

import { TypingAnimation } from "./primitives/typing-animation"

const DARK_VARS = {
  ["--canvas"]: "oklch(0.145 0 0)",
  ["--canvas-card"]: "oklch(0.205 0 0)",
  ["--text-primary"]: "oklch(0.985 0 0)",
  ["--text-secondary"]: "oklch(0.708 0 0)",
  ["--border"]: "oklch(1 0 0 / 10%)",
} as React.CSSProperties

/** Slim typed-title hero for a Claude Code Daily edition. */
export function ClearboxDailyHero() {
  return (
    <section
      className="full-bleed"
      style={{
        ...DARK_VARS,
        background:
          "linear-gradient(180deg, transparent 0%, oklch(0.145 0 0 / 0.85) 40%, oklch(0.145 0 0 / 0.85) 100%)",
        padding: "44px 0 32px",
        marginBottom: 20,
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(22px, 7.4vw, 58px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "oklch(0.985 0 0)",
            margin: 0,
            maxWidth: "100%",
            overflowWrap: "break-word",
          }}
        >
          <TypingAnimation as="span" duration={95} cursorStyle="block" className="leading-none tracking-[-0.03em]">
            Claude Code Daily
          </TypingAnimation>
        </h1>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "oklch(0.708 0 0)",
            marginTop: 18,
          }}
        >
          live &middot; the daily show for claude code builders
        </div>
      </div>
    </section>
  )
}
