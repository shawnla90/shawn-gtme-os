#!/bin/bash
# sync_reddit.sh — Fetch Reddit data and update cache for Vercel deployment
# Reddit blocks cloud provider IPs, so we fetch from Mac Mini and commit the cache.
# Runs hourly via launchd.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CACHE_FILE="$REPO_ROOT/website/packages/shared/data/reddit-cache.json"
LOGFILE="$REPO_ROOT/data/daily-log/sync-reddit.log"
TMP_DIR="$REPO_ROOT/data/daily-log/.reddit-tmp"
SUBREDDIT="GTMBuilders"
USERNAME="Shawntenam"
UA="GTMeOS/1.0 (+https://thegtmos.ai)"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOGFILE"
}

mkdir -p "$(dirname "$LOGFILE")" "$TMP_DIR"
log "Starting Reddit sync"

# Fetch data to temp files (avoids bash variable quoting issues with JSON)
curl -sf -H "User-Agent: $UA" \
  "https://www.reddit.com/r/${SUBREDDIT}/new.json?limit=50" \
  > "$TMP_DIR/posts.json" 2>/dev/null || true

curl -sf -H "User-Agent: $UA" \
  "https://www.reddit.com/r/${SUBREDDIT}/about.json" \
  > "$TMP_DIR/sub.json" 2>/dev/null || true

curl -sf -H "User-Agent: $UA" \
  "https://www.reddit.com/user/${USERNAME}/about.json" \
  > "$TMP_DIR/user.json" 2>/dev/null || true

# Check we got posts
if [ ! -s "$TMP_DIR/posts.json" ]; then
  log "ERROR: Failed to fetch posts from Reddit API"
  rm -rf "$TMP_DIR"
  exit 1
fi

# Build cache JSON from temp files
/opt/homebrew/bin/python3 - "$TMP_DIR" "$CACHE_FILE" "$SUBREDDIT" "$USERNAME" << 'PYEOF'
import json, sys, os
from datetime import datetime, timezone

tmp_dir, cache_file, subreddit, username = sys.argv[1:5]

# Read fetched data
with open(os.path.join(tmp_dir, "posts.json")) as f:
    posts_raw = json.load(f)

try:
    with open(os.path.join(tmp_dir, "sub.json")) as f:
        sub_raw = json.load(f)
except Exception:
    sub_raw = {}

try:
    with open(os.path.join(tmp_dir, "user.json")) as f:
        user_raw = json.load(f)
except Exception:
    user_raw = {}

# Map posts
posts = []
for c in posts_raw.get("data", {}).get("children", []):
    d = c["data"]
    thumb = d.get("thumbnail", "")
    if thumb in ("self", "default", ""):
        thumb = None
    preview_url = None
    try:
        preview_url = d["preview"]["images"][0]["source"]["url"].replace("&amp;", "&")
    except (KeyError, IndexError, TypeError):
        pass
    posts.append({
        "id": d["id"],
        "title": d["title"],
        "author": d["author"],
        "score": d["score"],
        "numComments": d["num_comments"],
        "permalink": d["permalink"],
        "selftext": d["selftext"],
        "createdUtc": d["created_utc"],
        "flair": d.get("link_flair_text"),
        "thumbnail": thumb,
        "url": d.get("url"),
        "isSelf": d.get("is_self", True),
        "stickied": d.get("stickied", False),
        "preview": preview_url,
    })

# Subreddit info
sub_data = sub_raw.get("data", {})
sub_info = {
    "name": sub_data.get("display_name", subreddit),
    "subscribers": sub_data.get("subscribers", 0),
    "description": sub_data.get("public_description", ""),
}

# User profile
user_data = user_raw.get("data", {})
user_profile = {
    "name": user_data.get("name", username),
    "totalKarma": user_data.get("total_karma", 0),
    "linkKarma": user_data.get("link_karma", 0),
    "commentKarma": user_data.get("comment_karma", 0),
}

cache = {
    "lastUpdated": datetime.now(timezone.utc).isoformat(),
    "posts": posts,
    "subredditInfo": sub_info,
    "userProfile": user_profile,
}

with open(cache_file, "w") as f:
    json.dump(cache, f, indent=2)
    f.write("\n")

print(f"Cached {len(posts)} posts")
PYEOF

# Clean up temp files
rm -rf "$TMP_DIR"

POST_COUNT=$(/opt/homebrew/bin/python3 -c "import json; print(len(json.load(open('$CACHE_FILE'))['posts']))")
log "Cached $POST_COUNT posts"

# Check if anything actually changed (ignore lastUpdated timestamp)
cd "$REPO_ROOT"
if git diff "$CACHE_FILE" 2>/dev/null | grep '^[+-]' | grep -v '^[+-][+-][+-]' | grep -v '"lastUpdated"' | grep -q .; then
  : # real data changed — proceed to commit
else
  log "No changes to Reddit data — skipping commit"
  exit 0
fi

# Commit and push
git add "$CACHE_FILE"
git commit -m "chore: sync Reddit cache — ${POST_COUNT} posts ($(date '+%Y-%m-%d %H:%M'))"
if git push origin HEAD >> "$LOGFILE" 2>&1; then
  log "Push successful — Vercel will auto-deploy with fresh Reddit data"
else
  log "Push failed — retrying after pull --rebase"
  git pull --rebase origin main
  git push origin HEAD
fi

log "Reddit sync complete"
