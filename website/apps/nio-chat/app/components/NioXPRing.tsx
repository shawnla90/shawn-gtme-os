// NioBot V3 — Circular XP progress ring around avatar (CSS conic-gradient)

'use client'

import type { ReactNode } from 'react'

const TIER_COLORS: Record<number, string> = {
  1: '#4EC373', // green
  2: '#6B8AFF', // blue
  3: '#C084FC', // purple
  4: '#F59E0B', // amber
  5: '#EF4444', // red
}

interface NioXPRingProps {
  progress: number  // 0-1
  tier: number
  children: ReactNode
  size?: number
}

export default function NioXPRing({ progress, tier, children, size = 44 }: NioXPRingProps) {
  const color = TIER_COLORS[tier] || TIER_COLORS[1]
  const borderWidth = 2
  const angle = Math.round(progress * 360)

  return (
    <div
      className="relative rounded-full"
      style={{
        width: size,
        height: size,
        padding: borderWidth,
        background: `conic-gradient(${color} ${angle}deg, var(--border) ${angle}deg)`,
      }}
    >
      <div
        className="rounded-full overflow-hidden flex items-center justify-center"
        style={{
          width: size - borderWidth * 2,
          height: size - borderWidth * 2,
          background: 'var(--canvas)',
        }}
      >
        {children}
      </div>
    </div>
  )
}
