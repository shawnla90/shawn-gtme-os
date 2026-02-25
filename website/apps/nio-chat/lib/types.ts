// NioBot V3 — Shared TypeScript interfaces

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  agentId?: string
}

// V3 DNA: evolutionTier/skillLevels removed — server reads DNA directly
export interface ChatRequest {
  message: string
  sessionId?: string
  agentId: string
}

export interface AgentChatState {
  sessionId: string | undefined
  messages: Message[]
}

export type ChatSSEEventType = 'text' | 'session' | 'done' | 'error' | 'usage' | 'model' | 'memory_flush' | 'confirm' | 'heartbeat'

export interface ChatSSEEvent {
  type: ChatSSEEventType
  data: string
}

// Evolution types
export interface EvolutionState {
  xp: number
  skillXP: Record<string, number>
  streak: number
  lastActiveDate: string | null
  dailyBonusClaimed: boolean
  deepConvoClaimed: boolean
  veryDeepConvoClaimed: boolean
  initialized: boolean
}

// DNA Snapshot — shared client/server type
export interface DNASnapshot {
  userId: string
  xp: number
  tier: number
  level: number
  streak: number
  lastActiveDate: string | null
  dailyBonusClaimed: boolean
  skillXP: Record<string, number>
  activeSoulTraits: string[]
  personalityFlags: Record<string, unknown>
  totalMessages: number
  totalConversations: number
  totalCostCents: number
  createdAt: number
  updatedAt: number
  // Computed fields (from enrichSnapshot)
  xpLast24h: number
  memoryCount: number
  conversationsToday: number
  costTodayCents: number
  levelProgress: number
  xpForNextLevel: number
  xpForCurrentLevel: number
  totalLevel: number
  tierName: string
  isMaxTier: boolean
  isMaxLevel: boolean
  streakMultiplier: number
  skillProgress: Record<string, {
    skillId: string
    level: number
    xp: number
    xpForNextLevel: number
    progress: number
  }>
}
