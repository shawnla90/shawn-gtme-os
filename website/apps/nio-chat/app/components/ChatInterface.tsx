'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { Message, ChatSSEEvent } from '../../lib/types'
import ChatHeader from './ChatHeader'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [sessionId, setSessionId] = useState<string | undefined>()
  const [authed, setAuthed] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Load session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nio-session-id')
    if (saved) setSessionId(saved)

    const savedMessages = localStorage.getItem('nio-messages')
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch {
        // corrupted, ignore
      }
    }

    const token = localStorage.getItem('nio-token')
    if (token) {
      setAuthed(true)
      setAuthChecked(true)
    } else {
      // Check if auth is needed
      checkAuth()
    }
  }, [])

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('nio-messages', JSON.stringify(messages))
    }
  }, [messages])

  // Save session ID
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('nio-session-id', sessionId)
    }
  }, [sessionId])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isWaiting])

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (res.ok) {
        setAuthed(true)
        localStorage.setItem('nio-token', 'no-auth')
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
        localStorage.setItem('nio-token', data.token || password)
        setAuthed(true)
      } else {
        setAuthError(data.error || 'wrong password')
      }
    } catch {
      setAuthError('connection failed')
    }
  }

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || isStreaming) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsStreaming(true)
    setIsWaiting(true)

    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }

    const token = localStorage.getItem('nio-token')
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
        body: JSON.stringify({ message: text, sessionId }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const errText = await res.text()
        setMessages(prev => [...prev, {
          ...assistantMsg,
          content: `error: ${res.status} ${errText}`,
        }])
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
                setMessages(prev => [...prev, { ...assistantMsg, content: currentContent }])
              } else {
                setMessages(prev =>
                  prev.map(m => m.id === assistantMsg.id ? { ...m, content: currentContent } : m)
                )
              }
            }

            if (event.type === 'session') {
              setSessionId(event.data)
            }

            if (event.type === 'error') {
              if (!addedMsg) {
                setMessages(prev => [...prev, { ...assistantMsg, content: `error: ${event.data}` }])
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
        setMessages(prev => [...prev, {
          ...assistantMsg,
          content: 'connection error. try again.',
        }])
      }
    }

    setIsStreaming(false)
    setIsWaiting(false)
    abortRef.current = null
  }, [input, isStreaming, sessionId])

  function handleNewChat() {
    if (isStreaming && abortRef.current) {
      abortRef.current.abort()
    }
    setMessages([])
    setSessionId(undefined)
    setIsStreaming(false)
    setIsWaiting(false)
    localStorage.removeItem('nio-session-id')
    localStorage.removeItem('nio-messages')
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
            <h1 className="text-lg font-bold text-[var(--text-primary)]">Nio</h1>
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
      <ChatHeader onNewChat={handleNewChat} isStreaming={isStreaming} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <p className="text-[var(--text-muted)] text-sm">say something to Nio</p>
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
            placeholder={isStreaming ? 'nio is thinking...' : 'message nio'}
            disabled={isStreaming}
            rows={1}
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
