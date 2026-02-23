// NioBot V3 — Observer hook: watches ChatProvider state transitions, fires chime events
// Zero changes to ChatProvider. Pure observation via useEffect.

'use client'

import { useEffect, useRef } from 'react'
import { useChatContext } from './ChatProvider'
import { useChimeContext } from './ChimeProvider'

export function useChatChimes() {
  const { state } = useChatContext()
  const { play } = useChimeContext()

  const prevState = useRef({
    isStreaming: false,
    isWaiting: false,
    activeAgentId: state.activeAgentId,
    messageCount: 0,
  })

  useEffect(() => {
    if (!state.initialized) return

    const prev = prevState.current
    const currentMessages = state.agentStates[state.activeAgentId]?.messages || []
    const messageCount = currentMessages.length

    // messageSent: user just sent a message (isStreaming flipped true, isWaiting true)
    if (state.isStreaming && state.isWaiting && !prev.isStreaming) {
      play('messageSent')
    }

    // messageReceived: first chunk arrived (isWaiting flipped to false while still streaming)
    if (state.isStreaming && !state.isWaiting && prev.isWaiting) {
      play('messageReceived')
    }

    // streamDone: response finished (isStreaming flipped to false)
    if (!state.isStreaming && prev.isStreaming) {
      play('streamDone')
    }

    // agentSwitch: active agent changed
    if (state.activeAgentId !== prev.activeAgentId) {
      play('agentSwitch')
    }

    // newChat: messages cleared (count went to 0 from > 0)
    if (messageCount === 0 && prev.messageCount > 0 && state.activeAgentId === prev.activeAgentId) {
      play('newChat')
    }

    // error: check last message for error content
    if (!state.isStreaming && prev.isStreaming && messageCount > 0) {
      const lastMsg = currentMessages[messageCount - 1]
      if (lastMsg?.role === 'assistant' && lastMsg.content.startsWith('error:')) {
        play('error')
      }
    }

    prevState.current = {
      isStreaming: state.isStreaming,
      isWaiting: state.isWaiting,
      activeAgentId: state.activeAgentId,
      messageCount,
    }
  }, [state, play])
}
