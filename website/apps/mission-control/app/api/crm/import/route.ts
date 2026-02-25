import { NextResponse } from 'next/server'
import { getDb } from '../../../lib/db'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function POST() {
  const db = getDb('crm')
  const repliesDir = path.join(process.cwd(), '..', '..', '..', 'clients', 'partner', 'partner-alpha', 'resources', 'replies')
  const researchDir = path.join(process.cwd(), '..', '..', '..', 'clients', 'partner', 'partner-alpha', 'research')

  const results = { accounts: 0, contacts: 0, activities: 0, errors: [] as string[] }

  // Create or get Partner-Alpha account
  let account = db.prepare('SELECT id FROM accounts WHERE name = ?').get('Partner-Alpha') as { id: number } | undefined

  if (!account) {
    const r = db.prepare(`
      INSERT INTO accounts (name, domain, industry, source, stage, notes)
      VALUES ('Partner-Alpha', 'partner-alpha.com', 'PropTech', 'partner', 'customer', 'Primary GTM partner')
    `).run()
    account = { id: Number(r.lastInsertRowid) }
    results.accounts++
  }

  // Import research docs as notes
  if (fs.existsSync(researchDir)) {
    const researchFiles = fs.readdirSync(researchDir).filter((f) => f.endsWith('.md'))
    for (const file of researchFiles) {
      try {
        const content = fs.readFileSync(path.join(researchDir, file), 'utf-8')
        db.prepare(`
          INSERT INTO activities (account_id, type, title, body, metadata)
          VALUES (?, 'note', ?, ?, ?)
        `).run(account.id, `Research: ${file.replace('.md', '')}`, content, JSON.stringify({ source: 'import', file }))
        results.activities++
      } catch (e) {
        results.errors.push(`Research ${file}: ${(e as Error).message}`)
      }
    }
  }

  // Import email replies
  if (fs.existsSync(repliesDir)) {
    const replyFiles = fs.readdirSync(repliesDir).filter((f) => f.endsWith('.md'))

    // Parse filenames: YYYY-MM-DD_HH-MM-SS_email_requestid.md
    for (const file of replyFiles) {
      try {
        const parts = file.replace('.md', '').split('_')
        if (parts.length < 4) continue

        const date = parts[0]
        const time = parts[1]
        const emailRaw = parts[2]
        // Convert email format: name-domain-com -> name@domain.com
        const emailParts = emailRaw.split('-')
        // Best-effort email reconstruction
        const email = emailRaw.replace(/-/g, '.').replace(/\.com$/, '@').replace(/@$/, '') + (emailRaw.endsWith('-com') ? '' : '')

        const content = fs.readFileSync(path.join(repliesDir, file), 'utf-8')

        // Create contact if email not already there
        const existingContact = db.prepare('SELECT id FROM contacts WHERE email = ? AND account_id = ?').get(email, account.id)

        let contactId: number
        if (!existingContact) {
          const name = emailParts[0] || 'Unknown'
          const r = db.prepare(`
            INSERT INTO contacts (account_id, first_name, email, source, notes)
            VALUES (?, ?, ?, 'import', 'Imported from email reply')
          `).run(account.id, name, email)
          contactId = Number(r.lastInsertRowid)
          results.contacts++
        } else {
          contactId = (existingContact as { id: number }).id
        }

        // Create activity for the reply
        db.prepare(`
          INSERT INTO activities (account_id, contact_id, type, title, body, metadata, created_at)
          VALUES (?, ?, 'email', ?, ?, ?, ?)
        `).run(
          account.id,
          contactId,
          `Email reply from ${email}`,
          content,
          JSON.stringify({ source: 'import', file, email }),
          `${date} ${time.replace(/-/g, ':')}`
        )
        results.activities++
      } catch (e) {
        results.errors.push(`Reply ${file}: ${(e as Error).message}`)
      }
    }
  }

  return NextResponse.json(results)
}
