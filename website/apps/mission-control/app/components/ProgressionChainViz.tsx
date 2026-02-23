'use client'

import type { RPGProfile, ScoringLogEntry } from '@shawnos/shared/lib/rpg'

interface ProgressionStreakVizProps {
  scoringLog: ScoringLogEntry[]
  profile: RPGProfile
}

export default function ProgressionStreakViz({ scoringLog, profile }: ProgressionStreakVizProps) {
  if (scoringLog.length === 0) return null

  const maxStreak = Math.max(...scoringLog.map((e) => e.streak), 1)

  return (
    <div className="card">
      <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">Streak</h3>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{profile.current_streak}d</div>
          <div className="text-[11px] text-gray-500 uppercase">Current</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{profile.streak_multiplier}x</div>
          <div className="text-[11px] text-gray-500 uppercase">Multiplier</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{maxStreak}d</div>
          <div className="text-[11px] text-gray-500 uppercase">Best</div>
        </div>
      </div>

      {/* Streak bars */}
      <div className="flex items-end gap-1" style={{ height: '80px' }}>
        {scoringLog.map((entry) => {
          const heightPct = (entry.streak / maxStreak) * 100
          const isActive = entry.streak > 1
          return (
            <div
              key={entry.date}
              className="flex-1 flex flex-col items-center justify-end"
              style={{ height: '100%' }}
            >
              <div
                className={`w-full rounded-t ${isActive ? 'bg-green-500' : 'bg-gray-700'}`}
                style={{ height: `${heightPct}%`, minHeight: '4px' }}
              />
              <div className="text-[11px] text-gray-600 mt-1">{entry.date.slice(8)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
