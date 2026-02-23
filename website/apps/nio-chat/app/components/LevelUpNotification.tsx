// NioBot V3 — Toast overlay for level/tier-up celebrations

'use client'

import { useState, useEffect } from 'react'
import { onLevelUp, type LevelUpEvent } from './EvolutionProvider'
import { useChimeContext } from './ChimeProvider'

export default function LevelUpNotification() {
  const [event, setEvent] = useState<LevelUpEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const { play } = useChimeContext()

  useEffect(() => {
    return onLevelUp((e) => {
      setEvent(e)
      setVisible(true)
      play('levelUp')

      // Auto-dismiss after 3 seconds
      setTimeout(() => setVisible(false), 3000)
      setTimeout(() => setEvent(null), 3500)
    })
  }, [play])

  if (!event) return null

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] pointer-events-none transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className={`px-5 py-3 rounded-xl border shadow-lg backdrop-blur-sm ${
        event.isTierUp
          ? 'bg-[var(--accent)]/20 border-[var(--accent)] level-up-glow'
          : 'bg-[var(--canvas-overlay)] border-[var(--border)]'
      }`}>
        <div className="text-center">
          {event.isTierUp ? (
            <>
              <p className="text-xs text-[var(--accent)] font-bold mb-0.5">TIER UP</p>
              <p className="text-sm font-bold text-[var(--text-primary)]">{event.tierName}</p>
              <p className="text-[10px] text-[var(--text-muted)]">tier {event.newTier} unlocked</p>
            </>
          ) : (
            <>
              <p className="text-xs text-[var(--accent)] font-bold mb-0.5">LEVEL UP</p>
              <p className="text-sm text-[var(--text-primary)]">
                {event.tierName} lv.{event.newLevel}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
