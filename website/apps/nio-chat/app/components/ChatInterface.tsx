// ShawnOS Chat - (c) 2026 Shawn Tenam - See /LICENSE

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { Message, ChatSSEEvent, AgentChatState } from '../../lib/types'
import type { AgentConfig } from '../../lib/agents'
import { getEnabledAgents, getDefaultAgent } from '../../lib/agents'
import ChatHeader from './ChatHeader'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

// localStorage key helpers
function storageKey(agentId: string, suffix: string) {
  return `shawnos-chat-${agentId}-${suffix}`
}

function applyAgentTheme(agent: AgentConfig) {
  const root = document.documentElement
  root.style.setProperty('--accent', agent.accentColor)
  root.style.setProperty('--bubble-user', agent.bubbleColors.user)
  root.style.setProperty('--bubble-user-text', agent.bubbleColors.userText)
  root.style.setProperty('--bubble-nio', agent.bubbleColors.agent)
  root.style.setProperty('--bubble-nio-text', agent.bubbleColors.agentText)
}

// One-time migration from old nio-* keys to new shawnos-chat-* namespace
function migrateOldStorage() {
  const migrated = localStorage.getItem('shawnos-chat-migrated')
  if (migrated) return

  const oldSessionId = localStorage.getItem('nio-session-id')
  const oldMessages = localStorage.getItem('nio-messages')
  const oldToken = localStorage.getItem('nio-token')

  if (oldSessionId) {
    localStorage.setItem(storageKey('nio', 'session-id'), oldSessionId)
    localStorage.removeItem('nio-session-id')
  }
  if (oldMessages) {
    localStorage.setItem(storageKey('nio', 'messages'), oldMessages)
    localStorage.removeItem('nio-messages')
  }
  if (oldToken) {
    localStorage.setItem('shawnos-chat-token', oldToken)
    localStorage.removeItem('nio-token')
  }

  localStorage.setItem('shawnos-chat-migrated', '1')
}

function loadAgentState(agentId: string): AgentChatState {
  const sessionId = localStorage.getItem(storageKey(agentId, 'session-id')) || undefined
  let messages: Message[] = []
  const saved = localStorage.getItem(storageKey(agentId, 'messages'))
  if (saved) {
    try {
      messages = JSON.parse(saved)
    } catch {
      // corrupted, ignore
    }
  }
  return { sessionId, messages }
}

function saveAgentState(agentId: string, state: AgentChatState) {
  if (state.sessionId) {
    localStorage.setItem(storageKey(agentId, 'session-id'), state.sessionId)
  } else {
    localStorage.removeItem(storageKey(agentId, 'session-id'))
  }
  if (state.messages.length > 0) {
    localStorage.setItem(storageKey(agentId, 'messages'), JSON.stringify(state.messages))
  } else {
    localStorage.removeItem(storageKey(agentId, 'messages'))
  }
}

