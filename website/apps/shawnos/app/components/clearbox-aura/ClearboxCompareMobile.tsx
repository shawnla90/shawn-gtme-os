"use client"

import { useEffect, useState } from "react"
import { AURA_COPY, ENTITIES } from "./lib/tokens"
import { Backlight } from "../../../components/magicui/backlight"

const DARK_VARS = {
  ["--canvas"]: "oklch(0.145 0 0)",
  ["--canvas-card"]: "oklch(0.205 0 0)",
  ["--text-primary"]: "oklch(0.985 0 0)",
  ["--text-secondary"]: "oklch(0.708 0 0)",
} as React.CSSProperties

function useMedia(query: string) {
  const [match, setMatch] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const sync = () => setMatch(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [query])
  return match
}

const chip = (violet?: boolean): React.CSSProperties => ({
  background: "var(--canvas-card)",
  border: violet ? "1px solid color-mix(in oklch, var(--aura) 30%, transparent)" : "1px solid oklch(1 0 0 / 12%)",
  borderRadius: 8,
  padding: "3px 9px",
  fontSize: 12,
  color: "var(--text-primary)",
  fontFamily: "var(--font-mono)",
  whiteSpace: "nowrap",
})

const label: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--text-secondary)",
  textAlign: "center",
  marginBottom: 14,
}

function Subs({ violet }: { violet?: boolean }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, maxWidth: 220, margin: "0 auto" }}>
      {AURA_COPY.subreddits.map((s) => (
        <span key={s} style={chip(violet)}>{s}</span>
      ))}
    </div>
  )
}

function Down() {
  return <div style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: 16, lineHeight: 1, margin: "12px 0" }}>&darr;</div>
}

function Card({ children, glow }: { children: React.ReactNode; glow?: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        maxWidth: 340,
        margin: "0 auto",
        borderRadius: 14,
        padding: "20px 18px",
        background: "color-mix(in oklch, var(--canvas-card) 55%, transparent)",
        border: glow
          ? "1px solid color-mix(in oklch, var(--aura) 45%, transparent)"
          : "1px dashed oklch(1 0 0 / 14%)",
        boxShadow: glow ? "0 0 44px -18px var(--aura)" : "none",
        opacity: glow ? 1 : 0.92,
      }}
    >
      {children}
    </div>
  )
}

export function ClearboxCompareMobile() {
  const show = useMedia("(max-width: 1549px)")
  const stacked = useMedia("(max-width: 640px)")
  if (!show) return null

  const rows = [
    { sub: "r/SaaS", intent: "High intent", score: 94, ...ENTITIES.lead },
    { sub: "r/startups", intent: "Buying signal", score: 91, ...ENTITIES.engage },
    { sub: "r/sales", intent: "Comp switch", score: 88, ...ENTITIES.competitor },
  ]

  return (
    <section
      className="full-bleed"
      style={{
        ...DARK_VARS,
        background: "linear-gradient(180deg, transparent 0%, oklch(0.145 0 0 / 0.85) 12%, oklch(0.145 0 0 / 0.85) 88%, transparent 100%)",
        padding: "36px 0 40px",
        marginBottom: 20,
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ ...label, marginBottom: 22, letterSpacing: "0.2em" }}>same subreddits &middot; two outcomes</div>

        <div
          style={{
            display: "flex",
            flexDirection: stacked ? "column" : "row",
            gap: stacked ? 14 : 20,
            alignItems: stacked ? "stretch" : "center",
            justifyContent: "center",
          }}
        >
          {/* raw scraper */}
          <Card>
            <div style={label}>raw scraper</div>
            <Subs />
            <Down />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, color: "color-mix(in oklch, var(--text-primary) 72%, transparent)" }}>3,000 maybes</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-secondary)", marginTop: 3 }}>unranked &middot; noisy</div>
            </div>
          </Card>

          {/* vs */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "var(--text-secondary)",
              border: "1px solid oklch(1 0 0 / 14%)",
              borderRadius: 999,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: stacked ? "-2px auto" : "0",
              flexShrink: 0,
              background: "var(--canvas)",
            }}
          >
            VS
          </div>

          {/* clearbox aura */}
          <Card glow>
            <div style={label}>clearbox &middot; aura</div>
            <Subs violet />
            <Down />
            <Backlight blur={11} className="relative" >
              <div
                style={{
                  width: 54,
                  height: 54,
                  margin: "0 auto",
                  borderRadius: 15,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--canvas-card)",
                  border: "1px solid color-mix(in oklch, var(--aura) 55%, transparent)",
                  boxShadow: "0 0 40px -8px var(--aura)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/clearbox-icon.svg" alt="Aura" style={{ width: 26, height: 26 }} />
              </div>
            </Backlight>
            <div
              style={{
                marginTop: 14,
                borderRadius: 10,
                border: "1px solid color-mix(in oklch, var(--aura) 45%, transparent)",
                background: "color-mix(in oklch, var(--canvas-card) 88%, transparent)",
                padding: "10px 12px",
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>the 12 that matter</div>
              {rows.map((r) => (
                <div key={r.sub} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, marginBottom: 4, fontFamily: "var(--font-mono)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: r.color, flexShrink: 0 }} />
                  <span style={{ color: "var(--text-secondary)", width: 52 }}>{r.sub}</span>
                  <span style={{ color: r.color, fontWeight: 500, flex: 1 }}>{r.intent}</span>
                  <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{r.score}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
