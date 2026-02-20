import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

function loadCalendar() {
  try {
    const dataPath = path.join(process.cwd(), 'public/data/calendar.json')
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    }
  } catch (e) {
    console.error('Failed to load calendar.json:', e)
  }
  return { events: [], stats: {} }
}

export async function GET() {
  try {
    const data = loadCalendar()

    return NextResponse.json({
      success: true,
      calendar: {
        events: data.events || [],
        stats: data.stats || {
          totalEvents: 0,
          completedEvents: 0,
          scheduledEvents: 0,
          deploymentsThisWeek: 0,
          upcomingCronJobs: 0
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to get calendar data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get calendar data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { eventType, title, datetime, description } = await request.json()
    const newEvent = {
      id: Date.now().toString(),
      title,
      type: eventType,
      datetime,
      status: 'scheduled',
      description,
      metadata: {}
    }
    return NextResponse.json({ success: true, event: newEvent })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to add calendar event' },
      { status: 500 }
    )
  }
}
