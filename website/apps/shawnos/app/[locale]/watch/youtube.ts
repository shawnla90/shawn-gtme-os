// YouTube uploads for /watch — pulled from the public channel RSS feed, ISR-cached hourly.
// No API key required. Returns [] on any failure so the page degrades gracefully.

export const YT_CHANNEL_ID = 'UCChgkZxMdGkiyzT56ccxpIA'
export const YT_HANDLE_URL = 'https://www.youtube.com/@ShawnOsAI'

export interface YouTubeVideo {
  id: string
  title: string
  published: string
  views?: number
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
