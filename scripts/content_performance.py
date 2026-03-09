#!/usr/bin/env python3
"""Content performance analytics — pull engagement data from PostHog.

Queries PostHog Events API for content_viewed, content_scroll_depth,
content_time_on_page, cta_clicked, and newsletter_signup events.
Aggregates per page and outputs a weekly report.

Usage:
  python3 scripts/content_performance.py [--days 7] [--dry-run]

Requires in scripts/abm/.env:
  POSTHOG_API_KEY     - PostHog Personal API Key (phx_...)
  POSTHOG_PROJECT_ID  - PostHog project ID (e.g. 325806)
"""

import argparse
import json
import os
import sys
import time
from collections import defaultdict
from datetime import datetime, timedelta, timezone

import requests

# Reuse ABM pipeline config for env loading and API headers
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(SCRIPT_DIR, 'abm'))

from config import POSTHOG_BASE, get_posthog_headers

REPO_ROOT = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(REPO_ROOT, 'data', 'content-analytics')


def fetch_events(event_name, days=7):
    """Fetch events from PostHog for the last N days."""
    project_id = os.environ.get('POSTHOG_PROJECT_ID', '325806')
    after = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()

    all_events = []
    url = f'{POSTHOG_BASE}/api/projects/{project_id}/events'
    params = {
        'event': event_name,
        'after': after,
        'limit': 100,
    }

    while url:
        resp = requests.get(url, params=params, headers=get_posthog_headers(), timeout=30)
        resp.raise_for_status()
        data = resp.json()
        results = data.get('results', [])
        all_events.extend(results)
        url = data.get('next')
        params = {}
        if url:
            time.sleep(0.3)

    return all_events


def build_report(days=7):
    """Build content performance report from PostHog events."""

    # Fetch all event types
    views = fetch_events('content_viewed', days)
    scrolls = fetch_events('content_scroll_depth', days)
    time_events = fetch_events('content_time_on_page', days)
    cta_events = fetch_events('cta_clicked', days)
    newsletter_events = fetch_events('newsletter_signup', days)

    # Aggregate per page
    pages = defaultdict(lambda: {
        'views': 0,
        'scroll_depths': [],
        'time_on_page': [],
        'cta_clicks': 0,
        'newsletter_signups': 0,
        'content_type': '',
        'title': '',
    })

    # Process views
    for event in views:
        props = event.get('properties', {})
        slug = props.get('content_slug', '')
        if not slug:
            continue
        pages[slug]['views'] += 1
        pages[slug]['content_type'] = props.get('content_type', '')
        pages[slug]['title'] = props.get('content_title', '')

    # Process scroll depths
    for event in scrolls:
        props = event.get('properties', {})
        slug = props.get('content_slug', '')
        depth = props.get('scroll_depth', 0)
        if slug and depth:
            pages[slug]['scroll_depths'].append(depth)

    # Process time on page
    for event in time_events:
        props = event.get('properties', {})
        slug = props.get('content_slug', '')
        duration = props.get('duration_seconds', 0)
        if slug and duration:
            pages[slug]['time_on_page'].append(duration)

    # Process CTA clicks
    for event in cta_events:
        props = event.get('properties', {})
        slug = props.get('content_slug', '')
        if slug:
            pages[slug]['cta_clicks'] += 1

    # Process newsletter signups by URL
    total_signups = len(newsletter_events)

    # Build source breakdown
    sources = defaultdict(int)
    for event in views:
        props = event.get('properties', {})
        source = props.get('utm_source', props.get('$referring_domain', 'direct'))
        if source:
            sources[source] += 1

    # Build content type breakdown
    by_type = defaultdict(lambda: {'views': 0})
    for slug, data in pages.items():
        ct = data['content_type'] or 'unknown'
        by_type[ct]['views'] += data['views']

    # Compute per-page metrics
    top_pages = []
    for slug, data in pages.items():
        avg_scroll = (
            round(sum(data['scroll_depths']) / len(data['scroll_depths']))
            if data['scroll_depths'] else 0
        )
        avg_time = (
            round(sum(data['time_on_page']) / len(data['time_on_page']))
            if data['time_on_page'] else 0
        )
        # Engagement score: views * scroll_pct * time_seconds
        engagement = round(data['views'] * (avg_scroll / 100) * avg_time, 1) if avg_scroll and avg_time else 0

        top_pages.append({
            'slug': slug,
            'title': data['title'],
            'content_type': data['content_type'],
            'views': data['views'],
            'avg_scroll_depth': avg_scroll,
            'avg_time_seconds': avg_time,
            'cta_clicks': data['cta_clicks'],
            'engagement_score': engagement,
        })

    # Sort by engagement score descending
    top_pages.sort(key=lambda x: x['engagement_score'], reverse=True)

    total_views = sum(p['views'] for p in top_pages)

    report = {
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'period': f'{days}d',
        'total_views': total_views,
        'total_newsletter_signups': total_signups,
        'top_pages': top_pages[:20],
        'by_content_type': dict(by_type),
        'by_source': dict(sorted(sources.items(), key=lambda x: x[1], reverse=True)[:15]),
        'all_pages': top_pages,
    }

    return report


def main():
    parser = argparse.ArgumentParser(description='Content performance analytics')
    parser.add_argument('--days', type=int, default=7, help='Days to look back (default: 7)')
    parser.add_argument('--dry-run', action='store_true', help='Print report without saving')
    args = parser.parse_args()

    print(f'Fetching content performance data for last {args.days} days...')
    report = build_report(args.days)

    print(f'Total views: {report["total_views"]}')
    print(f'Total pages: {len(report["all_pages"])}')
    print(f'Newsletter signups: {report["total_newsletter_signups"]}')

    if report['top_pages']:
        print('\nTop 5 pages by engagement:')
        for p in report['top_pages'][:5]:
            print(f'  {p["slug"]}: {p["views"]} views, {p["avg_scroll_depth"]}% scroll, {p["avg_time_seconds"]}s avg, score={p["engagement_score"]}')

    if args.dry_run:
        print('\n[dry-run] Report not saved.')
        return

    os.makedirs(DATA_DIR, exist_ok=True)

    # Write latest.json
    latest_path = os.path.join(DATA_DIR, 'latest.json')
    with open(latest_path, 'w') as f:
        json.dump(report, f, indent=2)
    print(f'\nSaved: {latest_path}')

    # Write weekly-report.json (append to history)
    weekly_path = os.path.join(DATA_DIR, 'weekly-report.json')
    history = []
    if os.path.exists(weekly_path):
        with open(weekly_path) as f:
            history = json.load(f)
    history.append({
        'generated_at': report['generated_at'],
        'period': report['period'],
        'total_views': report['total_views'],
        'total_newsletter_signups': report['total_newsletter_signups'],
        'top_5': [{'slug': p['slug'], 'views': p['views'], 'engagement_score': p['engagement_score']} for p in report['top_pages'][:5]],
    })
    with open(weekly_path, 'w') as f:
        json.dump(history, f, indent=2)
    print(f'Appended to: {weekly_path}')


if __name__ == '__main__':
    main()
