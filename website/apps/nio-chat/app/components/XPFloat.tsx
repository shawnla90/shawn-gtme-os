// NioBot V3 — Floating "+XP" text animation

'use client'

import { useState, useEffect } from 'react'
import { onXPGain, type XPGain } from './EvolutionProvider'

interface FloatItem {
  id: number
  amount: number
  source: string
}

let nextId = 0

export default function XPFloat() {
  const [floats, setFloats] = useState<FloatItem[]>([])

  useEffect(() => {
    return onXPGain((gain: XPGain) => {
      const id = nextId++
      setFloats(prev => [...prev, { id, amount: gain.amount, source: gain.source }])

      // Remove after animation completes
      setTimeout(() => {
        setFloats(prev => prev.filter(f => f.id !== id))
      }, 1500)
    })
  }, [])

  if (floats.length === 0) return null

  return (
    <div className="fixed top-14 right-3 z-[60] pointer-events-none">
      {floats.map((f, i) => (
        <div
          key={f.id}
          className="xp-float text-xs font-bold"
          style={{
            color: 'var(--accent)',
            animationDelay: `${i * 50}ms`,
          }}
        >
          +{f.amount} XP
        </div>
      ))}
    </div>
  )
}
