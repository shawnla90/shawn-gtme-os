import type { Metadata } from 'next'
import path from 'path'
import { getAllPosts, getAllLogs, getRPGProfile, getAvatarUrlsForProfile, resolveDataRoot } from '@shawnos/shared/lib'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { HomeContent } from './HomeContent'

export const metadata: Metadata = {
  title: 'ShawnOS.ai | GTM engineering, built in public',
  description:
    'One monorepo. One operating system. Every skill, post, and campaign runs through the same codebase.',
  alternates: { canonical: 'https://shawnos.ai' },
  openGraph: {
    title: 'ShawnOS.ai | GTM engineering, built in public',
    description:
      'One monorepo. One operating system. Every skill, post, and campaign runs through the same codebase.',
    url: 'https://shawnos.ai',
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
  twitter: {
    title: 'ShawnOS.ai | GTM engineering, built in public',
    description:
      'One monorepo. One operating system. Every skill, post, and campaign runs through the same codebase.',
    images: ['/og'],
  },
}

const DATA_ROOT = resolveDataRoot()
const CONTENT_DIR = path.join(process.cwd(), '../../../content/website/final')
const LOG_DIR = path.join(DATA_ROOT, 'daily-log')

export default function HomePage() {
  const posts = getAllPosts(CONTENT_DIR)
  const latestPosts = posts.slice(0, 3)
  const logs = getAllLogs(LOG_DIR)
  const latestLog = logs.length > 0 ? logs[0] : null

  const profile = getRPGProfile(DATA_ROOT)
  const urls =
    profile && profile.level > 0 ? getAvatarUrlsForProfile(profile) : null

  return (
    <>
      <BreadcrumbSchema items={[]} />
      <HomeContent
        posts={latestPosts}
        latestLog={latestLog}
        profile={profile}
        avatarUrls={urls}
      />
    </>
  )
}
