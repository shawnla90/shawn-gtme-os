#!/usr/bin/env python3
"""
Crypto OS — Signal Analyzer
Fetches market data from free APIs, analyzes sentiment,
and outputs structured signals for human review.

SAFETY: This script ONLY analyzes. No exchange API. No wallet.
No automated trading. AI analyzes. Human decides. Human executes.

Usage:
  python3 scripts/crypto/signal_analyzer.py           # full run
  python3 scripts/crypto/signal_analyzer.py --test    # dry run, prints to stdout
"""

import argparse
import json
import os
import pathlib
from datetime import datetime, timezone

import requests

try:
    import praw
    HAS_PRAW = True
except ImportError:
    HAS_PRAW = False

from config import (
    COINGECKO_GLOBAL,
    COINGECKO_PRICES,
    FEAR_GREED_URL,
    REDDIT_POST_LIMIT,
    SIGNAL_THRESHOLDS,
    SUBREDDITS,
    TRACKED_ASSETS,
)

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
LOG_DIR = REPO_ROOT / "data" / "agent-logs" / "crypto"
WEBSITE_SIGNALS = REPO_ROOT / "website" / "apps" / "shawnos" / "public" / "data" / "crypto-signals.json"

# Load from .env if not in environment
ENV_FILE = REPO_ROOT / ".env"
if ENV_FILE.exists():
    for line in ENV_FILE.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, val = line.split("=", 1)
            os.environ.setdefault(key.strip(), val.strip())

TIMEOUT = 15


# ── Data Fetchers ────────────────────────────────────────────────

def fetch_prices() -> dict:
    """Fetch current prices + 24h change from CoinGecko."""
    ids = ",".join(TRACKED_ASSETS.keys())
    params = {
        "ids": ids,
        "vs_currencies": "usd",
        "include_24hr_change": "true",
        "include_market_cap": "true",
    }
    try:
        resp = requests.get(COINGECKO_PRICES, params=params, timeout=TIMEOUT)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f"  WARN: CoinGecko prices failed: {e}")
        return {}


def fetch_global() -> dict:
    """Fetch global market data (BTC dominance, total market cap)."""
    try:
        resp = requests.get(COINGECKO_GLOBAL, timeout=TIMEOUT)
        resp.raise_for_status()
        return resp.json().get("data", {})
    except Exception as e:
        print(f"  WARN: CoinGecko global failed: {e}")
        return {}


def fetch_fear_greed() -> dict:
    """Fetch Fear & Greed Index from alternative.me."""
    try:
        resp = requests.get(FEAR_GREED_URL, timeout=TIMEOUT)
        resp.raise_for_status()
        data = resp.json().get("data", [{}])[0]
        return {
            "value": int(data.get("value", 0)),
            "classification": data.get("value_classification", "Unknown"),
        }
    except Exception as e:
        print(f"  WARN: Fear & Greed fetch failed: {e}")
        return {"value": 0, "classification": "Unknown"}


def fetch_reddit_sentiment() -> list:
    """Fetch hot posts from crypto subreddits via PRAW."""
    client_id = os.environ.get("REDDIT_CLIENT_ID", "")
    client_secret = os.environ.get("REDDIT_CLIENT_SECRET", "")
    user_agent = os.environ.get("REDDIT_USER_AGENT", "crypto-os-signal/0.1")

    if not HAS_PRAW:
        print("  WARN: praw not installed, skipping Reddit")
        return []
    if not client_id or not client_secret:
        print("  WARN: REDDIT_CLIENT_ID/SECRET not set, skipping Reddit")
        return []

    try:
        reddit = praw.Reddit(
            client_id=client_id,
            client_secret=client_secret,
            user_agent=user_agent,
        )
        posts = []
        for sub_name in SUBREDDITS:
            subreddit = reddit.subreddit(sub_name)
            for post in subreddit.hot(limit=REDDIT_POST_LIMIT):
                if post.stickied:
                    continue
                posts.append({
                    "subreddit": sub_name,
                    "title": post.title,
                    "score": post.score,
                    "num_comments": post.num_comments,
                    "upvote_ratio": post.upvote_ratio,
                })
        return posts
    except Exception as e:
        print(f"  WARN: Reddit fetch failed: {e}")
        return []


