'use client'

import type { Milestone } from '@shawnos/shared/lib/rpg'

// Known target milestones that may not be unlocked yet
const TARGET_MILESTONES = [
  { id: 'ascending_5', title: 'Rising Star', description: '5-day ascending score chain' },
  { id: 'commit_machine', title: 'Commit Machine', description: '20+ commits in a single day' },
  { id: 's_plus_day', title: 'Perfect Day', description: 'Achieved S+ grade on a daily log (v2)' },
  { id: 'first_5000xp', title: 'Power Level', description: 'Earned 5,000 XP' },
  { id: 'words_200k', title: 'Bibliophile', description: 'Wrote 200,000+ words across all days' },
]

interface ProgressionMilestonesProps {
  milestones: Milestone[]
}

export default function ProgressionMilestones({ milestones }: ProgressionMilestonesProps) {
  const unlockedIds = new Set(milestones.map((m) => m.id))
  const targets = TARGET_MILESTONES.filter((t) => !unlockedIds.has(t.id))

  return (
    <div className="card">
      <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">Milestones</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Unlocked */}
        {milestones.map((m) => (
          <div key={m.id} className="border border-green-700 rounded-lg p-3 bg-green-900/10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-green-400 text-sm">&#10003;</span>
              <span className="text-sm font-medium text-green-300">{m.title}</span>
            </div>
            <p className="text-xs text-gray-500">{m.description}</p>
            <p className="text-[10px] text-gray-600 mt-1">
              {new Date(m.unlocked_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        ))}

        {/* Targets */}
        {targets.map((t) => (
          <div key={t.id} className="border border-gray-800 rounded-lg p-3 opacity-40">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-600 text-sm">&#9679;</span>
              <span className="text-sm font-medium text-gray-500">{t.title}</span>
            </div>
            <p className="text-xs text-gray-600">{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
