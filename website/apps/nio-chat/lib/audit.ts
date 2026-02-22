// ShawnOS Chat - (c) 2026 Shawn Tenam - See /LICENSE

import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'

const AUDIT_DIR = path.join(os.homedir(), '.shawnos-chat', 'audit')

async function appendLog(file: string, entry: Record<string, unknown>): Promise<void> {
  try {
    await fs.mkdir(AUDIT_DIR, { recursive: true })
    const line = JSON.stringify({ ...entry, timestamp: new Date().toISOString() }) + '\n'
    await fs.appendFile(path.join(AUDIT_DIR, file), line, 'utf-8')
  } catch {
    // fire-and-forget: don't break the request if logging fails
  }
}

export function logAuthAttempt(ip: string, success: boolean): void {
  appendLog('auth.log', { ip, success })
}

export function logChatRequest(ip: string, agentId: string, messageLength: number): void {
  appendLog('chat.log', { ip, agentId, messageLength })
}
