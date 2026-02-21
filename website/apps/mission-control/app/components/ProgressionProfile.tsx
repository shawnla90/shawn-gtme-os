'use client'

import type { RPGProfile } from '@shawnos/shared/lib/rpg'
import { TITLE_TABLE, tierColor, getAvatarUrlsForProfile } from '@shawnos/shared/lib/rpg'
import AvatarUnlockCeremony from './AvatarUnlockCeremony'

interface ProgressionProfileProps {
  profile: RPGProfile
}

export default function ProgressionProfile({ profile }: ProgressionProfileProps) {
  const color = tierColor(profile.avatar_tier)
  const xpPct = profile.xp_next_level > 0
    ? Math.min((profile.xp_total / profile.xp_next_level) * 100, 100)
    : 0

  // Find next title
  const nextTitle = TITLE_TABLE.find((t) => t.xp_required > profile.xp_total)
  const xpToNext = nextTitle ? nextTitle.xp_required - profile.xp_total : 0
  const avatarUrls = getAvatarUrlsForProfile(profile)

  return (
    <>
      <AvatarUnlockCeremony
        currentTier={profile.avatar_tier}
        currentTitle={profile.title}
        level={profile.level}
      />
      <div
        className="card"
        style={{ borderColor: color, borderWidth: '1px' }}
      >
        <div className="flex items-start gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrls.idle}
              alt={profile.title}
              className="w-16 h-16 sm:w-24 sm:h-24 rounded"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg sm:text-xl font-bold text-green-300">{profile.title}</h2>
              <span className="text-sm text-gray-500">LVL {profile.level}</span>
            </div>
            <div className="text-sm text-gray-400 mb-1">
              Class: <span className="text-green-400 font-medium">{profile.class}</span>
            </div>

            {/* XP bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{profile.xp_total.toLocaleString()} / {profile.xp_next_level.toLocaleString()} XP</span>
                <span>{xpPct.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-gray-800 rounded overflow-hidden">
                <div
                  className="h-full rounded transition-all"
                  style={{ width: `${xpPct}%`, backgroundColor: color }}
                />
              </div>
            </div>

            {/* Next milestone */}
            {nextTitle && (
              <p className="text-xs text-gray-500 mt-2">
                {xpToNext.toLocaleString()} XP to <span className="text-green-400">{nextTitle.title}</span> (LVL {nextTitle.level})
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
