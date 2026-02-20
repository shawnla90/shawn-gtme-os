import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

function loadJSON(filename: string) {
  try {
    const dataPath = path.join(process.cwd(), `public/data/${filename}`)
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    }
  } catch (e) {
    console.error(`Failed to load ${filename}:`, e)
  }
  return null
}

export async function GET() {
  try {
    const memoriesData = loadJSON('memories.json')
    const tasksData = loadJSON('tasks.json')
    const calendarData = loadJSON('calendar.json')

    const memories = memoriesData?.memories || []
    const tasks = tasksData?.tasks || []
    const events = calendarData?.events || []

    return NextResponse.json({
      success: true,
      data: {
        memories,
        calendar: events.slice(0, 10),
        todos: tasks.filter((t: any) => t.status === 'todo').map((t: any) => ({
          task: t.title,
          time: 'Flexible',
          priority: t.priority
        })),
        drafts: [],
        insights: {
          observation: 'System operational. All data served from static JSON.',
          suggestion: 'Continue building.',
          focus: 'Automation and optimization'
        },
        lastUpdate: memoriesData?.generated || new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error reading enhanced data:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to load enhanced data'
    }, { status: 500 })
  }
}
