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
    if (!res.ok) return []
    const json: RedditApiResponse = await res.json()
    return json.data.children.map(mapPost)
  } catch {
    return []
  }
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
