'use client'

import type { RPGClass } from '@shawnos/shared/lib/rpg'

const classColors: Record<string, string> = {
  builder: 'bg-yellow-500',
  scribe: 'bg-purple-500',
  strategist: 'bg-cyan-500',
  alchemist: 'bg-orange-500',
  polymath: 'bg-green-500',
}

const classTextColors: Record<string, string> = {
  builder: 'text-yellow-400',
  scribe: 'text-purple-400',
  strategist: 'text-cyan-400',
  alchemist: 'text-orange-400',
  polymath: 'text-green-400',
}

interface MetaLike {
  class_window: string
  class_breakdown: Record<string, number>
}

interface ProgressionClassBreakdownProps {
  currentClass: RPGClass
  meta: MetaLike
}

export default function ProgressionClassBreakdown({ currentClass, meta }: ProgressionClassBreakdownProps) {
  const breakdown = meta.class_breakdown

  return (
    <div className="card">
      <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">
        Class Distribution ({meta.class_window} window)
      </h3>

      {/* Current class */}
      <div className={`text-2xl font-bold mb-3 ${classTextColors[currentClass.toLowerCase()] ?? 'text-green-400'}`}>
        {currentClass}
      </div>

      {/* Stacked bar */}
      <div className="flex h-6 rounded overflow-hidden mb-3">
        {Object.entries(breakdown)
          .filter(([, pct]) => pct > 0)
          .map(([cls, pct]) => (
            <div
              key={cls}
              className={`${classColors[cls] ?? 'bg-gray-600'} relative`}
              style={{ width: `${pct * 100}%` }}
              title={`${cls}: ${(pct * 100).toFixed(0)}%`}
            />
          ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-gray-500 flex-wrap">
        {Object.entries(breakdown).map(([cls, pct]) => (
          <span key={cls} className="flex items-center gap-1">
            <span className={`inline-block w-2 h-2 rounded-full ${classColors[cls] ?? 'bg-gray-600'}`} />
            <span className="capitalize">{cls}</span>: {(pct * 100).toFixed(0)}%
          </span>
        ))}
      </div>
    </div>
  )
}
