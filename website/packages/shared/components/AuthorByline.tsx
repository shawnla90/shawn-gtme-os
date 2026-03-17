import React from 'react'

export function AuthorByline() {
  return (
    <p
      style={{
        fontSize: '12px',
        color: 'var(--text-muted)',
        margin: '8px 0 0',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.3px',
      }}
    >
      by Shawn Tenam
    </p>
  )
}
