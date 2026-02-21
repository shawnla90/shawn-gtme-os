import { NextResponse } from 'next/server'
import { execSync } from 'child_process'

function run(command: string) {
  return execSync(command, { encoding: 'utf8' }).trim()
}

export async function POST() {
  try {
    const steps: string[] = []

    run('python3 /Users/shawnos.ai/shawn-gtme-os/scripts/mission_control_updater.py')
    steps.push('mission_control_updater.py')

    run('node /Users/shawnos.ai/shawn-gtme-os/website/apps/mission-control/scripts/generate-dashboard-data.js')
    steps.push('generate-dashboard-data.js')

    run('node /Users/shawnos.ai/shawn-gtme-os/website/apps/mission-control/scripts/generate-metrics.js')
    steps.push('generate-metrics.js')

    run('node /Users/shawnos.ai/shawn-gtme-os/website/apps/mission-control/scripts/validate-mission-control-data.js')
    steps.push('validate-mission-control-data.js')

    return NextResponse.json({
      success: true,
      steps,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Pipeline run failed'
      },
      { status: 500 }
    )
  }
}
