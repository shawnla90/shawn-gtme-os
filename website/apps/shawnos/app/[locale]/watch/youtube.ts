// YouTube uploads for /watch — primary source is the committed Data API pull
// (scripts/youtube_pull.py via OAuth → shared/data/youtube-videos.json: full
// catalog, real view counts, durations). The public RSS feed stays as the
// zero-key fallback (latest ~15 only). Returns [] only if both fail.

import catalog from '@shawnos/shared/data/youtube-videos.json'

export const YT_CHANNEL_ID = 'UCChgkZxMdGkiyzT56ccxpIA'
export const YT_HANDLE_URL = 'https://www.youtube.com/@ShawnOsAI'

export interface YouTubeVideo {
  id: string
  title: string
  published: string
  views?: number
  durationSeconds?: number
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

export async function getYouTubeUploads(): Promise<YouTubeVideo[]> {
  // committed API pull first — full catalog with real stats
  if (catalog?.videos?.length) {
    return catalog.videos.map((v) => ({
      id: v.id,
      title: v.title,
      published: v.published,
      views: v.views,
      durationSeconds: v.durationSeconds,
    }))
  }
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return []
    const xml = await res.text()
    const entries = xml.split('<entry>').slice(1)
    return entries
      .map((e): YouTubeVideo => {
        const id = e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? ''
        const rawTitle =
          e.match(/<media:title>([^<]+)<\/media:title>/)?.[1] ??
          e.match(/<title>([^<]+)<\/title>/)?.[1] ??
          ''
        const published = e.match(/<published>([^<]+)<\/published>/)?.[1] ?? ''
        const views = e.match(/views="(\d+)"/)?.[1]
        return {
          id,
          title: decodeEntities(rawTitle).trim(),
          published,
          views: views ? parseInt(views, 10) : undefined,
        }
      })
      .filter((v) => v.id)
  } catch {
    return []
  }
}
