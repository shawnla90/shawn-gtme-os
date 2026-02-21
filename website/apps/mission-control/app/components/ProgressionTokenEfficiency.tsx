'use client'

import Link from 'next/link'
import type { DailyLogSummary } from '@shawnos/shared/lib/logs'

interface ScoringEntry {
  date: string
  raw_score: number
  v2_xp?: number
  v3_xp?: number
}

interface ProgressionTokenEfficiencyProps {
  scoringLog: ScoringEntry[]
  logs: DailyLogSummary[]
  /** Map of date -> total cost for that day */
  costMap: Record<string, number>
  isV3?: boolean
}

export default function ProgressionTokenEfficiency({
  scoringLog,
  costMap,
  isV3,
}: ProgressionTokenEfficiencyProps) {
  // Build efficiency data (pts/$ per day)
  const getXP = (e: ScoringEntry) => (isV3 ? e.v3_xp : e.v2_xp) ?? e.raw_score
  const efficiencyData = scoringLog.map((entry) => {
    const cost = costMap[entry.date] ?? 0
    const xp = getXP(entry)
    const ptsDollar = cost > 0 ? entry.raw_score / cost : 0
    const costPerXP = xp > 0 ? cost / xp : 0
    return { date: entry.date, ptsDollar, cost, score: entry.raw_score, xp, costPerXP }
  })

  const totalCost = efficiencyData.reduce((s, d) => s + d.cost, 0)
  const maxPtsDollar = Math.max(...efficiencyData.map((d) => d.ptsDollar), 1)
  const maxCost = Math.max(...efficiencyData.map((d) => d.cost), 1)

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider">Token Efficiency</h3>
        <Link href="/analytics" className="text-xs text-green-600 hover:text-green-400 transition-colors">
          Full Analytics &rarr;
        </Link>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">${totalCost.toFixed(2)}</div>
          <div className="text-[11px] text-gray-500 uppercase">Total Spend</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">
            {totalCost > 0 ? (efficiencyData.reduce((s, d) => s + d.score, 0) / totalCost).toFixed(0) : '—'}
          </div>
          <div className="text-[11px] text-gray-500 uppercase">Avg Pts/$</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">
            ${efficiencyData.length > 0 ? (totalCost / efficiencyData.length).toFixed(2) : '0'}
          </div>
          <div className="text-[11px] text-gray-500 uppercase">Avg/Day</div>
        </div>
      </div>

      {/* pts/$ trend */}
      <div>
        <h4 className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Points per Dollar</h4>
        <div className="flex items-end gap-1" style={{ height: '80px' }}>
          {efficiencyData.map((d) => {
            const heightPct = maxPtsDollar > 0 ? (d.ptsDollar / maxPtsDollar) * 100 : 0
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center justify-end group" style={{ height: '100%' }}>
                <div className="text-[11px] text-gray-600 opacity-0 group-hover:opacity-100">
                  {d.ptsDollar.toFixed(0)}
                </div>
                <div
                  className="w-full rounded-t bg-cyan-600 group-hover:bg-cyan-500"
                  style={{ height: `${heightPct}%`, minHeight: '2px' }}
                />
                <div className="text-[11px] text-gray-600 mt-1">{d.date.slice(8)}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Daily cost chart */}
      <div>
        <h4 className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Daily Cost</h4>
        <div className="flex items-end gap-1" style={{ height: '60px' }}>
          {efficiencyData.map((d) => {
            const heightPct = maxCost > 0 ? (d.cost / maxCost) * 100 : 0
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center justify-end group" style={{ height: '100%' }}>
                <div className="text-[11px] text-gray-600 opacity-0 group-hover:opacity-100">
                  ${d.cost.toFixed(2)}
                </div>
                <div
                  className="w-full rounded-t bg-yellow-600 group-hover:bg-yellow-500"
                  style={{ height: `${heightPct}%`, minHeight: '2px' }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
