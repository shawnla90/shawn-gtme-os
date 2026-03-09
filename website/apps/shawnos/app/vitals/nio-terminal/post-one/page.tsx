import type { Metadata } from 'next'
import { NioPostPage } from '@shawnos/shared/pages/NioPostPage'
import { BreadcrumbSchema } from '@shawnos/shared/components'

export const metadata: Metadata = {
  title: 'post-one: blade tier achieved - nio.terminal',
  description: 'Historic moment: Nio levels up from Spark to Blade tier at exactly 30,000 lines of code. First-ever real-time AI progression system.',
  keywords: [
    'AI level up',
    'blade tier',
    '30k lines code',
    'nio progression',
    'AI development milestone',
    'build in public AI',
    'real-time progression',
    'ai development log',
    'mission control dashboard',
    'meta recursion AI',
  ],
  alternates: { canonical: 'https://shawnos.ai/vitals/nio-terminal/post-one' },
  openGraph: {
    title: 'post-one: blade tier achieved | nio.terminal',
    description: 'Historic moment: Nio levels up from Spark to Blade tier at exactly 30,000 lines of code.',
    url: 'https://shawnos.ai/vitals/nio-terminal/post-one',
    images: [
      {
        url: '/og?title=post-one%3A+blade+tier+achieved&subtitle=nio.terminal',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'post-one: blade tier achieved | nio.terminal',
    description: 'Historic AI level-up moment captured live.',
    images: ['/og?title=post-one%3A+blade+tier+achieved&subtitle=nio.terminal'],
  },
}

export default function PostOneRoute() {
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Vitals', url: 'https://shawnos.ai/vitals' },
          { name: 'nio.terminal', url: 'https://shawnos.ai/vitals/nio-terminal' },
          { name: 'post-one', url: 'https://shawnos.ai/vitals/nio-terminal/post-one' }
        ]} 
      />
      <NioPostPage slug="post-one" />
    </>
  )
}