'use client'

import Image from 'next/image'

interface ChatHeaderProps {
  onNewChat: () => void
  isStreaming: boolean
}

export default function ChatHeader({ onNewChat, isStreaming }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--canvas-overlay)]">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Image
            src="/avatars/nio-tier-2-idle.gif"
            alt="Nio"
            width={40}
            height={40}
            className="rounded-full"
            unoptimized
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[var(--accent)] rounded-full border-2 border-[var(--canvas-overlay)]" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-[var(--text-primary)]">Nio</h1>
          <p className="text-xs text-[var(--accent)]">online</p>
        </div>
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
