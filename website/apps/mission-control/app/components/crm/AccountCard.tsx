'use client'

import Link from 'next/link'
import { Building2, Users, DollarSign } from 'lucide-react'

const STAGE_COLORS: Record<string, string> = {
  prospect: 'bg-gray-700 text-gray-300',
  qualified: 'bg-blue-900 text-blue-300',
  opportunity: 'bg-yellow-900 text-yellow-300',
  customer: 'bg-green-900 text-green-300',
  churned: 'bg-red-900 text-red-300',
}

interface AccountCardProps {
  account: {
    id: number
    name: string
    domain: string | null
    industry: string | null
    stage: string
    contact_count: number
    deal_count: number
    pipeline_value: number
  }
}

export default function AccountCard({ account }: AccountCardProps) {
  return (
    <Link href={`/crm/accounts/${account.id}/`} className="block group">
      <div className="card hover:bg-gray-800 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <Building2 className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-medium text-green-300 truncate">{account.name}</div>
              {account.domain && (
                <div className="text-xs text-gray-500">{account.domain}</div>
              )}
            </div>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded font-medium shrink-0 ${
            STAGE_COLORS[account.stage] || 'bg-gray-800 text-gray-400'
          }`}>
            {account.stage}
          </span>
        </div>

        <div className="flex gap-4 mt-3 text-xs text-gray-500">
          {account.industry && <span>{account.industry}</span>}
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {account.contact_count}
          </span>
          {account.pipeline_value > 0 && (
            <span className="flex items-center gap-1 text-green-500">
              <DollarSign className="w-3 h-3" />
              {(account.pipeline_value / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
