'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
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
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

interface NavSection {
  title: string
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'OPS',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'Logs', href: '/logs', icon: FileText },
      { label: 'Calendar', href: '/calendar', icon: Calendar },
      { label: 'Office', href: '/office', icon: Building2 },
    ],
  },
  {
    title: 'INTEL',
    items: [
      { label: 'Content', href: '/content', icon: FileText },
      { label: 'Databases', href: '/databases', icon: Database },
      { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'GTM',
    items: [
      { label: 'CRM', href: '/crm', icon: Briefcase },
      { label: 'Projects', href: '/projects', icon: FolderKanban },
      { label: 'Team', href: '/team', icon: Users },
      { label: 'Progression', href: '/progression', icon: Crown },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const nav = (
    <nav className="flex flex-col gap-6 py-4">
      {NAV_SECTIONS.map((section) => (
        <div key={section.title}>
          <div className="px-4 mb-2 text-[10px] font-bold text-green-700 tracking-widest uppercase">
            {section.title}
          </div>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    active
                      ? 'bg-green-900/40 text-green-300 border-r-2 border-green-400'
                      : 'text-gray-500 hover:text-green-400 hover:bg-gray-900/50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-900 border border-green-800 rounded p-2 text-green-400"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[220px] bg-black border-r border-green-800/50 z-40 transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="px-4 py-5 border-b border-green-800/50">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <span className="text-lg">🤖</span>
            <span className="text-sm font-bold text-green-300 tracking-wide">MISSION CTRL</span>
          </Link>
          <div className="text-[10px] text-green-700 mt-1">STATUS: ONLINE</div>
        </div>

        {nav}
      </aside>
    </>
  )
}
