// NioBot V2 — Typed config loader with defaults

import path from 'path'
import os from 'os'

export interface AgentConfigEntry {
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
  defaultModel?: string
  downgradeModel?: string
}

export interface ModelConfig {
  id: string
  provider: 'claude-cli' | 'ollama'
  displayName: string
  costTier: '$' | '$$' | '$$$'
  inputPricePer1M: number
  outputPricePer1M: number
}

export interface MonitoringSiteConfig {
  url: string
  name: string
  checks: ('uptime' | 'freshness' | 'broken_links' | 'deploy' | 'ssl' | 'performance')[]
}

export interface NioBotConfig {
  name: string
  dataDir: string
  claudeBinary: string
  port: number
  agents: AgentConfigEntry[]
  models: Record<string, ModelConfig>
  monitoring: {
    enabled: boolean
    sites: MonitoringSiteConfig[]
    uptimeIntervalMs: number
    fullScanCron: string
  }
  dailyCostBudgetCents: number
}

const defaults: NioBotConfig = {
  name: 'NioBot',
  dataDir: path.join(os.homedir(), '.niobot', 'data'),
  claudeBinary: '/opt/homebrew/bin/claude',
  port: 3004,
  agents: [],
  models: {},
  monitoring: {
    enabled: false,
    sites: [],
    uptimeIntervalMs: 5 * 60 * 1000,
    fullScanCron: '0 0 * * *',
  },
  dailyCostBudgetCents: 500, // $5/day default
}

let _config: NioBotConfig | null = null

export function getConfig(): NioBotConfig {
  if (_config) return _config

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const userConfig = require(path.resolve(process.cwd(), 'niobot.config')).default as Partial<NioBotConfig>
    _config = { ...defaults, ...userConfig }
  } catch {
    _config = defaults
  }

  return _config
}
