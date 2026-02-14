'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

/* ── types ────────────────────────────────────────── */

export interface ScrambleCyclerProps {
  /** Phrases to cycle through */
  phrases: string[]
  /** How long a resolved phrase stays visible before scrambling (default 3000) */
  holdMs?: number
  /** Milliseconds per scramble tick — how fast random chars cycle (default 30) */
  scrambleSpeed?: number
  /** Milliseconds between each character resolving left-to-right (default 50) */
  resolveSpeed?: number
}

/* ── constants ────────────────────────────────────── */

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>/\\|{}[]~'

function randomChar(): string {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
}

/* ── phases ────────────────────────────────────────── */

type Phase = 'holding' | 'scrambling' | 'resolving'

/* ── component ────────────────────────────────────── */

/**
 * Scramble-decode cycler. Displays a phrase, then scrambles all characters
 * into random noise, then resolves them left-to-right into the next phrase.
 * Loops infinitely through the phrases array.
 *
 * Terminal / hacking-aesthetic animation. Pure React — zero deps.
 */
export function ScrambleCycler({
  phrases,
  holdMs = 3000,
  scrambleSpeed = 30,
  resolveSpeed = 50,
}: ScrambleCyclerProps) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [display, setDisplay] = useState(phrases[0] ?? '')
  const [phase, setPhase] = useState<Phase>('holding')
  const [resolvedCount, setResolvedCount] = useState(phrases[0]?.length ?? 0)

  // Ref to hold the interval so we can clear it
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // The *next* phrase we're resolving into
  const nextIndex = (phraseIndex + 1) % phrases.length
  const targetPhrase = phrases[nextIndex] ?? ''

  // Padded length — max of current display and target so transition is smooth
  const maxLen = Math.max(display.length, targetPhrase.length)

  /* ── build a scrambled string with N resolved chars on the left ── */
  const buildDisplay = useCallback(
    (resolved: number, target: string, length: number): string => {
      const chars: string[] = []
      for (let i = 0; i < length; i++) {
        if (i < resolved) {
          // Resolved: show the target character
          chars.push(target[i] ?? ' ')
        } else {
          // Not yet resolved: random character (but preserve spaces for readability)
          if (target[i] === ' ' || target[i] === '—' || target[i] === '>') {
            chars.push(target[i])
          } else {
            chars.push(randomChar())
          }
        }
      }
      return chars.join('')
    },
    [],
  )

  /* ── phase: holding ── */
  useEffect(() => {
    if (phase !== 'holding') return
    if (phrases.length <= 1) return // nothing to cycle

    const timer = setTimeout(() => {
      setResolvedCount(0)
      setPhase('scrambling')
    }, holdMs)

    return () => clearTimeout(timer)
  }, [phase, holdMs, phrases.length])

  /* ── phase: scrambling (random noise before resolving) ── */
  useEffect(() => {
    if (phase !== 'scrambling') return

    // Run a few ticks of pure scramble before we start resolving
    let ticks = 0
    const maxTicks = 8 // ~240ms of pure scramble at 30ms/tick

    intervalRef.current = setInterval(() => {
      ticks++
      setDisplay(buildDisplay(0, targetPhrase, maxLen))

      if (ticks >= maxTicks) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setPhase('resolving')
      }
    }, scrambleSpeed)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [phase, scrambleSpeed, targetPhrase, maxLen, buildDisplay])

  /* ── phase: resolving (left-to-right decode) ── */
  useEffect(() => {
    if (phase !== 'resolving') return

    // Scramble the unresolved portion on a fast interval
    intervalRef.current = setInterval(() => {
      setDisplay((prev) => {
        // Keep resolved chars, re-scramble the rest
        const chars: string[] = []
        for (let i = 0; i < maxLen; i++) {
          if (i < resolvedCount) {
            chars.push(targetPhrase[i] ?? ' ')
          } else if (
            targetPhrase[i] === ' ' ||
            targetPhrase[i] === '—' ||
            targetPhrase[i] === '>'
          ) {
            chars.push(targetPhrase[i])
          } else {
            chars.push(randomChar())
          }
        }
        return chars.join('')
      })
    }, scrambleSpeed)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [phase, resolvedCount, scrambleSpeed, targetPhrase, maxLen])

  /* ── resolve one more character at resolveSpeed ── */
  useEffect(() => {
    if (phase !== 'resolving') return

    if (resolvedCount >= targetPhrase.length) {
      // Fully resolved — trim to target length, advance phrase, hold
      setDisplay(targetPhrase)
      setPhraseIndex(nextIndex)
      setResolvedCount(targetPhrase.length)
      setPhase('holding')
      return
    }

    const timer = setTimeout(() => {
      setResolvedCount((c) => c + 1)
    }, resolveSpeed)

    return () => clearTimeout(timer)
  }, [
    phase,
    resolvedCount,
    resolveSpeed,
    targetPhrase,
    nextIndex,
  ])

  /* ── render ── */

  return (
    <>
      <style>{`
        .scramble-cycler {
          font-family: var(--font-mono);
          font-size: 14px;
          font-weight: 600;
          color: var(--accent);
          letter-spacing: 0.04em;
          line-height: 1.6;
          white-space: pre;
          min-height: 1.6em;
        }
        .scramble-char-resolved {
          color: var(--accent);
          opacity: 1;
        }
        .scramble-char-noise {
          color: var(--accent);
          opacity: 0.35;
        }
      `}</style>

      <div className="scramble-cycler" aria-live="polite" aria-atomic="true">
        {display.split('').map((char, i) => (
          <span
            key={i}
            className={
              i < resolvedCount || phase === 'holding'
                ? 'scramble-char-resolved'
                : 'scramble-char-noise'
            }
          >
            {char}
          </span>
        ))}
      </div>
    </>
  )
}
