export type MediaCategory = 'podcast' | 'interview' | 'panel' | 'speaking' | 'article'

export interface MediaLink {
  platform: string
  url: string
}

export interface MediaAppearance {
  id: string
  title: string
  show: string
  host: string
  date: string
  duration: string
  category: MediaCategory
  description: string
  topics: string[]
  links: MediaLink[]
  featured: boolean
}

export const MEDIA_APPEARANCES: MediaAppearance[] = [
  {
    id: 'outbound-wizards-ep82',
    title: 'Building AI-Native GTM Systems from Scratch',
    show: 'Outbound Wizards',
    host: 'Saurav Gupta',
    date: '2026-02-18',
    duration: '45 min',
    category: 'podcast',
    description:
      'How a plumber turned GTM engineer builds AI-native pipelines, agent-driven workflows, and a three-site content network - all from a single monorepo. Covers the SalesRobot stack, Clay enrichment workflows, and why building in public compounds faster than any outbound sequence.',
    topics: [
      'GTM Engineering',
      'AI Agents',
      'Build in Public',
      'SalesRobot',
      'Clay Workflows',
      'Monorepo Architecture',
      'Content-as-Code',
    ],
    links: [
      {
        platform: 'Apple Podcasts',
        url: 'https://podcasts.apple.com/us/podcast/outbound-wizards-by-salesrobot/id1740Part0327?i=1000697326429',
      },
      {
        platform: 'Spotify',
        url: 'https://open.spotify.com/episode/4yPXREp3qqKfhBwmZhG8oZ',
      },
    ],
    featured: true,
  },
]

export function getFeaturedAppearance(): MediaAppearance | undefined {
  return MEDIA_APPEARANCES.find((a) => a.featured)
}

export function getAppearancesByCategory(category: MediaCategory): MediaAppearance[] {
  return MEDIA_APPEARANCES.filter((a) => a.category === category)
}
