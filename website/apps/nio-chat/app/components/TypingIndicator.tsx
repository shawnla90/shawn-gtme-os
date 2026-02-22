'use client'

export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-2">
      <div className="bg-[var(--bubble-nio)] px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
        <span className="typing-dot w-2 h-2 bg-[var(--accent)] rounded-full inline-block" />
        <span className="typing-dot w-2 h-2 bg-[var(--accent)] rounded-full inline-block" />
        <span className="typing-dot w-2 h-2 bg-[var(--accent)] rounded-full inline-block" />
      </div>
    </div>
  )
}
