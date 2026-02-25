'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Briefcase, Users, DollarSign, Building2, ArrowRight } from 'lucide-react'
import ActivityTimeline from '../components/crm/ActivityTimeline'

interface Stats {
  stages: { stage: string; count: number }[]
  dealStages: { stage: string; count: number; total_value: number }[]
  recentActivity: {
    id: number
    type: string
    title: string
    body: string | null
    account_name: string
    created_at: string
  }[]
  totals: {
    total_accounts: number
    total_contacts: number
    total_deals: number
    pipeline_value: number
  }
}

export default function CrmDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/crm/stats/')
      .then((r) => r.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
  }, [])

  if (loading || !stats) {
    return <div className="text-center py-12 text-gray-500">Loading CRM...</div>
  }

  const pipelineValue = (stats.totals.pipeline_value / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-300 mb-1">CRM</h1>
          <p className="text-sm text-gray-500">Pipeline & relationships</p>
        </div>
        <Link href="/crm/accounts/" className="btn text-xs flex items-center gap-2">
          <Building2 className="w-3 h-3" /> View Accounts
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <Building2 className="w-5 h-5 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-400">{stats.totals.total_accounts}</div>
          <div className="text-[10px] text-gray-500 uppercase">Accounts</div>
        </div>
        <div className="card text-center">
          <Users className="w-5 h-5 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-400">{stats.totals.total_contacts}</div>
          <div className="text-[10px] text-gray-500 uppercase">Contacts</div>
        </div>
        <div className="card text-center">
          <Briefcase className="w-5 h-5 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-400">{stats.totals.total_deals}</div>
          <div className="text-[10px] text-gray-500 uppercase">Deals</div>
        </div>
        <div className="card text-center">
          <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-400">{pipelineValue}</div>
          <div className="text-[10px] text-gray-500 uppercase">Pipeline</div>
        </div>
      </div>

      {/* Pipeline by stage */}
      {stats.stages.length > 0 && (
        <div className="card">
          <h2 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-3">Account Pipeline</h2>
          <div className="flex gap-2 flex-wrap">
            {stats.stages.map((s) => (
              <div key={s.stage} className="bg-gray-800 rounded px-3 py-2 text-center">
                <div className="text-lg font-bold text-green-400">{s.count}</div>
                <div className="text-[10px] text-gray-500 capitalize">{s.stage}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/crm/deals/" className="group">
          <div className="card hover:bg-gray-800 transition-colors flex items-center justify-between">
            <span className="text-sm text-green-300">Deal Pipeline</span>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-green-400" />
          </div>
        </Link>
        <Link href="/crm/contacts/" className="group">
          <div className="card hover:bg-gray-800 transition-colors flex items-center justify-between">
            <span className="text-sm text-green-300">All Contacts</span>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-green-400" />
          </div>
        </Link>
        <Link href="/crm/import/" className="group">
          <div className="card hover:bg-gray-800 transition-colors flex items-center justify-between">
            <span className="text-sm text-green-300">Import Data</span>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-green-400" />
          </div>
        </Link>
      </div>

      {/* Recent activity */}
      <div className="card">
        <h2 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-3">Recent Activity</h2>
        <ActivityTimeline activities={stats.recentActivity} />
      </div>
    </div>
  )
}
