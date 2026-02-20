import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

function loadTeam() {
  try {
    const dataPath = path.join(process.cwd(), 'public/data/team.json')
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    }
  } catch (e) {
    console.error('Failed to load team.json:', e)
  }
  return { members: [], stats: {} }
}

export async function GET() {
  try {
    const data = loadTeam()

    return NextResponse.json({
      success: true,
      team: {
        members: data.members || [],
        stats: data.stats || {
          totalMembers: 4,
          activeMembers: 0,
          idleMembers: 0,
          totalCrons: 0,
          totalTasksCompleted: 0,
          avgSuccessRate: 0
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to get team data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get team data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { memberId } = await request.json()
    return NextResponse.json({
      success: true,
      message: `Team member ${memberId} updated`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update team member' },
      { status: 500 }
    )
  }
}
