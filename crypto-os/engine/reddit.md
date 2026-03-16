# Reddit Integration

## Sentiment Source
PRAW (Python Reddit API Wrapper) — reads hot posts from crypto subreddits.

## Target Subreddits (Analysis)
- **r/cryptocurrency** — general market sentiment, news
- **r/CryptoTechnology** — technical discussion, less noise
- **r/algotrading** — quantitative approaches, system trading

## Data Collected
- Post titles (topic detection)
- Score (community agreement)
- Comment count (engagement level)
- Upvote ratio (consensus vs controversy)

## Reddit Credentials
Requires `.env`:
```
REDDIT_CLIENT_ID=...
REDDIT_CLIENT_SECRET=...
REDDIT_USER_AGENT=crypto-os-signal/0.1
```
Create at https://www.reddit.com/prefs/apps (script type).

## Engagement Strategy (Build in Public)

### Target Subs for Sharing
- r/cryptocurrency — journey updates, market observations
- r/CryptoTechnology — technical system architecture
- r/algotrading — signal methodology, code snippets
- r/Python — tool showcase
- r/SideProject — build-in-public updates

### Rules
- Authentic engagement first — comment, contribute, learn
- Share learnings AND mistakes — transparency is the brand
- The "cyborg vs autonomous" angle is the unique contribution
- Never shill, never give financial advice
- Link to public repo when sharing code
- Wait for genuine context before sharing — don't force it
