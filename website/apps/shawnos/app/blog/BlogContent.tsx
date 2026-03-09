'use client'

import { PostCard, StaggerContainer, StaggerItem, ScrollRevealSection } from '@shawnos/shared/components'
import { PageHero } from '../components/PageHero'

interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  readingTime?: number
  category?: string
  featured?: boolean
}

export function BlogContent({ posts }: { posts: Post[] }) {
  const featuredPosts = posts.filter((p) => p.featured)
  const regularPosts = posts.filter((p) => !p.featured)

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
          <>
            {featuredPosts.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                {featuredPosts.map((post) => (
                  <article
                    key={post.slug}
                    style={{
                      padding: '24px',
                      borderLeft: '3px solid var(--accent)',
                      background: 'var(--surface, rgba(255,255,255,0.03))',
                      marginBottom: '16px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '10px',
                        color: 'var(--accent)',
                        border: '1px solid var(--accent)',
                        borderRadius: '3px',
                        padding: '2px 6px',
                        letterSpacing: '0.6px',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}>
                        featured
                      </span>
                    </div>
                    <a
                      href={`/blog/${post.slug}`}
                      style={{
                        color: 'var(--accent)',
                        fontSize: '22px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        lineHeight: 1.3,
                      }}
                    >
                      {post.title}
                    </a>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginTop: '8px',
                      flexWrap: 'wrap',
                    }}>
                      <time dateTime={post.date} style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {post.date}
                      </time>
                      {post.readingTime !== undefined && (
                        <>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>·</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {post.readingTime} min read
                          </span>
                        </>
                      )}
                      {post.category && (
                        <span style={{
                          fontSize: '11px',
                          color: 'var(--accent)',
                          border: '1px solid var(--accent)',
                          borderRadius: '3px',
                          padding: '1px 6px',
                          letterSpacing: '0.4px',
                          opacity: 0.75,
                        }}>
                          {post.category}
                        </span>
                      )}
                    </div>
                    <p style={{
                      marginTop: '10px',
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}>
                      {post.excerpt}
                    </p>
                    <a
                      href={`/blog/${post.slug}`}
                      style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none' }}
                    >
                      read more &rarr;
                    </a>
                  </article>
                ))}
              </div>
            )}
            <StaggerContainer stagger={0.08}>
              {regularPosts.map((post) => (
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
          </>
        )}
      </ScrollRevealSection>
    </>
  )
}
