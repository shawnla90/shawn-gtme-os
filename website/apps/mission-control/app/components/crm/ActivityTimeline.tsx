'use client'

import { Mail, Phone, Users, FileText, CheckCircle, Download } from 'lucide-react'

const TYPE_ICONS: Record<string, React.ElementType> = {
  email: Mail,
  call: Phone,
  meeting: Users,
  note: FileText,
  task: CheckCircle,
  import: Download,
}

const TYPE_COLORS: Record<string, string> = {
  email: 'text-blue-400',
  call: 'text-yellow-400',
  meeting: 'text-purple-400',
  note: 'text-gray-400',
  task: 'text-green-400',
  import: 'text-cyan-400',
}

interface Activity {
  id: number
  type: string
  title: string
  body: string | null
  account_name?: string
  contact_name?: string
  created_at: string
}

interface ActivityTimelineProps {
  activities: Activity[]
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return <div className="text-center py-8 text-gray-500 text-sm">No activities yet</div>
  }

  return (
    <div className="space-y-3">
      {activities.map((act) => {
        const Icon = TYPE_ICONS[act.type] || FileText
        const color = TYPE_COLORS[act.type] || 'text-gray-400'

        return (
          <div key={act.id} className="flex gap-3">
            <div className={`mt-1 shrink-0 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm text-green-300">{act.title}</div>
              {act.body && (
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{act.body}</div>
              )}
              <div className="text-[10px] text-gray-600 mt-1">
                {act.created_at}
                {act.account_name && <span> &middot; {act.account_name}</span>}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
