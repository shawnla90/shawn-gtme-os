import { NextResponse } from 'next/server'
import { getDb } from '../../lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    let xp = 0, messages = 0
    try {
      const niodb = getDb('niobot')
      const dna = niodb.prepare('SELECT xp FROM dna_state WHERE user_id = ?').get('default') as { xp: number } | undefined
      xp = dna?.xp ?? 0
      const msgCount = niodb.prepare('SELECT COUNT(*) as c FROM messages').get() as { c: number }
      messages = msgCount.c
    } catch { /* db might not exist */ }

    let contentCount = 0
    try {
      const indexDb = getDb('index')
      const row = indexDb.prepare('SELECT COUNT(*) as c FROM content').get() as { c: number }
      contentCount = row.c
    } catch { /* db might not exist */ }

    let accounts = 0, deals = 0, pipelineValue = 0
    try {
      const crmDb = getDb('crm')
      const acct = crmDb.prepare('SELECT COUNT(*) as c FROM accounts').get() as { c: number }
      accounts = acct.c
      const dealRow = crmDb.prepare("SELECT COUNT(*) as c, COALESCE(SUM(value_cents), 0) as v FROM deals WHERE stage NOT IN ('closed_lost')").get() as { c: number; v: number }
      deals = dealRow.c
      pipelineValue = dealRow.v
    } catch { /* db might not exist */ }

    return NextResponse.json({ xp, messages, contentCount, accounts, deals, pipelineValue })
  } catch {
    return NextResponse.json({ xp: 0, messages: 0, contentCount: 0, accounts: 0, deals: 0, pipelineValue: 0 })
  }
}
