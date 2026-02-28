export interface ProjectData {
  id: string
  name: string
  type: BuildingType
  status: ProjectStatus
  /** 0-1 normalized value driving building height */
  heightFactor: number
  /** Optional metadata for detail panel */
  meta?: Record<string, string | number>
  /** Link to navigate to on click */
  href?: string
}

export type BuildingType =
  | 'helix-tower'    // Projects
  | 'data-shard'     // Content platforms
  | 'quant-blade'    // CRM pipeline
  | 'hex-hive'       // Landing pages
  | 'memory-core'    // Progression/XP

export type ProjectStatus =
  | 'active'
  | 'blocked'
  | 'paused'
  | 'complete'
  | 'planned'
  | 'maintenance'
  | 'draft'
  | 'generated'
  | 'published'
  | 'expired'

export interface CityTheme {
  background: string
  grid: string
  glow: string
  statusColors: Record<string, string>
  fog: string
}

export interface HeartbeatStatus {
  active: boolean
  lastActivity?: string
  project?: string | null
  tool?: string | null
  activityCount?: number
}

export const TERMINAL_GREEN_THEME: CityTheme = {
  background: '#000000',
  grid: '#0a3a0a',
  glow: '#22c55e',
  fog: '#001a00',
  statusColors: {
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
  },
}
