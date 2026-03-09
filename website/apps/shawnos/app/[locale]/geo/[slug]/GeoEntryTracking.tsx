'use client'

import { useContentTracking } from '@shawnos/shared/hooks/useContentTracking'

export function GeoEntryTracking({ slug, title }: { slug: string; title: string }) {
  useContentTracking({
    content_type: 'geo',
    content_slug: slug,
    content_title: title,
    site: 'shawnos',
  })
  return null
}
