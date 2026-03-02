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
    title: 'RevOps Meets GTM Engineering ft. Shawn Tenam',
    show: 'Outbound Wizards',
    host: 'Saurav Gupta',
    date: '2026-02-18',
    duration: '20 min',
    category: 'podcast',
    description:
      'How a plumber turned GTM engineer builds all-bound motions at RevPartners - champion tracking, web visitor identification, email infrastructure, and Clay enrichment workflows. Covers the intersection of RevOps and GTM engineering and why building in public compounds faster than any outbound sequence.',
    topics: [
      'GTM Engineering',
      'RevOps',
      'Build in Public',
      'SalesRobot',
      'Clay Workflows',
      'Champion Tracking',
      'Email Infrastructure',
    ],
    links: [
      {
        platform: 'Apple Podcasts',
        url: 'https://podcasts.apple.com/us/podcast/revops-meets-gtm-engineering-ft-shawn-tenam/id1837922764?i=1000750238216',
      },
      {
        platform: 'Spotify',
        url: 'https://open.spotify.com/episode/4pmZvuhuiSHyBDIsPxtCmy',
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
