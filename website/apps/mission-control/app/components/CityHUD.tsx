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
        <div className="glass-sm rounded-lg px-4 py-3">
          <div className="section-label text-green-700 mb-2">
            MISSION CONTROL CITY
          </div>
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Buildings:</span>
              <span className="text-green-300 font-bold">{buildingCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Claude:</span>
              <div className={`w-1.5 h-1.5 rounded-full ${heartbeat.active ? 'status-active' : 'status-idle'}`} />
              <span className={heartbeat.active ? 'text-green-300' : 'text-gray-600'}>
                {heartbeat.active ? 'ACTIVE' : 'IDLE'}
              </span>
              {heartbeat.active && heartbeat.tool && (
                <span className="text-green-800 text-[10px]">({heartbeat.tool})</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-left: Key metrics */}
      <div className="absolute bottom-4 left-4 pointer-events-none">
        <div className="glass-sm rounded-lg px-4 py-3">
          <div className="grid grid-cols-3 gap-x-5 gap-y-2 text-xs">
            <MetricWidget label="XP" value={metrics.xp.toLocaleString()} accent="#4ade80" />
            <MetricWidget label="Content" value={String(metrics.contentCount)} accent="#60a5fa" />
            <MetricWidget label="Pipeline" value={formatPipeline(metrics.pipelineValue)} accent="#f59e0b" />
            <MetricWidget label="Messages" value={String(metrics.messages)} accent="#818cf8" />
            <MetricWidget label="Accounts" value={String(metrics.accounts)} accent="#2dd4bf" />
            <MetricWidget label="Deals" value={String(metrics.deals)} accent="#f472b6" />
          </div>
        </div>
      </div>

      {/* Top-right: Hover tooltip */}
      {hoveredProject && (
        <div className="absolute top-4 right-4 pointer-events-none">
          <div className="glass rounded-lg px-4 py-3">
            <div className="text-green-300 text-sm font-bold">{hoveredProject.name}</div>
            <div className="text-[10px] text-gray-600 uppercase tracking-wider mt-0.5">
              {hoveredProject.type} / {hoveredProject.status}
            </div>
          </div>
        </div>
      )}

      {/* Bottom-right: Navigation hint */}
      <div className="absolute bottom-4 right-4 pointer-events-none">
        <div className="text-[10px] text-gray-700 font-mono">
          Click building for details / Drag to orbit / Scroll to zoom
        </div>
      </div>
    </>
  )
}

function MetricWidget({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div>
      <div className="text-[9px] text-gray-600 uppercase tracking-wider font-sans">{label}</div>
      <div className="text-sm font-bold" style={{ color: accent }}>{value}</div>
    </div>
  )
}

function formatPipeline(valueCents: number): string {
  if (valueCents <= 0) return '$0'
  return `$${(valueCents / 100).toLocaleString()}`
}
