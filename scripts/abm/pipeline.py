#!/usr/bin/env python3
"""
ABM Pipeline Orchestrator

Usage:
  python3 scripts/abm/pipeline.py --step all --limit 100
  python3 scripts/abm/pipeline.py --step research --limit 5
  python3 scripts/abm/pipeline.py --step prospect --limit 5
  python3 scripts/abm/pipeline.py --step generate --limit 5
  python3 scripts/abm/pipeline.py --step gap_analysis --limit 10
  python3 scripts/abm/pipeline.py --step find_similar --limit 20 --seed best
  python3 scripts/abm/pipeline.py --step lemlist --campaign-id cam_xxx --limit 10
  python3 scripts/abm/pipeline.py --step backfill --limit 50
  python3 scripts/abm/pipeline.py --step validate --limit 50
  python3 scripts/abm/pipeline.py --step flag_titles --dry-run
  python3 scripts/abm/pipeline.py --step enrich --limit 50
  python3 scripts/abm/pipeline.py --step replace --limit 50
  python3 scripts/abm/pipeline.py --step clean --dry-run
  python3 scripts/abm/pipeline.py --step warming
  python3 scripts/abm/pipeline.py --step preflight
  python3 scripts/abm/pipeline.py --step linkedin_import --dry-run
  python3 scripts/abm/pipeline.py --step linkedin_messages --dry-run
  python3 scripts/abm/pipeline.py --step signals --limit 76
  python3 scripts/abm/pipeline.py --step cleanup --dry-run
  python3 scripts/abm/pipeline.py --step verify --limit 50
  python3 scripts/abm/pipeline.py --step source_yc --limit 200 --dry-run
  python3 scripts/abm/pipeline.py --step all --limit 5 --resume
"""

import argparse
import os
import sys
import time

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from config import load_env
load_env()


def check_keys(step):
    """Verify required API keys are set."""
    missing = []

    if step in ('research', 'generate', 'all'):
        if not os.environ.get('EXA_API_KEY'):
            missing.append('EXA_API_KEY')

    if step in ('prospect', 'all'):
        if not os.environ.get('APOLLO_API_KEY'):
            missing.append('APOLLO_API_KEY')

    if step in ('generate', 'all'):
        if not os.environ.get('XAI_API_KEY'):
            missing.append('XAI_API_KEY')

    if step in ('sync', 'all'):
        if not os.environ.get('ATTIO_API_TOKEN'):
            missing.append('ATTIO_API_TOKEN')

    # Outreach requires SMTP creds (NOT included in 'all')
    if step == 'outreach':
        for key in ('SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'):
            if not os.environ.get(key):
                missing.append(key)

    if step == 'find_similar':
        if not os.environ.get('EXA_API_KEY'):
            missing.append('EXA_API_KEY')

    if step in ('backfill', 'replace'):
        if not os.environ.get('APOLLO_API_KEY'):
            missing.append('APOLLO_API_KEY')

    if step == 'enrich':
        if not os.environ.get('EXA_API_KEY'):
            missing.append('EXA_API_KEY')
        if not os.environ.get('XAI_API_KEY'):
            missing.append('XAI_API_KEY')

    if step == 'lemlist':
        if not os.environ.get('LEMLIST_API_KEY'):
            missing.append('LEMLIST_API_KEY')

    if step in ('clean', 'cleanup'):
        if not os.environ.get('ATTIO_API_TOKEN'):
            missing.append('ATTIO_API_TOKEN')

    if step == 'verify':
        if not os.environ.get('PROSPEO_API_KEY'):
            missing.append('PROSPEO_API_KEY')

    if step == 'source_yc':
        for key in ('EXA_API_KEY', 'APOLLO_API_KEY', 'PROSPEO_API_KEY'):
            if not os.environ.get(key):
                missing.append(key)

    if missing:
        print(f"[!] Missing API keys: {', '.join(missing)}")
        print("    Export them or add to .env before running.")
        sys.exit(1)


