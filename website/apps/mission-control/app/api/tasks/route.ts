import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

function loadTasks(): any[] {
  try {
    const dataPath = path.join(process.cwd(), 'public/data/tasks.json')
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
      return data.tasks || []
    }
  } catch (e) {
    console.error('Failed to load tasks.json:', e)
  }
  return []
}

export async function GET() {
  try {
    const tasks = loadTasks()

    return NextResponse.json({
      success: true,
      tasks,
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
