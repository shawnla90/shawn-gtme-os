import Link from 'next/link'
import { FolderKanban, GitCommit } from 'lucide-react'

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

interface ProjectCardProps {
  project: {
    slug: string
    name: string
    description: string
    techStack: string[]
    team: string[]
    status: string
    commitCount: number
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}/`} className="block group">
      <div className="card hover:bg-gray-800 transition-colors h-full">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-green-400 shrink-0" />
            <h3 className="text-sm font-bold text-green-300">{project.name}</h3>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded font-medium shrink-0 ${
            STATUS_COLORS[project.status] || 'bg-gray-800 text-gray-400'
          }`}>
            {project.status}
          </span>
        </div>

        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{project.description}</p>

        {/* Team */}
        <div className="flex gap-1 mb-3 flex-wrap">
          {project.team.map((member) => (
            <span key={member} className={`text-[10px] px-1.5 py-0.5 rounded ${
              TEAM_COLORS[member] || 'bg-gray-800 text-gray-400'
            }`}>
              {member}
            </span>
          ))}
        </div>

        {/* Tech stack */}
        <div className="flex gap-1 flex-wrap mb-3">
          {project.techStack.map((tech) => (
            <span key={tech} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
              {tech}
            </span>
          ))}
        </div>

        {/* Commit count */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <GitCommit className="w-3 h-3" />
          <span>{project.commitCount} commits</span>
        </div>
      </div>
    </Link>
  )
}
