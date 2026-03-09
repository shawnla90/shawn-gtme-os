import type { Metadata } from 'next'
import path from 'path'
import { getAllPosts } from '@shawnos/shared/lib'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { BlogContent } from './BlogContent'

const CONTENT_DIR = path.join(process.cwd(), '../../../content/website/final')

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Posts from the shawnos.ai build log. GTM engineering, built in public.',
  alternates: { canonical: 'https://shawnos.ai/blog' },
  openGraph: {
    title: 'Blog | shawnos.ai',
    description: 'Posts from the shawnos.ai build log. GTM engineering, built in public.',
    url: 'https://shawnos.ai/blog',
    images: [{ url: '/og?title=Blog&subtitle=Posts+from+the+build+log', width: 1200, height: 630 }],
  },
  twitter: {
    title: 'Blog | shawnos.ai',
    description: 'Posts from the shawnos.ai build log. GTM engineering, built in public.',
    images: ['/og?title=Blog&subtitle=Posts+from+the+build+log'],
  },
}

export default function BlogIndex() {
  const posts = getAllPosts(CONTENT_DIR)

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Blog', url: 'https://shawnos.ai/blog' }]} />
      <BlogContent posts={posts} />
    </>
  )
}
