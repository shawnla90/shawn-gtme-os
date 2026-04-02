'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Building2,
  Database,
  BarChart3,
  Briefcase,
  FolderKanban,
  Users,
  Crown,
  Menu,
  X,
  GitGraph,
  Timer,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  private?: boolean
}

interface NavSection {
  title: string
  items: NavItem[]
}

const isPublic = process.env.NEXT_PUBLIC_MODE === 'public'

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'OPS',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'Logs', href: '/logs', icon: FileText, private: true },
      { label: 'Calendar', href: '/calendar', icon: Calendar },
      { label: 'Crons', href: '/crons', icon: Timer, private: true },
      { label: 'Office', href: '/office', icon: Building2, private: true },
    ],
  },
  {
    title: 'INTEL',
    items: [
      { label: 'Content', href: '/content', icon: FileText },
      { label: 'Code Graph', href: '/code-graph', icon: GitGraph, private: true },
      { label: 'Databases', href: '/databases', icon: Database, private: true },
      { label: 'Analytics', href: '/analytics', icon: BarChart3, private: true },
    ],
  },
  {
    title: 'GTM',
    items: [
      { label: 'CRM', href: '/crm', icon: Briefcase, private: true },
      { label: 'Projects', href: '/projects', icon: FolderKanban },
      { label: 'Team', href: '/team', icon: Users },
      { label: 'Progression', href: '/progression', icon: Crown },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [claudeActive, setClaudeActive] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Poll heartbeat for Claude status indicator
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/heartbeat')
        if (res.ok) {
          const data = await res.json()
          setClaudeActive(data.active ?? false)
        }
      } catch { /* ignore */ }
    }
    check()
    const interval = setInterval(check, 5000)
    return () => clearInterval(interval)
  }, [])

  const nav = (
    <nav className="flex flex-col gap-1 py-3 custom-scrollbar overflow-y-auto flex-1">
      {NAV_SECTIONS.map((section) => {
        const visibleItems = isPublic ? section.items.filter((i) => !i.private) : section.items
        if (visibleItems.length === 0) return null
        return (
          <div key={section.title} className="mb-2">
            <div className="px-4 mb-1.5 flex items-center gap-2">
              <span className="section-label text-green-700">{section.title}</span>
              <div className="flex-1 h-px bg-gradient-to-r from-green-900/40 to-transparent" />
            </div>
            <div className="space-y-px">
              {visibleItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2 text-xs transition-all duration-200 relative group ${
                      active
                        ? 'text-green-300 bg-green-500/8'
                        : 'text-gray-500 hover:text-green-400 hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Active left accent */}
                    {active && (
                      <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-green-400 rounded-r glow-green-sm" />
                    )}
                    {/* Hover left accent */}
                    {!active && (
                      <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-green-600/0 group-hover:bg-green-600/30 rounded-r transition-all duration-200" />
                    )}
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="tracking-wide">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 lg:hidden glass rounded p-2 text-green-400"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[220px] bg-black/90 border-r border-gray-800/50 z-40 transition-transform lg:translate-x-0 flex flex-col backdrop-blur-md ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="px-4 py-4 border-b border-gray-800/40">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <div className="w-7 h-7 rounded bg-green-500/10 border border-green-500/20 flex items-center justify-center glow-green-sm">
              <span className="text-[10px] font-bold text-green-400 tracking-tighter">MC</span>
            </div>
            <span className="text-xs font-bold text-green-300 tracking-[0.15em] uppercase">Mission Ctrl</span>
          </Link>
          <div className="flex items-center gap-2 mt-2.5">
            <div className={`w-1.5 h-1.5 rounded-full ${claudeActive ? 'status-active' : 'status-idle'}`} />
            <span className="text-[9px] text-gray-600 uppercase tracking-wider">
              Claude: {claudeActive ? 'Active' : 'Idle'}
            </span>
          </div>
        </div>

        {nav}

        {/* Bottom: system info */}
        <div className="px-4 py-3 border-t border-gray-800/30 text-[9px] text-gray-700 space-y-0.5">
          <div>System: <span className="text-gray-600">Online</span></div>
          <div>Version: <span className="text-gray-600">2.0.0</span></div>
        </div>
      </aside>
    </>
  )
}
