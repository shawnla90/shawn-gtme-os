import type { Metadata } from 'next'
import path from 'path'
import { getAllPosts } from '@shawnos/shared/lib'
import { PostCard, BreadcrumbSchema } from '@shawnos/shared/components'

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
    <section
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '40px 20px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <h1
        style={{
          fontSize: '14px',
          color: 'var(--accent)',
          fontWeight: 400,
          marginBottom: 32,
          letterSpacing: '0.5px',
        }}
      >
        $ ls ~/blog
      </h1>

      {posts.length === 0 ? (
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '14px',
          }}
        >
          No posts found. Check back soon.
        </p>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              title={post.title}
              date={post.date}
              excerpt={post.excerpt}
              slug={post.slug}
            />
          ))}
        </div>
      )}
    </section>
    </>
  )
}
