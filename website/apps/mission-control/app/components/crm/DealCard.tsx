'use client'

const STAGE_COLORS: Record<string, string> = {
  discovery: 'bg-gray-700 text-gray-300',
  demo: 'bg-blue-900 text-blue-300',
  proposal: 'bg-yellow-900 text-yellow-300',
  negotiation: 'bg-orange-900 text-orange-300',
  closed_won: 'bg-green-900 text-green-300',
  closed_lost: 'bg-red-900 text-red-300',
}

interface DealCardProps {
  deal: {
    id: number
    title: string
    value_cents: number
    stage: string
    probability: number
    account_name?: string
    expected_close_date?: string | null
  }
}

export default function DealCard({ deal }: DealCardProps) {
  const value = (deal.value_cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-medium text-green-300 truncate">{deal.title}</div>
          {deal.account_name && (
            <div className="text-xs text-gray-500">{deal.account_name}</div>
          )}
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded font-medium shrink-0 ${
          STAGE_COLORS[deal.stage] || 'bg-gray-800 text-gray-400'
        }`}>
          {deal.stage.replace('_', ' ')}
        </span>
      </div>
      <div className="flex gap-4 mt-2 text-xs">
        <span className="text-green-400 font-medium">{value}</span>
        <span className="text-gray-500">{deal.probability}% probability</span>
        {deal.expected_close_date && (
          <span className="text-gray-500">Close: {deal.expected_close_date}</span>
        )}
      </div>
    </div>
  )
}
