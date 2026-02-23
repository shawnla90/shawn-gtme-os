'use client'

import Link from 'next/link'
import type { ScoringLogEntry } from '@shawnos/shared/lib/rpg'

function gradeTextColor(grade: string): string {
  if (grade === 'S+') return 'text-yellow-400'
  if (grade === 'S') return 'text-purple-400'
  if (grade === 'A+') return 'text-cyan-400'
  if (grade === 'A') return 'text-green-400'
  if (grade === 'B') return 'text-gray-400'
  return 'text-red-500'
}

interface ProgressionGradeTableProps {
  scoringLog: ScoringLogEntry[]
}

export default function ProgressionGradeTable({ scoringLog }: ProgressionGradeTableProps) {
  if (scoringLog.length === 0) return null

  return (
    <div className="card overflow-x-auto">
      <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">Scoring Log</h3>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-500 border-b border-green-900">
            <th className="text-left py-2 pr-3">Date</th>
            <th className="text-right py-2 px-2">Score</th>
            <th className="text-center py-2 px-2">Grade</th>
            <th className="text-right py-2 pl-2">Commits</th>
          </tr>
        </thead>
        <tbody>
          {scoringLog.map((entry) => (
            <tr key={entry.date} className="border-b border-green-900/30 hover:bg-gray-900 transition-colors">
              <td className="py-1.5 pr-3">
                <Link href={`/logs/${entry.date}`} className="text-green-400 hover:text-green-300">
                  {entry.date}
                </Link>
              </td>
              <td className="text-right py-1.5 px-2 text-gray-400">{entry.output_score}</td>
              <td className={`text-center py-1.5 px-2 font-bold ${gradeTextColor(entry.letter_grade)}`}>
                {entry.letter_grade}
              </td>
              <td className="text-right py-1.5 pl-2 text-gray-400">{entry.commits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
