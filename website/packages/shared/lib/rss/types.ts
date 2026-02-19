export type SiteKey = 'shawnos' | 'gtmos' | 'contentos'

export interface FeedAuthor {
  name: string
  email?: string
  link?: string
}

export interface FeedConfig {
  title: string
  description: string
  id: string
  link: string
  language?: string
  copyright?: string
  feedLinks?: Record<string, string>
  author?: FeedAuthor
}

export interface FeedItem {
  title: string
  id: string
  link: string
  description: string
  content?: string
  date: Date
  category?: string[]
  author?: FeedAuthor
}
