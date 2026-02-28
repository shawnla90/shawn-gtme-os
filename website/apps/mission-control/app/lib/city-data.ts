import type { ProjectData, BuildingType, ProjectStatus } from '@hypernovum/core'
import { PROJECTS } from './projects'

/**
 * Assemble ProjectData[] from all Mission Control data sources.
 * Each source maps to a building type with appropriate status/height drivers.
 */
export function getCityData(metrics: {
  xp: number
  messages: number
  contentCount: number
  accounts: number
  deals: number
  pipelineValue: number
}): ProjectData[] {
  const buildings: ProjectData[] = []

  // ── Projects → Helix Towers ──────────────────────────────────
  for (const project of PROJECTS) {
    buildings.push({
      id: `project-${project.slug}`,
      name: project.name,
      type: 'helix-tower',
      status: mapProjectStatus(project.status),
      heightFactor: project.status === 'active' ? 0.8 : 0.4,
      href: '/projects/',
      meta: {
        stack: project.techStack.join(', '),
        team: project.team.join(', '),
        path: project.path,
      },
    })
  }

  // ── Content Platforms → Data Shards ──────────────────────────
  const platforms = ['linkedin', 'x', 'substack', 'tiktok', 'reddit', 'website']
  const platformShare = metrics.contentCount > 0 ? 1 / platforms.length : 0

  for (const platform of platforms) {
    buildings.push({
      id: `content-${platform}`,
      name: platformDisplayName(platform),
      type: 'data-shard',
      status: metrics.contentCount > 0 ? 'active' : 'draft',
      heightFactor: Math.min(platformShare * 3, 1),
      href: '/content/',
      meta: {
        platform,
        totalContent: metrics.contentCount,
      },
    })
  }

  // ── CRM Pipeline → Quant Blades ─────────────────────────────
  if (metrics.accounts > 0 || metrics.deals > 0) {
    const stages = ['prospecting', 'qualified', 'proposal', 'negotiation']
    for (let i = 0; i < stages.length; i++) {
      buildings.push({
        id: `crm-${stages[i]}`,
        name: `CRM: ${stages[i].charAt(0).toUpperCase() + stages[i].slice(1)}`,
        type: 'quant-blade',
        status: i < 2 ? 'active' : 'planned',
        heightFactor: metrics.pipelineValue > 0
          ? Math.min((metrics.pipelineValue / 100000) * (4 - i) / 4, 1)
          : 0.3,
        href: '/crm/',
        meta: {
          stage: stages[i],
          accounts: metrics.accounts,
          deals: metrics.deals,
          pipelineValue: metrics.pipelineValue,
        },
      })
    }
  }

  // ── Landing Pages → Hex Hives ───────────────────────────────
  buildings.push({
    id: 'landing-pages',
    name: 'ABM Landing Pages',
    type: 'hex-hive',
    status: 'active',
    heightFactor: 0.6,
    href: '/crm/',
    meta: {
      description: 'Personalized landing pages with TTL',
    },
  })

  // ── Progression/XP → Memory Core ────────────────────────────
  buildings.push({
    id: 'progression-xp',
    name: 'Progression System',
    type: 'memory-core',
    status: 'active',
    heightFactor: Math.min(metrics.xp / 5000, 1),
    href: '/progression/',
    meta: {
      xp: metrics.xp,
      messages: metrics.messages,
    },
  })

  return buildings
}

function mapProjectStatus(status: string): ProjectStatus {
  switch (status) {
    case 'active': return 'active'
    case 'maintenance': return 'maintenance'
    case 'planned': return 'planned'
    default: return 'active'
  }
}

function platformDisplayName(platform: string): string {
  const names: Record<string, string> = {
    linkedin: 'LinkedIn',
    x: 'X / Twitter',
    substack: 'Substack',
    tiktok: 'TikTok',
    reddit: 'Reddit',
    website: 'Blog / Website',
  }
  return names[platform] ?? platform
}
