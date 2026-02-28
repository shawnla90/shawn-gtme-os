'use client'

import { useRef, useEffect, useCallback } from 'react'
import { CityScene } from './scene/CityScene'
import { useCityStore } from './store'
import type { ProjectData, CityTheme, HeartbeatStatus } from './types'
import { TERMINAL_GREEN_THEME } from './types'

interface CityRendererProps {
  projects: ProjectData[]
  theme?: CityTheme
  heartbeatStatus?: HeartbeatStatus
  onBuildingClick?: (project: ProjectData) => void
  className?: string
}

export function CityRenderer({
  projects,
  theme = TERMINAL_GREEN_THEME,
  heartbeatStatus,
  onBuildingClick,
  className,
}: CityRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<CityScene | null>(null)
  const { setProjects, selectBuilding, setHeartbeat, setHovered } = useCityStore()

  const handleClick = useCallback(
    (project: ProjectData) => {
      selectBuilding(project.id)
      onBuildingClick?.(project)
    },
    [selectBuilding, onBuildingClick],
  )

  const handleHover = useCallback(
    (id: string | null) => {
      setHovered(id)
    },
    [setHovered],
  )

  // Initialize scene
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const scene = new CityScene({
      canvas,
      theme,
      onBuildingClick: handleClick,
      onBuildingHover: handleHover,
    })

    sceneRef.current = scene

    // Initial size
    const rect = canvas.parentElement?.getBoundingClientRect()
    if (rect) {
      scene.resize(rect.width, rect.height)
    }

    scene.start()

    return () => {
      scene.dispose()
      sceneRef.current = null
    }
  }, [theme, handleClick, handleHover])

  // Update projects
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setProjects(projects)
      setProjects(projects)
    }
  }, [projects, setProjects])

  // Update heartbeat
  useEffect(() => {
    if (sceneRef.current && heartbeatStatus) {
      sceneRef.current.setHeartbeat(heartbeatStatus)
      setHeartbeat(heartbeatStatus)
    }
  }, [heartbeatStatus, setHeartbeat])

  // Resize handler
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        sceneRef.current?.resize(width, height)
      }
    })

    if (canvas.parentElement) {
      observer.observe(canvas.parentElement)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
