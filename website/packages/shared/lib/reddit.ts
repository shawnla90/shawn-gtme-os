import cachedData from '../data/reddit-cache.json'

export interface RedditPost {
  id: string
  title: string
  author: string
  score: number
  numComments: number
  permalink: string
  selftext: string
  createdUtc: number
  flair?: string
}

interface RedditApiChild {
  data: {
    id: string
    title: string
    author: string
    score: number
    num_comments: number
    permalink: string
    selftext: string
    created_utc: number
    link_flair_text?: string
    stickied?: boolean
  }
}

interface RedditApiResponse {
  data: {
    children: RedditApiChild[]
    dist: number
  }
}

function mapPost(child: RedditApiChild): RedditPost {
  const d = child.data
  return {
    id: d.id,
    title: d.title,
    author: d.author,
    score: d.score,
    numComments: d.num_comments,
    permalink: d.permalink,
    selftext: d.selftext,
    createdUtc: d.created_utc,
    flair: d.link_flair_text ?? undefined,
  }
}

export async function fetchSubredditPosts(
  subreddit: string,
  limit = 25,
): Promise<RedditPost[]> {
  try {
    const res = await fetch(
      `https://www.reddit.com/r/${subreddit}/new.json?limit=${limit}`,
      {
        headers: { 'User-Agent': 'GTMeOS/1.0 (+https://thegtmos.ai)' },
        next: { revalidate: 3600 },
      },
    )
    if (!res.ok) throw new Error(`Reddit API ${res.status}`)
    const json: RedditApiResponse = await res.json()
    const posts = json.data.children.map(mapPost)
    if (posts.length > 0) return posts
  } catch {
    // Reddit blocks cloud provider IPs — fall back to cached data
  }
  return cachedData.posts.map((p) => ({
    ...p,
    flair: p.flair ?? undefined,
  })).slice(0, limit)
}

export async function fetchAuthorPosts(
  subreddit: string,
  author: string,
  limit = 50,
): Promise<RedditPost[]> {
  const posts = await fetchSubredditPosts(subreddit, limit)
  return posts.filter(
    (p) => p.author.toLowerCase() === author.toLowerCase(),
  )
}

export interface SubredditInfo {
  name: string
  subscribers: number
  description: string
}

export async function fetchSubredditInfo(
  subreddit: string,
): Promise<SubredditInfo | null> {
  try {
    const res = await fetch(
      `https://www.reddit.com/r/${subreddit}/about.json`,
      {
        headers: { 'User-Agent': 'GTMeOS/1.0 (+https://thegtmos.ai)' },
        next: { revalidate: 3600 },
      },
    )
    if (!res.ok) throw new Error(`Reddit API ${res.status}`)
    const json = await res.json()
    const d = json.data
    return {
      name: d.display_name,
      subscribers: d.subscribers ?? 0,
      description: d.public_description ?? '',
    }
  } catch {
    // Fall back to cached subreddit info
    return cachedData.subredditInfo as SubredditInfo
  }
}

export interface RedditUserProfile {
  name: string
  totalKarma: number
  linkKarma: number
  commentKarma: number
}

export async function fetchUserProfile(
  username: string,
): Promise<RedditUserProfile | null> {
  try {
    const res = await fetch(
      `https://www.reddit.com/user/${username}/about.json`,
      {
        headers: { 'User-Agent': 'GTMeOS/1.0 (+https://thegtmos.ai)' },
        next: { revalidate: 3600 },
      },
    )
    if (!res.ok) throw new Error(`Reddit API ${res.status}`)
    const json = await res.json()
    const d = json.data
    return {
      name: d.name,
      totalKarma: d.total_karma ?? 0,
      linkKarma: d.link_karma ?? 0,
      commentKarma: d.comment_karma ?? 0,
    }
  } catch {
    // Fall back to cached user profile
    return cachedData.userProfile as RedditUserProfile
  }
}
