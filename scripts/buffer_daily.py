#!/usr/bin/env python3
"""Cross-post the Claude Code Daily LinkedIn text to Buffer.

Gated on Shawn's new Buffer setup: reads BUFFER_ACCESS_TOKEN_V2 from niobot
secrets (falls back to BUFFER_ACCESS_TOKEN) and no-ops with a clear message
until a token with a LinkedIn channel exists. Typefully remains the primary
LinkedIn path until then (daily_content_intel.py::schedule_linkedin).

Usage:
  python3 scripts/buffer_daily.py channels                 # list connected channels
  python3 scripts/buffer_daily.py post 2026-07-03          # queue that day's post
  python3 scripts/buffer_daily.py post 2026-07-03 --draft  # save as Buffer draft
"""
import json
import sys
import urllib.request
from pathlib import Path

API = "https://api.buffer.com"
ORG = "6a42d13afe21742fad2dde4f"
REPO_ROOT = Path(__file__).resolve().parent.parent
LINKEDIN_DIR = REPO_ROOT / "content" / "linkedin" / "final"


def token():
    sys.path.insert(0, str(Path.home() / "content" / "dispatch"))
    from secret import secret
    for key in ("BUFFER_ACCESS_TOKEN_V2", "BUFFER_ACCESS_TOKEN"):
        try:
            t = secret(key)
            if t:
                return t
        except Exception:
            continue
    return None


def gql(tok, query, variables=None):
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(API, data=body, method="POST", headers={
        "Authorization": f"Bearer {tok}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        return {"errors": [{"message": f"HTTP {e.code}: {e.read().decode()[:300]}"}]}


def channels(tok):
    q = "query($i:ChannelsInput!){ channels(input:$i){ id service name } }"
    resp = gql(tok, q, {"i": {"organizationId": ORG}})
    return resp.get("data", {}).get("channels", []) or []


CREATE = """mutation($i:CreatePostInput!){ createPost(input:$i){
  __typename
  ... on PostActionSuccess { post { id status dueAt } }
  ... on MutationError { message }
} }"""


def post_daily(tok, date, draft=False):
    txt_path = LINKEDIN_DIR / f"claude-daily-{date}.txt"
    if not txt_path.exists():
        sys.exit(f"no LinkedIn text at {txt_path} (run the daily pipeline first)")
    text = txt_path.read_text().strip()

    chans = channels(tok)
    linkedin = next((c for c in chans if c["service"] == "linkedin"), None)
    if not linkedin:
        sys.exit("no LinkedIn channel on this Buffer org yet "
                 f"(have: {[c['service'] for c in chans]}). "
                 "Connect LinkedIn in Buffer, then re-run.")

    inp = {"channelId": linkedin["id"], "text": text,
           "schedulingType": "automatic", "mode": "addToQueue"}
    if draft:
        inp["saveToDraft"] = True
    resp = gql(tok, CREATE, {"i": inp})
    node = resp.get("data", {}).get("createPost", {}) or {}
    if node.get("__typename") == "PostActionSuccess":
        p = node["post"]
        print(f"buffer {'draft' if draft else 'queued'}: id={p['id']} "
              f"status={p['status']} dueAt={p.get('dueAt')}")
    else:
        sys.exit(f"buffer error: {node.get('message') or resp.get('errors')}")


def main():
    tok = token()
    if not tok:
        print("buffer_daily: no BUFFER_ACCESS_TOKEN_V2 in niobot secrets yet. "
              "Shawn creates the new Buffer setup + token, stores it, then this "
              "script goes live. (Typefully still covers LinkedIn.)")
        return

    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "channels":
        print(json.dumps(channels(tok), indent=2))
    elif cmd == "post":
        if len(sys.argv) < 3:
            sys.exit("usage: buffer_daily.py post <YYYY-MM-DD> [--draft]")
        post_daily(tok, sys.argv[2], draft="--draft" in sys.argv)
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
