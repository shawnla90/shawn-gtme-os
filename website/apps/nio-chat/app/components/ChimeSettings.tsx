// NioBot V3 — Chime settings dropdown: toggle, volume slider, pack picker with preview

'use client'

import { useRef, useEffect } from 'react'
import { useChimeContext } from './ChimeProvider'

interface ChimeSettingsProps {
  open: boolean
  onClose: () => void
}

export default function ChimeSettings({ open, onClose }: ChimeSettingsProps) {
  const { state, setEnabled, setVolume, setPack, play, packs } = useChimeContext()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-2 w-64 bg-[var(--canvas-overlay)] border border-[var(--border)] rounded-lg shadow-lg z-50 p-3"
    >
      {/* Enable toggle */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[var(--text-secondary)]">sound</span>
        <button
          onClick={() => setEnabled(!state.enabled)}
          className={`relative w-9 h-5 rounded-full transition-colors ${
            state.enabled ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
          }`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
              state.enabled ? 'left-[18px]' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      {/* Volume slider */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[var(--text-muted)]">volume</span>
          <span className="text-xs text-[var(--text-muted)]">{Math.round(state.volume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(state.volume * 100)}
          onChange={e => setVolume(Number(e.target.value) / 100)}
          className="w-full h-1 bg-[var(--border)] rounded-full appearance-none cursor-pointer accent-[var(--accent)]"
        />
      </div>

      {/* Pack picker */}
      <div className="border-t border-[var(--border)] pt-2">
        <span className="text-xs text-[var(--text-muted)] block mb-2">sound pack</span>
        <div className="space-y-1">
          {packs.map(pack => (
            <button
              key={pack.id}
              onClick={() => {
                setPack(pack.id)
                // Preview the messageReceived sound from this pack
                setTimeout(() => play('messageReceived'), 50)
              }}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${
                pack.id === state.packId
                  ? 'bg-[var(--canvas)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--canvas)] hover:text-[var(--text-primary)]'
              }`}
            >
              <div>
                <span className="text-xs font-medium">{pack.name}</span>
                <span className="text-[10px] text-[var(--text-muted)] ml-2">{pack.description}</span>
              </div>
              {pack.id === state.packId && (
                <svg className="w-3 h-3 text-[var(--accent)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
