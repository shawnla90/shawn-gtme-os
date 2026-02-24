const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const REPO_ROOT = path.join(__dirname, '../../../..')
const OUTPUT_DIR = path.join(__dirname, '../public/data')

// Local paths — repo-based data sources
const HEARTBEAT_PATH = path.join(REPO_ROOT, 'data', 'mission-control', 'HEARTBEAT.md')
const MEMORY_DIR = path.join(REPO_ROOT, 'data', 'nio-memory', 'daily')
const WORKSPACE_MEMORY = path.join(REPO_ROOT, 'data', 'nio-memory', 'MEMORY.md')

function ensureOutputDir() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

function writeJSON(filename, data) {
  const outPath = path.join(OUTPUT_DIR, filename)
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2))
  console.log(`  -> ${filename}`)
}

// ─── Tasks ──────────────────────────────────────────────────────────────────

function generateTasks() {
  const tasks = []

  // Scan HEARTBEAT.md for active tasks
  try {
    if (fs.existsSync(HEARTBEAT_PATH)) {
      const content = fs.readFileSync(HEARTBEAT_PATH, 'utf8')
      const lines = content.split('\n')
      let section = ''
      lines.forEach((line, i) => {
        if (line.startsWith('###')) section = line.replace(/^#+\s*/, '')
        if (line.match(/^-\s*\[[ x]\]/)) {
          const done = line.includes('[x]')
          const text = line.replace(/^-\s*\[[ x]\]\s*/, '').replace(/\*\*/g, '')
          if (text.length > 5) {
            tasks.push({
              id: `hb-${i}`,
              title: text.substring(0, 60),
              description: text,
              assignee: 'nio',
              status: done ? 'done' : 'todo',
              priority: section.toLowerCase().includes('infrastructure') ? 'high' : 'medium',
              category: section,
              createdAt: new Date().toISOString(),
              source: 'heartbeat'
            })
          }
        }
        // Also capture bullet-point tasks without checkboxes
        if (line.startsWith('- ') && !line.match(/^-\s*\[/) && section) {
          const taskText = line.replace(/^-\s*/, '').replace(/\*\*/g, '')
          if (taskText.length > 10 && section.includes('Maintenance')) {
            tasks.push({
              id: `maint-${i}`,
              title: taskText.substring(0, 60),
              description: taskText,
              assignee: 'nio',
              status: 'in_progress',
              priority: 'low',
              category: 'Maintenance',
              createdAt: new Date().toISOString(),
              source: 'heartbeat'
            })
          }
        }
      })
    }
  } catch (e) {
    console.error('  HEARTBEAT.md scan failed:', e.message)
  }

  // Scan recent memory files for checkbox items
  try {
    if (fs.existsSync(MEMORY_DIR)) {
      const files = fs.readdirSync(MEMORY_DIR)
        .filter(f => f.endsWith('.md'))
        .sort()
        .slice(-3)

      for (const file of files) {
        const content = fs.readFileSync(path.join(MEMORY_DIR, file), 'utf8')
        const date = file.replace('.md', '')
        content.split('\n').forEach((line, i) => {
          if (line.match(/^-\s*\[[ x]\]/)) {
            const done = line.includes('[x]')
            const text = line.replace(/^-\s*\[[ x]\]\s*/, '')
            tasks.push({
              id: `mem-${date}-${i}`,
              title: text.substring(0, 60),
              description: text,
              assignee: 'nio',
              status: done ? 'done' : 'todo',
              priority: 'medium',
              category: 'Memory',
              createdAt: `${date}T00:00:00Z`,
              source: 'memory'
            })
          }
        })
      }
    }
  } catch (e) {
    console.error('  Memory scan failed:', e.message)
  }

  writeJSON('tasks.json', {
    generated: new Date().toISOString(),
    tasks
  })
  return tasks.length
}

// ─── Calendar (commits + cron schedule) ─────────────────────────────────────

function generateCalendar() {
  const events = []

  // Recent git commits
  try {
    const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    const output = execSync(
      `git log --since="${since}" --pretty=format:"%H|%s|%aI" --max-count=15`,
      { cwd: REPO_ROOT, encoding: 'utf8' }
    )
    output.split('\n').filter(Boolean).forEach(line => {
      const [hash, message, date] = line.split('|')
      const isFeat = message?.startsWith('feat:')
      const isFix = message?.startsWith('fix:')
      events.push({
        id: `commit-${hash?.substring(0, 7)}`,
        title: message?.substring(0, 60) || 'commit',
        type: isFeat ? 'milestone' : isFix ? 'deployment' : 'system',
        datetime: date,
        status: 'completed',
        description: message,
        metadata: { commitHash: hash?.substring(0, 7) }
      })
    })
  } catch (e) {
    console.error('  Git log failed:', e.message)
  }

  // Crons are now managed via launchd, not tracked here

  events.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())

  writeJSON('calendar.json', {
    generated: new Date().toISOString(),
    events,
    stats: {
      totalEvents: events.length,
      completedEvents: events.filter(e => e.status === 'completed').length,
      scheduledEvents: events.filter(e => e.status === 'scheduled').length,
      deploymentsThisWeek: events.filter(e => e.type !== 'cron').length,
      upcomingCronJobs: events.filter(e => e.status === 'scheduled').length
    }
  })
  return events.length
}

// ─── Memories ───────────────────────────────────────────────────────────────

function generateMemories() {
  const memories = []

  // Scan daily memory files
  try {
    if (fs.existsSync(MEMORY_DIR)) {
      const files = fs.readdirSync(MEMORY_DIR)
        .filter(f => f.endsWith('.md'))
        .sort()
        .reverse()
        .slice(0, 7)

      for (const file of files) {
        const content = fs.readFileSync(path.join(MEMORY_DIR, file), 'utf8')
        const date = file.replace('.md', '')
        const sections = content.split(/^##\s+/m).filter(Boolean)
        for (const section of sections.slice(0, 3)) {
          const sectionTitle = section.split('\n')[0]?.trim()
          const sectionContent = section.split('\n').slice(1).join('\n').trim().substring(0, 200)
          if (sectionTitle && sectionContent.length > 20) {
            const tags = []
            if (sectionContent.match(/commit|deploy|push/i)) tags.push('development')
            if (sectionContent.match(/discord|whatsapp|channel/i)) tags.push('integration')
            if (sectionContent.match(/blog|content|post/i)) tags.push('content')
            if (sectionContent.match(/cron|automat|schedule/i)) tags.push('automation')
            if (sectionContent.match(/fix|bug|error/i)) tags.push('bugfix')
            if (sectionContent.match(/mission|control|dashboard/i)) tags.push('dashboard')
            if (tags.length === 0) tags.push('general')

            memories.push({
              id: `mem-${date}-${sectionTitle.substring(0, 10)}`,
              title: sectionTitle.substring(0, 60),
              content: sectionContent,
              date,
              type: 'daily',
              tags
            })
          }
        }
      }
    }
  } catch (e) {
    console.error('  Memory dir scan failed:', e.message)
  }

  // Scan MEMORY.md for long-term memories
  try {
    if (fs.existsSync(WORKSPACE_MEMORY)) {
      const content = fs.readFileSync(WORKSPACE_MEMORY, 'utf8')
      const sections = content.split(/^##\s+/m).filter(Boolean)
      for (const section of sections) {
        const sectionTitle = section.split('\n')[0]?.trim()
        const sectionContent = section.split('\n').slice(1).join('\n').trim().substring(0, 200)
        if (sectionTitle && sectionContent.length > 20) {
          memories.push({
            id: `lt-${sectionTitle.substring(0, 10)}`,
            title: sectionTitle.substring(0, 60),
            content: sectionContent,
            date: 'persistent',
            type: 'long-term',
            tags: ['core', 'persistent']
          })
        }
      }
    }
  } catch (e) {
    console.error('  MEMORY.md scan failed:', e.message)
  }

  writeJSON('memories.json', {
    generated: new Date().toISOString(),
    memories
  })
  return memories.length
}

// ─── Team ───────────────────────────────────────────────────────────────────

function generateTeam() {
  // Crons are now managed via launchd, team stats are static
  const members = [
    {
      id: 'nio',
      name: 'Nio',
      role: 'commander',
      model: 'Claude Sonnet 4',
      provider: 'Anthropic API',
      specialization: 'Main agent — chat, WhatsApp, Discord, orchestration',
      status: 'active',
      currentAssignment: 'Handling all conversations and agent coordination',
      skills: ['Chat', 'WhatsApp', 'Discord', 'Orchestration', 'Memory Management'],
      level: 6,
      experience: 600,
      performance: {
        tasksCompleted: 0,
        assignedCrons: 0,
        successRate: 100,
        avgResponseTime: 'n/a',
        cost: 'API pay-per-use'
      }
    },
    {
      id: 'qwen-local',
      name: 'Qwen 2.5 14B',
      role: 'scout',
      model: 'qwen2.5:14b',
      provider: 'Ollama (local)',
      specialization: 'High-frequency cron jobs — commit tracking, RSS, mission control, status updates',
      status: 'active',
      currentAssignment: 'launchd-managed cron jobs',
      skills: ['Commit Tracking', 'RSS Monitoring', 'Mission Control Updates', 'Status Reports'],
      level: 4,
      experience: 400,
      performance: {
        tasksCompleted: 0,
        assignedCrons: 0,
        successRate: 100,
        avgResponseTime: 'n/a',
        cost: 'FREE (local)'
      }
    },
    {
      id: 'opus',
      name: 'Claude Opus 4',
      role: 'strategist',
      model: 'claude-opus-4-20250514',
      provider: 'Anthropic API',
      specialization: 'Content creation — blog posts, Substack essays, LinkedIn, deep thinking',
      status: 'active',
      currentAssignment: 'Daily blog generation via launchd cron',
      skills: ['Blog Writing', 'Substack Essays', 'LinkedIn Posts', 'Deep Analysis', 'Voice DNA'],
      level: 7,
      experience: 700,
      performance: {
        tasksCompleted: 0,
        assignedCrons: 0,
        successRate: 100,
        avgResponseTime: 'n/a',
        cost: 'API pay-per-use (premium)'
      }
    },
    {
      id: 'claude-code',
      name: 'Claude Code',
      role: 'builder',
      model: 'Claude Opus 4.6',
      provider: 'Max Subscription',
      specialization: 'Silent gatekeeper — infrastructure, debugging, deployments, system fixes',
      status: 'active',
      currentAssignment: 'Watching over the system from the CLI',
      skills: ['Infrastructure', 'Debugging', 'Git Operations', 'Deployments', 'System Architecture'],
      level: 7,
      experience: 9999,
      performance: {
        tasksCompleted: 0,
        assignedCrons: 0,
        successRate: 100,
        avgResponseTime: 'instant',
        cost: 'FREE (Max sub)'
      }
    }
  ]

  const activeMembers = members.filter(m => m.status === 'active').length

  writeJSON('team.json', {
    generated: new Date().toISOString(),
    members,
    stats: {
      totalMembers: members.length,
      activeMembers,
      idleMembers: members.filter(m => m.status === 'idle' || m.status === 'standby').length,
      totalCrons: members.reduce((sum, m) => sum + (m.performance.assignedCrons || 0), 0),
      totalTasksCompleted: members.reduce((sum, m) => sum + m.performance.tasksCompleted, 0),
      avgSuccessRate: Math.round(members.reduce((sum, m) => sum + m.performance.successRate, 0) / members.length)
    }
  })
  return members.length
}

// ─── Status ──────────────────────────────────────────────────────────────────

function generateStatus() {
  try {
    const statusPath = path.join(REPO_ROOT, 'data/mission-control/nio-status-update.md')
    if (fs.existsSync(statusPath)) {
      const content = fs.readFileSync(statusPath, 'utf8')
      const sections = content.split(/^##\s+/m).filter(Boolean)
      writeJSON('status.json', {
        generated: new Date().toISOString(),
        raw: content,
        sections: sections.map(s => ({
          title: s.split('\n')[0]?.trim(),
          content: s.split('\n').slice(1).join('\n').trim()
        }))
      })
      return sections.length
    }
  } catch (e) {
    console.error('  Status generation failed:', e.message)
  }
  writeJSON('status.json', { generated: new Date().toISOString(), raw: '', sections: [] })
  return 0
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main() {
  console.log('Generating dashboard data...')
  ensureOutputDir()

  const taskCount = generateTasks()
  const eventCount = generateCalendar()
  const memoryCount = generateMemories()
  const teamCount = generateTeam()
  const statusCount = generateStatus()

  console.log(`\n✅ Dashboard data generated:`)
  console.log(`   ${taskCount} tasks, ${eventCount} events, ${memoryCount} memories, ${teamCount} team members, ${statusCount} status sections`)
}

main()
