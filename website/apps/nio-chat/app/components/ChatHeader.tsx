// NioBot V3 — Chat header with agent switcher, chime toggle, evolution panel, and usage display

'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import type { AgentConfig } from '../../lib/agents'
import type { UsageInfo } from './ChatProvider'
import { formatCost, formatTokens } from '../../lib/pricing'
import { useChimeContext } from './ChimeProvider'
import { useEvolutionContext } from './EvolutionProvider'
import ChimeSettings from './ChimeSettings'
import EvolutionPanel from './EvolutionPanel'
import NioXPRing from './NioXPRing'
import { getTierName, getLevelProgress } from '../../lib/evolution'

interface ChatHeaderProps {
  onNewChat: () => void
  isStreaming: boolean
  agents: AgentConfig[]
  activeAgent: AgentConfig
  onSwitchAgent: (agentId: string) => void
  onToggleSidebar?: () => void
  usage?: UsageInfo | null
}

export default function ChatHeader({ onNewChat, isStreaming, agents, activeAgent, onSwitchAgent, onToggleSidebar, usage }: ChatHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [chimeSettingsOpen, setChimeSettingsOpen] = useState(false)
  const [evolutionPanelOpen, setEvolutionPanelOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const chimeRef = useRef<HTMLDivElement>(null)
  const showDropdown = agents.length > 1

  const { state: chimeState, setEnabled: setChimeEnabled } = useChimeContext()
  const { state: evoState } = useEvolutionContext()
  const progress = getLevelProgress(evoState.xp)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--canvas-overlay)]">
        <div className="flex items-center gap-3">
          {/* Sidebar toggle */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          )}

          {/* Agent avatar with XP ring + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-3"
              onClick={() => showDropdown && setDropdownOpen(!dropdownOpen)}
              style={{ cursor: showDropdown ? 'pointer' : 'default' }}
            >
              <NioXPRing progress={progress.levelProgress} tier={progress.tier}>
                <Image
                  src={activeAgent.avatar}
                  alt={activeAgent.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                  unoptimized
                />
              </NioXPRing>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm font-bold text-[var(--text-primary)]">{activeAgent.name}</h1>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {getTierName(progress.tier)} lv.{progress.level}
                  </span>
                  {showDropdown && (
                    <svg
                      className={`w-3 h-3 text-[var(--text-secondary)] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
                <p className="text-xs" style={{ color: activeAgent.accentColor }}>online</p>
              </div>
            </button>

            {/* Agent dropdown */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-[var(--canvas-overlay)] border border-[var(--border)] rounded-lg shadow-lg z-50 overflow-hidden">
                {agents.map(agent => (
                  <button
                    key={agent.id}
                    onClick={() => {
                      onSwitchAgent(agent.id)
                      setDropdownOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--canvas)] transition-colors ${
                      agent.id === activeAgent.id ? 'bg-[var(--canvas)]' : ''
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Image
                        src={agent.avatar}
                        alt={agent.name}
                        width={28}
                        height={28}
                        className="rounded-full"
                        unoptimized
                      />
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[var(--canvas-overlay)]"
                        style={{ backgroundColor: agent.accentColor }}
                      />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{agent.name}</p>
                      <p className="text-xs text-[var(--text-secondary)] truncate">{agent.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side: evolution + chime + usage + new chat */}
        <div className="flex items-center gap-2">
          {/* Evolution panel toggle */}
          <button
            onClick={() => setEvolutionPanelOpen(true)}
            className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors p-1"
            aria-label="Evolution stats"
            title="Evolution stats"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </button>

          {/* Chime toggle + settings */}
          <div className="relative" ref={chimeRef}>
            <button
              onClick={() => setChimeSettingsOpen(!chimeSettingsOpen)}
              onContextMenu={e => {
                e.preventDefault()
                setChimeEnabled(!chimeState.enabled)
              }}
              className={`p-1 transition-colors ${
                chimeState.enabled
                  ? 'text-[var(--accent)] hover:text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
              aria-label={chimeState.enabled ? 'Sound on' : 'Sound off'}
              title="Sound settings (right-click to toggle)"
            >
              {chimeState.enabled ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
              )}
            </button>
            <ChimeSettings open={chimeSettingsOpen} onClose={() => setChimeSettingsOpen(false)} />
          </div>

          {/* Token/cost display */}
          {usage && (usage.inputTokens + usage.outputTokens) > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
              <span>{formatCost(usage.cost)}</span>
              <span className="opacity-40">|</span>
              <span>{formatTokens(usage.inputTokens + usage.outputTokens)}</span>
              {usage.model && (
                <>
                  <span className="opacity-40">|</span>
                  <span>{usage.model}</span>
                </>
              )}
            </div>
          )}

          <button
            onClick={onNewChat}
            disabled={isStreaming}
            className="text-xs px-3 py-1.5 rounded-md border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            new chat
          </button>
        </div>
      </header>

      {/* Evolution panel drawer */}
      <EvolutionPanel open={evolutionPanelOpen} onClose={() => setEvolutionPanelOpen(false)} />
    </>
  )
}
