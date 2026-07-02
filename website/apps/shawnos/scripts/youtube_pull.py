#!/usr/bin/env python3
"""Pull the ShawnOsAI channel's uploads (title, views, duration) into
packages/shared/data/youtube-videos.json for /watch.

Reuses the same OAuth token the Ep1 uploader minted (~/.config/youtube/token.json,
gspread client, project 524690866782). Run manually or from a Mac Mini cron —
Railway builds just read the committed JSON; /watch falls back to RSS if absent.
"""
import json
import re
import sys
from pathlib import Path

from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.force-ssl",
]
YT_TOKEN = Path.home() / ".config/youtube/token.json"
OUT = Path(__file__).resolve().parents[3] / "packages/shared/data/youtube-videos.json"
CHANNEL_ID = "UCChgkZxMdGkiyzT56ccxpIA"


def creds() -> Credentials:
    if not YT_TOKEN.exists():
        sys.exit(f"no YouTube token at {YT_TOKEN} — run the uploader once to mint it")
    c = Credentials.from_authorized_user_file(str(YT_TOKEN), SCOPES)
    if c.expired and c.refresh_token:
        c.refresh(Request())
        YT_TOKEN.write_text(c.to_json())
    return c


def iso_duration_to_seconds(d: str) -> int:
    m = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", d or "")
    if not m:
        return 0
    h, mi, s = (int(x) if x else 0 for x in m.groups())
    return h * 3600 + mi * 60 + s


def main() -> None:
    yt = build("youtube", "v3", credentials=creds())

    ch = yt.channels().list(part="contentDetails,statistics", id=CHANNEL_ID).execute()
    item = ch["items"][0]
    uploads_playlist = item["contentDetails"]["relatedPlaylists"]["uploads"]

    video_ids: list[str] = []
    page = None
    while True:
        pl = (
            yt.playlistItems()
            .list(part="contentDetails", playlistId=uploads_playlist, maxResults=50, pageToken=page)
            .execute()
        )
        video_ids += [i["contentDetails"]["videoId"] for i in pl["items"]]
        page = pl.get("nextPageToken")
        if not page:
            break

    videos = []
    for chunk_start in range(0, len(video_ids), 50):
        chunk = video_ids[chunk_start : chunk_start + 50]
        resp = (
            yt.videos()
            .list(part="snippet,statistics,contentDetails,status", id=",".join(chunk))
            .execute()
        )
        for v in resp["items"]:
            if v["status"].get("privacyStatus") != "public":
                continue
            videos.append(
                {
                    "id": v["id"],
                    "title": v["snippet"]["title"],
                    "published": v["snippet"]["publishedAt"],
                    "views": int(v["statistics"].get("viewCount", 0)),
                    "durationSeconds": iso_duration_to_seconds(v["contentDetails"]["duration"]),
                }
            )

    videos.sort(key=lambda v: v["published"], reverse=True)
    out = {
        "channelId": CHANNEL_ID,
        "handle": "@ShawnOsAI",
        "subscriberCount": int(item["statistics"].get("subscriberCount", 0)),
        "pulledAt": __import__("datetime").datetime.now(__import__("datetime").UTC).strftime("%Y-%m-%d"),
        "videos": videos,
    }
    OUT.write_text(json.dumps(out, indent=1) + "\n")
    print(f"wrote {len(videos)} public videos → {OUT}")


if __name__ == "__main__":
    main()
