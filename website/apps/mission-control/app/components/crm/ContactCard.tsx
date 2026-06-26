'use client'

import { Mail, Briefcase, Linkedin, Sparkles, Activity } from 'lucide-react'

interface ContactCardProps {
  contact: {
    id: number
    first_name: string
    last_name: string | null
    email: string | null
    role: string | null
    title?: string | null
    is_primary: number
    account_name?: string
    linkedin_url?: string | null
    persona?: string | null
    vibe?: string | null
    source?: string | null
  }
}

export default function ContactCard({ contact }: ContactCardProps) {
  const fullName = [contact.first_name, contact.last_name].filter(Boolean).join(' ')
  const jobLine = contact.title || contact.role

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-medium text-green-300 flex items-center gap-2 flex-wrap">
            {fullName}
            {contact.is_primary ? (
              <span className="text-[10px] px-1.5 py-0.5 bg-green-900 text-green-400 rounded">Primary</span>
            ) : null}
            {contact.persona ? (
              <span
                className="text-[10px] px-1.5 py-0.5 bg-blue-900 text-blue-300 rounded inline-flex items-center gap-1 cursor-help"
                title={contact.persona}
              >
                <Sparkles className="w-2.5 h-2.5" /> Persona
              </span>
            ) : null}
            {contact.vibe ? (
              <span
                className="text-[10px] px-1.5 py-0.5 bg-purple-900 text-purple-300 rounded inline-flex items-center gap-1"
                title={`Vibe: ${contact.vibe}`}
              >
                <Activity className="w-2.5 h-2.5" /> {contact.vibe.length > 16 ? 'Vibe' : contact.vibe}
              </span>
            ) : null}
          </div>
          {contact.account_name ? (
            <div className="text-xs text-gray-500 mt-0.5">{contact.account_name}</div>
          ) : null}
        </div>
        {contact.linkedin_url ? (
          <a
            href={contact.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-[11px] px-2 py-1 bg-[#0a66c2]/20 text-[#5aa2ea] rounded inline-flex items-center gap-1 hover:bg-[#0a66c2]/40 transition-colors"
            title="Open LinkedIn profile"
          >
            <Linkedin className="w-3 h-3" /> LinkedIn
          </a>
        ) : null}
      </div>
      <div className="flex gap-4 mt-2 text-xs text-gray-500 flex-wrap">
        {contact.email ? (
          <span className="flex items-center gap-1">
            <Mail className="w-3 h-3" /> {contact.email}
          </span>
        ) : null}
        {jobLine ? (
          <span className="flex items-center gap-1">
            <Briefcase className="w-3 h-3" /> {jobLine}
          </span>
        ) : null}
        {contact.source ? (
          <span className="flex items-center gap-1 text-gray-600">via {contact.source}</span>
        ) : null}
      </div>
    </div>
  )
}
