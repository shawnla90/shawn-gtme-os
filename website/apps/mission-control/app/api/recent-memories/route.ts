import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface Memory {
  id: string
  title: string
  content: string
  date: string
  type: 'daily' | 'long-term' | 'project'
  tags: string[]
}

function getMemoryDir() {
  return process.env.OPENCLAW_WORKSPACE_DIR || '/Users/shawnos.ai/.openclaw/workspace'
}

function parseMemoryFile(filePath: string, fileName: string): Memory[] {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const memories: Memory[] = []
    
    if (fileName.match(/\d{4}-\d{2}-\d{2}\.md$/)) {
      // Daily memory file
      const date = fileName.replace('.md', '')
      const sections = content.split('\n## ').filter(Boolean)
      
      sections.forEach((section, index) => {
        const lines = section.split('\n')
        const title = lines[0].replace(/^# /, '').replace(/^## /, '').trim()
        const contentLines = lines.slice(1).filter(line => line.trim()).slice(0, 3)
        const sectionContent = contentLines.join(' ').substring(0, 200)
        
        if (title && sectionContent) {
          memories.push({
            id: `${fileName}-${index}`,
            title,
            content: sectionContent + (sectionContent.length >= 200 ? '...' : ''),
            date,
            type: 'daily',
            tags: extractTags(title + ' ' + sectionContent)
          })
        }
      })
    } else if (fileName === 'MEMORY.md') {
      // Long-term memory file
      const sections = content.split('\n## ').filter(Boolean)
      
      sections.forEach((section, index) => {
        const lines = section.split('\n')
        const title = lines[0].replace(/^# /, '').replace(/^## /, '').trim()
        const contentLines = lines.slice(1).filter(line => line.trim() && !line.startsWith('-')).slice(0, 2)
        const sectionContent = contentLines.join(' ').substring(0, 200)
        
        if (title && sectionContent) {
          memories.push({
            id: `memory-${index}`,
            title,
            content: sectionContent + (sectionContent.length >= 200 ? '...' : ''),
            date: 'long-term',
            type: 'long-term',
            tags: extractTags(title + ' ' + sectionContent)
          })
        }
      })
    }
    
    return memories
  } catch (error) {
    console.error(`Error parsing ${fileName}:`, error)
    return []
  }
}

function extractTags(text: string): string[] {
  const tags = new Set<string>()
  const commonTerms = [
    'nio', 'shawn', 'mission-control', 'discord', 'blog', 'cron', 'rss', 
    'openclaw', 'system', 'memory', 'tasks', 'github', 'commit'
  ]
  
  commonTerms.forEach(term => {
    if (text.toLowerCase().includes(term.toLowerCase())) {
      tags.add(term)
    }
  })
  
  return Array.from(tags).slice(0, 3)
}

export async function GET() {
  try {
    const memoryDir = path.join(getMemoryDir(), 'memory')
    const workspaceDir = getMemoryDir()
    
    if (!fs.existsSync(memoryDir)) {
      return NextResponse.json({
        success: false,
        error: 'Memory directory not found'
      }, { status: 404 })
    }
    
    const memories: Memory[] = []
    
    // Read daily memory files (last 7 days)
    const files = fs.readdirSync(memoryDir)
      .filter(file => file.match(/\d{4}-\d{2}-\d{2}\.md$/))
      .sort()
      .reverse()
      .slice(0, 7)
    
    for (const file of files) {
      const filePath = path.join(memoryDir, file)
      const fileMemories = parseMemoryFile(filePath, file)
      memories.push(...fileMemories)
    }
    
    // Read MEMORY.md (long-term memory)
    const memoryMdPath = path.join(workspaceDir, 'MEMORY.md')
    if (fs.existsSync(memoryMdPath)) {
      const longTermMemories = parseMemoryFile(memoryMdPath, 'MEMORY.md').slice(0, 3)
      memories.push(...longTermMemories)
    }
    
    // Sort by recency and limit to 15 most relevant
    const sortedMemories = memories
      .sort((a, b) => {
        if (a.type === 'daily' && b.type === 'daily') {
          return b.date.localeCompare(a.date)
        }
        if (a.type === 'daily') return -1
        if (b.type === 'daily') return 1
        return 0
      })
      .slice(0, 15)
    
    return NextResponse.json({
      success: true,
      memories: sortedMemories,
      meta: {
        total: sortedMemories.length,
        daily: sortedMemories.filter(m => m.type === 'daily').length,
        longTerm: sortedMemories.filter(m => m.type === 'long-term').length,
        updatedAt: new Date().toISOString()
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'failed to fetch memories'
      },
      { status: 500 }
    )
  }
}