export default function ChatInterface() {
  const enabledAgents = getEnabledAgents()
  const defaultAgent = getDefaultAgent()

  const [activeAgentId, setActiveAgentId] = useState(defaultAgent.id)
  const [agentStates, setAgentStates] = useState<Record<string, AgentChatState>>({})
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const activeAgent = enabledAgents.find(a => a.id === activeAgentId) || defaultAgent
  const currentState = agentStates[activeAgentId] || { sessionId: undefined, messages: [] }
  const messages = currentState.messages
  const sessionId = currentState.sessionId

  // Initialize: migrate old storage, load states, restore active agent
  useEffect(() => {
    migrateOldStorage()

    // Restore active agent
    const savedActive = localStorage.getItem('shawnos-chat-active-agent')
    const initialAgentId = (savedActive && enabledAgents.some(a => a.id === savedActive)) ? savedActive : defaultAgent.id
    setActiveAgentId(initialAgentId)

    // Load all agent states
    const states: Record<string, AgentChatState> = {}
    for (const agent of enabledAgents) {
      states[agent.id] = loadAgentState(agent.id)
    }
    setAgentStates(states)

    // Apply theme for initial agent
    const initialAgent = enabledAgents.find(a => a.id === initialAgentId) || defaultAgent
    applyAgentTheme(initialAgent)

    // Check auth
    const token = localStorage.getItem('shawnos-chat-token')
    if (token) {
      setAuthed(true)
      setAuthChecked(true)
    } else {
      checkAuth()
    }
  }, [])

  // Save messages to localStorage when they change
  useEffect(() => {
    if (agentStates[activeAgentId]) {
      saveAgentState(activeAgentId, agentStates[activeAgentId])
    }
  }, [agentStates, activeAgentId])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isWaiting])

  function updateCurrentState(updater: (prev: AgentChatState) => AgentChatState) {
    setAgentStates(prev => ({
      ...prev,
      [activeAgentId]: updater(prev[activeAgentId] || { sessionId: undefined, messages: [] }),
    }))
  }

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (res.ok) {
        setAuthed(true)
        localStorage.setItem('shawnos-chat-token', 'no-auth')
      }
    } catch {
      // auth required
    }
    setAuthChecked(true)
  }

  async function handleLogin() {
    setAuthError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (data.ok) {
        localStorage.setItem('shawnos-chat-token', data.token || password)
        setAuthed(true)
      } else {
        setAuthError(data.error || 'wrong password')
      }
    } catch {
      setAuthError('connection failed')
    }
  }

  function handleSwitchAgent(agentId: string) {
    if (agentId === activeAgentId) return

    // Abort any in-progress stream
    if (isStreaming && abortRef.current) {
      abortRef.current.abort()
      setIsStreaming(false)
      setIsWaiting(false)
    }

    // Save current state
    if (agentStates[activeAgentId]) {
      saveAgentState(activeAgentId, agentStates[activeAgentId])
    }

    // Switch
    setActiveAgentId(agentId)
    localStorage.setItem('shawnos-chat-active-agent', agentId)

    // Load new agent state if not already loaded
    setAgentStates(prev => {
      if (!prev[agentId]) {
        return { ...prev, [agentId]: loadAgentState(agentId) }
      }
      return prev
    })

    // Apply theme
    const newAgent = enabledAgents.find(a => a.id === agentId) || defaultAgent
    applyAgentTheme(newAgent)
  }

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || isStreaming) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
      agentId: activeAgentId,
    }

    updateCurrentState(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg],
    }))
    setInput('')
    setIsStreaming(true)
    setIsWaiting(true)

    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      agentId: activeAgentId,
    }

    const token = localStorage.getItem('shawnos-chat-token')
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token && token !== 'no-auth') {
      headers['Authorization'] = `Bearer ${token}`
    }

    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: text, sessionId, agentId: activeAgentId }),
        signal: abortRef.current.signal,
      })

      if (res.status === 429) {
        updateCurrentState(prev => ({
          ...prev,
          messages: [...prev.messages, { ...assistantMsg, content: 'slow down. too many requests. try again in a moment.' }],
        }))
        setIsStreaming(false)
        setIsWaiting(false)
        return
      }

      if (res.status === 401) {
        localStorage.removeItem('shawnos-chat-token')
        setAuthed(false)
        setAuthChecked(true)
        setIsStreaming(false)
        setIsWaiting(false)
        return
      }

      if (!res.ok) {
        const errText = await res.text()
        updateCurrentState(prev => ({
          ...prev,
          messages: [...prev.messages, { ...assistantMsg, content: `error: ${res.status} ${errText}` }],
        }))
        setIsStreaming(false)
        setIsWaiting(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        setIsStreaming(false)
        setIsWaiting(false)
        return
      }

      const decoder = new TextDecoder()
      let accumulated = ''
      let addedMsg = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const json = line.slice(6)

          try {
            const event: ChatSSEEvent = JSON.parse(json)

            if (event.type === 'text') {
              setIsWaiting(false)
              accumulated += event.data
              const currentContent = accumulated

              if (!addedMsg) {
                addedMsg = true
                updateCurrentState(prev => ({
                  ...prev,
                  messages: [...prev.messages, { ...assistantMsg, content: currentContent }],
                }))
              } else {
                setAgentStates(prev => {
                  const state = prev[activeAgentId]
                  if (!state) return prev
                  return {
                    ...prev,
                    [activeAgentId]: {
                      ...state,
                      messages: state.messages.map(m =>
                        m.id === assistantMsg.id ? { ...m, content: currentContent } : m
                      ),
                    },
                  }
                })
              }
            }

            if (event.type === 'session') {
              updateCurrentState(prev => ({ ...prev, sessionId: event.data }))
            }

            if (event.type === 'error') {
              if (!addedMsg) {
                updateCurrentState(prev => ({
                  ...prev,
                  messages: [...prev.messages, { ...assistantMsg, content: `error: ${event.data}` }],
                }))
              }
            }
          } catch {
            // skip unparseable lines
          }
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // user cancelled
      } else {
        updateCurrentState(prev => ({
          ...prev,
          messages: [...prev.messages, {
            ...assistantMsg,
            content: 'connection error. try again.',
          }],
        }))
      }
    }

    setIsStreaming(false)
    setIsWaiting(false)
    abortRef.current = null
  }, [input, isStreaming, sessionId, activeAgentId])

  function handleNewChat() {
    if (isStreaming && abortRef.current) {
      abortRef.current.abort()
    }
    updateCurrentState(() => ({ sessionId: undefined, messages: [] }))
    localStorage.removeItem(storageKey(activeAgentId, 'session-id'))
    localStorage.removeItem(storageKey(activeAgentId, 'messages'))
    setIsStreaming(false)
    setIsWaiting(false)
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Auth gate
  if (!authChecked) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--canvas)]">
        <p className="text-[var(--text-secondary)] text-sm">connecting...</p>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--canvas)]">
        <div className="w-72 flex flex-col gap-4">
          <div className="text-center">
            <h1 className="text-lg font-bold text-[var(--text-primary)]">ShawnOS Chat</h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">enter password</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="password"
            autoFocus
            className="w-full px-3 py-2 rounded-lg bg-[var(--canvas-overlay)] border border-[var(--border)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--accent)] transition-colors"
          />
          {authError && (
            <p className="text-xs text-red-400 text-center">{authError}</p>
          )}
          <button
            onClick={handleLogin}
            className="w-full py-2 rounded-lg bg-[var(--accent)] text-[var(--canvas)] text-sm font-bold hover:opacity-90 transition-opacity"
          >
            connect
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--canvas)]">
      <ChatHeader
        onNewChat={handleNewChat}
        isStreaming={isStreaming}
        agents={enabledAgents}
        activeAgent={activeAgent}
        onSwitchAgent={handleSwitchAgent}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <p className="text-[var(--text-muted)] text-sm">say something to {activeAgent.name}</p>
          </div>
        )}
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isWaiting && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[var(--border)] px-4 py-3 bg-[var(--canvas-overlay)]">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isStreaming ? `${activeAgent.name.toLowerCase()} is thinking...` : `message ${activeAgent.name.toLowerCase()}`}
            disabled={isStreaming}
            rows={1}
            maxLength={10000}
            className="flex-1 resize-none px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-40 placeholder:text-[var(--text-muted)]"
            style={{ maxHeight: '120px' }}
            onInput={e => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = Math.min(target.scrollHeight, 120) + 'px'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={isStreaming || !input.trim()}
            className="px-3 py-2 rounded-xl bg-[var(--accent)] text-[var(--canvas)] text-sm font-bold transition-opacity disabled:opacity-30 hover:opacity-90 shrink-0"
          >
            send
          </button>
        </div>
      </div>
    </div>
  )
}
