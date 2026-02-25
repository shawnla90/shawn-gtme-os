'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
import ContactCard from '../../components/crm/ContactCard'

interface Contact {
  id: number
  first_name: string
  last_name: string | null
  email: string | null
  role: string | null
  is_primary: number
  account_name: string
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchContacts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    const res = await fetch(`/api/crm/contacts/?${params}`)
    const data = await res.json()
    setContacts(data.contacts)
    setLoading(false)
  }, [search])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-green-300 mb-1">CONTACTS</h1>
        <p className="text-sm text-gray-500">{contacts.length} contacts across all accounts</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-gray-900 border border-green-800 rounded text-sm text-green-300 placeholder-gray-600 focus:outline-none focus:border-green-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
          {contacts.length === 0 && (
            <div className="card text-center py-12 text-gray-500">No contacts found</div>
          )}
        </div>
      )}
    </div>
  )
}
