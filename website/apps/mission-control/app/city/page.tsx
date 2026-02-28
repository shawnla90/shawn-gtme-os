'use client'

import { useEffect, useState, useCallback } from 'react'
import type { ProjectData, HeartbeatStatus } from '@hypernovum/core'
import { useCityStore } from '@hypernovum/core'
import DynamicCityRenderer from '../components/DynamicCityRenderer'
import { getCityData } from '../lib/city-data'
import CityHUD from '../components/CityHUD'
import BuildingDetailPanel from '../components/BuildingDetailPanel'

export default function CityPage() {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [heartbeat, setHeartbeat] = useState<HeartbeatStatus>({ active: false })
  const [metrics, setMetrics] = useState({
    xp: 0, messages: 0, contentCount: 0, accounts: 0, deals: 0, pipelineValue: 0,
  })
  const { hoveredId } = useCityStore()
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/metrics')
        const data = res.ok ? await res.json() : null
        if (data) {
          setMetrics(data)
          setProjects(getCityData(data))
        }
      } catch {
        // Fall through with defaults
      }
    }
    load()
  }, [])

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch('/api/heartbeat')
        if (res.ok) setHeartbeat(await res.json())
      } catch { /* ignore */ }
    }
    poll()
    const interval = setInterval(poll, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleBuildingClick = useCallback((project: ProjectData) => {
    setSelectedProject(project)
  }, [])

  const hoveredProject = projects.find((p) => p.id === hoveredId)

  return (
    <div className="fixed inset-0 lg:left-[220px] bg-black">
      <DynamicCityRenderer
        projects={projects}
        heartbeatStatus={heartbeat}
        onBuildingClick={handleBuildingClick}
        className="w-full h-full"
      />

      <CityHUD
        metrics={metrics}
        heartbeat={heartbeat}
        buildingCount={projects.length}
        hoveredProject={hoveredProject ?? null}
      />

      {selectedProject && (
        <BuildingDetailPanel
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  )
}
