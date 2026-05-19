'use client'

import { useEffect, useState } from 'react'

function timeAgo(ms: number): string {
  const seconds = Math.floor((Date.now() - ms) / 1000)
  if (seconds < 30) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  const years = Math.floor(months / 12)
  return `${years}y ago`
}

interface RelativeTimeProps {
  timestamp: string
  className?: string
}

export function RelativeTime({ timestamp, className }: RelativeTimeProps) {
  const ms = new Date(timestamp).getTime()
  const [label, setLabel] = useState(() => timeAgo(ms))

  useEffect(() => {
    if (!Number.isFinite(ms)) return
    const id = setInterval(() => setLabel(timeAgo(ms)), 60_000)
    return () => clearInterval(id)
  }, [ms])

  return (
    <time
      dateTime={timestamp}
      title={new Date(timestamp).toLocaleString()}
      className={className}
      style={{ color: 'var(--text-muted)', fontSize: 12 }}
    >
      {label}
    </time>
  )
}
