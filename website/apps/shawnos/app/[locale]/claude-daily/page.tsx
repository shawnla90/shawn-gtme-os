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

export default async function ClaudeDailyPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const allPosts = getAllPosts(getContentDir(locale))
  const dailyPosts = allPosts.filter((p) => p.category === 'claude-daily')

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
      <ClaudeDailyContent posts={dailyPosts} />
    </>
  )
}
