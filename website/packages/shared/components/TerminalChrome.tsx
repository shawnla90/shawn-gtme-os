import React from 'react'

interface TerminalChromeProps {
  title?: string
  children: React.ReactNode
}

export function TerminalChrome({ title = 'terminal', children }: TerminalChromeProps) {
  return (
    <div
      style={{
        background: 'var(--canvas)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          background: 'var(--canvas-subtle)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Traffic lights */}
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#E05555',
            display: 'inline-block',
          }}
        />
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#D2A53C',
            display: 'inline-block',
          }}
        />
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#4EC373',
            display: 'inline-block',
          }}
        />
        <span
          style={{
            flex: 1,
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            userSelect: 'none',
          }}
        >
          {title}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  )
}
