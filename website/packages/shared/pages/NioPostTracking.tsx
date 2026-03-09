'use client'

import { useContentTracking } from '../hooks/useContentTracking'

export function NioPostTracking({ slug, title }: { slug: string; title: string }) {
  useContentTracking({ content_type: 'nio-terminal', content_slug: slug, content_title: title, site: 'shawnos' })
  return null
}
