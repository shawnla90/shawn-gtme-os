'use client'

import type { Crew } from '@shawnos/shared/lib/crews'

const PROVIDER_COLORS: Record<string, string> = {
  anthropic: 'text-purple-400',
  ollama: 'text-green-400',
  openai: 'text-blue-400',
}

interface CrewDetailProps {
  crew: Crew
}

export default function CrewDetail({ crew }: CrewDetailProps) {
  const totalCostPerRun = crew.agents.reduce((s, a) => s + a.cost_per_run, 0)

  return (
    <div className="card border border-green-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-green-300">{crew.name}</h3>
        <span className="text-xs text-gray-500 font-mono">{crew.workflow} workflow</span>
      </div>

      <p className="text-sm text-gray-400 mb-4">{crew.description}</p>

      {/* Crew Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">{crew.agents.length}</div>
          <div className="text-[11px] text-gray-500 uppercase">Agents</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">${totalCostPerRun.toFixed(2)}</div>
          <div className="text-[11px] text-gray-500 uppercase">Cost / Run</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">{crew.total_runs ?? 0}</div>
          <div className="text-[11px] text-gray-500 uppercase">Total Runs</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">{crew.cron_jobs.length}</div>
          <div className="text-[11px] text-gray-500 uppercase">Cron Jobs</div>
        </div>
      </div>

      {/* Agent Roster */}
      <h4 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">Agent Roster</h4>
      <div className="space-y-3 mb-6">
        {crew.agents.map((agent) => (
          <div key={agent.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  agent.status === 'active' ? 'bg-green-400 animate-pulse' :
                  agent.status === 'error' ? 'bg-red-400' :
                  'bg-gray-600'
                }`} />
                <span className="font-medium text-green-300">{agent.name}</span>
                <span className="text-xs text-gray-500">({agent.role})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono ${PROVIDER_COLORS[agent.provider] ?? 'text-gray-400'}`}>
                  {agent.provider}
                </span>
                <span className="text-xs text-gray-600 font-mono">{agent.model}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-2">{agent.description}</p>
            <div className="flex flex-wrap gap-1">
              {agent.skills.map((skill) => (
                <span key={skill} className="text-xs px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cron Jobs */}
      <h4 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">Assigned Cron Jobs</h4>
      <div className="space-y-1">
        {crew.cron_jobs.map((job) => (
          <div key={job} className="flex items-center gap-2 text-xs">
            <span className="text-green-600">&#9658;</span>
            <span className="text-gray-400">{job}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
