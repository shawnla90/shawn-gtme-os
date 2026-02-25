import { NextResponse } from 'next/server'
import { getDb } from '../../../lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const db = getDb('crm')

  const stages = db.prepare(`
    SELECT stage, COUNT(*) as count
    FROM accounts
    GROUP BY stage
    ORDER BY CASE stage
      WHEN 'prospect' THEN 1
      WHEN 'qualified' THEN 2
      WHEN 'opportunity' THEN 3
      WHEN 'customer' THEN 4
      WHEN 'churned' THEN 5
    END
  `).all()

  const dealStages = db.prepare(`
    SELECT stage, COUNT(*) as count, COALESCE(SUM(value_cents), 0) as total_value
    FROM deals
    GROUP BY stage
    ORDER BY CASE stage
      WHEN 'discovery' THEN 1
      WHEN 'demo' THEN 2
      WHEN 'proposal' THEN 3
      WHEN 'negotiation' THEN 4
      WHEN 'closed_won' THEN 5
      WHEN 'closed_lost' THEN 6
    END
  `).all()

  const recentActivity = db.prepare(`
    SELECT act.*, a.name as account_name
    FROM activities act
    LEFT JOIN accounts a ON a.id = act.account_id
    ORDER BY act.created_at DESC
    LIMIT 10
  `).all()

  const totals = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM accounts) as total_accounts,
      (SELECT COUNT(*) FROM contacts) as total_contacts,
      (SELECT COUNT(*) FROM deals) as total_deals,
      (SELECT COALESCE(SUM(value_cents), 0) FROM deals WHERE stage NOT IN ('closed_lost')) as pipeline_value
  `).get()

  return NextResponse.json({ stages, dealStages, recentActivity, totals })
}