def run_preflight():
    """Pre-launch checklist: verify everything is ready for Lemlist outreach."""
    from db_supabase import get_supabase
    from qualify import get_qualified_accounts

    print(f"\n{'='*60}")
    print(f"  Pre-Launch Checklist")
    print(f"{'='*60}\n")

    sb = get_supabase()
    checks_passed = 0
    checks_total = 0

    # Check 1: Qualified accounts exist
    checks_total += 1
    qualified = get_qualified_accounts(sb, limit=500)
    if len(qualified) >= 10:
        print(f"  [+] Qualified accounts: {len(qualified)} (>= 10)")
        checks_passed += 1
    else:
        print(f"  [!] Qualified accounts: {len(qualified)} (need >= 10)")

    # Check 2: Landing pages are live
    checks_total += 1
    qualified_ids = [a['id'] for a in qualified]
    if qualified_ids:
        lp_result = sb.table('landing_pages').select(
            'account_id', count='exact'
        ).in_('account_id', qualified_ids).eq('status', 'live').execute()
        lp_count = lp_result.count or 0
    else:
        lp_count = 0

    if lp_count >= 10:
        print(f"  [+] Live landing pages: {lp_count} (>= 10)")
        checks_passed += 1
    else:
        print(f"  [!] Live landing pages: {lp_count} (need >= 10)")

    # Check 3: Domains are warming
    checks_total += 1
    try:
        import warming_status
        config = warming_status.load_config()
        statuses = warming_status.get_warming_status(sb, config)
        min_days = min(s['warming_days'] for s in statuses) if statuses else 0

        if min_days >= 7:
            print(f"  [+] Domain warming: {min_days} days (>= 7)")
            checks_passed += 1
        else:
            print(f"  [!] Domain warming: {min_days} days (need >= 7)")
    except Exception as e:
        print(f"  [!] Domain warming: check failed ({e})")

    # Check 4: Lemlist API key configured
    checks_total += 1
    if os.environ.get('LEMLIST_API_KEY'):
        print(f"  [+] Lemlist API key: configured")
        checks_passed += 1
    else:
        print(f"  [!] Lemlist API key: not set")

    # Check 5: Email template exists
    checks_total += 1
    tpl_result = sb.table('email_templates').select('id', count='exact').execute()
    tpl_count = tpl_result.count or 0
    if tpl_count > 0:
        print(f"  [+] Email templates: {tpl_count} available")
        checks_passed += 1
    else:
        print(f"  [!] Email templates: none found")

    print(f"\n{'='*60}")
    print(f"  Result: {checks_passed}/{checks_total} checks passed")
    if checks_passed == checks_total:
        print(f"  READY FOR LAUNCH")
    else:
        print(f"  NOT READY - fix issues above")
    print(f"{'='*60}\n")

    return checks_passed == checks_total


