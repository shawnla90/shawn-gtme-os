// NioBot V3 — Thin layout shell composing all chat sub-components

'use client'

import ChatProvider, { useChatContext } from './ChatProvider'
import ChimeProvider from './ChimeProvider'
import { EvolutionProvider } from './EvolutionProvider'
import { useChatChimes } from './useChatChimes'
import { useEvolutionXP } from './useEvolutionXP'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import InputBar from './InputBar'
import SessionSidebar from './SessionSidebar'
import AuthGate from './AuthGate'
import LevelUpNotification from './LevelUpNotification'
import XPFloat from './XPFloat'

function ChatLayout() {
  const { state, enabledAgents, activeAgent, handleNewChat, handleSwitchAgent, dispatch } = useChatContext()
  useChatChimes()
  useEvolutionXP()

  if (!state.authed) {
    return <AuthGate />
  }

  return (
    <div className="flex flex-col bg-[var(--canvas)]" style={{ height: '100dvh' }}>
      <ChatHeader
        onNewChat={handleNewChat}
        isStreaming={state.isStreaming}
        agents={enabledAgents}
        activeAgent={activeAgent}
        onSwitchAgent={handleSwitchAgent}
        onToggleSidebar={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        usage={state.usage}
      />
      <MessageList />
      <InputBar />
      <SessionSidebar />
      <LevelUpNotification />
      <XPFloat />
    </div>
  )
}

export default function ChatInterface() {
  return (
    <ChatProvider>
      <ChimeProvider>
        <EvolutionProvider>
          <ChatLayout />
        </EvolutionProvider>
      </ChimeProvider>
    </ChatProvider>
  )
}
