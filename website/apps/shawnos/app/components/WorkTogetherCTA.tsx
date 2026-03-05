"use client"

import { usePostHog } from "posthog-js/react"

export function WorkTogetherCTA() {
  const posthog = usePostHog()

  const track = (source: string) => {
    posthog?.capture("nio_work_with_me_clicked", { source })
  }

  const linkStyle: React.CSSProperties = {
    fontSize: '14px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'color 0.15s ease',
    borderBottom: '1px solid transparent',
  }

  const onEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = 'var(--accent)'
    e.currentTarget.style.borderBottomColor = 'var(--accent)'
  }
  const onLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = 'var(--text-secondary)'
    e.currentTarget.style.borderBottomColor = 'transparent'
  }

  return (
    <div style={{ textAlign: 'center', padding: '32px 24px' }}>
      <p
        style={{
          fontSize: 'clamp(18px, 2.5vw, 24px)',
          fontWeight: 600,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
          margin: '0 0 16px',
        }}
      >
        want to work together?
      </p>
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a
          href="https://cal.com/shawntenam/30min"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("book_a_call")}
          style={linkStyle}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          book a call
        </a>
        <a
          href="mailto:shawn@thegtmos.ai"
          onClick={() => track("email")}
          style={linkStyle}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          drop me a line
        </a>
      </div>
    </div>
  )
}
