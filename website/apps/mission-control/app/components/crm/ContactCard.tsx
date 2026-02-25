'use client'

import { Mail, Briefcase } from 'lucide-react'

interface ContactCardProps {
  contact: {
    id: number
    first_name: string
    last_name: string | null
    email: string | null
    role: string | null
    is_primary: number
    account_name?: string
  }
}

export default function ContactCard({ contact }: ContactCardProps) {
  const fullName = [contact.first_name, contact.last_name].filter(Boolean).join(' ')

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-green-300 flex items-center gap-2">
            {fullName}
            {contact.is_primary ? (
              <span className="text-[10px] px-1.5 py-0.5 bg-green-900 text-green-400 rounded">Primary</span>
            ) : null}
          </div>
          {contact.account_name && (
            <div className="text-xs text-gray-500 mt-0.5">{contact.account_name}</div>
          )}
        </div>
      </div>
      <div className="flex gap-4 mt-2 text-xs text-gray-500">
        {contact.email && (
          <span className="flex items-center gap-1">
            <Mail className="w-3 h-3" /> {contact.email}
          </span>
        )}
        {contact.role && (
          <span className="flex items-center gap-1">
            <Briefcase className="w-3 h-3" /> {contact.role}
          </span>
        )}
      </div>
    </div>
  )
}
