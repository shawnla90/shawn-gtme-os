// NioBot V2 — Root configuration
// This is the ShawnOS instance config. Productized version ships niobot.config.example.ts.

import type { NioBotConfig } from './lib/config'

const config: Partial<NioBotConfig> = {
  name: 'NioBot',

  agents: [
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
      defaultModel: 'claude-opus-4-6',
      downgradeModel: 'claude-sonnet-4-6',
    },
    {
      id: 'architect',
      name: 'Architect',
      description: 'system design & planning',
      soulFile: 'souls/architect-soul.md',
      avatar: '/avatars/architect-idle.gif',
      accentColor: '#6B8AFF',
      bubbleColors: {
        agent: '#1e2230',
        agentText: '#c9d1d9',
        user: '#1a2a45',
        userText: '#c9d1d9',
      },
      maxTurns: 15,
      enabled: true,
      defaultModel: 'claude-opus-4-6',
      downgradeModel: 'claude-sonnet-4-6',
    },
    {
      id: 'writer',
      name: 'Writer',
      description: 'content, voice & blog drafting',
      soulFile: 'souls/writer-soul.md',
      avatar: '/avatars/writer-idle.gif',
      accentColor: '#FF8A6B',
      bubbleColors: {
        agent: '#2a1e1e',
        agentText: '#c9d1d9',
        user: '#3a2a1a',
        userText: '#c9d1d9',
      },
      maxTurns: 10,
      enabled: true,
      defaultModel: 'claude-opus-4-6',
    },
  ],

  models: {
    'claude-opus-4-6': {
      id: 'claude-opus-4-6',
      provider: 'claude-cli',
      displayName: 'Opus 4.6',
      costTier: '$$$',
      inputPricePer1M: 15,
      outputPricePer1M: 75,
    },
    'claude-sonnet-4-6': {
      id: 'claude-sonnet-4-6',
      provider: 'claude-cli',
      displayName: 'Sonnet 4.6',
      costTier: '$$',
      inputPricePer1M: 3,
      outputPricePer1M: 15,
    },
    'claude-haiku-4-5': {
      id: 'claude-haiku-4-5',
      provider: 'claude-cli',
      displayName: 'Haiku 4.5',
      costTier: '$',
      inputPricePer1M: 0.8,
      outputPricePer1M: 4,
    },
    'ollama/qwen2.5:14b': {
      id: 'ollama/qwen2.5:14b',
      provider: 'ollama',
      displayName: 'Qwen 2.5 14B (local)',
      costTier: '$',
      inputPricePer1M: 0,
      outputPricePer1M: 0,
    },
  },

  monitoring: {
    enabled: true,
    sites: [
      { url: 'https://shawnos.ai', name: 'ShawnOS', checks: ['uptime', 'ssl', 'performance'] },
      { url: 'https://thegtmos.ai', name: 'GTMe OS', checks: ['uptime', 'ssl', 'performance'] },
      { url: 'https://thecontentos.ai', name: 'ContentOS', checks: ['uptime', 'ssl', 'performance'] },
    ],
    uptimeIntervalMs: 5 * 60 * 1000,
    fullScanCron: '0 0 * * *',
  },

  dailyCostBudgetCents: 1000, // $10/day
}

export default config
