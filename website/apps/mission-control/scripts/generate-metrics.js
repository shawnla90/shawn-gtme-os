const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const APP_ROOT = path.join(__dirname, '..')
const PUBLIC_DIR = path.join(APP_ROOT, 'public')
const DATA_DIR = path.join(PUBLIC_DIR, 'data')
const ENHANCED_PATH = '/tmp/mission_control_enhanced.json'

function readJsonIfExists(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    console.error(`Failed to parse ${filePath}:`, error.message)
    return fallback
  }
}

function safeWriteJson(targetPath, data) {
  const normalizedTarget = path.resolve(targetPath)
  const normalizedPublic = path.resolve(PUBLIC_DIR)

  if (!normalizedTarget.startsWith(normalizedPublic)) {
    throw new Error(`Refusing write outside Mission Control public dir: ${normalizedTarget}`)
  }

  fs.mkdirSync(path.dirname(normalizedTarget), { recursive: true })
  fs.writeFileSync(normalizedTarget, JSON.stringify(data, null, 2))
}

function getGitStats() {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const repoRoot = path.join(__dirname, '../../../..')

    const commitCount = execSync(`git log --since="${since}" --oneline | wc -l`, {
      cwd: repoRoot,
      encoding: 'utf8'
    }).trim()

    return { commitCount: parseInt(commitCount, 10) || 0 }
  } catch (error) {
    console.error('Git stats error:', error.message)
    return { commitCount: 0 }
  }
}

function deriveSystemModel(teamData) {
  const members = teamData?.members || []
  const opusMember = members.find((m) => (m.model || '').toLowerCase().includes('opus'))
  if (opusMember) return opusMember.model
  return 'claude-sonnet-4'
}

function generateMetrics() {
  const now = new Date()
  const gitStats = getGitStats()

  const enhanced = readJsonIfExists(ENHANCED_PATH, {})
  const calendarData = readJsonIfExists(path.join(DATA_DIR, 'calendar.json'), { events: [] })
  const tasksData = readJsonIfExists(path.join(DATA_DIR, 'tasks.json'), { tasks: [] })
  const teamData = readJsonIfExists(path.join(DATA_DIR, 'team.json'), { members: [] })

  const todos = (enhanced.todos || [])
    .slice(0, 5)
    .map((t) => ({ task: t.task, time: t.time || 'Flexible', priority: t.priority || 'medium' }))

  const drafts = (enhanced.drafts || [])
    .slice(0, 5)
    .map((d) => ({ type: d.type || 'content', title: d.title || 'Untitled draft', status: d.status || 'draft' }))

  const today = now.toISOString().split('T')[0]
  const todayEvents = (enhanced.calendar || []).find((c) => c.date === today) || (enhanced.calendar || [])[0] || {
    date: today,
    events: []
  }

  const workspaceRoot = process.env.OPENCLAW_WORKSPACE || '/Users/shawnos.ai/.openclaw/workspace'
  const memoryDir = path.join(workspaceRoot, 'memory')
  const memoryFiles = fs.existsSync(memoryDir)
    ? fs.readdirSync(memoryDir).filter((f) => f.endsWith('.md')).length
    : 0

  const metrics = {
    generated: now.toISOString(),
    system: {
      status: enhanced.system_status?.overall === 'optimal' ? 'online' : 'degraded',
      uptime: 'live',
      lastCron: 'See scheduler',
      commitCount: gitStats.commitCount,
      activeSkills: 42,
      memoryFiles,
      sessionCost: '$0.00',
      model: deriveSystemModel(teamData)
    },
    calendar: [
      {
        date: todayEvents.date || today,
        events: (todayEvents.events || []).slice(0, 6)
      }
    ],
    todos: todos.length ? todos : [{ task: 'No active todos', time: 'N/A', priority: 'low' }],
    drafts: drafts.length ? drafts : [{ type: 'content', title: 'No drafts detected', status: 'empty' }],
    telemetry: {
      calendarEvents: (calendarData.events || []).length,
      tasksTracked: (tasksData.tasks || []).length,
      teamMembers: (teamData.members || []).length
    }
  }

  const outputPath = path.join(PUBLIC_DIR, 'metrics.json')
  safeWriteJson(outputPath, metrics)
  console.log(`✅ Generated metrics: ${gitStats.commitCount} commits | ${metrics.telemetry.tasksTracked} tasks`)
}

generateMetrics()
