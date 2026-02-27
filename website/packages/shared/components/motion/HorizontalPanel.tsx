'use client'

import type { CSSProperties, ReactNode } from 'react'

interface HorizontalPanelProps {
  children: ReactNode
  style?: CSSProperties
  className?: string
}

export function HorizontalPanel({ children, style, className }: HorizontalPanelProps) {
  return (
    <div
      className={className}
      style={{
        width: '100vw',
        height: '100vh',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ width: '100%', maxWidth: 1200, padding: '0 48px' }}>
        {children}
      </div>
    </div>
  )
}