# ── Signal Generation ────────────────────────────────────────────

def generate_signals(prices: dict, global_data: dict, fear_greed: dict) -> list:
    """Generate conservative signals based on market data.

    Defaults to 'hold' — only flags watch/consider signals on
    significant moves or extreme sentiment.
    """
    signals = []
    fg_value = fear_greed.get("value", 50)

    for coin_id, ticker in TRACKED_ASSETS.items():
        coin_data = prices.get(coin_id, {})
        price = coin_data.get("usd", 0)
        change_24h = coin_data.get("usd_24h_change", 0)

        action = "hold"
        confidence = 0.3
        reasons = []

        # Extreme fear + significant drop = potential opportunity
        if fg_value <= SIGNAL_THRESHOLDS["extreme_fear"]:
            reasons.append(f"extreme fear ({fg_value})")
            confidence += 0.15
        if change_24h <= SIGNAL_THRESHOLDS["large_drop_pct"]:
            reasons.append(f"24h drop {change_24h:.1f}%")
            confidence += 0.15

        # Extreme greed + large pump = caution
        if fg_value >= SIGNAL_THRESHOLDS["extreme_greed"]:
            reasons.append(f"extreme greed ({fg_value})")
            confidence += 0.1
        if change_24h >= SIGNAL_THRESHOLDS["large_pump_pct"]:
            reasons.append(f"24h pump {change_24h:.1f}%")
            confidence += 0.1

        # Determine action
        if fg_value <= SIGNAL_THRESHOLDS["extreme_fear"] and change_24h <= SIGNAL_THRESHOLDS["large_drop_pct"]:
            action = "consider_buy"
            confidence = min(confidence + 0.1, 0.7)
            reasons.append("fear + dip convergence")
        elif fg_value >= SIGNAL_THRESHOLDS["extreme_greed"] and change_24h >= SIGNAL_THRESHOLDS["large_pump_pct"]:
            action = "consider_sell"
            confidence = min(confidence + 0.1, 0.7)
            reasons.append("greed + pump convergence")
        elif reasons:
            action = "watch"

        if not reasons:
            reasons.append("no significant signals — default hold")

        signals.append({
            "asset": ticker,
            "price_usd": round(price, 2),
            "change_24h_pct": round(change_24h, 2) if change_24h else 0,
            "action": action,
            "confidence": round(confidence, 2),
            "reasoning": reasons,
        })

    return signals


def summarize_reddit(posts: list) -> dict:
    """Summarize Reddit sentiment from hot posts."""
    if not posts:
        return {"post_count": 0, "avg_score": 0, "top_topics": []}

    avg_score = sum(p["score"] for p in posts) / len(posts)
    avg_ratio = sum(p["upvote_ratio"] for p in posts) / len(posts)

    # Extract top posts by score
    top = sorted(posts, key=lambda p: p["score"], reverse=True)[:5]
    top_topics = [{"title": p["title"], "score": p["score"], "sub": p["subreddit"]} for p in top]

    return {
        "post_count": len(posts),
        "avg_score": round(avg_score, 1),
        "avg_upvote_ratio": round(avg_ratio, 3),
        "top_topics": top_topics,
    }


# ── Main Runner ──────────────────────────────────────────────────

