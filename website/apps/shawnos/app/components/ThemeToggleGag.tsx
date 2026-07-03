'use client'

import { useEffect, useRef, useState } from 'react'
import { ThemeToggle } from '@shawnos/shared/components'
import { useTheme } from '@shawnos/shared/hooks/useTheme'

const GAG_KEY = 'light-mode-gag'
const GAG_MS = 1200

/**
 * Wraps the shared ThemeToggle. The first time a visitor flips dark -> light
 * in a session, it holds the switch for ~1.2s, flashes a glitchy full-screen
 * "there is no light mode." overlay, then lets the light theme through.
 * Every toggle after that behaves normally. light -> dark never gags.
 */
export function ThemeToggleGag() {
  const { theme, setTheme } = useTheme()
  const [gagActive, setGagActive] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Never strand the overlay: clear the timer on unmount.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleClickCapture = (e: React.MouseEvent) => {
    if (theme !== 'dark' || gagActive) return
    let seen = true
    try {
      seen = sessionStorage.getItem(GAG_KEY) === '1'
    } catch {
      seen = true
    }
    if (seen) return

    // Intercept this dark -> light switch and play the gag first.
    e.preventDefault()
    e.stopPropagation()
    try {
      sessionStorage.setItem(GAG_KEY, '1')
    } catch {
      /* storage unavailable — gag once per mount instead */
    }
    setGagActive(true)
    timeoutRef.current = setTimeout(() => {
      setGagActive(false)
      setTheme('light')
    }, GAG_MS)
  }

  return (
    <>
      <span onClickCapture={handleClickCapture} style={{ display: 'inline-flex' }}>
        <ThemeToggle />
      </span>
      {gagActive && (
        <div
          aria-live="polite"
          role="status"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fafafa',
            animation: `ttg-flash ${GAG_MS}ms steps(1, end) forwards`,
            pointerEvents: 'none',
          }}
        >
          <style>{`
            @keyframes ttg-flash {
              0% { background: #fafafa; }
              12% { background: #0a0a0a; }
              100% { background: #0a0a0a; }
            }
            @keyframes ttg-jitter {
              0%, 100% { transform: translate(0, 0); opacity: 1; }
              10% { transform: translate(-3px, 1px) skewX(-4deg); opacity: 0.85; }
              20% { transform: translate(3px, -2px); opacity: 1; }
              30% { transform: translate(-2px, 2px) skewX(3deg); opacity: 0.7; }
              45% { transform: translate(2px, 0); opacity: 1; }
              60% { transform: translate(-1px, -1px) skewX(-2deg); opacity: 0.9; }
              75% { transform: translate(1px, 1px); opacity: 1; }
            }
            @media (prefers-reduced-motion: reduce) {
              .ttg-text { animation: none !important; text-shadow: none !important; }
            }
          `}</style>
          <p
            className="ttg-text"
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 'clamp(16px, 3vw, 24px)',
              letterSpacing: '0.06em',
              color: '#fafafa',
              margin: 0,
              animation: 'ttg-jitter 0.35s linear infinite',
              textShadow: '2px 0 0 rgba(109, 94, 233, 0.8), -2px 0 0 rgba(139, 125, 255, 0.6)',
            }}
          >
            there is no light mode.
          </p>
        </div>
      )}
    </>
  )
}
