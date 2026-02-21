const fs = require('fs')
const path = require('path')

const PUBLIC_DIR = path.join(__dirname, '..', 'public')

const checks = [
  {
    file: 'metrics.json',
    required: ['generated', 'system.status', 'system.commitCount', 'calendar', 'todos', 'drafts']
  },
  {
    file: 'data/status.json',
    required: ['generated', 'raw', 'sections']
  },
  {
    file: 'data/tasks.json',
    required: ['generated', 'tasks']
  },
  {
    file: 'data/calendar.json',
    required: ['generated', 'events', 'stats.totalEvents']
  },
  {
    file: 'data/memories.json',
    required: ['generated', 'memories']
  },
  {
    file: 'data/team.json',
    required: ['generated', 'members', 'stats.totalMembers']
  }
]

function get(obj, dottedPath) {
  return dottedPath.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj)
}

function main() {
  let failed = false

  for (const check of checks) {
    const fullPath = path.join(PUBLIC_DIR, check.file)

    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Missing file: ${check.file}`)
      failed = true
      continue
    }

    let data
    try {
      data = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
    } catch (error) {
      console.error(`❌ Invalid JSON: ${check.file} (${error.message})`)
      failed = true
      continue
    }

    const missing = check.required.filter((k) => get(data, k) === undefined)
    if (missing.length) {
      console.error(`❌ ${check.file} missing keys: ${missing.join(', ')}`)
      failed = true
    } else {
      console.log(`✅ ${check.file}`)
    }
  }

  if (failed) {
    process.exit(1)
  }

  console.log('✅ Mission Control data validation passed')
}

main()
