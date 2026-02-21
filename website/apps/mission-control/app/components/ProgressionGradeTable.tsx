'use client'

import Link from 'next/link'

function gradeTextColor(grade: string): string {
  if (grade === 'S+') return 'text-yellow-400'
  if (grade === 'S') return 'text-purple-400'
  if (grade === 'A+') return 'text-cyan-400'
  if (grade === 'A') return 'text-green-400'
  if (grade === 'B') return 'text-gray-400'
  return 'text-red-500'
}

interface ScoringEntry {
  date: string
  raw_score: number
  base_score?: number
  v2_grade?: string
  v3_grade?: string
  chain_length?: number
  ascending_chain?: number
  chain_mult?: number
  momentum_mult?: number
  streak_days?: number
  quality_bonus?: number
  efficiency_bonus: number
  velocity_bonus: number
  ship_bonus: number
  total_mult: number
  v2_xp?: number
  v3_xp?: number
}

interface ProgressionGradeTableProps {
  scoringLog: ScoringEntry[]
  isV3?: boolean
}

export default function ProgressionGradeTable({ scoringLog, isV3 }: ProgressionGradeTableProps) {
  if (scoringLog.length === 0) return null

  const getGrade = (e: ScoringEntry) => (isV3 ? e.v3_grade : e.v2_grade) ?? 'D'
  const getXP = (e: ScoringEntry) => (isV3 ? e.v3_xp : e.v2_xp) ?? 0
  const getChain = (e: ScoringEntry) => isV3 ? (e.ascending_chain ?? 0) : (e.chain_length ?? 0)

  return (
    <div className="card overflow-x-auto">
      <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">Scoring Log</h3>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-500 border-b border-green-900">
            <th className="text-left py-2 pr-3">Date</th>
            <th className="text-right py-2 px-2">Raw</th>
            {isV3 && <th className="text-right py-2 px-2">Base</th>}
            <th className="text-center py-2 px-2">Grade</th>
            <th className="text-center py-2 px-2">{isV3 ? 'Mom' : 'Chain'}</th>
            {isV3 && <th className="text-right py-2 px-2">Strk</th>}
            {isV3 && <th className="text-right py-2 px-2">Qual</th>}
            <th className="text-right py-2 px-2">Eff</th>
            <th className="text-right py-2 px-2 hidden md:table-cell">Vel</th>
            <th className="text-right py-2 px-2 hidden md:table-cell">Ship</th>
            <th className="text-right py-2 px-2">Mult</th>
            <th className="text-right py-2 pl-2">XP</th>
          </tr>
        </thead>
        <tbody>
          {scoringLog.map((entry) => {
            const grade = getGrade(entry)
            const xp = getXP(entry)
            const chain = getChain(entry)
            return (
              <tr key={entry.date} className="border-b border-green-900/30 hover:bg-gray-900 transition-colors">
                <td className="py-1.5 pr-3">
                  <Link href={`/logs/${entry.date}`} className="text-green-400 hover:text-green-300">
                    {entry.date}
                  </Link>
                </td>
                <td className="text-right py-1.5 px-2 text-gray-400">{entry.raw_score}</td>
                {isV3 && (
                  <td className="text-right py-1.5 px-2 text-gray-400">{(entry.base_score ?? entry.raw_score).toFixed(0)}</td>
                )}
                <td className={`text-center py-1.5 px-2 font-bold ${gradeTextColor(grade)}`}>
                  {grade}
                </td>
                <td className="text-center py-1.5 px-2 text-green-600">
                  {isV3
                    ? `${(entry.momentum_mult ?? 1).toFixed(2)}x`
                    : Array(chain).fill('|').join('')}
                </td>
                {isV3 && (
                  <td className="text-right py-1.5 px-2 text-gray-400">{entry.streak_days ?? 0}d</td>
                )}
                {isV3 && (
                  <td className="text-right py-1.5 px-2 text-gray-400">
                    {(entry.quality_bonus ?? 0) > 0 ? `+${((entry.quality_bonus ?? 0) * 100).toFixed(1)}%` : '—'}
                  </td>
                )}
                <td className="text-right py-1.5 px-2 text-gray-400">
                  {entry.efficiency_bonus > 0 ? `+${(entry.efficiency_bonus * 100).toFixed(1)}%` : '—'}
                </td>
                <td className="text-right py-1.5 px-2 text-gray-400 hidden md:table-cell">
                  {entry.velocity_bonus > 0 ? `+${(entry.velocity_bonus * 100).toFixed(1)}%` : '—'}
                </td>
                <td className="text-right py-1.5 px-2 text-gray-400 hidden md:table-cell">
                  {entry.ship_bonus > 0 ? `+${(entry.ship_bonus * 100).toFixed(1)}%` : '—'}
                </td>
                <td className="text-right py-1.5 px-2 text-green-400 font-medium">{entry.total_mult.toFixed(2)}x</td>
                <td className="text-right py-1.5 pl-2 text-green-300 font-bold">{xp}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
