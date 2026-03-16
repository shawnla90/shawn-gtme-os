'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { trackNewsletterSignup } from '../lib/analytics'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function ScrollSignup() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (dismissed) return

    const handleScroll = () => {
      const scrollPercent =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (scrollPercent > 0.4) {
        setVisible(true)
        window.removeEventListener('scroll', handleScroll)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [dismissed])

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!isValidEmail(email)) return

      setStatus('submitting')

      try {
        const form = formRef.current
        if (form) {
          form.submit()
        }
        trackNewsletterSignup('inline')
        setTimeout(() => setStatus('success'), 1500)
        setTimeout(() => {
          setDismissed(true)
          setVisible(false)
        }, 3000)
      } catch {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    },
    [email],
  )

  if (!visible || dismissed) return null

  return (
    <div style={outer}>
      <div style={card}>
        {/* Accent glow behind the card */}
        <div style={glowEffect} aria-hidden="true" />

        <iframe
          ref={iframeRef}
          name="scroll-signup-frame"
          title="Substack signup"
          style={{ display: 'none' }}
          tabIndex={-1}
        />

        {status === 'success' ? (
          <div style={successBlock}>
            <div style={checkCircle}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 10.5L8.5 14L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p style={successHeadline}>you're in</p>
            <p style={successSub}>welcome to the build.</p>
          </div>
        ) : (
          <>
            <div style={topSection}>
              <div style={accentDot} aria-hidden="true" />
              <p style={headline}>follow the build</p>
              <p style={subtext}>
                what I'm shipping, how I'm building it, and what I'd do differently.
                <br />
                no sales. no spam. just the work.
              </p>
            </div>

            <form
              ref={formRef}
              action="https://shawntenam.substack.com/api/v1/free?nojs=true"
              method="POST"
              target="scroll-signup-frame"
              onSubmit={handleSubmit}
              style={formRow}
            >
              <input type="hidden" name="first_url" value="https://shawntenam.substack.com/" />
              <input type="hidden" name="first_referrer" value="" />
              <input type="hidden" name="current_url" value="https://shawntenam.substack.com/" />
              <input type="hidden" name="current_referrer" value="" />

              <div style={inputGroup}>
                <input
                  type="email"
                  name="email"
                  placeholder="your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status === 'error') setStatus('idle')
                  }}
                  required
                  style={emailInput}
                  aria-label="Email address"
                />

                <button
                  type="submit"
                  disabled={status === 'submitting' || !email}
                  style={{
                    ...submitBtn,
                    opacity: status === 'submitting' || !email ? 0.5 : 1,
                    cursor: status === 'submitting' ? 'wait' : 'pointer',
                  }}
                >
                  {status === 'submitting' ? 'joining...' : 'subscribe'}
                </button>
              </div>
            </form>

            {status === 'error' && (
              <p style={errorText}>something went wrong — try again.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/* ---------- styles ---------- */

const outer: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  padding: '20px 16px',
  pointerEvents: 'none',
  animation: 'scrollSignupFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
}

const card: React.CSSProperties = {
  position: 'relative',
  maxWidth: '480px',
  margin: '0 auto',
  padding: '28px 28px 24px',
  pointerEvents: 'auto',
  background: '#0D1117',
  border: '1px solid rgba(78, 195, 115, 0.2)',
  borderRadius: '16px',
  overflow: 'hidden',
}

const glowEffect: React.CSSProperties = {
  position: 'absolute',
  top: '-1px',
  left: '-1px',
  right: '-1px',
  height: '3px',
  background: 'linear-gradient(90deg, transparent, #4EC373, transparent)',
  borderRadius: '16px 16px 0 0',
}

const topSection: React.CSSProperties = {
  marginBottom: '20px',
}

const accentDot: React.CSSProperties = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  background: '#4EC373',
  boxShadow: '0 0 8px rgba(78, 195, 115, 0.6)',
  marginBottom: '12px',
}

const headline: React.CSSProperties = {
  margin: '0 0 8px',
  fontSize: '20px',
  fontWeight: 700,
  color: '#E6EDF3',
  letterSpacing: '-0.02em',
  lineHeight: 1.2,
}

const subtext: React.CSSProperties = {
  margin: 0,
  fontSize: '13px',
  lineHeight: 1.6,
  color: '#8B949E',
}

const formRow: React.CSSProperties = {
  margin: 0,
}

const inputGroup: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  alignItems: 'stretch',
}

const emailInput: React.CSSProperties = {
  flex: 1,
  minHeight: '44px',
  padding: '0 16px',
  fontSize: '14px',
  color: '#E6EDF3',
  background: '#161B22',
  border: '1px solid rgba(78, 195, 115, 0.15)',
  borderRadius: '10px',
  outline: 'none',
  transition: 'border-color 0.2s',
}

const submitBtn: React.CSSProperties = {
  minHeight: '44px',
  padding: '0 24px',
  fontSize: '14px',
  fontWeight: 600,
  color: '#0D1117',
  background: 'linear-gradient(135deg, #4EC373 0%, #3BA55D 100%)',
  border: 'none',
  borderRadius: '10px',
  transition: 'opacity 0.15s, transform 0.1s',
  whiteSpace: 'nowrap',
  boxShadow: '0 2px 12px rgba(78, 195, 115, 0.3)',
}

const successBlock: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 0',
}

const checkCircle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'rgba(78, 195, 115, 0.15)',
  border: '1px solid rgba(78, 195, 115, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#4EC373',
}

const successHeadline: React.CSSProperties = {
  margin: 0,
  fontSize: '18px',
  fontWeight: 700,
  color: '#E6EDF3',
}

const successSub: React.CSSProperties = {
  margin: 0,
  fontSize: '13px',
  color: '#8B949E',
}

const errorText: React.CSSProperties = {
  margin: '10px 0 0',
  fontSize: '12px',
  color: '#E05555',
}
