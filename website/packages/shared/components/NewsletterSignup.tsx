'use client'

import React, { useState, useRef, useCallback } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

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
        setTimeout(() => setStatus('success'), 1500)
      } catch {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    },
    [email],
  )

  const blinkKeyframes = `
    @keyframes nl-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  `

  if (status === 'success') {
    return (
      <div style={wrapperStyle}>
        <style>{blinkKeyframes}</style>
        <div style={containerStyle}>
          <p style={successStyle}>
            <span style={{ color: 'var(--accent)', marginRight: '8px' }}>✓</span>
            // subscribed. welcome to the build.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={wrapperStyle}>
      <style>{blinkKeyframes}</style>
      <div style={containerStyle}>
        {/* Hidden iframe target for Substack form */}
        <iframe
          ref={iframeRef}
          name="substack-signup-frame"
          title="Substack signup"
          style={{ display: 'none' }}
          tabIndex={-1}
        />

        <p style={headingStyle}>// subscribe to follow the build</p>

        <p style={descStyle}>
          get build logs, quest updates, and gtm engineering drops.
          <br />
          no spam. unsubscribe anytime.
        </p>

        <form
          ref={formRef}
          action="https://shawntenam.substack.com/api/v1/free?nojs=true"
          method="POST"
          target="substack-signup-frame"
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
            <span style={cursorStyle} />
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
  borderTop: '1px solid var(--border)',
  padding: '48px 24px',
}

const containerStyle: React.CSSProperties = {
  maxWidth: '560px',
  margin: '0 auto',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  padding: '32px 28px',
}

const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '14px',
  color: 'var(--accent)',
  margin: '0 0 12px',
}

const descStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
  lineHeight: '1.6',
  color: 'var(--text-secondary)',
  margin: '0 0 24px',
}

const formStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
}

const inputWrapperStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flex: '1 1 240px',
  background: 'var(--canvas)',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  padding: '0 12px',
  minHeight: '40px',
}

const promptStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '14px',
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
  fontSize: '13px',
  color: 'var(--text-primary)',
  padding: '8px 0',
}

const cursorStyle: React.CSSProperties = {
  width: '2px',
  height: '16px',
  background: 'var(--accent)',
  animation: 'nl-blink 1s step-end infinite',
}

const buttonStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
  fontWeight: 600,
  background: 'var(--accent)',
  color: 'var(--canvas)',
  border: 'none',
  borderRadius: '4px',
  padding: '8px 20px',
  minHeight: '40px',
  transition: 'opacity 0.15s',
}

const successStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '14px',
  color: 'var(--accent)',
  margin: 0,
  textAlign: 'center',
}

const errorStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  color: '#E05555',
  margin: '12px 0 0',
}
