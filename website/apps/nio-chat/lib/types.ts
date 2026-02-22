// ShawnOS Chat - (c) 2026 Shawn Tenam - See /LICENSE

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  agentId?: string
}

export interface ChatRequest {
  message: string
  sessionId?: string
  agentId: string
}

export interface AgentChatState {
  sessionId: string | undefined
  messages: Message[]
}

export type ChatSSEEventType = 'text' | 'session' | 'done' | 'error'

export interface ChatSSEEvent {
  type: ChatSSEEventType
  data: string
}
