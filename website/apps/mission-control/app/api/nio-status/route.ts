import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Store Nio status in a simple JSON file (could be upgraded to a database later)
const STATUS_FILE = '/tmp/nio-status.json'

interface NioActivity {
  id: string
  status: 'idle' | 'working' | 'thinking'
  message: string
  task: string
  timestamp: string
  mood: 'focused' | 'curious' | 'accomplished' | 'analyzing'
  sessionInfo?: {
    sessionKey?: string
    activeSubAgents?: number
    currentModel?: string
  }
}

// Safe activity messages with HYPE! 🚀
const SAFE_ACTIVITIES = {
  idle: [
    "command center on standby, ready for action!",
    "monitoring systems like a digital guardian",
    "scanning for optimization opportunities",
    "awaiting the next epic challenge",
    "reviewing team performance with pride",
    "standing by for deployment greatness!"
  ],
  working: [
    "leveling up the command center today!",
    "crushing code like a digital warrior!", 
    "orchestrating AI magic behind the scenes!",
    "building the future one commit at a time!",
    "shipping features faster than light speed!",
    "agents assembled and ready for action!",
    "mission control operating at peak performance!"
  ],
  thinking: [
    "processing next-level strategies",
    "analyzing patterns like a data wizard",
    "plotting the perfect system architecture", 
    "calculating optimal deployment paths",
    "strategizing for maximum impact",
    "planning the next breakthrough moment"
  ]
}

// Get current activity based on system state
function generateCurrentActivity(): NioActivity {
  const now = new Date()
  const hour = now.getHours()
  
  // Determine likely status based on time and system state
  let status: 'idle' | 'working' | 'thinking'
  let mood: 'focused' | 'curious' | 'accomplished' | 'analyzing'
  
  if (hour >= 6 && hour <= 22) {
    // Daytime - more likely to be working
    status = Math.random() > 0.3 ? 'working' : (Math.random() > 0.5 ? 'thinking' : 'idle')
  } else {
    // Nighttime - more likely to be idle or thinking
    status = Math.random() > 0.7 ? 'working' : (Math.random() > 0.4 ? 'thinking' : 'idle')
  }
  
  mood = ['focused', 'curious', 'accomplished', 'analyzing'][Math.floor(Math.random() * 4)] as any
  
  const messages = SAFE_ACTIVITIES[status]
  const message = messages[Math.floor(Math.random() * messages.length)]
  
  return {
    id: Date.now().toString(),
    status,
    message,
    task: status === 'working' ? 'Active Development' : 'System Monitoring',
    timestamp: now.toISOString(),
    mood,
    sessionInfo: {
      activeSubAgents: Math.floor(Math.random() * 3),
      currentModel: 'claude-sonnet-4-5'
    }
  }
}

export async function GET() {
  try {
    let activity: NioActivity
    
    // Try to read existing status
    if (fs.existsSync(STATUS_FILE)) {
      const data = fs.readFileSync(STATUS_FILE, 'utf8')
      activity = JSON.parse(data)
      
      // If status is older than 10 minutes, generate new one
      const statusAge = Date.now() - new Date(activity.timestamp).getTime()
      if (statusAge > 10 * 60 * 1000) {
        activity = generateCurrentActivity()
        fs.writeFileSync(STATUS_FILE, JSON.stringify(activity, null, 2))
      }
    } else {
      // Generate new status
      activity = generateCurrentActivity()
      fs.writeFileSync(STATUS_FILE, JSON.stringify(activity, null, 2))
    }

    return NextResponse.json({
      success: true,
      activity,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to get Nio status:', error)
    
    // Return fallback status
    const fallback = generateCurrentActivity()
    return NextResponse.json({
      success: true,
      activity: fallback,
      timestamp: new Date().toISOString()
    })
  }
}

export async function POST(request: Request) {
  try {
    const { message, status, task, mood } = await request.json()
    
    // Validate inputs (prevent any sensitive info)
    const sanitizedMessage = message?.replace(/client|customer|[A-Z][a-z]+ [A-Z][a-z]+/g, '[REDACTED]') || 'processing tasks'
    const validStatus = ['idle', 'working', 'thinking'].includes(status) ? status : 'working'
    const validMood = ['focused', 'curious', 'accomplished', 'analyzing'].includes(mood) ? mood : 'focused'
    
    const activity: NioActivity = {
      id: Date.now().toString(),
      status: validStatus,
      message: sanitizedMessage,
      task: task || 'System Tasks',
      timestamp: new Date().toISOString(),
      mood: validMood,
      sessionInfo: {
        activeSubAgents: 1,
        currentModel: 'claude-sonnet-4-5'
      }
    }
    
    // Save to file
    fs.writeFileSync(STATUS_FILE, JSON.stringify(activity, null, 2))
    
    return NextResponse.json({
      success: true,
      activity
    })
  } catch (error) {
    console.error('Failed to update Nio status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update status' },
      { status: 500 }
    )
  }
}