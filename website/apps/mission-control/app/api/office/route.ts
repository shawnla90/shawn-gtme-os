import { NextResponse } from 'next/server'

// Mock office data - could be enhanced to read from actual system state
const OFFICE_STATE = {
  agents: [
    {
      id: 'nio-main',
      name: 'Nio',
      role: 'alchemist',
      status: 'working',
      currentTask: 'Building Mission Control Office View',
      workstation: { x: 20, y: 30, desk: 'Command Center' },
      mood: '🎯',
      lastActivity: 'just now'
    },
    {
      id: 'builder-01',
      name: 'Builder',
      role: 'builder', 
      status: 'working',
      currentTask: 'Optimizing component architecture',
      workstation: { x: 60, y: 20, desk: 'Dev Station Alpha' },
      mood: '🔧',
      lastActivity: '2m ago'
    },
    {
      id: 'scribe-01',
      name: 'Scribe',
      role: 'scribe',
      status: 'thinking', 
      currentTask: 'Drafting system documentation',
      workstation: { x: 20, y: 70, desk: 'Content Lab' },
      mood: '📝',
      lastActivity: '5m ago'
    },
    {
      id: 'strategist-01',
      name: 'Strategist',
      role: 'strategist',
      status: 'idle',
      currentTask: 'Planning next sprint objectives',
      workstation: { x: 75, y: 60, desk: 'Strategy Corner' },
      mood: '🧠',
      lastActivity: '12m ago'
    },
    {
      id: 'polymath-01',
      name: 'Polymath',
      role: 'polymath',
      status: 'break',
      currentTask: 'Processing multi-domain analysis',
      workstation: { x: 45, y: 45, desk: 'Research Hub' },
      mood: '☕',
      lastActivity: '8m ago'
    }
  ],
  officeStats: {
    totalAgents: 5,
    activeWorkstations: 5,
    currentTasks: 5,
    lastUpdate: new Date().toISOString()
  }
}

export async function GET() {
  try {
    // In the future, this could:
    // - Read from active sub-agent sessions
    // - Check real task assignments from the tasks API
    // - Monitor actual system activity
    // - Integrate with the memory system for agent states
    
    // Add some randomization to simulate live activity
    const agents = OFFICE_STATE.agents.map(agent => ({
      ...agent,
      lastActivity: Math.random() > 0.7 ? 'just now' : agent.lastActivity,
      status: Math.random() > 0.9 ? 
        (['working', 'thinking', 'idle', 'break'][Math.floor(Math.random() * 4)] as any) : 
        agent.status
    }))

    return NextResponse.json({
      success: true,
      office: {
        ...OFFICE_STATE,
        agents,
        officeStats: {
          ...OFFICE_STATE.officeStats,
          working: agents.filter(a => a.status === 'working').length,
          thinking: agents.filter(a => a.status === 'thinking').length,
          idle: agents.filter(a => a.status === 'idle').length,
          onBreak: agents.filter(a => a.status === 'break').length,
          lastUpdate: new Date().toISOString()
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to get office status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get office status' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { agentId, status, currentTask } = await request.json()
    
    // In the future, this could update agent status
    // For now, just return success
    
    return NextResponse.json({
      success: true,
      message: `Agent ${agentId} status updated`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to update office status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update office status' },
      { status: 500 }
    )
  }
}