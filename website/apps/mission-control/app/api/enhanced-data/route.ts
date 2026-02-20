import { NextResponse } from 'next/server'
import fs from 'fs'

export async function GET() {
  try {
    const enhancedDataPath = '/tmp/mission_control_enhanced.json'
    
    if (fs.existsSync(enhancedDataPath)) {
      const data = JSON.parse(fs.readFileSync(enhancedDataPath, 'utf8'))
      
      // Sanitize sensitive data
      if (data.drafts) {
        data.drafts = data.drafts.map((draft: any) => ({
          ...draft,
          title: draft.title.substring(0, 30) + '...', // Truncate titles
          type: draft.type === 'substack' ? 'newsletter' : draft.type // Generic naming
        }))
      }
      
      return NextResponse.json({
        success: true,
        data: {
          calendar: data.calendar || [],
          todos: data.todos || [],
          drafts: data.drafts || [],
          insights: data.nio_insights || {},
          lastUpdate: data.last_update || new Date().toISOString()
        }
      })
    }
    
    // Return default structure if no data file
    return NextResponse.json({
      success: true,
      data: {
        calendar: generateDefaultCalendar(),
        todos: generateDefaultTodos(),
        drafts: [],
        insights: {
          observation: 'System operational. Monitoring active.',
          suggestion: 'Continue building awesome features.',
          focus: 'Automation and optimization'
        },
        lastUpdate: new Date().toISOString()
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

function generateDefaultTodos() {
  return [
    {
      task: 'Check morning automation',
      time: '9:00 AM',
      priority: 'high',
      automated: true
    },
    {
      task: 'Review system metrics',
      time: '2:00 PM', 
      priority: 'medium',
      automated: false
    }
  ]
}

function generateDefaultCalendar() {
  const today = new Date()
  return [{
    date: today.toISOString().split('T')[0],
    day: today.toLocaleDateString('en-US', { weekday: 'long' }),
    events: [
      {
        time: '8:00 AM',
        event: 'Daily automation cycle',
        type: 'automated'
      },
      {
        time: '10:00 PM',
        event: 'System summary',
        type: 'automated'
      }
    ]
  }]
}