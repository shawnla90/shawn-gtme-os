// NioBot V2 — Chat input textarea with send button and character count

'use client'

import { useState, useRef, useEffect } from 'react'
import { useChatContext } from './ChatProvider'

const MAX_LENGTH = 10_000

export default function InputBar() {
  const { state, activeAgent, sendMessage } = useChatContext()
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Focus input when agent changes or chat resets
  useEffect(() => {
    if (!state.isStreaming) {
      inputRef.current?.focus()
    }
  }, [state.activeAgentId, state.isStreaming])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleSend() {
    const text = input.trim()
    if (!text || state.isStreaming) return
    sendMessage(text)
    setInput('')
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }
  }

  function handleInput(e: React.FormEvent<HTMLTextAreaElement>) {
    const target = e.target as HTMLTextAreaElement
    target.style.height = 'auto'
    target.style.height = Math.min(target.scrollHeight, 120) + 'px'
  }

  const charCount = input.length
  const showCharCount = charCount > MAX_LENGTH * 0.8

  return (
    <div className="border-t border-[var(--border)] px-4 py-3 bg-[var(--canvas-overlay)]">
      <div className="flex gap-2 items-end">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={state.isStreaming ? `${activeAgent.name.toLowerCase()} is thinking...` : `message ${activeAgent.name.toLowerCase()}`}
          disabled={state.isStreaming}
          rows={1}
          maxLength={MAX_LENGTH}
          className="flex-1 resize-none px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-40 placeholder:text-[var(--text-muted)]"
          style={{ maxHeight: '120px' }}
        />
        <button
          onClick={handleSend}
          disabled={state.isStreaming || !input.trim()}
          className="px-3 py-2 rounded-xl bg-[var(--accent)] text-[var(--canvas)] text-sm font-bold transition-opacity disabled:opacity-30 hover:opacity-90 shrink-0"
        >
          send
        </button>
      </div>
      {showCharCount && (
        <div className="text-right mt-1">
          <span className={`text-[10px] ${charCount >= MAX_LENGTH ? 'text-red-400' : 'text-[var(--text-muted)]'}`}>
            {charCount.toLocaleString()}/{MAX_LENGTH.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  )
}
