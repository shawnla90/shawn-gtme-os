// NioBot V2 — Slide-out drawer for past conversations
// Wired to localStorage for now; will connect to SQLite in Phase 2.

'use client'

import { useChatContext } from './ChatProvider'

export default function SessionSidebar() {
  const { state, dispatch, handleNewChat, activeAgent } = useChatContext()

  if (!state.sidebarOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
      />

      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-72 bg-[var(--canvas-overlay)] border-r border-[var(--border)] z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">conversations</h2>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* New chat button */}
        <div className="px-4 py-3">
          <button
            onClick={() => {
              handleNewChat()
              dispatch({ type: 'TOGGLE_SIDEBAR' })
            }}
            className="w-full py-2 rounded-lg border border-dashed border-[var(--border)] text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
          >
            + new chat with {activeAgent.name}
          </button>
        </div>

        {/* Conversation list — placeholder until Phase 2 */}
        <div className="flex-1 overflow-y-auto px-4">
          <p className="text-[10px] text-[var(--text-muted)] text-center mt-8">
            conversation history coming soon
          </p>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[var(--border)]">
          <p className="text-[10px] text-[var(--text-muted)]">NioBot V2</p>
        </div>
      </div>
    </>
  )
}
