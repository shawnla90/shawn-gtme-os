"use client"

import { useEffect, useRef, useState } from "react"
import { AURA, AURA_COPY, ENTITIES } from "./lib/tokens"
import { AnimatedBeam } from "./primitives/animated-beam"
import { Backlight } from "../../../components/magicui/backlight"

const DARK_VARS = {
  ["--canvas-card"]: "oklch(0.205 0 0)",
  ["--text-primary"]: "oklch(0.985 0 0)",
  ["--text-secondary"]: "oklch(0.708 0 0)",
} as React.CSSProperties

const GRAY_PATH = "oklch(0.55 0 0 / 18%)"
const GRAY_START = "oklch(0.8 0 0)"
const GRAY_STOP = "oklch(0.42 0 0)"
const VIOLET_PATH = "oklch(0.585 0.223 264.376 / 24%)"

function useRefArray<T>(n: number) {
  const ref = useRef<React.RefObject<T | null>[]>(null)
  if (!ref.current) ref.current = Array.from({ length: n }, () => ({ current: null }))
  return ref.current
}

function Chip({
  innerRef,
  style,
  children,
}: {
  innerRef?: React.Ref<HTMLDivElement>
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <div
      ref={innerRef}
      style={{
        position: "relative",
        zIndex: 10,
        background: "var(--canvas-card)",
        border: "1px solid oklch(1 0 0 / 12%)",
        borderRadius: 9,
        padding: "7px 12px",
        fontSize: 13,
        fontWeight: 500,
        color: "var(--text-primary)",
        fontFamily: "var(--font-mono)",
        whiteSpace: "nowrap",
        boxShadow: "0 8px 22px rgba(0,0,0,0.5)",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function RailLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--text-secondary)",
        textAlign: "center",
        marginBottom: 22,
      }}
    >
      {children}
    </div>
  )
}

