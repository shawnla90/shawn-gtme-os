#!/usr/bin/env python3
"""
Sentinel — System Health Monitor Agent
Checks website uptime, RSS feeds, cron pipeline status, git sync, and disk usage.
Runs every 4 hours via launchd on Mac Mini.

Usage:
  python3 scripts/agents/sentinel.py           # full run
  python3 scripts/agents/sentinel.py --test    # dry run, prints to stdout
"""

import argparse
import json
import os
import pathlib
import shutil
import subprocess
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from urllib.request import urlopen, Request
from urllib.error import URLError

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
LOG_DIR = REPO_ROOT / "data" / "agent-logs" / "sentinel"
DAILY_LOG_DIR = REPO_ROOT / "data" / "daily-log"

WEBSITES = {
    "shawnos.ai": "https://shawnos.ai",
    "thegtmos.ai": "https://thegtmos.ai",
    "thecontentos.ai": "https://thecontentos.ai",
}

RSS_FEEDS = [
    "https://shawnos.ai/feed.xml",
    "https://shawnos.ai/feed/all.xml",
    "https://shawnos.ai/feed/knowledge.xml",
    "https://shawnos.ai/feed/how-to.xml",
    "https://shawnos.ai/feed/nio-terminal.xml",
    "https://shawnos.ai/feed/daily-logs.xml",
    "https://thegtmos.ai/feed.xml",
    "https://thegtmos.ai/feed/clay-wiki.xml",
    "https://thegtmos.ai/feed/knowledge.xml",
    "https://thecontentos.ai/feed.xml",
    "https://thecontentos.ai/feed/content-wiki.xml",
]

TIMEOUT = 10


def check_websites() -> dict:
    """HTTP GET each site, return status codes."""
    results = {}
    for name, url in WEBSITES.items():
        try:
            req = Request(url, method="GET")
            req.add_header("User-Agent", "Sentinel/1.0 (ShawnOS Health Monitor)")
            with urlopen(req, timeout=TIMEOUT) as resp:
                results[name] = resp.status
        except URLError as e:
            results[name] = f"error: {e.reason}" if hasattr(e, "reason") else f"error: {e}"
        except Exception as e:
            results[name] = f"error: {e}"
    return results


def check_rss_feeds() -> dict:
    """Validate RSS feeds — HTTP 200, valid XML, has <item> elements."""
    valid = 0
    invalid = 0
    details = []
    for url in RSS_FEEDS:
        try:
            req = Request(url, method="GET")
            req.add_header("User-Agent", "Sentinel/1.0 (ShawnOS Health Monitor)")
            with urlopen(req, timeout=TIMEOUT) as resp:
                if resp.status != 200:
                    invalid += 1
                    details.append({"url": url, "issue": f"HTTP {resp.status}"})
                    continue
                body = resp.read()
                root = ET.fromstring(body)
                items = root.findall(".//{http://www.w3.org/2005/Atom}entry") or root.findall(".//item")
                if len(items) == 0:
                    invalid += 1
                    details.append({"url": url, "issue": "no items/entries"})
                else:
                    valid += 1
        except ET.ParseError:
            invalid += 1
            details.append({"url": url, "issue": "invalid XML"})
        except Exception as e:
            invalid += 1
            details.append({"url": url, "issue": str(e)})
    return {"valid": valid, "invalid": invalid, "details": details}


def check_cron_pipeline() -> dict:
    """Check if today's daily-log JSON exists."""
    today = datetime.now().strftime("%Y-%m-%d")
    today_json = DAILY_LOG_DIR / f"{today}.json"
    last_run = None
    # Find most recent JSON
    jsons = sorted(DAILY_LOG_DIR.glob("20??-??-??.json"), reverse=True)
    if jsons:
        last_run = jsons[0].stem
    return {
        "today_json_exists": today_json.exists(),
        "last_run": last_run,
    }


def check_git_sync() -> dict:
    """Check local repo status vs origin/main."""
    try:
        # Fetch latest without pulling
        subprocess.run(
            ["git", "fetch", "origin", "main"],
            cwd=REPO_ROOT,
            capture_output=True,
            timeout=15,
        )
        # Count ahead/behind
        result = subprocess.run(
            ["git", "rev-list", "--left-right", "--count", "HEAD...origin/main"],
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
            timeout=10,
        )
        if result.returncode == 0:
            parts = result.stdout.strip().split()
            ahead = int(parts[0]) if len(parts) > 0 else 0
            behind = int(parts[1]) if len(parts) > 1 else 0
        else:
            ahead, behind = -1, -1

        # Check working tree clean
        status = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
            timeout=10,
        )
        clean = len(status.stdout.strip()) == 0

        return {"ahead": ahead, "behind": behind, "clean": clean}
    except Exception as e:
        return {"ahead": -1, "behind": -1, "clean": False, "error": str(e)}


def check_disk() -> dict:
    """Check disk usage percentage."""
    usage = shutil.disk_usage("/")
    percent = round((usage.used / usage.total) * 100, 1)
    return {"usage_percent": percent}


def run_all_checks() -> dict:
    """Run all health checks and compile report."""
    now = datetime.now(timezone.utc)
    issues = []

    websites = check_websites()
    for name, status in websites.items():
        if status != 200:
            issues.append(f"website {name}: {status}")

    rss = check_rss_feeds()
    if rss["invalid"] > 0:
        for detail in rss["details"]:
            issues.append(f"rss {detail['url']}: {detail['issue']}")

    cron = check_cron_pipeline()
    # Only flag missing daily JSON after 1am (give cron time to run)
    if not cron["today_json_exists"] and now.hour >= 1:
        issues.append(f"cron pipeline: no daily JSON for {now.strftime('%Y-%m-%d')}")

    git = check_git_sync()
    if git.get("behind", 0) > 3:
        issues.append(f"git: {git['behind']} commits behind origin/main")

    disk = check_disk()
    if disk["usage_percent"] > 85:
        issues.append(f"disk: {disk['usage_percent']}% used")

    # Determine overall status
    if any("website" in i or "cron" in i for i in issues):
        status = "degraded"
    elif len(issues) == 0:
        status = "healthy"
    else:
        status = "degraded"

    # Check for anything truly down
    for name, code in websites.items():
        if isinstance(code, str) and "error" in code:
            status = "down"
            break

    summary = "all systems operational" if len(issues) == 0 else f"{len(issues)} issue(s) detected"

    return {
        "agent": "sentinel",
        "timestamp": now.isoformat(),
        "status": status,
        "checks": {
            "websites": websites,
            "rss_feeds": rss,
            "cron_pipeline": cron,
            "git_sync": git,
            "disk": disk,
        },
        "issues": issues,
        "summary": summary,
    }


def main():
    parser = argparse.ArgumentParser(description="Sentinel — System Health Monitor")
    parser.add_argument("--test", action="store_true", help="Dry run — print to stdout, don't write log")
    args = parser.parse_args()

    report = run_all_checks()

    if args.test:
        print(json.dumps(report, indent=2))
        return

    # Write log file
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    now = datetime.now()
    filename = f"{now.strftime('%Y-%m-%d-%H%M')}.json"
    log_path = LOG_DIR / filename

    with open(log_path, "w") as f:
        json.dump(report, f, indent=2)

    # Print summary to stdout for cron logs
    icon = {"healthy": "OK", "degraded": "WARN", "down": "CRIT"}.get(report["status"], "???")
    print(f"[sentinel] [{icon}] {report['summary']}")
    if report["issues"]:
        for issue in report["issues"]:
            print(f"  - {issue}")


if __name__ == "__main__":
    main()
