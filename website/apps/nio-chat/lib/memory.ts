// ShawnOS Chat - (c) 2026 Shawn Tenam - See /LICENSE

import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'

const BASE_DIR = path.join(os.homedir(), '.shawnos-chat', 'memory')

function agentDir(agentId: string) {
  return path.join(BASE_DIR, agentId)
}

export async function ensureMemoryDir(agentId: string): Promise<void> {
  const dir = agentDir(agentId)
  await fs.mkdir(path.join(dir, 'daily'), { recursive: true })
}

export async function readMemory(agentId: string): Promise<string | null> {
  try {
    return await fs.readFile(path.join(agentDir(agentId), 'MEMORY.md'), 'utf-8')
  } catch {
    return null
  }
}

export async function writeMemorySnapshot(agentId: string, content: string): Promise<void> {
  await ensureMemoryDir(agentId)
  const date = new Date().toISOString().split('T')[0]
  await fs.writeFile(path.join(agentDir(agentId), 'daily', `${date}.md`), content, 'utf-8')
}

export async function readHeartbeat(agentId: string): Promise<string | null> {
  try {
    return await fs.readFile(path.join(agentDir(agentId), 'HEARTBEAT.md'), 'utf-8')
  } catch {
    return null
  }
}

export async function writeHeartbeat(agentId: string, content: string): Promise<void> {
  await ensureMemoryDir(agentId)
  await fs.writeFile(path.join(agentDir(agentId), 'HEARTBEAT.md'), content, 'utf-8')
}
