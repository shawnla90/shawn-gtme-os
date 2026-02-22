// ShawnOS Chat - (c) 2026 Shawn Tenam - See /LICENSE

'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import type { AgentConfig } from '../../lib/agents'

interface ChatHeaderProps {
  onNewChat: () => void
  isStreaming: boolean
  agents: AgentConfig[]
  activeAgent: AgentConfig
  onSwitchAgent: (agentId: string) => void
}

export default function ChatHeader({ onNewChat, isStreaming, agents, activeAgent, onSwitchAgent }: ChatHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const showDropdown = agents.length > 1

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
    <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--canvas-overlay)]">
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center gap-3"
          onClick={() => showDropdown && setDropdownOpen(!dropdownOpen)}
          style={{ cursor: showDropdown ? 'pointer' : 'default' }}
        >
          <div className="relative">
            <Image
              src={activeAgent.avatar}
              alt={activeAgent.name}
              width={40}
              height={40}
              className="rounded-full"
              unoptimized
            />
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[var(--canvas-overlay)]"
              style={{ backgroundColor: activeAgent.accentColor }}
            />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-[var(--text-primary)]">{activeAgent.name}</h1>
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

      <button
        onClick={onNewChat}
        disabled={isStreaming}
        className="text-xs px-3 py-1.5 rounded-md border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        new chat
      </button>
    </header>
  )
}
