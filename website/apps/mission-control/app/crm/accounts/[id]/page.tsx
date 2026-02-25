'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import ContactCard from '../../../components/crm/ContactCard'
import DealCard from '../../../components/crm/DealCard'
import ActivityTimeline from '../../../components/crm/ActivityTimeline'
import CrmForm from '../../../components/crm/CrmForm'

const STAGE_COLORS: Record<string, string> = {
  prospect: 'bg-gray-700 text-gray-300',
  qualified: 'bg-blue-900 text-blue-300',
  opportunity: 'bg-yellow-900 text-yellow-300',
  customer: 'bg-green-900 text-green-300',
  churned: 'bg-red-900 text-red-300',
}

type Tab = 'overview' | 'contacts' | 'deals' | 'activity'

export default function AccountDetailPage() {
  const { id } = useParams()
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('overview')
  const [showContactForm, setShowContactForm] = useState(false)
  const [showDealForm, setShowDealForm] = useState(false)

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/crm/accounts/${id}/`)
    const json = await res.json()
    setData(json)
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading || !data) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>
  }

  const account = data.account as Record<string, unknown>
  const contacts = (data.contacts || []) as Record<string, unknown>[]
  const deals = (data.deals || []) as Record<string, unknown>[]
  const activities = (data.activities || []) as Record<string, unknown>[]

  const handleAddContact = async (formData: Record<string, string>) => {
    await fetch('/api/crm/contacts/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, account_id: id }),
    })
    setShowContactForm(false)
    fetchData()
  }

  const handleAddDeal = async (formData: Record<string, string>) => {
    await fetch('/api/crm/deals/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        account_id: id,
        value_cents: formData.value_cents ? parseInt(formData.value_cents) : 0,
        probability: formData.probability ? parseInt(formData.probability) : 0,
      }),
    })
    setShowDealForm(false)
    fetchData()
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'contacts', label: 'Contacts', count: contacts.length },
    { key: 'deals', label: 'Deals', count: deals.length },
    { key: 'activity', label: 'Activity', count: activities.length },
  ]

  return (
    <div className="space-y-6">
      <Link href="/crm/accounts/" className="text-sm text-green-600 hover:text-green-400 transition-colors">
        &larr; Back to Accounts
      </Link>

      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-green-300">{account.name as string}</h1>
            {account.domain ? <div className="text-xs text-gray-500 mt-1">{String(account.domain)}</div> : null}
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
            STAGE_COLORS[String(account.stage)] || 'bg-gray-800 text-gray-400'
          }`}>
            {String(account.stage)}
          </span>
        </div>
        <div className="flex gap-4 mt-3 text-xs text-gray-500">
          {account.industry ? <span>{String(account.industry)}</span> : null}
          {account.geography ? <span>{String(account.geography)}</span> : null}
          {account.size ? <span>Size: {String(account.size)}</span> : null}
          {account.source ? <span>Source: {String(account.source)}</span> : null}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-green-800/50 pb-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-xs font-medium rounded-t transition-colors ${
              tab === t.key
                ? 'bg-gray-900 text-green-300 border border-green-800/50 border-b-0'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t.label}
            {t.count !== undefined && (
              <span className="ml-1 text-gray-600">({t.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div className="card">
          <h2 className="text-sm font-bold text-green-400 mb-2">Notes</h2>
          <div className="text-sm text-gray-300 whitespace-pre-wrap">
            {(account.notes as string) || 'No notes yet.'}
          </div>
        </div>
      )}

      {tab === 'contacts' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowContactForm(!showContactForm)} className="btn text-xs flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add Contact
            </button>
          </div>
          {showContactForm && (
            <div className="card">
              <CrmForm
                fields={[
                  { name: 'first_name', label: 'First Name', type: 'text', required: true },
                  { name: 'last_name', label: 'Last Name', type: 'text' },
                  { name: 'email', label: 'Email', type: 'email' },
                  { name: 'phone', label: 'Phone', type: 'text' },
                  { name: 'role', label: 'Role/Title', type: 'text' },
                  { name: 'linkedin_url', label: 'LinkedIn URL', type: 'text' },
                ]}
                onSubmit={handleAddContact}
                submitLabel="Add Contact"
                onCancel={() => setShowContactForm(false)}
              />
            </div>
          )}
          <div className="space-y-2">
            {contacts.map((c) => (
              <ContactCard key={c.id as number} contact={c as ContactCard['contact']} />
            ))}
            {contacts.length === 0 && (
              <div className="card text-center py-8 text-gray-500 text-sm">No contacts yet</div>
            )}
          </div>
        </div>
      )}

      {tab === 'deals' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowDealForm(!showDealForm)} className="btn text-xs flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add Deal
            </button>
          </div>
          {showDealForm && (
            <div className="card">
              <CrmForm
                fields={[
                  { name: 'title', label: 'Deal Title', type: 'text', required: true },
                  { name: 'value_cents', label: 'Value (cents)', type: 'number', placeholder: '10000 = $100' },
                  {
                    name: 'stage',
                    label: 'Stage',
                    type: 'select',
                    options: [
                      { label: 'Discovery', value: 'discovery' },
                      { label: 'Demo', value: 'demo' },
                      { label: 'Proposal', value: 'proposal' },
                      { label: 'Negotiation', value: 'negotiation' },
                      { label: 'Closed Won', value: 'closed_won' },
                      { label: 'Closed Lost', value: 'closed_lost' },
                    ],
                  },
                  { name: 'probability', label: 'Probability (%)', type: 'number' },
                  { name: 'expected_close_date', label: 'Expected Close Date', type: 'text', placeholder: 'YYYY-MM-DD' },
                  { name: 'notes', label: 'Notes', type: 'textarea' },
                ]}
                onSubmit={handleAddDeal}
                submitLabel="Create Deal"
                onCancel={() => setShowDealForm(false)}
              />
            </div>
          )}
          <div className="space-y-2">
            {deals.map((d) => (
              <DealCard key={d.id as number} deal={d as DealCard['deal']} />
            ))}
            {deals.length === 0 && (
              <div className="card text-center py-8 text-gray-500 text-sm">No deals yet</div>
            )}
          </div>
        </div>
      )}

      {tab === 'activity' && (
        <div className="card">
          <ActivityTimeline activities={activities as ActivityTimeline['activities']} />
        </div>
      )}
    </div>
  )
}

// Type helpers for component props
type ContactCard = { contact: { id: number; first_name: string; last_name: string | null; email: string | null; role: string | null; is_primary: number } }
type DealCard = { deal: { id: number; title: string; value_cents: number; stage: string; probability: number; expected_close_date?: string | null } }
type ActivityTimeline = { activities: { id: number; type: string; title: string; body: string | null; created_at: string }[] }
