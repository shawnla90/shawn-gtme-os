#!/usr/bin/env python3
"""
substack_rss_pull.py — Pull Shawn's Substack RSS into a JSON cache.

Reads https://shawntenam.substack.com/feed (RSS 2.0), parses items, writes a
JSON cache consumed by the blog timeline at /blog (TimelineItem source =
"substack"). Idempotent — overwrites cache on every run.

Output: <repo_root>/data/substack/feed.json
  {
    "fetchedAt": "2026-05-19T07:00:00.000Z",
    "items": [
      { "guid": "...", "title": "...", "excerpt": "...", "url": "...", "pubDate": "ISO8601" }
    ]
  }

Schedule: launchd plist com.shawn.substack-rss-pull every 4h.

Failure mode: writes nothing on network/parse error so the blog timeline
gracefully degrades to blog + reddit only (readJsonSafe in timeline.ts).
"""

from __future__ import annotations

import json
import re
import sys
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = REPO_ROOT / "data" / "substack"
OUT_PATH = OUT_DIR / "feed.json"
LOG_DIR = Path.home() / "logs"

FEED_URL = "https://shawntenam.substack.com/feed"
USER_AGENT = "shawnos-blog-feed/1.0 (+https://shawnos.ai)"
REQUEST_TIMEOUT = 30
MAX_ITEMS = 50
EXCERPT_LEN = 220

NAMESPACES = {
    "content": "http://purl.org/rss/1.0/modules/content/",
    "dc": "http://purl.org/dc/elements/1.1/",
}


def log(msg: str) -> None:
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    print(f"[substack-rss-pull {ts}] {msg}", file=sys.stderr)


def strip_html(html: str) -> str:
    text = re.sub(r"<[^>]+>", " ", html or "")
    text = re.sub(r"&nbsp;", " ", text)
    text = re.sub(r"&amp;", "&", text)
    text = re.sub(r"&quot;", '"', text)
    text = re.sub(r"&#39;", "'", text)
    text = re.sub(r"&lt;", "<", text)
    text = re.sub(r"&gt;", ">", text)
    return re.sub(r"\s+", " ", text).strip()


def make_excerpt(html_or_text: str) -> str:
    text = strip_html(html_or_text)
    if len(text) <= EXCERPT_LEN:
        return text
    return text[:EXCERPT_LEN].rsplit(" ", 1)[0] + "…"


def parse_pubdate(raw: str | None) -> str:
    if not raw:
        return datetime.now(timezone.utc).isoformat()
    try:
        dt = parsedate_to_datetime(raw)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc).isoformat()
    except Exception:
        return datetime.now(timezone.utc).isoformat()


def fetch_feed() -> str:
    req = urllib.request.Request(FEED_URL, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
        return resp.read().decode("utf-8", errors="replace")


def parse_items(xml_text: str) -> list[dict]:
    root = ET.fromstring(xml_text)
    channel = root.find("channel")
    if channel is None:
        return []

    items: list[dict] = []
    for el in channel.findall("item"):
        title = (el.findtext("title") or "").strip()
        link = (el.findtext("link") or "").strip()
        guid = (el.findtext("guid") or link or title).strip()
        pub_date = parse_pubdate(el.findtext("pubDate"))
        description = el.findtext("description") or ""
        content_encoded_el = el.find("content:encoded", NAMESPACES)
        content = content_encoded_el.text if content_encoded_el is not None else ""
        body = content or description
        excerpt = make_excerpt(body)
        if not (title and link):
            continue
        items.append({
            "guid": guid,
            "title": title,
            "excerpt": excerpt,
            "url": link,
            "pubDate": pub_date,
        })
    items.sort(key=lambda i: i["pubDate"], reverse=True)
    return items[:MAX_ITEMS]


def write_cache(items: list[dict]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    payload = {
        "fetchedAt": datetime.now(timezone.utc).isoformat(),
        "items": items,
    }
    tmp = OUT_PATH.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    tmp.replace(OUT_PATH)


def main() -> int:
    try:
        xml_text = fetch_feed()
    except urllib.error.URLError as e:
        log(f"fetch failed: {e}")
        return 2
    try:
        items = parse_items(xml_text)
    except ET.ParseError as e:
        log(f"parse failed: {e}")
        return 3
    write_cache(items)
    log(f"wrote {len(items)} items → {OUT_PATH}")
    return 0


if __name__ == "__main__":
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    sys.exit(main())
