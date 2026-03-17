'use client'

import React, { useState, useEffect } from 'react'

const STORAGE_KEY = 'scroll-signup-subscribed'

export function NewsletterSignup() {
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) {
        setSubscribed(true)
      }
    } catch {
      // localStorage unavailable
    }
  }, [])

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <p style={headingStyle}>// subscribe to follow the build</p>

        {subscribed ? (
          <p style={subscribedStyle}>
            <span style={{ color: 'var(--accent)', marginRight: '8px' }}>✓</span>
            you&apos;re already subscribed. thanks for being here.
          </p>
        ) : (
          <>
            <p style={descStyle}>
              get build logs, quest updates, and gtm engineering drops.
              <br />
              no spam. unsubscribe anytime.
            </p>

            <iframe
              src="https://shawntenam.substack.com/embed"
              width="100%"
              height="150"
              style={iframeStyle}
              frameBorder="0"
              scrolling="no"
              title="Subscribe to Substack"
            />
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
  margin: '0 0 16px',
}

const subscribedStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
  color: 'var(--text-secondary)',
  margin: 0,
}

const iframeStyle: React.CSSProperties = {
  borderRadius: '4px',
  background: 'transparent',
}
