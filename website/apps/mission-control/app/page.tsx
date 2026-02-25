import TasksBoard from './components/TasksBoard'
import SystemStatus from './components/SystemStatus'
import RecentMemories from './components/RecentMemories'
import NioStatus from './components/NioStatus'
import SessionStatus from './components/SessionStatus'
import TodayFocus from './components/TodayFocus'
import Link from 'next/link'
import {
  Users, ArrowRight, Crown, Calendar,
  Database, FileText, Briefcase, FolderKanban,
  Building2,
} from 'lucide-react'

const isPublic = process.env.NEXT_PUBLIC_MODE === 'public'

// Live DB metrics
function getDbMetrics() {
  try {
    const { getDb } = require('./lib/db')

    // NioBot metrics
    let xp = 0, messages = 0
    try {
      const niodb = getDb('niobot')
      const dna = niodb.prepare('SELECT xp FROM dna_state WHERE user_id = ?').get('default') as { xp: number } | undefined
      xp = dna?.xp ?? 0
      const msgCount = niodb.prepare('SELECT COUNT(*) as c FROM messages').get() as { c: number }
      messages = msgCount.c
    } catch { /* db might not exist */ }

    // Content metrics
    let contentCount = 0
    try {
      const indexDb = getDb('index')
      const row = indexDb.prepare('SELECT COUNT(*) as c FROM content').get() as { c: number }
      contentCount = row.c
    } catch { /* db might not exist */ }

    // CRM metrics
    let accounts = 0, deals = 0, pipelineValue = 0
    try {
      const crmDb = getDb('crm')
      const acct = crmDb.prepare('SELECT COUNT(*) as c FROM accounts').get() as { c: number }
      accounts = acct.c
      const dealRow = crmDb.prepare('SELECT COUNT(*) as c, COALESCE(SUM(value_cents), 0) as v FROM deals WHERE stage NOT IN (\'closed_lost\')').get() as { c: number; v: number }
      deals = dealRow.c
      pipelineValue = dealRow.v
    } catch { /* db might not exist */ }

    return { xp, messages, contentCount, accounts, deals, pipelineValue }
  } catch {
    return { xp: 0, messages: 0, contentCount: 0, accounts: 0, deals: 0, pipelineValue: 0 }
  }
}

export const dynamic = 'force-dynamic'

export default function Dashboard() {
  const metrics = getDbMetrics()

  return (
    <div className="space-y-8">
      {/* System Status */}
      <SystemStatus />

      <TodayFocus />

      {/* Live Metrics */}
      <div className={`card grid ${isPublic ? 'grid-cols-3' : 'grid-cols-3 md:grid-cols-6'} gap-4`}>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">{metrics.xp.toLocaleString()}</div>
          <div className="text-[10px] text-gray-500 uppercase">XP</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">{metrics.messages}</div>
          <div className="text-[10px] text-gray-500 uppercase">Messages</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">{metrics.contentCount}</div>
          <div className="text-[10px] text-gray-500 uppercase">Content</div>
        </div>
        {!isPublic && (
          <>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{metrics.accounts}</div>
              <div className="text-[10px] text-gray-500 uppercase">Accounts</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{metrics.deals}</div>
              <div className="text-[10px] text-gray-500 uppercase">Deals</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">
                {metrics.pipelineValue > 0
                  ? `$${(metrics.pipelineValue / 100).toLocaleString()}`
                  : '$0'}
              </div>
              <div className="text-[10px] text-gray-500 uppercase">Pipeline</div>
            </div>
          </>
        )}
      </div>

      {/* Navigation Cards */}
      <div className={`grid grid-cols-2 ${isPublic ? 'md:grid-cols-2' : 'md:grid-cols-4'} gap-4`}>
        <Link href="/content/" className="group">
          <div className="card hover:bg-gray-800 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-green-400" />
                <div>
                  <h3 className="font-medium text-green-300 text-sm">Content</h3>
                  <p className="text-[10px] text-gray-500">{metrics.contentCount} items</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-green-400 transition-colors" />
            </div>
          </div>
        </Link>

        {!isPublic && (
          <Link href="/databases/" className="group">
            <div className="card hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-green-400" />
                  <div>
                    <h3 className="font-medium text-green-300 text-sm">Databases</h3>
                    <p className="text-[10px] text-gray-500">3 databases</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-green-400 transition-colors" />
              </div>
            </div>
          </Link>
        )}

        {!isPublic && (
          <Link href="/crm/" className="group">
            <div className="card hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-green-400" />
                  <div>
                    <h3 className="font-medium text-green-300 text-sm">CRM</h3>
                    <p className="text-[10px] text-gray-500">{metrics.accounts} accounts</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-green-400 transition-colors" />
              </div>
            </div>
          </Link>
        )}

        <Link href="/projects/" className="group">
          <div className="card hover:bg-gray-800 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FolderKanban className="w-5 h-5 text-green-400" />
                <div>
                  <h3 className="font-medium text-green-300 text-sm">Projects</h3>
                  <p className="text-[10px] text-gray-500">5 projects</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-green-400 transition-colors" />
            </div>
          </div>
        </Link>
      </div>

      {/* Secondary nav cards */}
      <div className={`grid grid-cols-1 ${isPublic ? 'md:grid-cols-3' : 'md:grid-cols-3'} gap-4`}>
        {!isPublic && (
          <Link href="/office/" className="group">
            <div className="card hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-green-400" />
                  <div>
                    <h3 className="font-medium text-green-300">The Office</h3>
                    <p className="text-xs text-gray-400">Live agent workspace</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors" />
              </div>
            </div>
          </Link>
        )}

        <Link href="/team/" className="group">
          <div className="card hover:bg-gray-800 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-yellow-400" />
                <div>
                  <h3 className="font-medium text-green-300">Team</h3>
                  <p className="text-xs text-gray-400">Agent roster & roles</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors" />
            </div>
          </div>
        </Link>

        <Link href="/calendar/" className="group">
          <div className="card hover:bg-gray-800 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-green-400" />
                <div>
                  <h3 className="font-medium text-green-300">Calendar</h3>
                  <p className="text-xs text-gray-400">Events & deployments</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors" />
            </div>
          </div>
        </Link>

        <Link href="/progression/" className="group">
          <div className="card hover:bg-gray-800 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-yellow-400" />
                <div>
                  <h3 className="font-medium text-green-300">Progression</h3>
                  <p className="text-xs text-gray-400">XP & leveling</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors" />
            </div>
          </div>
        </Link>
      </div>

      {/* Main Dashboard Grid */}
      <div className={`grid grid-cols-1 ${isPublic ? '' : 'lg:grid-cols-3'} gap-8`}>
        {!isPublic && (
          <div className="lg:col-span-2">
            <TasksBoard />
          </div>
        )}

        {/* Side Panel */}
        <div className="space-y-6">
          <NioStatus />
          {!isPublic && <SessionStatus />}
          <RecentMemories />
        </div>
      </div>
    </div>
  )
}
