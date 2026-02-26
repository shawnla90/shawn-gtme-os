'use client'

import { PostCard } from '@shawnos/shared/components'
import { StaggerContainer, StaggerItem, ScrollRevealSection } from '../components/motion'
import { PageHero } from '../components/PageHero'

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
    <>
      <PageHero
        compact
        title="Blog"
        subtitle="Posts from the build log."
      />

      <ScrollRevealSection background="var(--canvas)">
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
      </ScrollRevealSection>
    </>
  )
}
