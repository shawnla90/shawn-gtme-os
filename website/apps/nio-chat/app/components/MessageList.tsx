// NioBot V2 — Scrolling message area with auto-scroll and "scroll to bottom" button

'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useChatContext } from './ChatProvider'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

export default function MessageList() {
  const { messages, activeAgent, state } = useChatContext()
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' })
  }, [])

  // Auto-scroll when new messages arrive or waiting state changes
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    // Only auto-scroll if user is near the bottom
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150
    if (isNearBottom) {
      scrollToBottom()
    }
  }, [messages, state.isWaiting, scrollToBottom])

  // Track scroll position for "scroll to bottom" button
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    function handleScroll() {
      if (!container) return
      const distFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
      setShowScrollBtn(distFromBottom > 200)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 relative">
      {messages.length === 0 && (
        <div className="h-full flex items-center justify-center">
          <p className="text-[var(--text-muted)] text-sm">say something to {activeAgent.name}</p>
        </div>
      )}
      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {state.isWaiting && <TypingIndicator />}
      <div ref={bottomRef} />

      {/* Scroll to bottom button */}
      {showScrollBtn && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-[var(--canvas-overlay)] border border-[var(--border)] flex items-center justify-center shadow-lg hover:border-[var(--accent)] transition-colors z-10"
          aria-label="Scroll to bottom"
        >
          <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}
    </div>
  )
}
