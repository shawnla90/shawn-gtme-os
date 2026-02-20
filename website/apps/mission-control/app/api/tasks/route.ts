import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

function scanMemoryForTasks(): any[] {
  const tasks: any[] = []
  const memoryDir = '/Users/shawnos.ai/.openclaw/workspace/memory'
  const heartbeatPath = '/Users/shawnos.ai/.openclaw/workspace/HEARTBEAT.md'

  // Scan HEARTBEAT.md for active tasks
  try {
    if (fs.existsSync(heartbeatPath)) {
      const content = fs.readFileSync(heartbeatPath, 'utf8')
      const lines = content.split('\n')
      let section = ''
      lines.forEach((line, i) => {
        if (line.startsWith('###')) section = line.replace(/^#+\s*/, '')
        if (line.startsWith('- ') && section) {
          const taskText = line.replace(/^-\s*/, '').replace(/\*\*/g, '')
          if (taskText.length > 10) {
            tasks.push({
              id: `hb-${i}`,
              title: taskText.substring(0, 60),
              description: taskText,
              assignee: 'nio',
              status: 'in_progress',
              priority: 'medium',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              source: 'heartbeat'
            })
          }
        }
      })
    }
  } catch (e) { /* skip */ }

  // Scan recent memory files for action items
  try {
    if (fs.existsSync(memoryDir)) {
      const files = fs.readdirSync(memoryDir)
        .filter(f => f.endsWith('.md'))
        .sort()
        .slice(-3) // last 3 days

      for (const file of files) {
        const content = fs.readFileSync(path.join(memoryDir, file), 'utf8')
        const date = file.replace('.md', '')
        const lines = content.split('\n')
        lines.forEach((line, i) => {
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
              createdAt: `${date}T00:00:00Z`,
              updatedAt: `${date}T00:00:00Z`,
              source: 'memory'
            })
          }
        })
      }
    }
  } catch (e) { /* skip */ }

  // Read from enhanced data todos
  try {
    const enhancedPath = '/tmp/mission_control_enhanced.json'
    if (fs.existsSync(enhancedPath)) {
      const data = JSON.parse(fs.readFileSync(enhancedPath, 'utf8'))
      if (data.todos) {
        data.todos.forEach((todo: any, i: number) => {
          tasks.push({
            id: `todo-${i}`,
            title: todo.task,
            description: `Scheduled: ${todo.time}`,
            assignee: todo.automated ? 'nio' : 'shawn',
            status: 'todo',
            priority: todo.priority || 'medium',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            source: 'enhanced'
          })
        })
      }
    }
  } catch (e) { /* skip */ }

  return tasks
}

export async function GET() {
  try {
    const tasks = scanMemoryForTasks()

    return NextResponse.json({
      success: true,
      tasks: tasks.length > 0 ? tasks : [],
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks', tasks: [] },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, assignee, priority } = await request.json()

    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      assignee,
      status: 'todo',
      priority: priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ success: true, task: newTask })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
