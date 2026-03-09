export interface Announcement {
  id: string
  text: string
  link?: string
  date: string
  active: boolean
  priority: number
}

export const announcements: Announcement[] = [
  {
    id: 'i18n-launch',
    text: 'Web dev services now in 3 languages',
    link: '/services/web-development',
    date: '2026-03-08',
    active: true,
    priority: 1,
  },
  {
    id: 'services-overhaul',
    text: 'Services page redesigned with live benchmarks',
    link: '/services/web-development',
    date: '2026-03-07',
    active: true,
    priority: 2,
  },
  {
    id: 'blog-autoresearch',
    text: 'New post: Karpathy autoresearch breakdown',
    link: '/blog',
    date: '2026-03-05',
    active: true,
    priority: 3,
  },
]
