import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

function scanMemoryFiles(): any[] {
  const memories: any[] = []
  const memoryDir = '/Users/shawnos.ai/.openclaw/workspace/memory'
  const workspaceDir = '/Users/shawnos.ai/.openclaw/workspace'

  // Scan daily memory files
  try {
    if (fs.existsSync(memoryDir)) {
      const files = fs.readdirSync(memoryDir)
        .filter(f => f.endsWith('.md'))
        .sort()
        .reverse()
        .slice(0, 7) // last 7 days

      for (const file of files) {
        const filePath = path.join(memoryDir, file)
        const content = fs.readFileSync(filePath, 'utf8')
        const date = file.replace('.md', '')
        const title = content.split('\n')[0]?.replace(/^#+\s*/, '') || date

        // Extract key sections as separate memories
        const sections = content.split(/^##\s+/m).filter(Boolean)
        for (const section of sections.slice(0, 3)) {
          const sectionTitle = section.split('\n')[0]?.trim()
          const sectionContent = section.split('\n').slice(1).join('\n').trim().substring(0, 200)
          if (sectionTitle && sectionContent.length > 20) {
            const tags: string[] = []
            if (sectionContent.match(/commit|deploy|push/i)) tags.push('development')
            if (sectionContent.match(/discord|whatsapp|channel/i)) tags.push('integration')
            if (sectionContent.match(/blog|content|post/i)) tags.push('content')
            if (sectionContent.match(/cron|automat|schedule/i)) tags.push('automation')
            if (sectionContent.match(/fix|bug|error/i)) tags.push('bugfix')
            if (sectionContent.match(/mission|control|dashboard/i)) tags.push('dashboard')
            if (tags.length === 0) tags.push('general')

            memories.push({
              id: `mem-${date}-${sectionTitle.substring(0, 10)}`,
              title: sectionTitle.substring(0, 60),
              content: sectionContent,
              date,
              type: 'daily',
              tags
            })
          }
        }
      }
    }
  } catch (e) { /* skip */ }

  // Scan MEMORY.md for long-term memories
  try {
    const memoryMd = path.join(workspaceDir, 'MEMORY.md')
    if (fs.existsSync(memoryMd)) {
      const content = fs.readFileSync(memoryMd, 'utf8')
      const sections = content.split(/^##\s+/m).filter(Boolean)
      for (const section of sections) {
        const sectionTitle = section.split('\n')[0]?.trim()
        const sectionContent = section.split('\n').slice(1).join('\n').trim().substring(0, 200)
        if (sectionTitle && sectionContent.length > 20) {
          memories.push({
            id: `lt-${sectionTitle.substring(0, 10)}`,
            title: sectionTitle.substring(0, 60),
            content: sectionContent,
            date: 'persistent',
            type: 'long-term',
            tags: ['core', 'persistent']
          })
        }
      }
    }
  } catch (e) { /* skip */ }

  return memories
}

export async function GET() {
  try {
    const memories = scanMemoryFiles()

    // Also try to read enhanced data for todos/calendar
    let enhanced: any = {}
    try {
      const enhancedPath = '/tmp/mission_control_enhanced.json'
      if (fs.existsSync(enhancedPath)) {
        enhanced = JSON.parse(fs.readFileSync(enhancedPath, 'utf8'))
      }
    } catch (e) { /* skip */ }

    return NextResponse.json({
      success: true,
      data: {
        memories,
        calendar: enhanced.calendar || [],
        todos: enhanced.todos || [],
        drafts: (enhanced.drafts || []).map((d: any) => ({
          ...d,
          title: d.title?.substring(0, 30) + '...',
          type: d.type === 'substack' ? 'newsletter' : d.type
        })),
        insights: enhanced.nio_insights || {
          observation: 'System operational. Monitoring active.',
          suggestion: 'Continue building.',
          focus: 'Automation and optimization'
        },
        lastUpdate: enhanced.last_update || new Date().toISOString()
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