/** Left gutter — raw scraper: same subreddits → scraper → 3,000 maybes. */
function ScraperRail() {
  const container = useRef<HTMLDivElement>(null)
  const subs = useRefArray<HTMLDivElement>(AURA_COPY.subreddits.length)
  const scraper = useRef<HTMLDivElement>(null)
  const maybes = useRef<HTMLDivElement>(null)
  return (
    <div ref={container} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, maxWidth: 220 }}>
        {AURA_COPY.subreddits.map((s, i) => (
          <Chip key={s} innerRef={subs[i]} style={{ fontSize: 12, padding: "4px 9px", borderStyle: "dashed" }}>
            {s}
          </Chip>
        ))}
      </div>
      <Chip innerRef={scraper} style={{ borderStyle: "dashed", borderColor: "oklch(1 0 0 / 18%)", flexDirection: "column", display: "flex", alignItems: "center", gap: 2 }}>
        <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>◇ raw scraper</span>
        <span style={{ color: "var(--text-secondary)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>keywords · guesswork</span>
      </Chip>
      <Chip innerRef={maybes} style={{ flexDirection: "column", display: "flex", alignItems: "center", gap: 2 }}>
        <span style={{ color: "color-mix(in oklch, var(--text-primary) 70%, transparent)", fontSize: 15, fontWeight: 700 }}>3,000 maybes</span>
        <span style={{ color: "var(--text-secondary)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>unranked · noisy</span>
      </Chip>

      {subs.map((r, i) => (
        <AnimatedBeam key={`s${i}`} containerRef={container} fromRef={r} toRef={scraper} curvature={(i - 2) * 16} delay={(i % 3) * 0.4} reverse={i % 2 === 0} pathColor={GRAY_PATH} pathWidth={1.2} gradientStartColor={GRAY_START} gradientStopColor={GRAY_STOP} />
      ))}
      <AnimatedBeam containerRef={container} fromRef={scraper} toRef={maybes} curvature={26} delay={0.6} reverse pathColor={GRAY_PATH} pathWidth={1.2} gradientStartColor={GRAY_START} gradientStopColor={GRAY_STOP} />
    </div>
  )
}

/** Right gutter — Clearbox Aura: same subreddits → glowing core → the 12 that matter. */
function AuraRail() {
  const container = useRef<HTMLDivElement>(null)
  const subs = useRefArray<HTMLDivElement>(AURA_COPY.subreddits.length)
  const core = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const rows = [
    { sub: "r/SaaS", intent: "High intent", score: 94, ...ENTITIES.lead },
    { sub: "r/startups", intent: "Buying signal", score: 91, ...ENTITIES.engage },
    { sub: "r/sales", intent: "Comp switch", score: 88, ...ENTITIES.competitor },
  ]
  return (
    <div ref={container} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, maxWidth: 220 }}>
        {AURA_COPY.subreddits.map((s, i) => (
          <Chip key={s} innerRef={subs[i]} style={{ fontSize: 12, padding: "4px 9px", borderColor: "color-mix(in oklch, var(--aura) 30%, transparent)" }}>
            {s}
          </Chip>
        ))}
      </div>

      <Backlight blur={12} className="relative" >
        <div
          ref={core}
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 62,
            height: 62,
            borderRadius: 18,
            background: "var(--canvas-card)",
            border: "1px solid color-mix(in oklch, var(--aura) 55%, transparent)",
            boxShadow: "0 0 46px -8px var(--aura)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/clearbox-icon.svg" alt="Aura" style={{ width: 30, height: 30 }} />
        </div>
      </Backlight>

      <div
        ref={card}
        style={{
          position: "relative",
          zIndex: 10,
          borderRadius: 12,
          border: "1px solid color-mix(in oklch, var(--aura) 55%, transparent)",
          background: "color-mix(in oklch, var(--canvas-card) 92%, transparent)",
          boxShadow: "0 0 40px -14px var(--aura)",
          padding: "12px 14px",
          minWidth: 186,
        }}
      >
        <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-primary)", marginBottom: 9, fontFamily: "var(--font-mono)" }}>
          the 12 that matter
        </div>
        {rows.map((r) => (
          <div key={r.sub} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 11.5, marginBottom: 5, fontFamily: "var(--font-mono)" }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: r.color, flexShrink: 0 }} />
            <span style={{ color: "var(--text-secondary)", width: 56 }}>{r.sub}</span>
            <span style={{ color: r.color, fontWeight: 500, flex: 1 }}>{r.intent}</span>
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{r.score}</span>
          </div>
        ))}
      </div>

      {subs.map((r, i) => (
        <AnimatedBeam key={`a${i}`} containerRef={container} fromRef={r} toRef={core} curvature={(i - 2) * 8} delay={i * 0.18} pathColor={VIOLET_PATH} pathWidth={1.7} gradientStartColor="#8b7cf6" gradientStopColor={AURA.aura} />
      ))}
      <AnimatedBeam containerRef={container} fromRef={core} toRef={card} curvature={0} delay={0.7} pathColor="oklch(0.585 0.223 264.376 / 32%)" pathWidth={2.2} gradientStartColor={AURA.aura} gradientStopColor={AURA.auraStrong} />
    </div>
  )
}

export function ClearboxReadingRails() {
  const [wide, setWide] = useState(false)
  const [dim, setDim] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1550px)")
    const sync = () => setWide(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    const el = document.getElementById("clearbox-finale")
    if (!el) return
    const io = new IntersectionObserver(([e]) => setDim(e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [wide])

  if (!wide) return null

  const rail = (side: "left" | "right"): React.CSSProperties => ({
    position: "fixed",
    [side]: 40,
    top: "50%",
    transform: "translateY(-50%)",
    width: 280,
    zIndex: 5,
    pointerEvents: "none",
    opacity: dim ? 0 : 0.94,
    transition: "opacity 0.5s ease",
    ...DARK_VARS,
  })

  return (
    <>
      <div style={rail("left")} aria-hidden>
        <RailLabel>raw reddit scraper</RailLabel>
        <ScraperRail />
      </div>
      <div style={rail("right")} aria-hidden>
        <RailLabel>clearbox &middot; aura</RailLabel>
        <AuraRail />
      </div>
    </>
  )
}
