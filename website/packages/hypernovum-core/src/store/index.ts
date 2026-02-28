import { create } from 'zustand'
import type { ProjectData, HeartbeatStatus } from '../types'

interface CityStore {
  projects: ProjectData[]
  selectedId: string | null
  heartbeat: HeartbeatStatus
  hoveredId: string | null

  setProjects: (projects: ProjectData[]) => void
  selectBuilding: (id: string | null) => void
  setHeartbeat: (status: HeartbeatStatus) => void
  setHovered: (id: string | null) => void
}

export const useCityStore = create<CityStore>((set) => ({
  projects: [],
  selectedId: null,
  heartbeat: { active: false },
  hoveredId: null,

  setProjects: (projects) => set({ projects }),
  selectBuilding: (id) => set({ selectedId: id }),
  setHeartbeat: (status) => set({ heartbeat: status }),
  setHovered: (id) => set({ hoveredId: id }),
}))
