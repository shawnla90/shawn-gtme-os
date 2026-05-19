'use client'

import type { CSSProperties } from 'react'

interface LivePulseProps {
  size?: number
  color?: string
  label?: string
}

export function LivePulse({
  size = 8,
  color = 'var(--accent)',
  label = 'Live',
}: LivePulseProps) {
  const wrap: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
  }
  const dotWrap: CSSProperties = {
    position: 'relative',
    width: size,
    height: size,
    display: 'inline-block',
  }
  const core: CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    background: color,
    boxShadow: `0 0 ${size}px ${color}`,
  }
  const ring: CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    background: color,
    opacity: 0.6,
    animation: 'live-pulse-ring 1.6s cubic-bezier(0, 0, 0.2, 1) infinite',
  }

  return (
    <span style={wrap} aria-label={`${label} feed indicator`}>
      <style jsx>{`
        @keyframes live-pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(2.6);
            opacity: 0;
          }
        }
      `}</style>
      <span style={dotWrap} aria-hidden>
        <span style={ring} />
        <span style={core} />
      </span>
      <span>{label}</span>
    </span>
  )
}
