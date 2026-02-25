'use client'

import { useState, useEffect } from 'react'
import DealCard from './DealCard'

const DEAL_STAGES = ['discovery', 'demo', 'proposal', 'negotiation', 'closed_won', 'closed_lost']

const STAGE_LABELS: Record<string, string> = {
  discovery: 'Discovery',
  demo: 'Demo',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  closed_won: 'Won',
  closed_lost: 'Lost',
}

interface Deal {
  id: number
  title: string
  value_cents: number
  stage: string
  probability: number
  account_name?: string
  expected_close_date?: string | null
}

export default function PipelineBoard() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/crm/deals/')
      .then((r) => r.json())
      .then((data) => {
        setDeals(data.deals)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading pipeline...</div>
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3 min-w-[900px]">
        {DEAL_STAGES.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage)
          const stageValue = stageDeals.reduce((s, d) => s + d.value_cents, 0)

          return (
            <div key={stage} className="flex-1 min-w-[150px]">
              <div className="bg-gray-900 rounded-t-lg px-3 py-2 border border-green-800/50 border-b-0">
                <div className="text-xs font-bold text-green-400 uppercase">
                  {STAGE_LABELS[stage]}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  {stageDeals.length} deals &middot;{' '}
                  {(stageValue / 100).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                  })}
                </div>
              </div>
              <div className="border border-green-800/50 border-t-0 rounded-b-lg p-2 space-y-2 min-h-[200px] bg-black/30">
                {stageDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-[10px] text-gray-600">Empty</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
