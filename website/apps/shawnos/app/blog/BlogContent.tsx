'use client'

import { PostCard } from '@shawnos/shared/components'
import { MotionReveal, StaggerContainer, StaggerItem } from '../components/motion'

interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  readingTime?: number
  category?: string
}

export function BlogContent({ posts }: { posts: Post[] }) {
  return (
    <section
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '40px 20px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <MotionReveal variant="fadeIn">
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
      </MotionReveal>

      {posts.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          No posts found. Check back soon.
        </p>
      ) : (
        <StaggerContainer stagger={0.08}>
          {posts.map((post) => (
            <StaggerItem key={post.slug}>
              <PostCard
                title={post.title}
                date={post.date}
                excerpt={post.excerpt}
                slug={post.slug}
                readingTime={post.readingTime}
                category={post.category}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </section>
  )
}
