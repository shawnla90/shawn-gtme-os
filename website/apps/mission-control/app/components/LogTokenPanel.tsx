'use client'

import type { TokenEntry } from '@shawnos/shared/lib/logs'

const BUDGET_PER_SESSION = 200_000

function sessionTokens(t: TokenEntry): number {
  return t.input_tokens + t.output_tokens + t.cache_read_tokens + t.cache_write_tokens
}

interface LogTokenPanelProps {
  tokenUsage: TokenEntry[]
}

export default function LogTokenPanel({ tokenUsage }: LogTokenPanelProps) {
  const sessionCount = tokenUsage.length
  const totalBudget = sessionCount * BUDGET_PER_SESSION
  const totalTokens = tokenUsage.reduce((sum, t) => sum + sessionTokens(t), 0)
  const pct = totalBudget > 0 ? (totalTokens / totalBudget) * 100 : 0
  const delta = totalTokens - totalBudget
  const isOver = delta > 0
  const pctColor = pct < 70 ? 'bg-green-500' : pct < 90 ? 'bg-yellow-500' : 'bg-red-500'
  const pctTextColor = pct < 70 ? 'text-green-400' : pct < 90 ? 'text-yellow-400' : 'text-red-400'

  // Source split
  const claudeCode = tokenUsage.filter((t) => t.source === 'claude-code')
  const cursor = tokenUsage.filter((t) => t.source !== 'claude-code')
  const ccTokens = claudeCode.reduce((s, t) => s + sessionTokens(t), 0)
  const cursorTokens = cursor.reduce((s, t) => s + sessionTokens(t), 0)
  const ccPct = totalTokens > 0 ? ((ccTokens / totalTokens) * 100).toFixed(1) : '0'
  const cursorPct = totalTokens > 0 ? ((cursorTokens / totalTokens) * 100).toFixed(1) : '0'

  // Per-model breakdown
  const modelMap = new Map<string, { tokens: number; cost: number }>()
  for (const t of tokenUsage) {
    const total = sessionTokens(t)
    const existing = modelMap.get(t.model) ?? { tokens: 0, cost: 0 }
    modelMap.set(t.model, {
      tokens: existing.tokens + total,
      cost: existing.cost + (t.cost ?? 0),
    })
  }

  const totalCost = tokenUsage.reduce((s, t) => s + (t.cost ?? 0), 0)

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider">Token Budget</h3>

      {/* Session ratio context */}
      <div className="text-xs text-gray-500">
        <span className="text-gray-300 font-medium">{sessionCount}</span> session{sessionCount !== 1 ? 's' : ''} &times; 200K = <span className="text-gray-300 font-medium">{totalBudget.toLocaleString()}</span> allotment
      </div>

      {/* Budget gauge */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className={pctTextColor}>
            {totalTokens.toLocaleString()} / {totalBudget.toLocaleString()}
          </span>
          <span className={pctTextColor}>{pct.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded overflow-hidden">
          <div
            className={`h-full ${pctColor} transition-all`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <div className={`text-[10px] mt-1 ${isOver ? 'text-red-400' : 'text-green-500'}`}>
          {isOver
            ? `${Math.abs(delta).toLocaleString()} over allotment`
            : `${Math.abs(delta).toLocaleString()} under allotment`}
        </div>
      </div>

      {/* Source split */}
      <div className="flex gap-4 text-xs text-gray-500">
        <span>Claude Code: <span className="text-gray-300">{ccTokens.toLocaleString()}</span> ({ccPct}%)</span>
        {cursorTokens > 0 && (
          <span>Cursor: <span className="text-gray-300">{cursorTokens.toLocaleString()}</span> ({cursorPct}%)</span>
        )}
      </div>

      {/* Per-model table */}
      {modelMap.size > 0 && (
        <div className="text-xs">
          <div className="grid grid-cols-3 gap-2 text-gray-500 border-b border-green-900 pb-1 mb-1">
            <span>Model</span>
            <span className="text-right">Tokens</span>
            <span className="text-right">Cost</span>
          </div>
          {Array.from(modelMap.entries()).map(([model, data]) => (
            <div key={model} className="grid grid-cols-3 gap-2 text-gray-400 py-0.5">
              <span className="text-green-400">{model}</span>
              <span className="text-right">{data.tokens.toLocaleString()}</span>
              <span className="text-right">${data.cost.toFixed(2)}</span>
            </div>
          ))}
          <div className="grid grid-cols-3 gap-2 text-gray-300 border-t border-green-900 pt-1 mt-1 font-medium">
            <span>Total</span>
            <span className="text-right">{totalTokens.toLocaleString()}</span>
            <span className="text-right">${totalCost.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Per-session breakdown */}
      {tokenUsage.length > 0 && (
        <div className="text-xs space-y-1 mt-2">
          <h4 className="text-gray-500 uppercase tracking-wider">Sessions</h4>
          {tokenUsage.map((t, i) => {
            const sTokens = sessionTokens(t)
            const sPct = (sTokens / BUDGET_PER_SESSION) * 100
            const sOver = sTokens > BUDGET_PER_SESSION
            return (
              <div key={i} className="space-y-0.5">
                <div className="flex justify-between text-gray-500">
                  <span className="text-gray-400">{t.context ?? t.source}</span>
                  <span className="flex gap-3">
                    <span className={sOver ? 'text-red-400' : 'text-gray-400'}>
                      {sTokens.toLocaleString()} ({sPct.toFixed(0)}%)
                    </span>
                    <span>${(t.cost ?? 0).toFixed(2)}</span>
                  </span>
                </div>
                <div className="h-1 bg-gray-800 rounded overflow-hidden">
                  <div
                    className={`h-full rounded ${sOver ? 'bg-red-500' : sPct > 70 ? 'bg-yellow-500' : 'bg-green-700'}`}
                    style={{ width: `${Math.min(sPct, 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
