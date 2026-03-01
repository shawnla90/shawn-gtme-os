import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export const dynamic = 'force-dynamic'

function listDir(dir: string): string[] {
  try { return fs.readdirSync(dir) } catch { return [] }
}

function findDbRecursive(dir: string, depth = 0): string[] {
  if (depth > 3) return []
  const results: string[] = []
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const e of entries) {
      const full = path.join(dir, e.name)
      if (e.name.endsWith('.db')) results.push(full)
      if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
        results.push(...findDbRecursive(full, depth + 1))
      }
    }
  } catch { /* */ }
  return results
}

export async function GET() {
  const cwd = process.cwd()
  const dirname = __dirname

  // Try every possible path strategy
  const strategies: Record<string, string> = {
    'cwd+../../../data': path.join(cwd, '..', '..', '..', 'data', 'index.db'),
    'cwd+../../data': path.join(cwd, '..', '..', 'data', 'index.db'),
    'cwd+../data': path.join(cwd, '..', 'data', 'index.db'),
    'cwd+data': path.join(cwd, 'data', 'index.db'),
    'cwd+.next/data': path.join(cwd, '.next', 'data', 'index.db'),
    '/var/task/data': '/var/task/data/index.db',
  }

  const results: Record<string, { path: string; exists: boolean }> = {}
  for (const [name, p] of Object.entries(strategies)) {
    results[name] = { path: p, exists: fs.existsSync(p) }
  }

  // Search for .db files from /var/task
  const dbFiles = findDbRecursive('/var/task')

  return NextResponse.json({
    cwd,
    dirname,
    env: {
      VERCEL: process.env.VERCEL,
      NODE_ENV: process.env.NODE_ENV,
    },
    strategies: results,
    cwdContents: listDir(cwd),
    varTaskContents: listDir('/var/task'),
    dotNextContents: listDir(path.join(cwd, '.next')),
    dbFilesFound: dbFiles,
  })
}
