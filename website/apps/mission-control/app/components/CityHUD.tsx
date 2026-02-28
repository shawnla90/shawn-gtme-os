'use client'

import type { ProjectData, HeartbeatStatus } from '@hypernovum/core'

interface CityHUDProps {
  metrics: {
    xp: number
    messages: number
    contentCount: number
    accounts: number
    deals: number
    pipelineValue: number
  }
  heartbeat: HeartbeatStatus
  buildingCount: number
  hoveredProject: ProjectData | null
}

export default function CityHUD({ metrics, heartbeat, buildingCount, hoveredProject }: CityHUDProps) {
  return (
    <>
      {/* Top-left: System status */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="bg-black/60 border border-green-800/40 rounded px-3 py-2 font-mono backdrop-blur-sm">
          <div className="text-[10px] text-green-700 uppercase tracking-widest mb-2">
            MISSION CONTROL CITY
          </div>
          <div className="text-xs text-green-400 space-y-0.5">
            <div>
              Buildings: <span className="text-green-300">{buildingCount}</span>
            </div>
            <div>
              Claude:{' '}
              <span className={heartbeat.active ? 'text-green-300 animate-pulse' : 'text-gray-600'}>
                {heartbeat.active ? 'ACTIVE' : 'IDLE'}
              </span>
              {heartbeat.active && heartbeat.tool && (
                <span className="text-green-700 ml-1">({heartbeat.tool})</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-left: Key metrics */}
      <div className="absolute bottom-4 left-4 pointer-events-none">
        <div className="bg-black/60 border border-green-800/40 rounded px-3 py-2 font-mono backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-xs">
            <MetricItem label="XP" value={metrics.xp.toLocaleString()} />
            <MetricItem label="Content" value={String(metrics.contentCount)} />
            <MetricItem label="Pipeline" value={formatPipeline(metrics.pipelineValue)} />
            <MetricItem label="Messages" value={String(metrics.messages)} />
            <MetricItem label="Accounts" value={String(metrics.accounts)} />
            <MetricItem label="Deals" value={String(metrics.deals)} />
          </div>
        </div>
      </div>

      {/* Top-right: Hover tooltip */}
      {hoveredProject && (
        <div className="absolute top-4 right-4 pointer-events-none">
          <div className="bg-black/80 border border-green-800/50 rounded px-3 py-2 font-mono backdrop-blur-sm">
            <div className="text-green-300 text-sm">{hoveredProject.name}</div>
            <div className="text-green-700 text-[10px] uppercase">
              {hoveredProject.type} / {hoveredProject.status}
            </div>
          </div>
        </div>
      )}

      {/* Bottom-right: Navigation hint */}
      <div className="absolute bottom-4 right-4 pointer-events-none">
        <div className="text-[10px] text-green-800 font-mono">
          Click building for details / Drag to orbit / Scroll to zoom
        </div>
      </div>
    </>
  )
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-600">{label}: </span>
      <span className="text-green-400">{value}</span>
    </div>
  )
}

function formatPipeline(valueCents: number): string {
  if (valueCents <= 0) return '$0'
  return `$${(valueCents / 100).toLocaleString()}`
}
