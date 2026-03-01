import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cwd = process.cwd()
  const dirname = __dirname

  // Try various path strategies to find index.db
  const strategies: Record<string, string> = {
    'cwd+../../../data': path.join(cwd, '..', '..', '..', 'data', 'index.db'),
    'cwd+data': path.join(cwd, 'data', 'index.db'),
    'dirname+../../../../../../../../../data': path.resolve(dirname, '../../../../../../../../../data/index.db'),
    'dirname+../../../../../../../../data': path.resolve(dirname, '../../../../../../../../data/index.db'),
  }

  const results: Record<string, { path: string; exists: boolean }> = {}
  for (const [name, p] of Object.entries(strategies)) {
    results[name] = { path: p, exists: fs.existsSync(p) }
  }

  // Also check what's in cwd
  let cwdContents: string[] = []
  try { cwdContents = fs.readdirSync(cwd) } catch { /* */ }

  let cwdParent: string[] = []
  try { cwdParent = fs.readdirSync(path.join(cwd, '..')) } catch { /* */ }

  return NextResponse.json({
    cwd,
    dirname,
    env: {
      VERCEL: process.env.VERCEL,
      NODE_ENV: process.env.NODE_ENV,
    },
    strategies: results,
    cwdContents,
    cwdParent,
  })
}
