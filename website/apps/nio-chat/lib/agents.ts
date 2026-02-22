// ShawnOS Chat - (c) 2026 Shawn Tenam - See /LICENSE

export interface AgentConfig {
  id: string
  name: string
  description: string
  soulFile: string
  avatar: string
  accentColor: string
  bubbleColors: {
    agent: string
    agentText: string
    user: string
    userText: string
  }
  maxTurns: number
  enabled: boolean
}

const agents: AgentConfig[] = [
  {
    id: 'nio',
    name: 'Nio',
    description: 'ops & infrastructure',
    soulFile: 'souls/nio-soul.md',
    avatar: '/avatars/nio-tier-2-idle.gif',
    accentColor: '#4EC373',
    bubbleColors: {
      agent: '#1e2430',
      agentText: '#c9d1d9',
      user: '#1a3a25',
      userText: '#c9d1d9',
    },
    maxTurns: 10,
    enabled: true,
  },
  {
    id: 'architect',
    name: 'Architect',
    description: 'system design & planning',
    soulFile: 'souls/architect-soul.md',
    avatar: '/avatars/nio-tier-2-idle.gif',
    accentColor: '#6B8AFF',
    bubbleColors: {
      agent: '#1e2230',
      agentText: '#c9d1d9',
      user: '#1a2a45',
      userText: '#c9d1d9',
    },
    maxTurns: 15,
    enabled: false,
  },
  {
    id: 'writer',
    name: 'Writer',
    description: 'content, voice & blog drafting',
    soulFile: 'souls/writer-soul.md',
    avatar: '/avatars/nio-tier-2-idle.gif',
    accentColor: '#FF8A6B',
    bubbleColors: {
      agent: '#2a1e1e',
      agentText: '#c9d1d9',
      user: '#3a2a1a',
      userText: '#c9d1d9',
    },
    maxTurns: 10,
    enabled: false,
  },
]

export function getAgent(id: string): AgentConfig | undefined {
  return agents.find(a => a.id === id)
}

export function getEnabledAgents(): AgentConfig[] {
  return agents.filter(a => a.enabled)
}

export function getDefaultAgent(): AgentConfig {
  return agents[0]
}
