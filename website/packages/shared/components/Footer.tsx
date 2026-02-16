import React from 'react'
import { NewsletterSignup } from './NewsletterSignup'

interface FooterProps {
  siteName?: string
}

export function Footer({ siteName }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer>
      <NewsletterSignup />

      <div
        style={{
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <p style={{ margin: '0 0 4px' }}>
          built in public. powered by cursor.
        </p>
        <p style={{ margin: 0 }}>
          &copy; {year} {siteName ?? 'shawnos'}. all rights reserved.
        </p>
      </div>
    </footer>
  )
}
