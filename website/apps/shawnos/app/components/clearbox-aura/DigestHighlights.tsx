"use client"

import { useEffect } from "react"
import { annotate } from "rough-notation"
import type { RoughAnnotation } from "rough-notation/lib/model"

type Action = "underline" | "highlight" | "circle" | "box"

const AURA = "#8b7cf6"
const GREEN = "#3fbf7f"
const RED = "#e5564d"
const AMBER = "#e6a93a"

// Curated marker on a few section headings.
const HEADING: Record<string, { type: Action; color: string }> = {
  "hottest thread": { type: "underline", color: AURA },
  "best comment award": { type: "highlight", color: GREEN },
  "troll of the day": { type: "circle", color: RED },
  "fun facts": { type: "box", color: AMBER },
}

// Every section's inline-highlight color (for the ==marker== spans).
const SECTION_COLOR: Record<string, string> = {
  "the pulse": AURA,
  "hottest thread": AURA,
  "repo of the day": AURA,
  "best comment award": GREEN,
  "troll of the day": RED,
  "fun facts": AMBER,
  "code drop": AURA,
  "builder takeaways": AURA,
  "the scoreboard": AURA,
}

const norm = (s: string | null) => (s || "").trim().toLowerCase()

/** For an inline mark, the normalized text of the nearest preceding <h2>. */
function sectionOf(mark: Element): string {
  let block: Element = mark
  while (block.parentElement && !block.parentElement.classList.contains("prose")) {
    block = block.parentElement
  }
  let n = block.previousElementSibling
  while (n) {
    if (n.tagName === "H2") return norm(n.textContent)
    n = n.previousElementSibling
  }
  return ""
}

/**
 * DigestHighlights — after the digest renders, draw rough-notation marker strokes:
 * color-coded on curated section headings, and a highlight on every inline
 * `.cb-hl` (from a `==marker==`), colored by its section.
 */
export function DigestHighlights() {
  useEffect(() => {
    const root = document.querySelector(".blog-post-content")
    if (!root) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const anns: RoughAnnotation[] = []

    // `animated` only on the first pass; redraws (on width change) reposition
    // silently so the marks never re-animate while the reader scrolls.
    const draw = (animated: boolean) => {
      anns.forEach((a) => a.remove())
      anns.length = 0
      const anim = animated && !reduce

      // 1) curated section headings
      ;(Array.from(root.querySelectorAll("h2")) as HTMLElement[]).forEach((h) => {
        const cfg = HEADING[norm(h.textContent)]
        if (!cfg) return
        const a = annotate(h, {
          type: cfg.type,
          color: cfg.color,
          strokeWidth: 2.5,
          padding: cfg.type === "highlight" ? 2 : cfg.type === "circle" ? 8 : 5,
          multiline: cfg.type === "underline" || cfg.type === "highlight",
          iterations: 2,
          animate: anim,
          animationDuration: 700,
        })
        a.show()
        anns.push(a)
      })

      // 2) every inline ==marker==, highlighted in its section color
      ;(Array.from(root.querySelectorAll(".cb-hl")) as HTMLElement[]).forEach((m, i) => {
        const color = SECTION_COLOR[sectionOf(m)] || AURA
        const a = annotate(m, {
          type: "highlight",
          color,
          strokeWidth: 0,
          padding: 1.5,
          multiline: true,
          iterations: 1,
          animate: anim,
          animationDuration: 500,
        })
        if (anim) window.setTimeout(() => a.show(), i * 120)
        else a.show()
        anns.push(a)
      })
    }

    const t = window.setTimeout(() => draw(true), 900)

    // Redraw ONLY on a real width change. Mobile scrolling toggles the URL bar,
    // which fires resize with an unchanged width — ignore those so the marks
    // don't jump. Debounce so a drag resize doesn't thrash.
    let lastWidth = window.innerWidth
    let debounce: number | undefined
    const onResize = () => {
      if (window.innerWidth === lastWidth) return
      lastWidth = window.innerWidth
      window.clearTimeout(debounce)
      debounce = window.setTimeout(() => draw(false), 200)
    }
    window.addEventListener("resize", onResize)
    return () => {
      window.clearTimeout(t)
      window.clearTimeout(debounce)
      window.removeEventListener("resize", onResize)
      anns.forEach((a) => a.remove())
    }
  }, [])

  return null
}
