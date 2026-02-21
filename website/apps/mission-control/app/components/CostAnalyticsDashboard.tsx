'use client'

import type { CostAnalytics } from '@shawnos/shared/lib/costs'

const MODEL_COLORS: Record<string, string> = {
  'opus-4': '#8B5CF6',
  'sonnet-4': '#06B6D4',
  'haiku-3.5': '#10B981',
  'qwen-2.5': '#F59E0B',
  'llama-3.2': '#EF4444',
  gemini: '#3B82F6',
  unknown: '#64748B',
}

const SOURCE_COLORS: Record<string, string> = {
  'claude-code': '#10B981',
  cursor: '#8B5CF6',
  openclaw: '#F59E0B',
  unknown: '#64748B',
}

function getColor(map: Record<string, string>, key: string): string {
  return map[key] ?? '#64748B'
}

interface CostAnalyticsDashboardProps {
  analytics: CostAnalytics
}

export default function CostAnalyticsDashboard({ analytics }: CostAnalyticsDashboardProps) {
  const { days, model_totals, source_totals } = analytics
  if (days.length === 0) return null

  const maxCost = Math.max(...days.map((d) => d.total_cost), 1)
  const maxCumulative = days[days.length - 1]?.cumulative_total ?? 1
  const maxCostPerXP = Math.max(...days.map((d) => d.cost_per_xp_v3), 0.01)

  // SVG dimensions
  const W = 600
  const H = 200
  const PAD = 40
  const plotW = W - PAD * 2
  const plotH = H - PAD * 2

  // Cumulative line path
  const cumulativePath = days
    .map((d, i) => {
      const x = PAD + (i / Math.max(days.length - 1, 1)) * plotW
      const y = PAD + plotH - (d.cumulative_total / maxCumulative) * plotH
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')

  // All models across all days for stacked bar
  const allModels = Array.from(new Set(days.flatMap((d) => Object.keys(d.by_model))))
  const allSources = Array.from(new Set(days.flatMap((d) => Object.keys(d.by_source))))

  return (
    <div className="space-y-6">
      {/* Cumulative Spend Line */}
      <div className="card">
        <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">Cumulative Spend</h3>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '220px' }}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <g key={f}>
              <line
                x1={PAD} y1={PAD + plotH * (1 - f)} x2={W - PAD} y2={PAD + plotH * (1 - f)}
                stroke="#1a2e1a" strokeWidth="1"
              />
              <text x={PAD - 4} y={PAD + plotH * (1 - f) + 4} textAnchor="end" fill="#4a5568" fontSize="10">
                ${(maxCumulative * f).toFixed(0)}
              </text>
            </g>
          ))}
          {/* Date labels */}
          {days.map((d, i) => {
            const x = PAD + (i / Math.max(days.length - 1, 1)) * plotW
            return (
              <text key={d.date} x={x} y={H - 5} textAnchor="middle" fill="#4a5568" fontSize="9">
                {d.date.slice(5)}
              </text>
            )
          })}
          {/* Line */}
          <path d={cumulativePath} fill="none" stroke="#10B981" strokeWidth="2.5" />
          {/* Dots */}
          {days.map((d, i) => {
            const x = PAD + (i / Math.max(days.length - 1, 1)) * plotW
            const y = PAD + plotH - (d.cumulative_total / maxCumulative) * plotH
            return <circle key={d.date} cx={x} cy={y} r="3" fill="#10B981" />
          })}
        </svg>
      </div>

      {/* Cost per XP Trend */}
      <div className="card">
        <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">Cost per XP ($/XP)</h3>
        <div className="flex items-end gap-1" style={{ height: '120px' }}>
          {days.map((d) => {
            const heightPct = maxCostPerXP > 0 ? (d.cost_per_xp_v3 / maxCostPerXP) * 100 : 0
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center justify-end group" style={{ height: '100%' }}>
                <div className="text-[11px] text-gray-600 opacity-0 group-hover:opacity-100">
                  ${d.cost_per_xp_v3.toFixed(3)}
                </div>
                <div
                  className="w-full rounded-t bg-amber-600 group-hover:bg-amber-500"
                  style={{ height: `${heightPct}%`, minHeight: '2px' }}
                />
                <div className="text-[11px] text-gray-600 mt-1">{d.date.slice(8)}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Model + Source breakdown side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Model cost breakdown */}
        <div className="card">
          <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">Cost by Model</h3>
          <div className="space-y-2">
            {Object.entries(model_totals)
              .sort(([, a], [, b]) => b - a)
              .map(([model, cost]) => {
                const pct = analytics.total_spend > 0 ? (cost / analytics.total_spend) * 100 : 0
                const color = getColor(MODEL_COLORS, model)
                return (
                  <div key={model}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400 font-mono">{model}</span>
                      <span className="text-gray-300">${cost.toFixed(2)} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded overflow-hidden">
                      <div className="h-full rounded" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Source split */}
        <div className="card">
          <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">Cost by Source</h3>
          <div className="space-y-2">
            {Object.entries(source_totals)
              .sort(([, a], [, b]) => b - a)
              .map(([source, cost]) => {
                const pct = analytics.total_spend > 0 ? (cost / analytics.total_spend) * 100 : 0
                const color = getColor(SOURCE_COLORS, source)
                return (
                  <div key={source}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400 font-mono">{source}</span>
                      <span className="text-gray-300">${cost.toFixed(2)} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded overflow-hidden">
                      <div className="h-full rounded" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Source split trend (stacked per day) */}
      <div className="card">
        <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">Source Split Trend</h3>
        <div className="flex items-end gap-1" style={{ height: '120px' }}>
          {days.map((d) => {
            const total = d.total_cost || 1
            return (
              <div key={d.date} className="flex-1 flex flex-col justify-end group" style={{ height: '100%' }}>
                <div className="text-[11px] text-gray-600 opacity-0 group-hover:opacity-100 text-center">
                  ${d.total_cost.toFixed(1)}
                </div>
                <div className="flex flex-col-reverse w-full" style={{ height: `${(d.total_cost / maxCost) * 100}%`, minHeight: '2px' }}>
                  {allSources.map((source) => {
                    const cost = d.by_source[source] ?? 0
                    if (cost <= 0) return null
                    const pct = (cost / total) * 100
                    return (
                      <div
                        key={source}
                        className="w-full"
                        style={{ height: `${pct}%`, backgroundColor: getColor(SOURCE_COLORS, source), minHeight: '1px' }}
                      />
                    )
                  })}
                </div>
                <div className="text-[11px] text-gray-600 mt-1 text-center">{d.date.slice(8)}</div>
              </div>
            )
          })}
        </div>
        {/* Legend */}
        <div className="flex gap-4 mt-3 text-xs text-gray-500">
          {allSources.map((source) => (
            <span key={source} className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: getColor(SOURCE_COLORS, source) }} />
              {source}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
