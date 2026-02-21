'use client'

import Link from 'next/link'

function gradeBarColor(grade: string): string {
  if (grade === 'S+') return 'bg-yellow-400'
  if (grade === 'S') return 'bg-purple-400'
  if (grade === 'A+') return 'bg-cyan-400'
  if (grade === 'A') return 'bg-green-400'
  if (grade === 'B') return 'bg-gray-400'
  return 'bg-red-500'
}

interface ScoringEntry {
  date: string
  v2_xp?: number
  v3_xp?: number
  v2_grade?: string
  v3_grade?: string
}

interface ProgressionXPGraphProps {
  scoringLog: ScoringEntry[]
  isV3?: boolean
}

export default function ProgressionXPGraph({ scoringLog, isV3 }: ProgressionXPGraphProps) {
  if (scoringLog.length === 0) return null

  const getXP = (e: ScoringEntry) => (isV3 ? e.v3_xp : e.v2_xp) ?? 0
  const getGrade = (e: ScoringEntry) => (isV3 ? e.v3_grade : e.v2_grade) ?? 'D'
  const maxXP = Math.max(...scoringLog.map(getXP))

  return (
    <div className="card">
      <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-4">XP Earned Per Day</h3>
      <div className="flex items-end gap-1" style={{ height: '160px' }}>
        {scoringLog.map((entry) => {
          const xp = getXP(entry)
          const grade = getGrade(entry)
          const heightPct = maxXP > 0 ? (xp / maxXP) * 100 : 0
          return (
            <Link
              key={entry.date}
              href={`/logs/${entry.date}`}
              className="flex-1 flex flex-col items-center justify-end group"
              style={{ height: '100%' }}
            >
              <div className="text-[11px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                {xp}
              </div>
              <div
                className={`w-full rounded-t ${gradeBarColor(grade)} group-hover:opacity-80 transition-opacity`}
                style={{ height: `${heightPct}%`, minHeight: '4px' }}
              />
              <div className="text-[11px] text-gray-600 mt-1 rotate-[-45deg] origin-top-left whitespace-nowrap">
                {entry.date.slice(5)}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