def run_analysis(test_mode: bool = False) -> dict:
    """Run the full signal analysis pipeline."""
    now = datetime.now(timezone.utc)
    today = now.strftime("%Y-%m-%d")

    print("[crypto] fetching market data...")
    prices = fetch_prices()
    global_data = fetch_global()
    fear_greed = fetch_fear_greed()

    print("[crypto] fetching reddit sentiment...")
    reddit_posts = fetch_reddit_sentiment()

    print("[crypto] generating signals...")
    signals = generate_signals(prices, global_data, fear_greed)
    reddit_summary = summarize_reddit(reddit_posts)

    # Build market snapshot
    btc_dom = global_data.get("market_cap_percentage", {}).get("btc", 0)
    total_mcap = global_data.get("total_market_cap", {}).get("usd", 0)

    snapshot = {
        "btc_dominance_pct": round(btc_dom, 2),
        "total_market_cap_usd": round(total_mcap, 0),
        "fear_greed_index": fear_greed.get("value", 0),
        "fear_greed_label": fear_greed.get("classification", "Unknown"),
        "assets": {},
    }
    for coin_id, ticker in TRACKED_ASSETS.items():
        coin_data = prices.get(coin_id, {})
        snapshot["assets"][ticker] = {
            "price_usd": round(coin_data.get("usd", 0), 2),
            "change_24h_pct": round(coin_data.get("usd_24h_change", 0), 2) if coin_data.get("usd_24h_change") else 0,
            "market_cap_usd": round(coin_data.get("usd_market_cap", 0), 0) if coin_data.get("usd_market_cap") else 0,
        }

    return {
        "agent": "crypto-signal",
        "timestamp": now.isoformat(),
        "date": today,
        "test_mode": test_mode,
        "market_snapshot": snapshot,
        "signals": signals,
        "reddit_sentiment": reddit_summary,
        "disclaimer": "AI-generated analysis for informational purposes only. Not financial advice. Human reviews all signals before any action. No automated trading.",
        "model": "rule-based-v1",
    }


def determine_period() -> str:
    """Determine if this is a morning or evening run based on local hour."""
    from datetime import datetime as dt
    hour = dt.now().hour
    return "morning" if hour < 14 else "evening"


def update_website_signals(result: dict) -> None:
    """Merge this run into the website-facing signals JSON.

    Keeps both morning and evening runs visible. The website reads
    this file at build time (Vercel) and on client load.
    """
    period = determine_period()
    result["period"] = period

    # Load existing data if present
    existing = {"last_updated": "", "runs": {}}
    if WEBSITE_SIGNALS.exists():
        try:
            existing = json.loads(WEBSITE_SIGNALS.read_text())
        except (json.JSONDecodeError, OSError):
            pass

    # Reset runs if it's a new day
    existing_date = existing.get("runs", {}).get("morning", {}).get("date", "")
    if existing_date and existing_date != result["date"]:
        existing["runs"] = {}

    # Merge this run
    existing["last_updated"] = result["timestamp"]
    existing["runs"][period] = result

    # Write
    WEBSITE_SIGNALS.parent.mkdir(parents=True, exist_ok=True)
    with open(WEBSITE_SIGNALS, "w") as f:
        json.dump(existing, f, indent=2, default=str)

    print(f"[crypto] Website signals updated ({period} run) → {WEBSITE_SIGNALS}")


def main():
    parser = argparse.ArgumentParser(description="Crypto OS — Signal Analyzer")
    parser.add_argument(
        "--test", action="store_true",
        help="Dry run — prints JSON to stdout, does not write log file",
    )
    args = parser.parse_args()

    print("[crypto] starting signal analysis...")
    result = run_analysis(test_mode=args.test)

    if args.test:
        print(json.dumps(result, indent=2, default=str))
        return

    # Write log file
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d_%H%M")
    filename = f"{timestamp}.json"
    log_path = LOG_DIR / filename

    with open(log_path, "w") as f:
        json.dump(result, f, indent=2, default=str)

    # Update website-facing signals JSON
    update_website_signals(result)

    # Print summary to stdout for cron logs
    snap = result["market_snapshot"]
    print(f"\n[crypto] Market: F&G={snap['fear_greed_index']} ({snap['fear_greed_label']}), BTC dom={snap['btc_dominance_pct']}%")
    for sig in result["signals"]:
        print(f"  {sig['asset']}: ${sig['price_usd']:,.2f} ({sig['change_24h_pct']:+.1f}%) → {sig['action']} (conf={sig['confidence']})")
    print(f"\n[crypto] Log written to {log_path}")


if __name__ == "__main__":
    main()
