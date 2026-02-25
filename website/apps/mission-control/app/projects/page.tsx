'use client'

import { useState, useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'

interface ProjectData {
  slug: string
  name: string
  description: string
  techStack: string[]
  team: string[]
  status: string
  commitCount: number
  recentCommits: { hash: string; message: string; date: string; author: string }[]
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects/')
      .then((r) => r.json())
      .then((data) => {
        setProjects(data.projects)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading projects...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-green-300 mb-1">PROJECTS</h1>
        <p className="text-sm text-gray-500">{projects.length} active projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}