def main():
    parser = argparse.ArgumentParser(description='ABM Pipeline - Find, Research, Generate')
    parser.add_argument('--step', choices=[
        'research', 'prospect', 'generate', 'sync', 'depersonalize',
        'outreach', 'gap_analysis', 'find_similar', 'lemlist',
        'backfill', 'validate', 'flag_titles', 'enrich', 'replace',
        'clean', 'cleanup', 'verify', 'source_yc',
        'warming', 'preflight',
        'linkedin_import', 'linkedin_messages', 'signals',
        'all',
    ], default='all', help='Pipeline step to run (outreach/gap_analysis/find_similar/lemlist/backfill/validate/flag_titles/enrich/replace/clean/cleanup/verify/source_yc/warming/preflight/linkedin_import/linkedin_messages/signals must be called explicitly)')
    parser.add_argument('--limit', type=int, default=100,
                        help='Max number of companies to process')
    parser.add_argument('--dry-run', action='store_true',
                        help='Preview without making changes')
    parser.add_argument('--full', action='store_true',
                        help='Sync all accounts to Attio (bypass outreach gate)')
    parser.add_argument('--resume', action='store_true', default=True,
                        help='Resume from where we left off (default: true)')
    parser.add_argument('--no-resume', action='store_true',
                        help='Start fresh, don\'t skip already-processed items')
    parser.add_argument('--seed', choices=['replied', 'viewed', 'best'], default='best',
                        help='Seed type for find_similar step')
    parser.add_argument('--campaign-id', default=None,
                        help='Lemlist campaign ID (required for lemlist step)')

    args = parser.parse_args()

    if args.no_resume:
        args.resume = False

    step = args.step
    limit = args.limit
    resume = args.resume

    print("=" * 60)
    print(f"  ABM Pipeline - {step.upper()}")
    print(f"  Limit: {limit} | Resume: {resume}")
    print("=" * 60)

    check_keys(step)

    start = time.time()

    if step in ('research', 'all'):
        import research
        research.run(limit=limit, resume=resume)

    if step in ('prospect', 'all'):
        import prospect
        prospect.run(limit=limit, resume=resume)

    if step in ('generate', 'all'):
        import generate
        generate.run(limit=limit, resume=resume)

    if step in ('sync', 'all'):
        import sync_attio
        sync_attio.run(limit=limit, full=getattr(args, 'full', False))

    if step in ('depersonalize', 'all'):
        import depersonalize
        depersonalize.run()

    # Outreach is NEVER included in 'all' - must be explicitly called
    if step == 'outreach':
        import outreach
        outreach.run(limit=limit, dry_run=args.dry_run)

    # Gap analysis - explicit only (NOT in 'all')
    if step == 'gap_analysis':
        import gap_analysis
        gap_analysis.run(limit=limit, dry_run=args.dry_run)

    # Find similar - explicit only (NOT in 'all')
    if step == 'find_similar':
        import find_similar
        find_similar.run(limit=limit, seed=args.seed, dry_run=args.dry_run)

    # Lemlist push - explicit only (NOT in 'all')
    if step == 'lemlist':
        if not args.campaign_id:
            print("[!] --campaign-id required for lemlist step")
            sys.exit(1)
        import push_to_lemlist
        push_to_lemlist.run(campaign_id=args.campaign_id, limit=limit, dry_run=args.dry_run)

    # Backfill contacts + accounts via Apollo People Match - explicit only
    if step == 'backfill':
        import backfill_contacts
        backfill_contacts.run(limit=limit, dry_run=args.dry_run)

    # Email validation via MX lookup - explicit only
    if step == 'validate':
        import validate_emails
        validate_emails.run(limit=limit, dry_run=args.dry_run)

    # Flag contacts with irrelevant titles - explicit only
    if step == 'flag_titles':
        import title_filter
        title_filter.flag_irrelevant_contacts(dry_run=args.dry_run)

    # Enrich accounts via Exa/Firecrawl + Grok - explicit only
    if step == 'enrich':
        import enrich_accounts
        enrich_accounts.run(limit=limit, dry_run=args.dry_run)

    # Replace irrelevant contacts with GTM prospects - explicit only
    if step == 'replace':
        import replace_contacts
        replace_contacts.run(limit=limit, dry_run=args.dry_run)

    # Clean Attio CRM - remove unqualified records - explicit only
    if step == 'clean':
        import clean_attio
        clean_attio.run(dry_run=args.dry_run)

    # Database cleanup - archive orphans not in Attio - explicit only
    if step == 'cleanup':
        from db_supabase import run_cleanup
        run_cleanup(dry_run=args.dry_run)

    # Prospeo email verification - explicit only
    if step == 'verify':
        import verify_emails
        verify_emails.run(limit=limit, dry_run=args.dry_run)

    # YC company sourcing - explicit only (NOT in 'all')
    if step == 'source_yc':
        import source_yc
        source_yc.run(limit=limit, dry_run=args.dry_run)

    # Domain warming status - explicit only
    if step == 'warming':
        import warming_status
        warming_status.run(check_only=False)

    # Pre-launch checklist - explicit only
    if step == 'preflight':
        run_preflight()

    # LinkedIn connection import - explicit only
    if step == 'linkedin_import':
        import linkedin_import
        linkedin_import.run(dry_run=args.dry_run)

    # LinkedIn message history import - explicit only
    if step == 'linkedin_messages':
        import linkedin_messages
        linkedin_messages.run(dry_run=args.dry_run)

    # Signal collection + priority scoring - explicit only
    if step == 'signals':
        import signals
        signals.run(limit=limit, dry_run=args.dry_run)

    elapsed = time.time() - start
    minutes = int(elapsed // 60)
    seconds = int(elapsed % 60)
    print(f"\n{'=' * 60}")
    print(f"  Pipeline complete in {minutes}m {seconds}s")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
