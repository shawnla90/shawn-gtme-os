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

interface DayScoringEntry {
  date: string
  output_score: number
  letter_grade: string
  commits_count: number
}

interface ProgressionXPGraphProps {
  dayScoring: DayScoringEntry[]
}

export default function ProgressionXPGraph({ dayScoring }: ProgressionXPGraphProps) {
  if (dayScoring.length === 0) return null

  const maxScore = Math.max(...dayScoring.map((e) => e.output_score))

  return (
    <div className="card">
      <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-4">Score Per Day</h3>
      <div className="flex items-end gap-1" style={{ height: '160px' }}>
        {dayScoring.map((entry) => {
          const heightPct = maxScore > 0 ? (entry.output_score / maxScore) * 100 : 0
          return (
            <Link
              key={entry.date}
              href={`/logs/${entry.date}`}
              className="flex-1 flex flex-col items-center justify-end group"
              style={{ height: '100%' }}
            >
              <div className="text-[11px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                {entry.output_score}
              </div>
              <div
                className={`w-full rounded-t ${gradeBarColor(entry.letter_grade)} group-hover:opacity-80 transition-opacity`}
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
