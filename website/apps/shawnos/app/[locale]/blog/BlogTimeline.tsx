'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import {
  FeedCard,
  LivePulse,
  StaggerContainer,
  StaggerItem,
} from '@shawnos/shared/components'
import { PillTabs, type PillTabItem } from '@shawnos/shared/components/ui'
import type { TimelineItem, TimelineSource } from '@shawnos/shared/lib'

interface BlogTimelineProps {
  initialItems: TimelineItem[]
  tagline?: string
}

type Filter = 'all' | TimelineSource

const PAGE_SIZE = 20

export function BlogTimeline({
  initialItems,
  tagline = 'Live feed — everything I publish: blog, Substack, Reddit.',
}: BlogTimelineProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const counts = useMemo(() => {
    const c = { all: initialItems.length, blog: 0, substack: 0, reddit: 0 }
    for (const i of initialItems) c[i.source]++
    return c
  }, [initialItems])

  const filtered = useMemo(() => {
    if (filter === 'all') return initialItems
    return initialItems.filter((i) => i.source === filter)
  }, [initialItems, filter])

  const sliced = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

  const tabs: PillTabItem[] = [
    { id: 'all', label: `All · ${counts.all}` },
    { id: 'blog', label: `Blog · ${counts.blog}` },
    { id: 'substack', label: `Substack · ${counts.substack}` },
    { id: 'reddit', label: `Reddit · ${counts.reddit}` },
  ]

  return (
    <div
      style={{
        maxWidth: 680,
        margin: '0 auto',
        padding: '24px 16px 96px',
      }}
    >
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background:
            'color-mix(in srgb, var(--canvas) 92%, transparent)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom:
            '1px solid var(--canvas-border, var(--border, rgba(255,255,255,0.08)))',
          padding: '16px 8px 12px',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 10,
          }}
        >
          <Image
            src="/clearbox/pfp.png"
            alt="Shawn Tenam"
            width={44}
            height={44}
            style={{
              borderRadius: '50%',
              border:
                '1px solid var(--canvas-border, var(--border, rgba(255,255,255,0.10)))',
              objectFit: 'cover',
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 17,
                  color: 'var(--text-primary)',
                }}
              >
                Shawn Tenam
              </span>
              <span
                style={{ color: 'var(--text-muted)', fontSize: 14 }}
              >
                @shawntenam
              </span>
              <LivePulse />
            </div>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: 13,
                color: 'var(--text-muted)',
                lineHeight: 1.4,
              }}
            >
              {tagline}
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <PillTabs
            items={tabs}
            value={filter}
            onChange={(id) => {
              setFilter(id as Filter)
              setVisible(PAGE_SIZE)
            }}
            ariaLabel="Filter feed by source"
          />
        </div>
      </header>

      {sliced.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '64px 20px',
            color: 'var(--text-muted)',
            fontSize: 14,
          }}
        >
          Nothing here yet — check back soon.
        </div>
      ) : (
        <StaggerContainer
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {sliced.map((item) => (
            <StaggerItem key={item.id}>
              <FeedCard item={item} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            style={{
              padding: '10px 22px',
              borderRadius: 999,
              border:
                '1px solid var(--canvas-border, var(--border, rgba(255,255,255,0.12)))',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'border-color 0.15s ease, background 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                'var(--canvas-border, var(--border, rgba(255,255,255,0.12)))'
            }}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  )
}
