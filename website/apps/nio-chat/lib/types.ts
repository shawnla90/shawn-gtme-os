export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface ChatRequest {
  message: string
  sessionId?: string
}

export type ChatSSEEventType = 'text' | 'session' | 'done' | 'error'

export interface ChatSSEEvent {
  type: ChatSSEEventType
  data: string
}
