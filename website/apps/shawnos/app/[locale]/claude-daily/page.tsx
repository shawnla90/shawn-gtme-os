import type { Metadata } from 'next'
import path from 'path'
import fs from 'fs'
import { setRequestLocale } from 'next-intl/server'
import { getAllPosts } from '@shawnos/shared/lib'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../../i18n/hreflang'
import { ClaudeDailyContent } from './ClaudeDailyContent'

const CONTENT_BASE = path.join(process.cwd(), '../../../content/website/final')

function getContentDir(locale: string) {
  const localeDir = path.join(CONTENT_BASE, locale)
  if (locale !== 'en' && fs.existsSync(localeDir)) return localeDir
  return CONTENT_BASE
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Claude Code Daily | shawnos.ai',
    description:
      'The daily show for Claude Code builders. News, repos, roasts, and the Reddit comments you missed. Updated every day from r/ClaudeCode.',
    alternates: {
      canonical: 'https://shawnos.ai/claude-daily',
      languages: hreflang('/claude-daily'),
    },
    openGraph: {
      title: 'Claude Code Daily | shawnos.ai',
      description:
        'The daily show for Claude Code builders. News, repos, roasts, and the Reddit comments you missed.',
      url: 'https://shawnos.ai/claude-daily',
      images: [
        {
          url: '/og?title=Claude+Code+Daily&subtitle=ecosystem+digest',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title: 'Claude Code Daily | shawnos.ai',
      description:
        'The daily show for Claude Code builders. News, repos, roasts, and the Reddit comments you missed.',
      images: ['/og?title=Claude+Code+Daily&subtitle=ecosystem+digest'],
    },
  }
}

type Props = {
  params: Promise<{ locale: string }>
}

function extractHighlights(content: string) {
  const sections: Record<string, string> = {}
  const lines = content.split('\n')
  let currentSection = ''
  let currentBody: string[] = []

  for (const line of lines) {
    const match = line.match(/^## (.+)$/)
    if (match) {
      if (currentSection && currentBody.length) {
        sections[currentSection] = currentBody.join('\n').trim()
      }
      currentSection = match[1].trim()
      currentBody = []
    } else if (currentSection) {
      currentBody.push(line)
    }
  }
  if (currentSection && currentBody.length) {
    sections[currentSection] = currentBody.join('\n').trim()
  }

  // Extract blockquote from a section (for best comment / troll)
  function getBlockquote(text: string | undefined): string | null {
    if (!text) return null
    const bqLines: string[] = []
    let inQuote = false
    for (const l of text.split('\n')) {
      if (l.startsWith('> ')) {
        inQuote = true
        bqLines.push(l.replace(/^> ?/, ''))
      } else if (inQuote && l.trim() === '') {
        break
      } else if (inQuote) {
        break
      }
    }
    return bqLines.length ? bqLines.join(' ').trim() : null
  }

  // Extract fun facts as array of bullet points
  function getFunFacts(text: string | undefined): string[] {
    if (!text) return []
    return text
      .split('\n')
      .filter((l) => l.startsWith('- **'))
      .map((l) => l.replace(/^- /, '').trim())
      .slice(0, 3)
  }

  return {
    bestComment: getBlockquote(sections['best comment award']),
    trollOfTheDay: getBlockquote(sections['troll of the day']),
    funFacts: getFunFacts(sections['fun facts']),
    pulse: (sections['the pulse'] || '').split('\n')[0]?.trim() || null,
  }
}

export default async function ClaudeDailyPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const allPosts = getAllPosts(getContentDir(locale))
  const dailyPosts = allPosts.filter((p) => p.category === 'claude-daily')

  // Extract highlights from the latest post
  const sortedPosts = [...dailyPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const latestContent = sortedPosts[0]?.content || ''
  const highlights = extractHighlights(latestContent)

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Claude Code Daily',
    url: 'https://shawnos.ai/claude-daily',
    description:
      'The daily show for Claude Code builders. News, repos, roasts, and the Reddit comments you missed.',
    author: { '@type': 'Person', name: 'Shawn Tenam', url: 'https://shawnos.ai' },
    numberOfItems: dailyPosts.length,
  }

  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'Claude Code Daily', url: 'https://shawnos.ai/claude-daily' }]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <ClaudeDailyContent posts={dailyPosts} highlights={highlights} />
    </>
  )
}
