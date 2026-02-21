'use client'

import { useState, useEffect } from 'react'
import { tierColor, getTierAvatarUrls, TITLE_TABLE } from '@shawnos/shared/lib/rpg'

interface AvatarUnlockCeremonyProps {
  currentTier: number
  currentTitle: string
  level: number
}

export default function AvatarUnlockCeremony({ currentTier, currentTitle, level }: AvatarUnlockCeremonyProps) {
  const [show, setShow] = useState(false)
  const [oldTier, setOldTier] = useState<number | null>(null)

  useEffect(() => {
    const key = 'mc_lastSeenTier'
    const stored = localStorage.getItem(key)
    const lastSeen = stored ? parseInt(stored, 10) : 0

    if (lastSeen > 0 && currentTier > lastSeen) {
      setOldTier(lastSeen)
      setShow(true)
      // Auto-dismiss after 5s
      const timer = setTimeout(() => setShow(false), 5000)
      localStorage.setItem(key, String(currentTier))
      return () => clearTimeout(timer)
    }

    // First visit or same tier — just store
    if (!stored || lastSeen !== currentTier) {
      localStorage.setItem(key, String(currentTier))
    }
  }, [currentTier])

  if (!show || !oldTier) return null

  const color = tierColor(currentTier)
  const oldAvatarUrls = getTierAvatarUrls(oldTier)
  const newAvatarUrls = getTierAvatarUrls(currentTier)
  const titleEntry = TITLE_TABLE.find((t) => t.avatar_tier === currentTier)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 cursor-pointer"
      onClick={() => setShow(false)}
    >
      <div className="text-center space-y-6 animate-fadeIn">
        {/* Old avatar fading out */}
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={oldAvatarUrls.idle}
            alt={`Tier ${oldTier}`}
            className="w-24 h-24 mx-auto opacity-30"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Arrow */}
        <div className="text-4xl text-green-600 animate-bounce">&#8595;</div>

        {/* New avatar with glow */}
        <div className="relative inline-block">
          <div
            className="absolute inset-0 rounded-lg blur-xl opacity-50 animate-pulse"
            style={{ backgroundColor: color }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={newAvatarUrls.idle}
            alt={`Tier ${currentTier}`}
            className="w-32 h-32 mx-auto relative z-10"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div
            className="text-3xl font-bold animate-slideUp"
            style={{ color }}
          >
            TIER {currentTier} UNLOCKED
          </div>
          <div className="text-lg text-green-300">{currentTitle}</div>
          {titleEntry && (
            <div className="text-sm text-gray-500">Level {level}</div>
          )}
        </div>

        <div className="text-xs text-gray-600 mt-4">Click anywhere to dismiss</div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideUp { animation: slideUp 0.8s ease-out 0.3s both; }
      `}</style>
    </div>
  )
}
