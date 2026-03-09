import type { RPGClass } from '@shawnos/shared/lib'

export const REVEAL_DURATION_MAX = 9    // closest locked tier (seconds)
export const REVEAL_DURATION_MIN = 1.5  // max rank / farthest (seconds)
export const ALL_CLASSES: RPGClass[] = ['Builder', 'Scribe', 'Strategist', 'Alchemist', 'Polymath']

/* ── Per-class color palette (Easter egg reveal effects) ── */

export interface ClassColor {
  primary: string
  glow: string
  shadow: string
}

export const CLASS_COLORS: Record<RPGClass, ClassColor> = {
  Builder:    { primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)',  shadow: 'rgba(245, 158, 11, 0.15)' },
  Scribe:     { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.3)',   shadow: 'rgba(6, 182, 212, 0.15)' },
  Strategist: { primary: '#3b82f6', glow: 'rgba(59, 130, 246, 0.3)',  shadow: 'rgba(59, 130, 246, 0.15)' },
  Alchemist:  { primary: '#a855f7', glow: 'rgba(168, 85, 247, 0.3)',  shadow: 'rgba(168, 85, 247, 0.15)' },
  Polymath:   { primary: '#00ff41', glow: 'rgba(0, 255, 65, 0.3)',    shadow: 'rgba(0, 255, 65, 0.15)' },
}
