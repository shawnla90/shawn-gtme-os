// NioBot V2 — Message bubble with markdown rendering for assistant messages

'use client'

import type { Message } from '../../lib/types'
import MarkdownRenderer from './MarkdownRenderer'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words overflow-hidden ${
          isUser
            ? 'bg-[var(--bubble-user)] text-[var(--bubble-user-text)] rounded-br-md whitespace-pre-wrap'
            : 'bg-[var(--bubble-nio)] text-[var(--bubble-nio-text)] rounded-bl-md'
        }`}
      >
        {isUser ? (
          message.content
        ) : (
          <MarkdownRenderer content={message.content} />
        )}
      </div>
    </div>
  )
}
