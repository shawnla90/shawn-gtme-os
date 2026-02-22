'use client'

import type { RPGClass } from '@shawnos/shared/lib/rpg'

const classTextColors: Record<string, string> = {
  builder: 'text-yellow-400',
  scribe: 'text-purple-400',
  strategist: 'text-cyan-400',
  alchemist: 'text-orange-400',
  polymath: 'text-green-400',
}

interface ProgressionClassBreakdownProps {
  currentClass: RPGClass
}

export default function ProgressionClassBreakdown({ currentClass }: ProgressionClassBreakdownProps) {
  return (
    <div className="card">
      <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">
        Current Class
      </h3>
      <div className={`text-2xl font-bold ${classTextColors[currentClass.toLowerCase()] ?? 'text-green-400'}`}>
        {currentClass}
      </div>
    </div>
  )
}
