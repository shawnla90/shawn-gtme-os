import { NextResponse } from 'next/server'

// Calendar events data
const CALENDAR_EVENTS = {
  events: [
    {
      id: '1',
      title: 'Mission Control Deployed 🚀',
      type: 'deployment',
      datetime: '2026-02-19T07:46:00Z',
      status: 'completed',
      description: 'Successfully deployed Mission Control to Vercel with all 10 pages',
      metadata: {
        deploymentUrl: 'https://mission-control-six-smoky.vercel.app',
        commitHash: '3826995',
        duration: '2m 15s'
      }
    },
    {
      id: '2', 
      title: 'Nio Status Update - HYPE MODE! ⚡',
      type: 'cron',
      datetime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
      status: 'scheduled',
      description: 'Next hype status update with creative messaging',
      metadata: {
        cronId: 'bcd555fc-f9c8-4ff1-a7dc-ccf4f355deec'
      }
    },
    {
      id: '3',
      title: 'Morning Team Briefing 📋',
      type: 'cron', 
      datetime: new Date(new Date().setHours(6, 0, 0, 0) + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow 6 AM
      status: 'scheduled',
      description: 'Daily morning scan: Slack channels, system health, team updates',
      metadata: {
        cronId: 'morning-briefing-id'
      }
    },
    {
      id: '4',
      title: '100+ Commits Milestone 🎯',
      type: 'milestone',
      datetime: '2026-02-18T22:00:00Z', 
      status: 'completed',
      description: 'Hit 108 commits! From zero to full GTM OS in 2 weeks'
    },
    {
      id: '5',
      title: 'Calendar System Launch 📅',
      type: 'system',
      datetime: new Date().toISOString(),
      status: 'completed', 
      description: 'Added Mission Calendar with events tracking, deployment history, and cron monitoring'
    },
    {
      id: '6',
      title: 'Next Deployment Window 🚀',
      type: 'system',
      datetime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
      status: 'scheduled',
      description: 'Upcoming feature deployment window - Calendar enhancements and system updates'
    }
  ],
  stats: {
    totalEvents: 6,
    completedEvents: 3,
    scheduledEvents: 3,
    deploymentsThisWeek: 2,
    upcomingCronJobs: 2
  }
}

export async function GET() {
  try {
    // In the future, this could:
    // - Read from actual cron job schedules
    // - Integration with Vercel deployment API
    // - Pull from git commit history
    // - Read from system logs and events
    
    // Add real-time data
    const eventsWithCurrentData = CALENDAR_EVENTS.events.map(event => ({
      ...event,
      // Add deployment status checks, cron job status, etc.
      lastUpdated: new Date().toISOString()
    }))

    return NextResponse.json({
      success: true,
      calendar: {
        ...CALENDAR_EVENTS,
        events: eventsWithCurrentData
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
    
    // In the future, this could:
    // - Add new scheduled events
    // - Update deployment statuses
    // - Log system milestones
    // - Schedule new cron jobs
    
    const newEvent = {
      id: Date.now().toString(),
      title,
      type: eventType,
      datetime,
      status: 'scheduled',
      description,
      metadata: {}
    }

    return NextResponse.json({
      success: true,
      message: 'Event added to calendar',
      event: newEvent,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to add calendar event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add calendar event' },
      { status: 500 }
    )
  }
}