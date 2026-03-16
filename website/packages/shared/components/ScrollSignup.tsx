'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { trackNewsletterSignup } from '../lib/analytics'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function ScrollSignup() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const sentinelRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    // don't show if already dismissed this session
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

  if (!visible || dismissed) return <div ref={sentinelRef} />

  if (status === 'success') {
    return (
      <div style={wrapperStyle}>
        <div style={containerStyle}>
          <p style={successStyle}>
            <span style={{ color: 'var(--accent)', marginRight: '8px' }}>✓</span>
            you're in. welcome to the build.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <iframe
          ref={iframeRef}
          name="scroll-signup-frame"
          title="Substack signup"
          style={{ display: 'none' }}
          tabIndex={-1}
        />

        <div style={headerRowStyle}>
          <p style={headingStyle}>// appreciate you reading this far</p>
          <button
            onClick={handleDismiss}
            style={dismissStyle}
            aria-label="Dismiss signup"
          >
            ×
          </button>
        </div>

        <p style={descStyle}>
          sign up if you want to follow the build. no sales, no spam.
          <br />
          just ships, repos, and the occasional late-night build log.
        </p>

        <form
          ref={formRef}
          action="https://shawntenam.substack.com/api/v1/free?nojs=true"
          method="POST"
          target="scroll-signup-frame"
          onSubmit={handleSubmit}
          style={formStyle}
        >
          <input type="hidden" name="first_url" value="https://shawntenam.substack.com/" />
          <input type="hidden" name="first_referrer" value="" />
          <input type="hidden" name="current_url" value="https://shawntenam.substack.com/" />
          <input type="hidden" name="current_referrer" value="" />

          <div style={inputWrapperStyle}>
            <span style={promptStyle}>&gt;</span>
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === 'error') setStatus('idle')
              }}
              required
              style={inputStyle}
              aria-label="Email address"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting' || !email}
            style={{
              ...buttonStyle,
              opacity: status === 'submitting' || !email ? 0.5 : 1,
              cursor: status === 'submitting' ? 'wait' : 'pointer',
            }}
          >
            {status === 'submitting' ? 'sending...' : 'subscribe'}
          </button>
        </form>

        {status === 'error' && (
          <p style={errorStyle}>// error. try again.</p>
        )}
      </div>
    </div>
  )
}

/* ---------- styles ---------- */

const wrapperStyle: React.CSSProperties = {
  padding: '32px 24px',
  animation: 'scrollSignupFadeIn 0.4s ease-out',
}

const containerStyle: React.CSSProperties = {
  maxWidth: '560px',
  margin: '0 auto',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  padding: '24px 24px',
}

const headerRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
}

const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
  color: 'var(--accent)',
  margin: 0,
}

const dismissStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  fontSize: '18px',
  cursor: 'pointer',
  padding: '0 4px',
  lineHeight: 1,
  fontFamily: 'var(--font-mono)',
}

const descStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  lineHeight: '1.6',
  color: 'var(--text-secondary)',
  margin: '0 0 16px',
}

const formStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
}

const inputWrapperStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flex: '1 1 220px',
  background: 'var(--canvas)',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  padding: '0 12px',
  minHeight: '36px',
}

const promptStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
  color: 'var(--accent)',
  marginRight: '8px',
  userSelect: 'none',
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  color: 'var(--text-primary)',
  padding: '8px 0',
}

const buttonStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  fontWeight: 600,
  background: 'var(--accent)',
  color: 'var(--canvas)',
  border: 'none',
  borderRadius: '4px',
  padding: '8px 16px',
  minHeight: '36px',
  transition: 'opacity 0.15s',
}

const successStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
  color: 'var(--accent)',
  margin: 0,
  textAlign: 'center',
}

const errorStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  color: '#E05555',
  margin: '8px 0 0',
}
