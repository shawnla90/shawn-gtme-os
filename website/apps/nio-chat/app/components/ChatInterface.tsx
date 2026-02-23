// NioBot V2 — Thin layout shell composing all chat sub-components

'use client'

import ChatProvider, { useChatContext } from './ChatProvider'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import InputBar from './InputBar'
import UsagePill from './UsagePill'
import SessionSidebar from './SessionSidebar'
import AuthGate from './AuthGate'

function ChatLayout() {
  const { state, enabledAgents, activeAgent, handleNewChat, handleSwitchAgent, dispatch } = useChatContext()

  if (!state.authed) {
    return <AuthGate />
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--canvas)]">
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
      <UsagePill />
      <InputBar />
      <SessionSidebar />
    </div>
  )
}

export default function ChatInterface() {
  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  )
}
