// NioBot V3 — Chime system context: settings state, localStorage persistence, play()

'use client'

import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react'
import { unlockAudio, playChime, preloadMP3 } from '../../lib/chime-engine'
import { resolveSound, chimePacks, type ChimePack } from '../../lib/chime-packs'
import type { ChimeEvent } from '../../lib/chime-engine'

// --- State ---

interface ChimeState {
  enabled: boolean
  volume: number  // 0-1
  packId: string
  initialized: boolean
}

type ChimeAction =
  | { type: 'INIT'; state: Partial<ChimeState> }
  | { type: 'SET_ENABLED'; enabled: boolean }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'SET_PACK'; packId: string }

function chimeReducer(state: ChimeState, action: ChimeAction): ChimeState {
  switch (action.type) {
    case 'INIT':
      return { ...state, ...action.state, initialized: true }
    case 'SET_ENABLED':
      return { ...state, enabled: action.enabled }
    case 'SET_VOLUME':
      return { ...state, volume: action.volume }
    case 'SET_PACK':
      return { ...state, packId: action.packId }
    default:
      return state
  }
}

const STORAGE_KEY = 'shawnos-chime-settings'

function loadSettings(): Partial<ChimeState> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch { /* corrupted */ }
  return {}
}

function saveSettings(state: ChimeState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    enabled: state.enabled,
    volume: state.volume,
    packId: state.packId,
  }))
}

// --- Context ---

interface ChimeContextValue {
  state: ChimeState
  play: (event: ChimeEvent) => void
  setEnabled: (enabled: boolean) => void
  setVolume: (volume: number) => void
  setPack: (packId: string) => void
  packs: ChimePack[]
}

const ChimeContext = createContext<ChimeContextValue | null>(null)

export function useChimeContext() {
  const ctx = useContext(ChimeContext)
  if (!ctx) throw new Error('useChimeContext must be used within ChimeProvider')
  return ctx
}

// --- Provider ---

export default function ChimeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chimeReducer, {
    enabled: true,
    volume: 0.6,
    packId: '8bit',
    initialized: false,
  })

  // Initialize from localStorage
  useEffect(() => {
    const saved = loadSettings()
    // Validate saved packId still exists in the trimmed pack list
    if (saved.packId && !chimePacks.some(p => p.id === saved.packId)) {
      saved.packId = '8bit'
    }
    dispatch({ type: 'INIT', state: saved })

    // Register unlock listener for iOS Safari
    const handler = () => unlockAudio()
    document.addEventListener('touchstart', handler, { once: true })
    document.addEventListener('click', handler, { once: true })
    return () => {
      document.removeEventListener('touchstart', handler)
      document.removeEventListener('click', handler)
    }
  }, [])

  // Persist settings
  useEffect(() => {
    if (state.initialized) saveSettings(state)
  }, [state])

  // Preload MP3s for current pack
  useEffect(() => {
    if (!state.initialized) return
    const pack = chimePacks.find(p => p.id === state.packId)
    if (!pack) return
    for (const sound of Object.values(pack.sounds)) {
      if (sound.type === 'mp3') preloadMP3(sound.src)
    }
  }, [state.packId, state.initialized])

  const play = useCallback((event: ChimeEvent) => {
    if (!state.enabled) return
    const sound = resolveSound(state.packId, event)
    if (sound) playChime(sound, state.volume)
  }, [state.enabled, state.packId, state.volume])

  const setEnabled = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_ENABLED', enabled })
  }, [])

  const setVolume = useCallback((volume: number) => {
    dispatch({ type: 'SET_VOLUME', volume: Math.min(1, Math.max(0, volume)) })
  }, [])

  const setPack = useCallback((packId: string) => {
    dispatch({ type: 'SET_PACK', packId })
  }, [])

  return (
    <ChimeContext.Provider value={{ state, play, setEnabled, setVolume, setPack, packs: chimePacks }}>
      {children}
    </ChimeContext.Provider>
  )
}
