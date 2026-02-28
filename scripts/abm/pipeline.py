#!/usr/bin/env python3
"""
ABM Pipeline Orchestrator

Usage:
  python3 scripts/abm/pipeline.py --step all --limit 100
  python3 scripts/abm/pipeline.py --step research --limit 5
  python3 scripts/abm/pipeline.py --step prospect --limit 5
  python3 scripts/abm/pipeline.py --step generate --limit 5
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

    if missing:
        print(f"[!] Missing API keys: {', '.join(missing)}")
        print("    Export them or add to .env before running.")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description='ABM Pipeline - Find, Research, Generate')
    parser.add_argument('--step', choices=['research', 'prospect', 'generate', 'sync', 'depersonalize', 'all'],
                        default='all', help='Pipeline step to run')
    parser.add_argument('--limit', type=int, default=100,
                        help='Max number of companies to process')
    parser.add_argument('--resume', action='store_true', default=True,
                        help='Resume from where we left off (default: true)')
    parser.add_argument('--no-resume', action='store_true',
                        help='Start fresh, don\'t skip already-processed items')

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
        sync_attio.run(limit=limit)

    if step in ('depersonalize', 'all'):
        import depersonalize
        depersonalize.run()

    elapsed = time.time() - start
    minutes = int(elapsed // 60)
    seconds = int(elapsed % 60)
    print(f"\n{'=' * 60}")
    print(f"  Pipeline complete in {minutes}m {seconds}s")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
