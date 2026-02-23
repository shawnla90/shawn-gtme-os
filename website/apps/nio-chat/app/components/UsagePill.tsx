// NioBot V2 — Subtle pill showing token count, cost, and model

'use client'

import { useChatContext } from './ChatProvider'
import { formatCost, formatTokens } from '../../lib/pricing'

export default function UsagePill() {
  const { state } = useChatContext()
  const { usage } = state

  if (!usage) return null

  const totalTokens = usage.inputTokens + usage.outputTokens
  if (totalTokens === 0) return null

  return (
    <div className="flex items-center justify-center py-1">
      <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] bg-[var(--canvas-overlay)] px-3 py-1 rounded-full border border-[var(--border)]">
        <span>{formatCost(usage.cost)}</span>
        <span className="opacity-40">|</span>
        <span>{formatTokens(totalTokens)} tokens</span>
        {usage.model && (
          <>
            <span className="opacity-40">|</span>
            <span>{usage.model}</span>
          </>
        )}
      </div>
    </div>
  )
}
