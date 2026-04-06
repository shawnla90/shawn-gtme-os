'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { trackNewsletterSignup } from '../lib/analytics'
import { subscribeEmail } from '../lib/subscribe'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const STORAGE_KEY = 'scroll-signup-subscribed'

export function ScrollSignup() {
  const [visible, setVisible] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const mountTime = useRef(Date.now())
  const substackIframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) {
        setSubscribed(true)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (subscribed) return

    let scrollReady = false
    let timeReady = false

    const maybeShow = () => {
      if (scrollReady && timeReady) {
        setVisible(true)
        window.removeEventListener('scroll', handleScroll)
      }
    }

    const handleScroll = () => {
      const scrollPercent =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (scrollPercent > 0.4) {
        scrollReady = true
        maybeShow()
      }
    }

    const timer = setTimeout(() => {
      timeReady = true
      maybeShow()
    }, 6000)

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
  }, [subscribed])

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleDismiss = useCallback(() => {
    setDismissed(true)
    setVisible(false)
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!isValidEmail(email)) return

      setStatus('submitting')

      try { localStorage.setItem(STORAGE_KEY, '1') } catch {}

      // Track in PostHog client-side
      const pathname = window.location.pathname
      const site = window.location.hostname.includes('gtmos')
        ? 'gtmos'
        : window.location.hostname.includes('contentos')
          ? 'contentos'
          : 'shawnos'
      const slug = pathname.split('/').filter(Boolean).pop() || ''
      trackNewsletterSignup('inline', {
        site,
        content_slug: slug,
        seconds_on_page: Math.round((Date.now() - mountTime.current) / 1000),
      })

      // Send to Substack via hidden iframe FIRST (runs from user's browser, not server)
      if (substackIframeRef.current) {
        substackIframeRef.current.src =
          `https://shawntenam.substack.com/subscribe?email=${encodeURIComponent(email)}&just_hierarchical=true`
      }

      // Capture email server-side (PostHog + Telegram + Sheets)
      await subscribeEmail(email)

      setStatus('success')
      setTimeout(() => {
        setSubscribed(true)
        setVisible(false)
      }, 3000)
    },
    [email],
  )

  if (!visible || subscribed || dismissed) return null

  return (
    <div style={overlay} onClick={handleDismiss}>
      <div style={card} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleDismiss}
          style={dismissBtn}
          aria-label="Close signup"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div style={glowBar} aria-hidden="true" />
        <div style={gridPattern} aria-hidden="true" />

        {/* Hidden iframe for Substack subscribe */}
        <iframe
          ref={substackIframeRef}
          style={{ display: 'none' }}
          title="Substack subscribe"
          tabIndex={-1}
        />

        {status === 'success' ? (
          <div style={successBlock}>
            <div style={checkCircle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 13L10 18L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p style={successTitle}>you&apos;re in</p>
            <p style={successSub}>check your email to confirm.</p>
          </div>
        ) : (
          <div style={content}>
            <div style={textBlock}>
              <p style={headline}>
                follow the <span style={greenText}>build</span>
              </p>
              <p style={subtext}>
                what I&apos;m shipping, how I&apos;m building it, and what I&apos;d do differently.
                <br />
                <span style={{ fontSize: '12px', opacity: 0.7 }}>
                  signed up before and didn&apos;t get a confirmation? we fixed it. try again.
                </span>
              </p>
            </div>

            <form onSubmit={handleSubmit} style={formBlock}>
              <div style={inputRow}>
                <input
                  type="email"
                  placeholder="your@email.com"
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
              <p style={errorText}>something went wrong. try again.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------- styles ---------- */

const overlay: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(6px)',
  padding: '24px',
  animation: 'scrollSignupFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
}

const dismissBtn: React.CSSProperties = {
  position: 'absolute',
  top: '14px',
  right: '14px',
  zIndex: 2,
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  color: '#8B949E',
  cursor: 'pointer',
  padding: 0,
  transition: 'color 0.15s, background 0.15s',
}

const card: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  maxWidth: '520px',
  padding: '48px 40px 40px',
  background: '#0D1117',
  border: '1px solid rgba(78, 195, 115, 0.25)',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow:
    '0 0 80px rgba(78, 195, 115, 0.12), 0 0 40px rgba(0, 0, 0, 0.5)',
}

const glowBar: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '2px',
  background: 'linear-gradient(90deg, transparent 0%, #4EC373 30%, #4EC373 70%, transparent 100%)',
  boxShadow: '0 0 20px rgba(78, 195, 115, 0.5), 0 0 60px rgba(78, 195, 115, 0.2)',
}

const gridPattern: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundImage:
    'linear-gradient(rgba(78, 195, 115, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(78, 195, 115, 0.03) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
  pointerEvents: 'none',
}

const content: React.CSSProperties = {
  position: 'relative',
}

const textBlock: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '32px',
}

const headline: React.CSSProperties = {
  margin: '0 0 12px',
  fontSize: '28px',
  fontWeight: 700,
  color: '#E6EDF3',
  letterSpacing: '-0.03em',
  lineHeight: 1.2,
}

const greenText: React.CSSProperties = {
  color: '#4EC373',
  textShadow: '0 0 20px rgba(78, 195, 115, 0.4)',
}

const subtext: React.CSSProperties = {
  margin: 0,
  fontSize: '15px',
  lineHeight: 1.7,
  color: '#8B949E',
}

const formBlock: React.CSSProperties = {
  position: 'relative',
}

const inputRow: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
  alignItems: 'stretch',
}

const emailInput: React.CSSProperties = {
  flex: 1,
  minHeight: '52px',
  padding: '0 18px',
  fontSize: '15px',
  color: '#E6EDF3',
  background: '#161B22',
  border: '1px solid rgba(78, 195, 115, 0.2)',
  borderRadius: '12px',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const submitBtn: React.CSSProperties = {
  minHeight: '52px',
  padding: '0 32px',
  fontSize: '16px',
  fontWeight: 700,
  letterSpacing: '-0.01em',
  color: '#0D1117',
  background: 'linear-gradient(135deg, #5EE89A 0%, #4EC373 50%, #3BA55D 100%)',
  border: 'none',
  borderRadius: '12px',
  transition: 'opacity 0.15s, transform 0.1s',
  whiteSpace: 'nowrap',
  boxShadow:
    '0 4px 20px rgba(78, 195, 115, 0.35), 0 0 40px rgba(78, 195, 115, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
}

const successBlock: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  padding: '16px 0',
}

const checkCircle: React.CSSProperties = {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  background: 'rgba(78, 195, 115, 0.15)',
  border: '2px solid rgba(78, 195, 115, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#4EC373',
  boxShadow: '0 0 24px rgba(78, 195, 115, 0.2)',
}

const successTitle: React.CSSProperties = {
  margin: 0,
  fontSize: '24px',
  fontWeight: 700,
  color: '#E6EDF3',
}

const successSub: React.CSSProperties = {
  margin: 0,
  fontSize: '15px',
  color: '#8B949E',
}

const errorText: React.CSSProperties = {
  margin: '12px 0 0',
  fontSize: '13px',
  color: '#E05555',
  textAlign: 'center',
}
