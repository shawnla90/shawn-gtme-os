'use client'

import { useState } from 'react'
import type { Crew } from '@shawnos/shared/lib/crews'
import CrewDetail from './CrewDetail'

const WORKFLOW_COLORS: Record<string, string> = {
  sequential: 'text-cyan-400 border-cyan-600',
  parallel: 'text-purple-400 border-purple-600',
  independent: 'text-amber-400 border-amber-600',
}

const WORKFLOW_LABELS: Record<string, string> = {
  sequential: 'SEQ',
  parallel: 'PAR',
  independent: 'IND',
}

interface CrewDashboardProps {
  crews: Crew[]
}

export default function CrewDashboard({ crews }: CrewDashboardProps) {
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null)

  const totalAgents = crews.reduce((s, c) => s + c.agents.length, 0)
  const activeAgents = crews.reduce((s, c) => s + c.agents.filter((a) => a.status === 'active').length, 0)
  const totalCost = crews.reduce((s, c) => s + (c.total_cost ?? 0), 0)
  const totalRuns = crews.reduce((s, c) => s + (c.total_runs ?? 0), 0)

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-300">{crews.length}</div>
          <div className="text-xs text-gray-400">Crews</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-300">{totalAgents}</div>
          <div className="text-xs text-gray-400">Agents</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-300">{totalRuns}</div>
          <div className="text-xs text-gray-400">Total Runs</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-300">${totalCost.toFixed(2)}</div>
          <div className="text-xs text-gray-400">Total Cost</div>
        </div>
      </div>

      {/* Crew Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {crews.map((crew) => {
          const crewActive = crew.agents.filter((a) => a.status === 'active').length
          const wfColor = WORKFLOW_COLORS[crew.workflow] ?? 'text-gray-400 border-gray-600'
          const wfLabel = WORKFLOW_LABELS[crew.workflow] ?? '?'
          const isSelected = selectedCrew?.id === crew.id

          return (
            <div
              key={crew.id}
              className={`card cursor-pointer transition-all hover:bg-gray-800 ${
                isSelected ? 'ring-2 ring-green-500' : ''
              }`}
              onClick={() => setSelectedCrew(isSelected ? null : crew)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-green-300">{crew.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded border font-mono ${wfColor}`}>
                  {wfLabel}
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-3">{crew.description}</p>

              {/* Agent avatars */}
              <div className="flex gap-2 mb-3">
                {crew.agents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold border ${
                      agent.status === 'active'
                        ? 'bg-green-900 border-green-600 text-green-300'
                        : 'bg-gray-800 border-gray-700 text-gray-500'
                    }`}
                    title={`${agent.name} (${agent.status})`}
                  >
                    {agent.name.slice(0, 2).toUpperCase()}
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex justify-between text-xs text-gray-500">
                <span>{crew.agents.length} agents ({crewActive} active)</span>
                <span>{crew.total_runs ?? 0} runs</span>
              </div>

              {crew.last_run && (
                <div className="text-xs text-gray-600 mt-1">
                  Last: {new Date(crew.last_run).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Detail panel */}
      {selectedCrew && <CrewDetail crew={selectedCrew} />}
    </div>
  )
}
