'use client'

import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'

const STORAGE_KEY = 'scroll-signup-subscribed'
const SUBSTACK_SUBSCRIBE_URL = 'https://shawntenam.substack.com/subscribe'

export function NewsletterSignup() {
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) {
        setSubscribed(true)
      }
    } catch {
      // localStorage unavailable
    }
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return
    const url = `${SUBSTACK_SUBSCRIBE_URL}?email=${encodeURIComponent(trimmed)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // localStorage unavailable
    }
    setSubscribed(true)
  }

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <p style={headingStyle}>// subscribe to follow the build</p>

        {subscribed ? (
          <p style={subscribedStyle}>
            <span style={{ color: 'var(--text-primary)', marginRight: '8px' }}>✓</span>
            you&apos;re subscribed. thanks for being here.
          </p>
        ) : (
          <>
            <p style={descStyle}>
              build logs, quest updates, and gtm engineering drops.
              <br />
              no spam. unsubscribe anytime.
            </p>

            <form onSubmit={handleSubmit} style={formStyle}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={inputStyle}
                aria-label="email address"
              />
              <Button type="submit" variant="primary" size="md">
                Subscribe
              </Button>
            </form>
          </>
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
  borderRadius: '12px',
  padding: '32px 28px',
}

const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '14px',
  color: 'var(--text-primary)',
  margin: '0 0 12px',
}

const descStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
  lineHeight: '1.6',
  color: 'var(--text-secondary)',
  margin: '0 0 20px',
}

const subscribedStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
  color: 'var(--text-secondary)',
  margin: 0,
}

const formStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  flexWrap: 'wrap',
}

const inputStyle: React.CSSProperties = {
  flex: '1 1 200px',
  minWidth: 0,
  padding: '12px 16px',
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
  color: 'var(--text-primary)',
  background: 'var(--canvas)',
  border: '1px solid var(--canvas-border)',
  borderRadius: '9999px',
  outline: 'none',
}
