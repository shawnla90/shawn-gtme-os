import type { Metadata } from 'next'
import path from 'path'
import fs from 'fs'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getAllPosts } from '@shawnos/shared/lib'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { BlogContent } from './BlogContent'

const CONTENT_BASE = path.join(process.cwd(), '../../../content/website/final')

function getContentDir(locale: string) {
  const localeDir = path.join(CONTENT_BASE, locale)
  if (locale !== 'en' && fs.existsSync(localeDir)) return localeDir
  return CONTENT_BASE
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Blog')
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    alternates: { canonical: 'https://shawnos.ai/blog' },
    openGraph: {
      title: 'Blog | shawnos.ai',
      description: t('metadata.description'),
      url: 'https://shawnos.ai/blog',
      images: [{ url: '/og?title=Blog&subtitle=Posts+from+the+build+log', width: 1200, height: 630 }],
    },
    twitter: {
      title: 'Blog | shawnos.ai',
      description: t('metadata.description'),
      images: ['/og?title=Blog&subtitle=Posts+from+the+build+log'],
    },
  }
}

type Props = {
  params: Promise<{ locale: string }>
}

export default async function BlogIndex({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const posts = getAllPosts(getContentDir(locale))

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Blog', url: 'https://shawnos.ai/blog' }]} />
      <BlogContent posts={posts} />
    </>
  )
}
