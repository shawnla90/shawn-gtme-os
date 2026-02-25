// NioBot V3 — Chat state management via React context + useReducer
// DNA Phase 5: removed client evolution sending, server reads DNA directly

'use client'

import { createContext, useContext, useReducer, useRef, useEffect, useCallback, type ReactNode } from 'react'
import type { Message, ChatSSEEvent, AgentChatState } from '../../lib/types'
import type { AgentConfig } from '../../lib/agents'
import { getEnabledAgents, getDefaultAgent } from '../../lib/agents'

// --- Storage helpers ---

function storageKey(agentId: string, suffix: string) {
  return `shawnos-chat-${agentId}-${suffix}`
}

function loadAgentState(agentId: string): AgentChatState {
  const sessionId = localStorage.getItem(storageKey(agentId, 'session-id')) || undefined
  let messages: Message[] = []
  const saved = localStorage.getItem(storageKey(agentId, 'messages'))
  if (saved) {
    try { messages = JSON.parse(saved) } catch { /* corrupted */ }
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

function migrateOldStorage() {
  const migrated = localStorage.getItem('shawnos-chat-migrated')
  if (migrated) return
  const oldSessionId = localStorage.getItem('nio-session-id')
  const oldMessages = localStorage.getItem('nio-messages')
  const oldToken = localStorage.getItem('nio-token')
  if (oldSessionId) { localStorage.setItem(storageKey('nio', 'session-id'), oldSessionId); localStorage.removeItem('nio-session-id') }
  if (oldMessages) { localStorage.setItem(storageKey('nio', 'messages'), oldMessages); localStorage.removeItem('nio-messages') }
  if (oldToken) { localStorage.setItem('shawnos-chat-token', oldToken); localStorage.removeItem('nio-token') }
  localStorage.setItem('shawnos-chat-migrated', '1')
}

export function applyAgentTheme(agent: AgentConfig) {
  const root = document.documentElement
  root.style.setProperty('--accent', agent.accentColor)
  root.style.setProperty('--bubble-user', agent.bubbleColors.user)
  root.style.setProperty('--bubble-user-text', agent.bubbleColors.userText)
  root.style.setProperty('--bubble-nio', agent.bubbleColors.agent)
  root.style.setProperty('--bubble-nio-text', agent.bubbleColors.agentText)
}

// --- Usage tracking types ---

export interface UsageInfo {
  inputTokens: number
  outputTokens: number
  cacheReadTokens: number
  cacheWriteTokens: number
  cost: number
  model: string | null
}

// --- State & Actions ---

interface ChatState {
  activeAgentId: string
  agentStates: Record<string, AgentChatState>
  isStreaming: boolean
  isWaiting: boolean
  authed: boolean
  authChecked: boolean
  initialized: boolean
  sidebarOpen: boolean
  usage: UsageInfo | null
  sessionTokens: number // Cumulative input tokens this session (context window usage)
}

type ChatAction =
  | { type: 'INIT'; agentId: string; states: Record<string, AgentChatState>; authed: boolean }
  | { type: 'AUTH_CHECKED'; authed: boolean }
  | { type: 'AUTHED'; token: string }
  | { type: 'LOGOUT' }
  | { type: 'SWITCH_AGENT'; agentId: string }
  | { type: 'NEW_CHAT' }
  | { type: 'SEND_MESSAGE'; message: Message }
  | { type: 'START_STREAM'; assistantMsgId: string }
  | { type: 'RECEIVE_CHUNK'; text: string; msgId: string }
  | { type: 'RECEIVE_FULL_TEXT'; text: string; msgId: string }
  | { type: 'SET_SESSION'; sessionId: string }
  | { type: 'STREAM_DONE' }
  | { type: 'STREAM_ERROR'; error: string; msgId: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_USAGE'; usage: UsageInfo }
  | { type: 'LOAD_HISTORY'; messages: Message[]; sessionId?: string }

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  const currentState = () => state.agentStates[state.activeAgentId] || { sessionId: undefined, messages: [] }

  switch (action.type) {
    case 'INIT':
      return { ...state, activeAgentId: action.agentId, agentStates: action.states, authed: action.authed, authChecked: true, initialized: true }

    case 'AUTH_CHECKED':
      return { ...state, authChecked: true, authed: action.authed }

    case 'AUTHED':
      return { ...state, authed: true }

    case 'LOGOUT':
      return { ...state, authed: false }

    case 'SWITCH_AGENT': {
      return { ...state, activeAgentId: action.agentId, isStreaming: false, isWaiting: false, usage: null }
    }

    case 'NEW_CHAT': {
      const updated = { ...state.agentStates, [state.activeAgentId]: { sessionId: undefined, messages: [] } }
      return { ...state, agentStates: updated, isStreaming: false, isWaiting: false, usage: null, sessionTokens: 0 }
    }

    case 'SEND_MESSAGE': {
      const cs = currentState()
      const updated = { ...state.agentStates, [state.activeAgentId]: { ...cs, messages: [...cs.messages, action.message] } }
      return { ...state, agentStates: updated, isStreaming: true, isWaiting: true, usage: null }
    }

    case 'START_STREAM':
      return state // isStreaming already true from SEND_MESSAGE

    case 'RECEIVE_CHUNK': {
      const cs = currentState()
      const msgs = cs.messages
      const existing = msgs.find(m => m.id === action.msgId)
      let newMsgs: Message[]
      if (existing) {
        newMsgs = msgs.map(m => m.id === action.msgId ? { ...m, content: m.content + action.text } : m)
      } else {
        newMsgs = [...msgs, { id: action.msgId, role: 'assistant' as const, content: action.text, timestamp: Date.now(), agentId: state.activeAgentId }]
      }
      return { ...state, agentStates: { ...state.agentStates, [state.activeAgentId]: { ...cs, messages: newMsgs } }, isWaiting: false }
    }

    case 'RECEIVE_FULL_TEXT': {
      const cs = currentState()
      const msgs = cs.messages
      const existing = msgs.find(m => m.id === action.msgId)
      let newMsgs: Message[]
      if (existing) {
        newMsgs = msgs.map(m => m.id === action.msgId ? { ...m, content: action.text } : m)
      } else {
        newMsgs = [...msgs, { id: action.msgId, role: 'assistant' as const, content: action.text, timestamp: Date.now(), agentId: state.activeAgentId }]
      }
      return { ...state, agentStates: { ...state.agentStates, [state.activeAgentId]: { ...cs, messages: newMsgs } }, isWaiting: false }
    }

    case 'SET_SESSION': {
      const cs = currentState()
      return { ...state, agentStates: { ...state.agentStates, [state.activeAgentId]: { ...cs, sessionId: action.sessionId } } }
    }

    case 'STREAM_DONE':
      return { ...state, isStreaming: false, isWaiting: false }

    case 'STREAM_ERROR': {
      const cs = currentState()
      const existing = cs.messages.find(m => m.id === action.msgId)
      let newMsgs: Message[]
      if (existing) {
        newMsgs = cs.messages.map(m => m.id === action.msgId ? { ...m, content: `error: ${action.error}` } : m)
      } else {
        newMsgs = [...cs.messages, { id: action.msgId, role: 'assistant' as const, content: `error: ${action.error}`, timestamp: Date.now(), agentId: state.activeAgentId }]
      }
      return { ...state, agentStates: { ...state.agentStates, [state.activeAgentId]: { ...cs, messages: newMsgs } }, isStreaming: false, isWaiting: false }
    }

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }

    case 'SET_USAGE':
      return { ...state, usage: action.usage, sessionTokens: state.sessionTokens + action.usage.inputTokens }

    case 'LOAD_HISTORY': {
      const cs = currentState()
      return {
        ...state,
        agentStates: {
          ...state.agentStates,
          [state.activeAgentId]: { ...cs, messages: action.messages, sessionId: action.sessionId ?? cs.sessionId },
        },
      }
    }

    default:
      return state
  }
}

// --- Context ---

interface ChatContextValue {
  state: ChatState
  dispatch: React.Dispatch<ChatAction>
  enabledAgents: AgentConfig[]
  activeAgent: AgentConfig
  messages: Message[]
  sessionId: string | undefined
  sendMessage: (text: string) => void
  handleNewChat: () => void
  handleSwitchAgent: (agentId: string) => void
  abortRef: React.RefObject<AbortController | null>
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function useChatContext() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider')
  return ctx
}

// --- Provider ---

export default function ChatProvider({ children }: { children: ReactNode }) {
  const enabledAgents = getEnabledAgents()
  const defaultAgent = getDefaultAgent()

  const [state, dispatch] = useReducer(chatReducer, {
    activeAgentId: defaultAgent.id,
    agentStates: {},
    isStreaming: false,
    isWaiting: false,
    authed: false,
    authChecked: false,
    initialized: false,
    sidebarOpen: false,
    usage: null,
    sessionTokens: 0,
  })

  const abortRef = useRef<AbortController | null>(null)

  const activeAgent = enabledAgents.find(a => a.id === state.activeAgentId) || defaultAgent
  const currentState = state.agentStates[state.activeAgentId] || { sessionId: undefined, messages: [] }

  // Initialize
  useEffect(() => {
    migrateOldStorage()

    const savedActive = localStorage.getItem('shawnos-chat-active-agent')
    const initialAgentId = (savedActive && enabledAgents.some(a => a.id === savedActive)) ? savedActive : defaultAgent.id

    const states: Record<string, AgentChatState> = {}
    for (const agent of enabledAgents) {
      states[agent.id] = loadAgentState(agent.id)
    }

    const initialAgent = enabledAgents.find(a => a.id === initialAgentId) || defaultAgent
    applyAgentTheme(initialAgent)

    const token = localStorage.getItem('shawnos-chat-token')
    let authed = false

    if (token) {
      authed = true
      dispatch({ type: 'INIT', agentId: initialAgentId, states, authed: true })
    } else {
      dispatch({ type: 'INIT', agentId: initialAgentId, states, authed: false })
      // Check if auth is even required
      fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }).then(res => {
        if (res.ok) {
          localStorage.setItem('shawnos-chat-token', 'no-auth')
          dispatch({ type: 'AUTH_CHECKED', authed: true })
        } else {
          dispatch({ type: 'AUTH_CHECKED', authed: false })
        }
      }).catch(() => {
        dispatch({ type: 'AUTH_CHECKED', authed: false })
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist state to localStorage when it changes
  useEffect(() => {
    if (!state.initialized) return
    const agentState = state.agentStates[state.activeAgentId]
    if (agentState) {
      saveAgentState(state.activeAgentId, agentState)
    }
  }, [state.agentStates, state.activeAgentId, state.initialized])

  const handleSwitchAgent = useCallback((agentId: string) => {
    if (agentId === state.activeAgentId) return

    if (state.isStreaming && abortRef.current) {
      abortRef.current.abort()
    }

    // Save current state
    const currentAgentState = state.agentStates[state.activeAgentId]
    if (currentAgentState) {
      saveAgentState(state.activeAgentId, currentAgentState)
    }

    dispatch({ type: 'SWITCH_AGENT', agentId })
    localStorage.setItem('shawnos-chat-active-agent', agentId)

    const newAgent = enabledAgents.find(a => a.id === agentId) || defaultAgent
    applyAgentTheme(newAgent)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeAgentId, state.isStreaming, state.agentStates, enabledAgents])

  const handleNewChat = useCallback(() => {
    if (state.isStreaming && abortRef.current) {
      abortRef.current.abort()
    }

    // Auto-summarize: save conversation memory before wiping (fire-and-forget)
    const agentState = state.agentStates[state.activeAgentId]
    if (agentState?.messages && agentState.messages.length >= 4) {
      const last10 = agentState.messages.slice(-10)
      const summary = last10.map(m => `${m.role}: ${m.content.substring(0, 300)}`).join('\n')
      const token = localStorage.getItem('shawnos-chat-token')
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (token && token !== 'no-auth') headers['Authorization'] = `Bearer ${token}`

      fetch('/api/memory', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          agentId: state.activeAgentId,
          content: `## Session Summary (${new Date().toISOString().split('T')[0]})\n\n${summary}`,
          type: 'session_summary',
          importance: 3,
        }),
      }).catch(() => { /* non-fatal */ })
    }

    dispatch({ type: 'NEW_CHAT' })
    localStorage.removeItem(storageKey(state.activeAgentId, 'session-id'))
    localStorage.removeItem(storageKey(state.activeAgentId, 'messages'))
  }, [state.isStreaming, state.activeAgentId, state.agentStates])

  // Stream SSE response from the chat API, with line buffering and event dispatch
  const streamResponse = useCallback(async (
    res: Response,
    assistantMsgId: string,
  ): Promise<boolean> => {
    const reader = res.body?.getReader()
    if (!reader) return true // no body = done

    const decoder = new TextDecoder()
    let sseBuffer = '' // Accumulates partial SSE lines across chunks

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      sseBuffer += decoder.decode(value, { stream: true })
      const lines = sseBuffer.split('\n')
      sseBuffer = lines.pop() || '' // Keep incomplete last line in buffer

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        try {
          const event: ChatSSEEvent = JSON.parse(line.slice(6))

          if (event.type === 'heartbeat') continue // Ignore keepalive

          if (event.type === 'text') {
            dispatch({ type: 'RECEIVE_CHUNK', text: event.data, msgId: assistantMsgId })
          }

          if (event.type === 'session') {
            dispatch({ type: 'SET_SESSION', sessionId: event.data })
          }

          if (event.type === 'usage') {
            try {
              const usage = JSON.parse(event.data) as UsageInfo
              dispatch({ type: 'SET_USAGE', usage })
            } catch { /* ignore */ }
          }

          if (event.type === 'error') {
            dispatch({ type: 'STREAM_ERROR', error: event.data, msgId: assistantMsgId })
          }
        } catch { /* skip unparseable */ }
      }
    }

    // Process any remaining buffer
    if (sseBuffer.startsWith('data: ')) {
      try {
        const event: ChatSSEEvent = JSON.parse(sseBuffer.slice(6))
        if (event.type === 'text') {
          dispatch({ type: 'RECEIVE_CHUNK', text: event.data, msgId: assistantMsgId })
        }
      } catch { /* ignore */ }
    }

    return true
  }, [])

  // Fire a chat request — returns the Response or null on failure
  const fireChatRequest = useCallback(async (
    trimmed: string,
    sessionId: string | undefined,
    agentId: string,
    signal: AbortSignal,
    assistantMsgId: string,
  ): Promise<Response | null> => {
    const token = localStorage.getItem('shawnos-chat-token')
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token && token !== 'no-auth') {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify({ message: trimmed, sessionId, agentId }),
      signal,
    })

    if (res.status === 429) {
      dispatch({ type: 'STREAM_ERROR', error: 'slow down. too many requests.', msgId: assistantMsgId })
      return null
    }

    if (res.status === 401) {
      localStorage.removeItem('shawnos-chat-token')
      dispatch({ type: 'LOGOUT' })
      return null
    }

    if (!res.ok) {
      const errText = await res.text()
      dispatch({ type: 'STREAM_ERROR', error: `${res.status} ${errText}`, msgId: assistantMsgId })
      return null
    }

    return res
  }, [])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || state.isStreaming) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
      agentId: state.activeAgentId,
    }

    dispatch({ type: 'SEND_MESSAGE', message: userMsg })

    const assistantMsgId = crypto.randomUUID()
    abortRef.current = new AbortController()

    const sessionId = state.agentStates[state.activeAgentId]?.sessionId

    try {
      const res = await fireChatRequest(trimmed, sessionId, state.activeAgentId, abortRef.current.signal, assistantMsgId)
      if (res) await streamResponse(res, assistantMsgId)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // User cancelled — don't retry
      } else {
        // Auto-retry once after 2s delay
        try {
          await new Promise(r => setTimeout(r, 2000))
          if (abortRef.current?.signal.aborted) throw new DOMException('Aborted', 'AbortError')
          const retryRes = await fireChatRequest(trimmed, sessionId, state.activeAgentId, abortRef.current!.signal, assistantMsgId)
          if (retryRes) await streamResponse(retryRes, assistantMsgId)
        } catch (retryErr) {
          if (!(retryErr instanceof DOMException && retryErr.name === 'AbortError')) {
            dispatch({ type: 'STREAM_ERROR', error: 'connection lost. please try again.', msgId: assistantMsgId })
          }
        }
      }
    }

    dispatch({ type: 'STREAM_DONE' })
    abortRef.current = null
  }, [state.isStreaming, state.activeAgentId, state.agentStates, fireChatRequest, streamResponse])

  return (
    <ChatContext.Provider value={{
      state,
      dispatch,
      enabledAgents,
      activeAgent,
      messages: currentState.messages,
      sessionId: currentState.sessionId,
      sendMessage,
      handleNewChat,
      handleSwitchAgent,
      abortRef,
    }}>
      {children}
    </ChatContext.Provider>
  )
}
