'use client'

import Link from 'next/link'
import type { ProjectData } from '@hypernovum/core'

interface BuildingDetailPanelProps {
  project: ProjectData
  onClose: () => void
}

const STATUS_COLORS: Record<string, string> = {
  active: '#4ade80',
  blocked: '#ef4444',
  paused: '#eab308',
  complete: '#22c55e',
  planned: '#6b7280',
  maintenance: '#f59e0b',
  draft: '#6b7280',
  generated: '#22c55e',
  published: '#4ade80',
  expired: '#ef4444',
}

const TYPE_LABELS: Record<string, string> = {
  'helix-tower': 'Project',
  'data-shard': 'Content Platform',
  'quant-blade': 'CRM Pipeline',
  'hex-hive': 'Landing Pages',
  'memory-core': 'Progression System',
}

export default function BuildingDetailPanel({ project, onClose }: BuildingDetailPanelProps) {
  const statusColor = STATUS_COLORS[project.status] ?? '#22c55e'

  return (
    <div className="absolute bottom-0 right-0 w-80 max-h-[60vh] bg-black/95 border-l border-t border-green-800/50 overflow-y-auto backdrop-blur-sm font-mono">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 border-b border-green-800/30 px-4 py-3 flex items-center justify-between">
        <div>
          <h3 className="text-green-300 text-sm font-bold">{project.name}</h3>
          <span className="text-[10px] text-green-700 uppercase">
            {TYPE_LABELS[project.type] ?? project.type}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-green-400 transition-colors text-sm px-1"
        >
          [x]
        </button>
      </div>

      {/* Details */}
      <div className="p-4 space-y-3 text-xs">
        {/* Status + Height */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-gray-600 block mb-1">Status</span>
            <span
              className="inline-block px-2 py-0.5 rounded text-[10px] font-bold"
              style={{
                backgroundColor: `${statusColor}15`,
                color: statusColor,
                border: `1px solid ${statusColor}30`,
              }}
            >
              {project.status.toUpperCase()}
            </span>
          </div>
          <div>
            <span className="text-gray-600 block mb-1">Intensity</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-800 rounded overflow-hidden">
                <div
                  className="h-full rounded"
                  style={{
                    width: `${Math.round(project.heightFactor * 100)}%`,
                    backgroundColor: statusColor,
                  }}
                />
              </div>
              <span className="text-green-400">{Math.round(project.heightFactor * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Metadata */}
        {project.meta && Object.keys(project.meta).length > 0 && (
          <div className="border-t border-green-800/20 pt-3 space-y-1.5">
            <span className="text-[10px] text-green-700 uppercase tracking-wider">Metadata</span>
            {Object.entries(project.meta).map(([key, value]) => (
              <div key={key} className="flex justify-between items-start">
                <span className="text-gray-600 capitalize">{key}</span>
                <span className="text-green-600 text-right max-w-[60%] break-words">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        {project.href && (
          <Link
            href={project.href}
            className="block mt-3 text-center py-2 border border-green-800 rounded text-green-400 hover:bg-green-900/30 transition-colors text-xs"
          >
            Open in Mission Control →
          </Link>
        )}
      </div>
    </div>
  )
}
