#!/usr/bin/env python3
"""
expire_pages.py — Nightly TTL enforcement for personalized landing pages.

Queries pages where expires_at < now(), strips personal names from page_data
(sets depersonalized = true), keeps company content. Fully expired pages
(>60 days past expiry) get deprecated = true.

Usage:
    python3 scripts/abm/expire_pages.py           # run expiry
    python3 scripts/abm/expire_pages.py --dry-run  # preview only
"""

import argparse
import copy
import json
import os
import sys
from datetime import datetime, timedelta, timezone

# Add parent dir so we can import db_supabase
sys.path.insert(0, os.path.dirname(__file__))
from db_supabase import get_supabase


def depersonalize_page_data(page_data):
    """Strip personal names from page_data, keep company content."""
    clean = copy.deepcopy(page_data)

    # Remove personal contact info
    clean.pop('contactName', None)
    clean.pop('contactRole', None)
    clean.pop('contacts', None)

    # Strip contact references from text fields
    contact_name = page_data.get('contactName', '')
    first_name = contact_name.split()[0] if contact_name else ''

    def strip_names(text):
        if not isinstance(text, str):
            return text
        if contact_name:
            text = text.replace(contact_name, 'your team')
        if first_name and len(first_name) > 2:
            text = text.replace(first_name, 'you')
        return text

    # Clean headline/subheadline
    clean['headline'] = strip_names(clean.get('headline', ''))
    clean['subheadline'] = strip_names(clean.get('subheadline', ''))

    # Clean nested arrays
    for key in ('challenges', 'deliverables', 'engagementSteps', 'faqItems'):
        if key in clean and isinstance(clean[key], list):
            for item in clean[key]:
                for field in ('title', 'desc', 'subtitle', 'question', 'answer'):
                    if field in item:
                        item[field] = strip_names(item[field])

    return clean


def run(dry_run=False):
    """Main entry point."""
    print("\n[TTL] Landing Page Expiry Check")

    sb = get_supabase()
    now = datetime.now(timezone.utc).isoformat()

    # Find pages past their expiry that haven't been depersonalized yet
    expired = sb.table('landing_pages') \
        .select('id, slug, page_data, expires_at, depersonalized, deprecated') \
        .lt('expires_at', now) \
        .eq('depersonalized', False) \
        .eq('deprecated', False) \
        .execute()

    pages = expired.data or []
    print(f"  Found {len(pages)} pages past expiry needing depersonalization")

    depersonalized_count = 0
    for page in pages:
        slug = page['slug']
        page_data = page['page_data']

        if not page_data:
            continue

        clean_data = depersonalize_page_data(page_data)

        if dry_run:
            print(f"  [DRY RUN] Would depersonalize: {slug}")
        else:
            sb.table('landing_pages').update({
                'page_data': clean_data,
                'depersonalized': True,
            }).eq('id', page['id']).execute()
            print(f"  Depersonalized: {slug}")

        depersonalized_count += 1

    # Deprecate pages that are >60 days past expiry
    cutoff_60d = (datetime.now(timezone.utc) - timedelta(days=60)).isoformat()

    very_old = sb.table('landing_pages') \
        .select('id, slug') \
        .lt('expires_at', cutoff_60d) \
        .eq('deprecated', False) \
        .execute()

    deprecated_pages = very_old.data or []
    deprecated_count = 0
    for page in deprecated_pages:
        if dry_run:
            print(f"  [DRY RUN] Would deprecate: {page['slug']}")
        else:
            sb.table('landing_pages').update({
                'deprecated': True,
            }).eq('id', page['id']).execute()
            print(f"  Deprecated: {page['slug']}")
        deprecated_count += 1

    print(f"\n  Summary: {depersonalized_count} depersonalized, {deprecated_count} deprecated")
    return depersonalized_count + deprecated_count


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Landing page TTL enforcement")
    parser.add_argument("--dry-run", action="store_true", help="Preview only, no changes")
    args = parser.parse_args()
    run(dry_run=args.dry_run)
