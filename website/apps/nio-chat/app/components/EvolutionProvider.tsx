// NioBot V3 — Evolution context: server-first init, optimistic XP, localStorage cache
// DNA Phase 5: fetches from /api/dna on init, POSTs XP to /api/dna/xp

'use client'

import { createContext, useContext, useReducer, useEffect, useCallback, useRef, type ReactNode } from 'react'
import { getToday, getLevelProgress } from '../../lib/evolution'

// --- State ---

export interface EvolutionState {
  xp: number
  skillXP: Record<string, number>  // skillId → accumulated XP
  streak: number
  lastActiveDate: string | null
  dailyBonusClaimed: boolean       // from server via dna_daily_flags
  deepConvoClaimed: boolean        // client-side per-session
  veryDeepConvoClaimed: boolean    // client-side per-session
  initialized: boolean
  serverSynced: boolean            // true once server response received
}

export interface XPGain {
  amount: number
  source: string
}

export type EvolutionAction =
  | { type: 'INIT'; state: Partial<EvolutionState> }
  | { type: 'SERVER_SYNC'; state: Partial<EvolutionState> }
  | { type: 'ADD_XP'; amount: number; source: string; skillId?: string }
  | { type: 'RECONCILE_XP'; serverState: { xp: number; tier: number; level: number; skillXP: Record<string, number> } }
  | { type: 'CLAIM_DAILY_BONUS' }
  | { type: 'CLAIM_DEEP_CONVO' }
  | { type: 'CLAIM_VERY_DEEP_CONVO' }
  | { type: 'RESET_SESSION_FLAGS' }

function evolutionReducer(state: EvolutionState, action: EvolutionAction): EvolutionState {
  switch (action.type) {
    case 'INIT':
      return { ...state, ...action.state, initialized: true }

    case 'SERVER_SYNC':
      return { ...state, ...action.state, initialized: true, serverSynced: true }

    case 'ADD_XP': {
      const newXP = state.xp + action.amount
      const skillXP = { ...state.skillXP }
      if (action.skillId) {
        skillXP[action.skillId] = (skillXP[action.skillId] || 0) + action.amount
      }
      return { ...state, xp: newXP, skillXP }
    }

    case 'RECONCILE_XP':
      // Server response is truth — replace XP/tier/level
      return {
        ...state,
        xp: action.serverState.xp,
        skillXP: action.serverState.skillXP,
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
  } catch (e) { console.error('[evolution] Failed to load cached state:', e) }
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
    serverSynced: false,
  })

  const bootstrapAttempted = useRef(false)

  // Step 1: Show localStorage cache instantly (stale but fast)
  useEffect(() => {
    const saved = loadEvolution()
    const today = getToday()

    // Recalculate streak from cache
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
        streak += 1
        dailyBonusClaimed = false
      } else {
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

    // Step 2: Fetch server truth from GET /api/dna
    const token = localStorage.getItem('shawnos-chat-token')
    const headers: Record<string, string> = {}
    if (token && token !== 'no-auth') {
      headers['Authorization'] = `Bearer ${token}`
    }

    fetch('/api/dna', { headers })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        // Step 3: Dispatch SERVER_SYNC with server state
        dispatch({
          type: 'SERVER_SYNC',
          state: {
            xp: data.xp,
            skillXP: data.skillXP,
            streak: data.streak,
            lastActiveDate: data.lastActiveDate,
            dailyBonusClaimed: data.dailyBonusClaimed,
          },
        })

        // Bootstrap: if server has 0 XP but localStorage has XP, migrate
        if (data.xp === 0 && saved.xp && (saved.xp as number) > 0 && !bootstrapAttempted.current) {
          bootstrapAttempted.current = true
          fetch('/api/dna/bootstrap', {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              xp: saved.xp,
              skillXP: saved.skillXP || {},
              streak: saved.streak || 0,
              lastActiveDate: saved.lastActiveDate || null,
            }),
          }).then(res => res.json()).then(result => {
            if (result.migrated) {
              // Re-fetch to get the migrated state
              fetch('/api/dna', { headers })
                .then(r => r.json())
                .then(refreshed => {
                  dispatch({
                    type: 'SERVER_SYNC',
                    state: {
                      xp: refreshed.xp,
                      skillXP: refreshed.skillXP,
                      streak: refreshed.streak,
                      lastActiveDate: refreshed.lastActiveDate,
                      dailyBonusClaimed: refreshed.dailyBonusClaimed,
                    },
                  })
                })
                .catch((e) => { console.error('[evolution] Failed to refresh after bootstrap:', e) })
            }
          }).catch((e) => { console.error('[evolution] Bootstrap migration failed:', e) })
        }
      })
      .catch(() => {
        // Step 4: On error, fall back to cached data (already loaded above)
        console.warn('[evolution] Server sync failed, using cached state')
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist state to localStorage cache
  useEffect(() => {
    if (state.initialized) saveEvolution(state)
  }, [state])

  const addXP = useCallback((amount: number, source: string, skillId?: string) => {
    // Step 1: Dispatch local ADD_XP optimistically (UI updates instantly)
    const beforeProgress = getLevelProgress(state.xp)
    const afterProgress = getLevelProgress(state.xp + amount)

    dispatch({ type: 'ADD_XP', amount, source, skillId })
    emitXPGain({ amount, source })

    // Check for level up from optimistic state
    if (afterProgress.totalLevel > beforeProgress.totalLevel) {
      emitLevelUp({
        newTier: afterProgress.tier,
        newLevel: afterProgress.level,
        tierName: afterProgress.tierName,
        isTierUp: afterProgress.tier > beforeProgress.tier,
      })
    }

    // Step 2: POST /api/dna/xp with base amount + source + skillId
    const token = localStorage.getItem('shawnos-chat-token')
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token && token !== 'no-auth') {
      headers['Authorization'] = `Bearer ${token}`
    }

    fetch('/api/dna/xp', {
      method: 'POST',
      headers,
      body: JSON.stringify({ amount, source, skillId }),
    })
      .then(res => {
        if (!res.ok) return // 409 for already-claimed bonuses is fine
        return res.json()
      })
      .then(result => {
        if (!result) return
        // Step 3: Reconcile state from server response
        dispatch({
          type: 'RECONCILE_XP',
          serverState: {
            xp: result.newXP,
            tier: result.tier,
            level: result.level,
            skillXP: state.skillXP, // keep local for now, server handles it
          },
        })

        // Step 4: Check leveledUp/tieredUp from server for authoritative level-up
        if (result.tieredUp || result.leveledUp) {
          emitLevelUp({
            newTier: result.tier,
            newLevel: result.level,
            tierName: result.tierName,
            isTierUp: result.tieredUp,
          })
        }
      })
      .catch((e) => {
        console.error('[evolution] XP sync failed, optimistic state stands:', e)
      })
  }, [state.xp, state.skillXP])

  return (
    <EvolutionContext.Provider value={{ state, dispatch, addXP }}>
      {children}
    </EvolutionContext.Provider>
  )
}
