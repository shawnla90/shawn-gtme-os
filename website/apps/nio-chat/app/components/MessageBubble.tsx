'use client'

import type { Message } from '../../lib/types'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? 'bg-[var(--bubble-user)] text-[var(--bubble-user-text)] rounded-br-md'
            : 'bg-[var(--bubble-nio)] text-[var(--bubble-nio-text)] rounded-bl-md'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}
