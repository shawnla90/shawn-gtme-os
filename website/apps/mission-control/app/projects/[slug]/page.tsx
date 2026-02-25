'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { FolderKanban } from 'lucide-react'
import CommitLog from '../../components/CommitLog'

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-900 text-green-400',
  maintenance: 'bg-yellow-900 text-yellow-300',
  planned: 'bg-gray-700 text-gray-300',
}

const TEAM_COLORS: Record<string, string> = {
  'claude-code': 'bg-purple-900 text-purple-300',
  nio: 'bg-cyan-900 text-cyan-300',
  opus: 'bg-orange-900 text-orange-300',
  qwen: 'bg-blue-900 text-blue-300',
}

interface ProjectData {
  slug: string
  name: string
  description: string
  path: string
  techStack: string[]
  team: string[]
  status: string
  commitCount: number
  recentCommits: { hash: string; message: string; date: string; author: string }[]
}

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects/')
      .then((r) => r.json())
      .then((data) => {
        const found = data.projects.find((p: ProjectData) => p.slug === slug)
        setProject(found || null)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <Link href="/projects/" className="text-sm text-green-600 hover:text-green-400">
          &larr; Back to Projects
        </Link>
        <div className="card text-center py-12 text-gray-500">Project not found</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link href="/projects/" className="text-sm text-green-600 hover:text-green-400 transition-colors">
        &larr; Back to Projects
      </Link>

      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <FolderKanban className="w-6 h-6 text-green-400 mt-0.5" />
            <div>
              <h1 className="text-xl font-bold text-green-300">{project.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{project.description}</p>
            </div>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
            STATUS_COLORS[project.status] || 'bg-gray-800 text-gray-400'
          }`}>
            {project.status}
          </span>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <code className="bg-gray-800 px-2 py-1 rounded text-green-400">{project.path}</code>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team */}
        <div className="card">
          <h2 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-3">Team</h2>
          <div className="flex gap-2 flex-wrap">
            {project.team.map((member) => (
              <Link key={member} href="/team/" className="block">
                <span className={`text-xs px-3 py-1.5 rounded font-medium ${
                  TEAM_COLORS[member] || 'bg-gray-800 text-gray-400'
                }`}>
                  {member}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="card">
          <h2 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-3">Tech Stack</h2>
          <div className="flex gap-2 flex-wrap">
            {project.techStack.map((tech) => (
              <span key={tech} className="text-xs px-3 py-1.5 rounded bg-gray-800 text-gray-300">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent commits */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-green-400 uppercase tracking-wider">
            Recent Commits
          </h2>
          <span className="text-xs text-gray-500">{project.commitCount} total</span>
        </div>
        <CommitLog commits={project.recentCommits} />
      </div>
    </div>
  )
}
