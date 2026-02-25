'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface SchemaViewerProps {
  schemas: { name: string; sql: string }[]
}

export default function SchemaViewer({ schemas }: SchemaViewerProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggle = (name: string) => {
    const next = new Set(expanded)
    if (next.has(name)) {
      next.delete(name)
    } else {
      next.add(name)
    }
    setExpanded(next)
  }

  return (
    <div className="space-y-2">
      {schemas.map(({ name, sql }) => (
        <div key={name} className="border border-green-800 rounded-lg overflow-hidden">
          <button
            onClick={() => toggle(name)}
            className="w-full flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 transition-colors text-left"
          >
            {expanded.has(name) ? (
              <ChevronDown className="w-3 h-3 text-green-400" />
            ) : (
              <ChevronRight className="w-3 h-3 text-green-400" />
            )}
            <span className="text-sm font-medium text-green-300">{name}</span>
          </button>
          {expanded.has(name) && (
            <pre className="px-4 py-3 text-xs text-green-400 bg-black overflow-x-auto">
              {sql}
            </pre>
          )}
        </div>
      ))}
    </div>
  )
}
