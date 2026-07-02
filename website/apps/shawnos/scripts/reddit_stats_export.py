#!/usr/bin/env python3
"""Export the Reddit journey numbers from the local clearbox-reddit.db into
packages/shared/data/reddit-stats.json for the /reddit playbook page.

Reddit's API blocks server IPs, so the site never live-fetches — this script
runs on the Mac Mini (manually or cron) and the committed JSON ships with the
build. DB is the tracker's source of truth for live posts; the 2M+ cumulative
views claim includes pre-tracker history and stays the public line.
"""
import json
import sqlite3
from pathlib import Path

DB = Path.home() / "clearbox-reddit/data/clearbox-reddit.db"
OUT = Path(__file__).resolve().parents[3] / "packages/shared/data/reddit-stats.json"

con = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
con.row_factory = sqlite3.Row

snap = con.execute("SELECT * FROM account_snapshots ORDER BY date DESC LIMIT 1").fetchone()

eras = [
    dict(r)
    for r in con.execute(
        """SELECT era, COUNT(*) AS items, SUM(COALESCE(view_count,0)) AS views,
                  SUM(score) AS score
           FROM items WHERE deleted=0 AND era IS NOT NULL GROUP BY era"""
    )
]

top_subs = [
    dict(r)
    for r in con.execute(
        """SELECT subreddit, COUNT(*) AS items, SUM(COALESCE(view_count,0)) AS views,
                  SUM(score) AS score
           FROM items WHERE deleted=0 AND subreddit IS NOT NULL
           GROUP BY subreddit ORDER BY views DESC LIMIT 10"""
    )
]

top_post = con.execute(
    """SELECT title, subreddit, score, COALESCE(view_count,0) AS views
       FROM items WHERE kind='post' AND deleted=0 ORDER BY score DESC LIMIT 1"""
).fetchone()

wins = con.execute("SELECT COUNT(*) AS c FROM wins").fetchone()["c"]

out = {
    "asOf": snap["date"],
    "totalKarma": snap["link_karma"] + snap["comment_karma"],
    "linkKarma": snap["link_karma"],
    "commentKarma": snap["comment_karma"],
    "totalPosts": snap["total_posts"],
    "totalComments": snap["total_comments"],
    "trackedViews": snap["total_views"],
    "wins": wins,
    "eras": eras,
    "topSubreddits": top_subs,
    "topPost": dict(top_post) if top_post else None,
}

OUT.write_text(json.dumps(out, indent=1) + "\n")
print(f"wrote reddit stats as of {out['asOf']} → {OUT}")
print(f"  karma {out['totalKarma']:,} · tracked views {out['trackedViews']:,} · wins {wins}")
