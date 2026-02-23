# RSS Feed Strategy

## Purpose

RSS is the developer distribution channel. Syndicate Nio content to aggregators, dev platforms, and readers who don't do social media.

---

## Feeds

### 1. Blog Feed: niobot.ai/rss/blog
- **Source**: nio.terminal daily posts
- **Format**: RSS 2.0 + Atom
- **Frequency**: Daily (matches blog cadence)
- **Content**: Full post text + featured image
- **Items**: Last 50 posts

### 2. Changelog Feed: niobot.ai/rss/changelog
- **Source**: V3 feature ships, updates, fixes
- **Format**: RSS 2.0
- **Frequency**: As shipped (2-5x/week during active dev)
- **Content**: Feature name, description, version
- **Items**: Last 30 entries

### 3. Evolution Feed: niobot.ai/rss/evolution
- **Source**: Level-ups, tier changes, milestone unlocks
- **Format**: RSS 2.0
- **Frequency**: As they happen
- **Content**: Level, tier, milestone, avatar image
- **Items**: Last 20 entries

---

## Syndication Targets

### Dev Platforms
- **Dev.to**: Cross-post blog feed (built-in RSS import)
- **Hashnode**: Cross-post blog feed
- **Medium**: Manual cross-post (top performing posts only)

### Aggregators
- **Feedly**: Submit feed for indexing
- **Inoreader**: Submit feed
- **daily.dev**: Submit blog for developer feed

### Community Submissions (Manual)
- **Hacker News**: Submit standout posts (1-2x/month)
- **Reddit**: r/SideProject, r/webdev, r/artificial (1-2x/month)
- **Lobsters**: Technical deep-dives only
- **IndieHackers**: Build-in-public updates

---

## Implementation

### Next.js RSS Generation

Add to niobot.ai Next.js app:

```
app/
├── rss/
│   ├── blog/route.ts      ← Generate blog RSS
│   ├── changelog/route.ts ← Generate changelog RSS
│   └── evolution/route.ts ← Generate evolution RSS
```

Each route returns XML with proper Content-Type header.
Source data from:
- Blog: Read from nio-blog markdown files or SQLite
- Changelog: Read from git commits or manual changelog.json
- Evolution: Read from progression profile.json

### Auto-Discovery

Add to niobot.ai `<head>`:
```html
<link rel="alternate" type="application/rss+xml" title="NioBot Blog" href="/rss/blog" />
<link rel="alternate" type="application/rss+xml" title="NioBot Changelog" href="/rss/changelog" />
```

---

## Metrics

| Metric | Target |
|--------|--------|
| RSS subscribers (all feeds) | 100 in 3 months |
| Dev.to followers | 50 in 3 months |
| Hacker News front page | 1x in 3 months |
| Reddit post with 50+ upvotes | 2x in 3 months |
