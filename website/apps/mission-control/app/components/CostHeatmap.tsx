'use client'

import type { CostBreakdown } from '@shawnos/shared/lib/costs'

interface CostHeatmapProps {
  days: CostBreakdown[]
}

function costColor(cost: number, maxCost: number): string {
  if (cost === 0) return '#111827'
  const intensity = Math.min(cost / maxCost, 1)
  if (intensity > 0.75) return '#991B1B' // red-800
  if (intensity > 0.5) return '#B45309'  // amber-700
  if (intensity > 0.25) return '#065F46' // emerald-800
  return '#064E3B'                       // emerald-900
}

function getDayOfWeek(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).getDay() // 0=Sun, 6=Sat
}

function getWeekNumber(dateStr: string, startDate: string): number {
  const [sy, sm, sd] = startDate.split('-').map(Number)
  const [y, m, d] = dateStr.split('-').map(Number)
  const start = new Date(sy, sm - 1, sd)
  const current = new Date(y, m - 1, d)
  const diffDays = Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return Math.floor((diffDays + start.getDay()) / 7)
}

export default function CostHeatmap({ days }: CostHeatmapProps) {
  if (days.length === 0) return null

  const maxCost = Math.max(...days.map((d) => d.total_cost), 1)
  const costMap = new Map(days.map((d) => [d.date, d]))

  // Generate a calendar grid from first to last day
  const firstDate = days[0].date
  const lastDate = days[days.length - 1].date
  const [fy, fm, fd] = firstDate.split('-').map(Number)
  const [ly, lm, ld] = lastDate.split('-').map(Number)
  const start = new Date(fy, fm - 1, fd)
  const end = new Date(ly, lm - 1, ld)

  const allDates: string[] = []
  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    allDates.push(dt.toISOString().slice(0, 10))
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const cellSize = 28
  const gap = 3
  const totalWeeks = getWeekNumber(lastDate, firstDate) + 1

  return (
    <div className="card">
      <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">Daily Cost Heatmap</h3>

      <div className="overflow-x-auto">
        <div className="inline-flex gap-2">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] pt-5">
            {dayLabels.map((label) => (
              <div key={label} className="text-[11px] text-gray-600 h-[28px] flex items-center">
                {label}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-[3px]">
            {Array.from({ length: totalWeeks }, (_, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }, (_, dayIdx) => {
                  const date = allDates.find(
                    (d) => getWeekNumber(d, firstDate) === weekIdx && getDayOfWeek(d) === dayIdx
                  )
                  if (!date) {
                    return <div key={dayIdx} style={{ width: cellSize, height: cellSize }} />
                  }
                  const entry = costMap.get(date)
                  const cost = entry?.total_cost ?? 0
                  const bg = costColor(cost, maxCost)
                  return (
                    <div
                      key={dayIdx}
                      className="rounded-sm border border-gray-800 cursor-default group relative"
                      style={{ width: cellSize, height: cellSize, backgroundColor: bg }}
                      title={`${date}: $${cost.toFixed(2)}`}
                    >
                      {cost > 0 && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 border border-green-700 rounded px-2 py-1 text-[10px] text-green-300 whitespace-nowrap opacity-0 group-hover:opacity-100 z-10 pointer-events-none">
                          {date}: ${cost.toFixed(2)}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
        <span>Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <div
            key={f}
            className="w-3 h-3 rounded-sm border border-gray-800"
            style={{ backgroundColor: costColor(maxCost * f, maxCost) }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
