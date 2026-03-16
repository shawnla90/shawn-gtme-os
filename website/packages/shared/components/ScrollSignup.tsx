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
        }, 3500)
      } catch {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    },
    [email],
  )

  const handleDismiss = () => {
    setDismissed(true)
    setVisible(false)
  }

  if (!visible || dismissed) return null

  return (
    <div style={backdrop}>
      <div style={bar}>
        <button
          onClick={handleDismiss}
          style={closeBtn}
          aria-label="Dismiss signup"
        >
          &times;
        </button>

        <iframe
          ref={iframeRef}
          name="scroll-signup-frame"
          title="Substack signup"
          style={{ display: 'none' }}
          tabIndex={-1}
        />

        {status === 'success' ? (
          <p style={successText}>welcome to the build.</p>
        ) : (
          <>
            <div style={copyBlock}>
              <p style={headline}>follow the build</p>
              <p style={subline}>
                ships, repos, and the occasional late-night build log. no spam.
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

              <input
                type="email"
                name="email"
                placeholder="you@email.com"
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
                  opacity: status === 'submitting' || !email ? 0.6 : 1,
                  cursor: status === 'submitting' ? 'wait' : 'pointer',
                }}
              >
                {status === 'submitting' ? 'joining...' : 'subscribe'}
              </button>
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

const backdrop: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  padding: '16px',
  pointerEvents: 'none',
  animation: 'scrollSignupFadeIn 0.5s ease-out',
}

const bar: React.CSSProperties = {
  position: 'relative',
  maxWidth: '540px',
  margin: '0 auto',
  padding: '20px 24px',
  pointerEvents: 'auto',
  background: 'color-mix(in srgb, var(--canvas-subtle) 95%, var(--accent) 5%)',
  border: '1px solid color-mix(in srgb, var(--accent) 25%, var(--border) 75%)',
  borderRadius: '12px',
  boxShadow:
    '0 -4px 24px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
  backdropFilter: 'blur(12px)',
}

const closeBtn: React.CSSProperties = {
  position: 'absolute',
  top: '8px',
  right: '10px',
  background: 'none',
  border: 'none',
  color: 'var(--text-secondary)',
  fontSize: '20px',
  lineHeight: 1,
  cursor: 'pointer',
  padding: '4px 8px',
  borderRadius: '4px',
  transition: 'color 0.15s',
}

const copyBlock: React.CSSProperties = {
  marginBottom: '14px',
  paddingRight: '28px',
}

const headline: React.CSSProperties = {
  margin: 0,
  fontSize: '15px',
  fontWeight: 600,
  color: 'var(--text-primary)',
  letterSpacing: '-0.01em',
}

const subline: React.CSSProperties = {
  margin: '4px 0 0',
  fontSize: '13px',
  lineHeight: 1.5,
  color: 'var(--text-secondary)',
}

const formRow: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  flexWrap: 'wrap',
}

const emailInput: React.CSSProperties = {
  flex: '1 1 200px',
  minHeight: '40px',
  padding: '0 14px',
  fontSize: '14px',
  color: 'var(--text-primary)',
  background: 'var(--canvas)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  outline: 'none',
  transition: 'border-color 0.15s',
}

const submitBtn: React.CSSProperties = {
  minHeight: '40px',
  padding: '0 20px',
  fontSize: '14px',
  fontWeight: 600,
  color: '#fff',
  background: 'var(--accent)',
  border: 'none',
  borderRadius: '8px',
  transition: 'opacity 0.15s, transform 0.1s',
  whiteSpace: 'nowrap',
}

const successText: React.CSSProperties = {
  margin: 0,
  fontSize: '15px',
  fontWeight: 600,
  color: 'var(--accent)',
  textAlign: 'center',
  padding: '4px 0',
}

const errorText: React.CSSProperties = {
  margin: '8px 0 0',
  fontSize: '12px',
  color: '#E05555',
}
