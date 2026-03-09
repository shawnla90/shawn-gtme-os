'use client'

import { useContentTracking } from '@shawnos/shared/hooks/useContentTracking'

export function BlogTracking({ slug, title }: { slug: string; title: string }) {
  useContentTracking({ content_type: 'blog', content_slug: slug, content_title: title, site: 'shawnos' })
  return null
}
