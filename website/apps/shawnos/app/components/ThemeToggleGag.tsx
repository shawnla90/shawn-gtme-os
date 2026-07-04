'use client'

import { useEffect, useRef, useState } from 'react'
import { ThemeToggle } from '@shawnos/shared/components'
import { useTheme } from '@shawnos/shared/hooks/useTheme'

const PEEK_MS = 900 // how long the visitor gets to believe in light mode
const GAG_MS = 1400 // glitch overlay duration before dark returns

/**
 * Wraps the shared ThemeToggle. Flipping dark -> light lets light mode
 * through for a moment, then a glitchy "there is no light mode." overlay
 * takes it back and the site returns to dark. Light mode never persists;
 * that is the joke.
 */
export function ThemeToggleGag() {
  const { theme, setTheme } = useTheme()
  const [gagActive, setGagActive] = useState(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // Never strand the overlay or a pending revert: clear timers on unmount.
  useEffect(() => {
    return () => {
      for (const t of timersRef.current) clearTimeout(t)
    }
  }, [])

  const handleClickCapture = (e: React.MouseEvent) => {
    if (theme !== 'dark' || gagActive) return

    // Let them taste light mode, then take it away.
    e.preventDefault()
    e.stopPropagation()
    setTheme('light')
    timersRef.current.push(
      setTimeout(() => setGagActive(true), PEEK_MS),
      setTimeout(() => {
        setTheme('dark')
        setGagActive(false)
      }, PEEK_MS + GAG_MS),
    )
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
            background: '#0a0a0a',
            animation: `ttg-swallow ${GAG_MS}ms steps(1, end) forwards`,
            pointerEvents: 'none',
          }}
        >
          <style>{`
            @keyframes ttg-swallow {
              0% { background: rgba(10, 10, 10, 0.55); }
              18% { background: #0a0a0a; }
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
