#!/usr/bin/env python3
"""
ABM Depersonalization & Deprecation

Depersonalize: strips PII at render time after outreach TTL expires.
Deprecate: full opt-out, page returns 404. Use when a contact requests removal.

Usage:
  python3 scripts/abm/depersonalize.py                    # run TTL enforcement
  python3 scripts/abm/depersonalize.py --dry-run          # preview only
  python3 scripts/abm/depersonalize.py --deprecate acme   # 404 a page (opt-out)
  python3 scripts/abm/depersonalize.py --undeprecate acme # restore a deprecated page
"""

import argparse
import sys
from datetime import datetime, timezone

from db_supabase import get_supabase


def run(dry_run: bool = False):
    sb = get_supabase()
    now = datetime.now(timezone.utc).isoformat()

    # Find pages where sent_at is set, TTL has expired, and not yet depersonalized
    result = (
        sb.table('landing_pages')
        .select('slug, sent_at, expires_at')
        .eq('depersonalized', False)
        .not_.is_('sent_at', 'null')
        .lt('expires_at', now)
        .execute()
    )

    pages = result.data or []

    if not pages:
        print("[depersonalize] No expired pages to process.")
        return 0

    print(f"[depersonalize] Found {len(pages)} expired page(s):")
    for p in pages:
        print(f"  - {p['slug']} | sent: {p['sent_at']} | expired: {p['expires_at']}")

    if dry_run:
        print("[depersonalize] --dry-run: no changes made.")
        return len(pages)

    # Flip depersonalized = true for each expired page
    slugs = [p['slug'] for p in pages]
    update_result = (
        sb.table('landing_pages')
        .update({'depersonalized': True})
        .in_('slug', slugs)
        .execute()
    )

    updated = len(update_result.data) if update_result.data else 0
    print(f"[depersonalize] Flipped {updated} page(s) to depersonalized.")
    return updated


def deprecate(slug: str):
    """Full opt-out: mark page as deprecated (404). Also depersonalizes."""
    sb = get_supabase()

    # Verify the page exists
    check = sb.table('landing_pages').select('slug, deprecated').eq('slug', slug).single().execute()
    if not check.data:
        print(f"[deprecate] Page '{slug}' not found.")
        return False

    if check.data.get('deprecated'):
        print(f"[deprecate] Page '{slug}' is already deprecated.")
        return True

    sb.table('landing_pages').update({
        'deprecated': True,
        'depersonalized': True,
    }).eq('slug', slug).execute()

    print(f"[deprecate] Page '{slug}' deprecated. It will now 404.")
    return True


def undeprecate(slug: str):
    """Restore a deprecated page. Stays depersonalized - re-personalize manually if needed."""
    sb = get_supabase()

    check = sb.table('landing_pages').select('slug, deprecated').eq('slug', slug).single().execute()
    if not check.data:
        print(f"[undeprecate] Page '{slug}' not found.")
        return False

    if not check.data.get('deprecated'):
        print(f"[undeprecate] Page '{slug}' is not deprecated.")
        return True

    sb.table('landing_pages').update({
        'deprecated': False,
    }).eq('slug', slug).execute()

    print(f"[undeprecate] Page '{slug}' restored. Still depersonalized - re-personalize manually if needed.")
    return True


def main():
    parser = argparse.ArgumentParser(description='ABM Depersonalization & Deprecation')
    parser.add_argument('--dry-run', action='store_true', help='Preview TTL enforcement without making changes')
    parser.add_argument('--deprecate', metavar='SLUG', help='Deprecate (404) a specific page - full opt-out')
    parser.add_argument('--undeprecate', metavar='SLUG', help='Restore a deprecated page')
    args = parser.parse_args()

    try:
        if args.deprecate:
            deprecate(args.deprecate)
        elif args.undeprecate:
            undeprecate(args.undeprecate)
        else:
            count = run(dry_run=args.dry_run)
            print(f"[depersonalize] Done. {count} page(s) {'would be' if args.dry_run else ''} processed.")
    except Exception as e:
        print(f"[depersonalize] ERROR: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
