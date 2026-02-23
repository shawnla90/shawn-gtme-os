// NioBot V3 — Evolution context: XP state, skill tracking, streak management, localStorage persistence

'use client'

import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react'
import { getToday, getLevelProgress } from '../../lib/evolution'

// --- State ---

export interface EvolutionState {
  xp: number
  skillXP: Record<string, number>  // skillId → accumulated XP
  streak: number
  lastActiveDate: string | null
  dailyBonusClaimed: boolean       // has first-message-of-day bonus been given today
  deepConvoClaimed: boolean        // 5+ turns bonus this session
  veryDeepConvoClaimed: boolean    // 10+ turns bonus this session
  initialized: boolean
}

export interface XPGain {
  amount: number
  source: string
}

export type EvolutionAction =
  | { type: 'INIT'; state: Partial<EvolutionState> }
  | { type: 'ADD_XP'; amount: number; source: string; skillId?: string }
  | { type: 'CLAIM_DAILY_BONUS' }
  | { type: 'CLAIM_DEEP_CONVO' }
  | { type: 'CLAIM_VERY_DEEP_CONVO' }
  | { type: 'RESET_SESSION_FLAGS' }

function evolutionReducer(state: EvolutionState, action: EvolutionAction): EvolutionState {
  switch (action.type) {
    case 'INIT':
      return { ...state, ...action.state, initialized: true }

    case 'ADD_XP': {
      const newXP = state.xp + action.amount
      const skillXP = { ...state.skillXP }
      if (action.skillId) {
        skillXP[action.skillId] = (skillXP[action.skillId] || 0) + action.amount
      }
      return { ...state, xp: newXP, skillXP }
    }

    case 'CLAIM_DAILY_BONUS':
      return { ...state, dailyBonusClaimed: true }

    case 'CLAIM_DEEP_CONVO':
      return { ...state, deepConvoClaimed: true }

    case 'CLAIM_VERY_DEEP_CONVO':
      return { ...state, veryDeepConvoClaimed: true }

    case 'RESET_SESSION_FLAGS':
      return { ...state, deepConvoClaimed: false, veryDeepConvoClaimed: false }

    default:
      return state
  }
}

const STORAGE_KEY = 'shawnos-evolution'

function loadEvolution(): Partial<EvolutionState> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch { /* corrupted */ }
  return {}
}

function saveEvolution(state: EvolutionState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    xp: state.xp,
    skillXP: state.skillXP,
    streak: state.streak,
    lastActiveDate: state.lastActiveDate,
    dailyBonusClaimed: state.dailyBonusClaimed,
  }))
}

// --- XP Gain Event Bus (for UI animations) ---

type XPGainListener = (gain: XPGain) => void
let xpListeners: XPGainListener[] = []

export function onXPGain(listener: XPGainListener): () => void {
  xpListeners.push(listener)
  return () => {
    xpListeners = xpListeners.filter(l => l !== listener)
  }
}

function emitXPGain(gain: XPGain) {
  xpListeners.forEach(l => l(gain))
}

// --- Level-Up Event Bus ---

export interface LevelUpEvent {
  newTier: number
  newLevel: number
  tierName: string
  isTierUp: boolean
}

type LevelUpListener = (event: LevelUpEvent) => void
let levelUpListeners: LevelUpListener[] = []

export function onLevelUp(listener: LevelUpListener): () => void {
  levelUpListeners.push(listener)
  return () => {
    levelUpListeners = levelUpListeners.filter(l => l !== listener)
  }
}

function emitLevelUp(event: LevelUpEvent) {
  levelUpListeners.forEach(l => l(event))
}

// --- Context ---

interface EvolutionContextValue {
  state: EvolutionState
  dispatch: React.Dispatch<EvolutionAction>
  addXP: (amount: number, source: string, skillId?: string) => void
}

const EvolutionContext = createContext<EvolutionContextValue | null>(null)

export function useEvolutionContext() {
  const ctx = useContext(EvolutionContext)
  if (!ctx) throw new Error('useEvolutionContext must be used within EvolutionProvider')
  return ctx
}

// --- Provider ---

export function EvolutionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(evolutionReducer, {
    xp: 0,
    skillXP: {},
    streak: 0,
    lastActiveDate: null,
    dailyBonusClaimed: false,
    deepConvoClaimed: false,
    veryDeepConvoClaimed: false,
    initialized: false,
  })

  // Initialize from localStorage
  useEffect(() => {
    const saved = loadEvolution()
    const today = getToday()

    // Check streak
    let streak = saved.streak || 0
    let dailyBonusClaimed = saved.dailyBonusClaimed || false

    if (saved.lastActiveDate) {
      const last = new Date(saved.lastActiveDate)
      const now = new Date(today)
      const diffMs = now.getTime() - last.getTime()
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        // Same day, keep everything
      } else if (diffDays === 1) {
        // Consecutive day, increment streak
        streak += 1
        dailyBonusClaimed = false
      } else {
        // Streak broken
        streak = 1
        dailyBonusClaimed = false
      }
    } else {
      streak = 0
    }

    dispatch({
      type: 'INIT',
      state: {
        ...saved,
        streak,
        dailyBonusClaimed,
        deepConvoClaimed: false,
        veryDeepConvoClaimed: false,
      },
    })
  }, [])

  // Persist state
  useEffect(() => {
    if (state.initialized) saveEvolution(state)
  }, [state])

  const addXP = useCallback((amount: number, source: string, skillId?: string) => {
    const beforeProgress = getLevelProgress(state.xp)
    const afterProgress = getLevelProgress(state.xp + amount)

    dispatch({ type: 'ADD_XP', amount, source, skillId })
    emitXPGain({ amount, source })

    // Check for level up
    if (afterProgress.totalLevel > beforeProgress.totalLevel) {
      emitLevelUp({
        newTier: afterProgress.tier,
        newLevel: afterProgress.level,
        tierName: afterProgress.tierName,
        isTierUp: afterProgress.tier > beforeProgress.tier,
      })
    }
  }, [state.xp])

  return (
    <EvolutionContext.Provider value={{ state, dispatch, addXP }}>
      {children}
    </EvolutionContext.Provider>
  )
}
