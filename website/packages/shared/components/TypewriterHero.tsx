/**
 * ShawnOS — Proprietary System Architecture
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE.md for terms
 */

'use client'

import { useState, useEffect } from 'react'

/* ── types ────────────────────────────────────────── */

interface TypewriterSequence {
  /** Text to type out */
  text: string
  /**
   * Color treatment for this sequence.
   * - undefined / omitted → var(--text-primary)
   * - "accent"            → acronym portion in var(--accent), expansion in var(--text-primary)
   */
  color?: string
  /** Milliseconds to hold the fully-typed text before erasing (default 3000) */
  pauseAfter?: number
}

export interface TypewriterHeroProps {
  /** Always-visible site title rendered as h1 */
  siteName: string
  /** Ordered text sequences to cycle through */
  sequences: TypewriterSequence[]
  /** Milliseconds per character typed (default 40) */
  typeSpeed?: number
  /** Milliseconds per character deleted (default 25) */
  deleteSpeed?: number
  /** Blinking cursor character (default "_") */
  cursorChar?: string
  /** If true, types the first sequence once and stops (no delete/cycle) */
  typeOnce?: boolean
  /** Max width of the typing area */
  maxWidth?: number
}

type Phase = 'typing' | 'paused' | 'deleting'

/* ── helper: two-tone backronym rendering ─────────── */

/**
 * When color === 'accent', splits on an em-dash (" — ") or double-dash
 * (" -- ") so the acronym portion renders in var(--accent) and the
 * expansion renders in var(--text-primary). During the character-by-character
 * reveal the split happens naturally as soon as the separator is typed.
 */
function renderDisplayText(text: string, color?: string) {
  if (!text) return null

  if (color === 'accent') {
    const emIdx = text.indexOf(' \u2014 ') // " — "
    const ddIdx = emIdx === -1 ? text.indexOf(' -- ') : -1
    const idx = emIdx !== -1 ? emIdx : ddIdx

    if (idx !== -1) {
      return (
        <>
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
            {text.slice(0, idx)}
          </span>
          <span style={{ color: 'var(--text-primary)' }}>
            {text.slice(idx)}
          </span>
        </>
      )
    }

    // Separator not yet typed (or absent) — all accent
    return (
      <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{text}</span>
    )
  }

  // Default: inherit container color (--text-primary)
  return <span>{text}</span>
}

/* ── component ────────────────────────────────────── */

/**
 * Terminal-aesthetic typing hero. The site title stays fixed while text
 * sequences type, pause, erase, and loop beneath it. SSR renders the first
 * sequence fully visible so there is no layout shift or SEO penalty.
 *
 * Pure React (useState + useEffect + setTimeout) — zero external deps.
 */
export function TypewriterHero({
  siteName,
  sequences,
  typeSpeed = 40,
  deleteSpeed = 25,
  cursorChar = '_',
  typeOnce = false,
  maxWidth,
}: TypewriterHeroProps) {
  /*
   * Initialise with the first sequence *fully visible*.  On the server this
   * means the tagline text is already in the markup (SEO + no layout shift).
   * The useEffect below only fires client-side, starting the animation from
   * the "paused" state → delete → next sequence → type → loop.
   */
  const [seqIndex, setSeqIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(
    sequences[0]?.text.length ?? 0,
  )
  const [phase, setPhase] = useState<Phase>('paused')

  /* ── animation state-machine ── */

  useEffect(() => {
    if (sequences.length === 0) return

    const seq = sequences[seqIndex]
    if (!seq) return

    let timer: ReturnType<typeof setTimeout>

    switch (phase) {
      /* Hold the fully-typed text, then begin erasing */
      case 'paused':
        // typeOnce: stay paused forever once fully typed
        if (typeOnce) break
        timer = setTimeout(() => {
          setPhase('deleting')
        }, seq.pauseAfter ?? 3000)
        break

      /* Remove one character at a time */
      case 'deleting':
        if (charIndex > 0) {
          timer = setTimeout(() => {
            setCharIndex((c) => c - 1)
          }, deleteSpeed)
        } else {
          // Brief pause, then advance to the next sequence
          timer = setTimeout(() => {
            const next = (seqIndex + 1) % sequences.length
            setSeqIndex(next)
            setCharIndex(0)
            setPhase('typing')
          }, 500)
        }
        break

      /* Add one character at a time */
      case 'typing':
        if (charIndex < seq.text.length) {
          timer = setTimeout(() => {
            setCharIndex((c) => c + 1)
          }, typeSpeed)
        } else {
          // Fully typed — transition to hold
          setPhase('paused')
        }
        break
    }

    return () => clearTimeout(timer)
  }, [phase, charIndex, seqIndex, sequences, typeSpeed, deleteSpeed, typeOnce])

  /* ── derived display text ── */

  const currentSeq = sequences[seqIndex]
  const displayText = currentSeq?.text.slice(0, charIndex) ?? ''

  /* ── render ── */

  return (
    <>
      {/* Scoped keyframes — mirrors the blink pattern from LogHero */}
      <style>{`
        .tw-hero-cursor {
          color: var(--accent);
          animation: tw-hero-blink 1s step-end infinite;
          font-weight: 400;
        }
        @keyframes tw-hero-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* ── Fixed title ── */}
      <h1
        style={{
          fontSize: '28px',
          fontWeight: 700,
          color: 'var(--accent)',
          margin: '0 0 8px 0',
          lineHeight: 1.2,
        }}
      >
        {siteName}
      </h1>

      {/* ── Typing area ── */}
      <div
        style={{
          fontSize: '16px',
          color: 'var(--text-primary)',
          lineHeight: 1.6,
          marginBottom: 28,
          maxWidth: maxWidth ?? 560,
          minHeight: '3.2em', // reserve ~2 lines to prevent CTA jump
        }}
      >
        {renderDisplayText(displayText, currentSeq?.color)}
        <span className="tw-hero-cursor">{cursorChar}</span>
      </div>
    </>
  )
}