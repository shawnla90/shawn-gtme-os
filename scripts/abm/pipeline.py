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
  python3 scripts/abm/pipeline.py --step all --limit 5 --resume
"""

import argparse
import os
import sys
import time

# Add scripts dir to path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

# Load .env from scripts/abm/.env if it exists
env_path = os.path.join(SCRIPT_DIR, '.env')
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, val = line.split('=', 1)
                os.environ.setdefault(key.strip(), val.strip())


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

    if missing:
        print(f"[!] Missing API keys: {', '.join(missing)}")
        print("    Export them or add to .env before running.")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description='ABM Pipeline - Find, Research, Generate')
    parser.add_argument('--step', choices=[
        'research', 'prospect', 'generate', 'sync', 'depersonalize',
        'outreach', 'gap_analysis', 'find_similar', 'lemlist',
        'backfill', 'validate', 'flag_titles', 'enrich', 'replace', 'all',
    ], default='all', help='Pipeline step to run (outreach/gap_analysis/find_similar/lemlist/backfill/validate/flag_titles/enrich/replace must be called explicitly)')
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

    elapsed = time.time() - start
    minutes = int(elapsed // 60)
    seconds = int(elapsed % 60)
    print(f"\n{'=' * 60}")
    print(f"  Pipeline complete in {minutes}m {seconds}s")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
