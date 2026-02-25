'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import AccountCard from '../../components/crm/AccountCard'
import CrmForm from '../../components/crm/CrmForm'

const STAGES = ['', 'prospect', 'qualified', 'opportunity', 'customer', 'churned']

interface Account {
  id: number
  name: string
  domain: string | null
  industry: string | null
  stage: string
  contact_count: number
  deal_count: number
  pipeline_value: number
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [stage, setStage] = useState('')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  const fetchAccounts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (stage) params.set('stage', stage)
    if (search) params.set('search', search)
    const res = await fetch(`/api/crm/accounts/?${params}`)
    const data = await res.json()
    setAccounts(data.accounts)
    setLoading(false)
  }, [stage, search])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const handleCreate = async (data: Record<string, string>) => {
    await fetch('/api/crm/accounts/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setShowForm(false)
    fetchAccounts()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-300 mb-1">ACCOUNTS</h1>
          <p className="text-sm text-gray-500">{accounts.length} accounts</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn text-xs flex items-center gap-2">
          <Plus className="w-3 h-3" /> New Account
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card">
          <h2 className="text-sm font-bold text-green-400 mb-3">New Account</h2>
          <CrmForm
            fields={[
              { name: 'name', label: 'Company Name', type: 'text', required: true },
              { name: 'domain', label: 'Domain', type: 'text', placeholder: 'example.com' },
              { name: 'industry', label: 'Industry', type: 'text' },
              { name: 'size', label: 'Company Size', type: 'text' },
              { name: 'geography', label: 'Geography', type: 'text' },
              { name: 'source', label: 'Source', type: 'text' },
              {
                name: 'stage',
                label: 'Stage',
                type: 'select',
                options: [
                  { label: 'Prospect', value: 'prospect' },
                  { label: 'Qualified', value: 'qualified' },
                  { label: 'Opportunity', value: 'opportunity' },
                  { label: 'Customer', value: 'customer' },
                ],
              },
              { name: 'notes', label: 'Notes', type: 'textarea' },
            ]}
            onSubmit={handleCreate}
            submitLabel="Create Account"
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Stage filter */}
      <div className="flex gap-1 flex-wrap">
        {STAGES.map((s) => (
          <button
            key={s}
            onClick={() => setStage(s)}
            className={`px-3 py-1.5 text-xs rounded font-medium transition-colors capitalize ${
              stage === s ? 'bg-green-800 text-green-300' : 'bg-gray-800 text-gray-500 hover:text-gray-300'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input
          type="text"
          placeholder="Search accounts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-gray-900 border border-green-800 rounded text-sm text-green-300 placeholder-gray-600 focus:outline-none focus:border-green-500"
        />
      </div>

      {/* Account list */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-2">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
          {accounts.length === 0 && (
            <div className="card text-center py-12 text-gray-500">No accounts found</div>
          )}
        </div>
      )}
    </div>
  )
}
