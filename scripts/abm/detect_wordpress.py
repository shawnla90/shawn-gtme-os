#!/usr/bin/env python3
"""Async WordPress detection module.

Given a list of domains, checks multiple WordPress signals and returns
a confidence score. Confirmed WordPress = confidence >= 40.

Signals:
  - /wp-content/ in HTML source (weight: 40)
  - /wp-json/ API responds 200/301/302 (weight: 40)
  - <meta name="generator" content="WordPress"> (weight: 40)
  - /wp-login.php exists (weight: 30)

Usage:
  # As module
  from detect_wordpress import scan_batch
  results = asyncio.run(scan_batch(["example.com", "other.com"]))

  # Standalone
  python3 scripts/abm/detect_wordpress.py domain1.com domain2.com
  python3 scripts/abm/detect_wordpress.py --file domains.txt
"""

import asyncio
import argparse
import json
import sys
import time

import aiohttp

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
}

CONCURRENCY = 10
DELAY = 0.5
TIMEOUT = 15
CONFIDENCE_THRESHOLD = 40


async def _fetch(session, url):
    """Fetch URL, return (status_code, text) or (None, None) on failure."""
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=TIMEOUT),
                               allow_redirects=True, ssl=False) as resp:
            text = await resp.text(errors='replace')
            return resp.status, text
    except Exception:
        return None, None


async def _head(session, url):
    """HEAD request, return status_code or None on failure."""
    try:
        async with session.head(url, timeout=aiohttp.ClientTimeout(total=TIMEOUT),
                                allow_redirects=True, ssl=False) as resp:
            return resp.status
    except Exception:
        # Fallback to GET if HEAD fails
        try:
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=TIMEOUT),
                                   allow_redirects=True, ssl=False) as resp:
                return resp.status
        except Exception:
            return None


async def detect_wordpress(session, domain, semaphore):
    """Check a single domain for WordPress signals.

    Returns dict with:
      domain, is_wordpress, confidence, signals, error
    """
    result = {
        'domain': domain,
        'is_wordpress': False,
        'confidence': 0,
        'signals': {},
        'error': None,
    }

    async with semaphore:
        base_url = f'https://{domain}'
        signals = {}
        confidence = 0

        # Signal 1: Fetch homepage, check for /wp-content/ in HTML
        status, html = await _fetch(session, base_url)
        if status is None:
            # Try HTTP fallback
            base_url = f'http://{domain}'
            status, html = await _fetch(session, base_url)

        if status is None:
            result['error'] = 'unreachable'
            return result

        if html and '/wp-content/' in html:
            signals['wp_content_in_html'] = True
            confidence += 40
        else:
            signals['wp_content_in_html'] = False

        # Signal 2: Check meta generator tag
        if html and 'content="WordPress' in html:
            signals['meta_generator'] = True
            confidence += 40
        elif html and 'content="wordpress' in html.lower():
            # Case-insensitive fallback
            signals['meta_generator'] = True
            confidence += 40
        else:
            signals['meta_generator'] = False

        # Signal 3: /wp-json/ API responds
        wp_json_status = await _head(session, f'{base_url}/wp-json/')
        if wp_json_status in (200, 301, 302):
            signals['wp_json_api'] = True
            confidence += 40
        else:
            signals['wp_json_api'] = False

        # Signal 4: /wp-login.php exists
        wp_login_status = await _head(session, f'{base_url}/wp-login.php')
        if wp_login_status in (200, 301, 302):
            signals['wp_login'] = True
            confidence += 30
        else:
            signals['wp_login'] = False

        result['confidence'] = confidence
        result['is_wordpress'] = confidence >= CONFIDENCE_THRESHOLD
        result['signals'] = signals

        await asyncio.sleep(DELAY)

    return result


async def scan_batch(domains):
    """Scan a batch of domains for WordPress. Returns list of result dicts."""
    semaphore = asyncio.Semaphore(CONCURRENCY)
    connector = aiohttp.TCPConnector(limit=CONCURRENCY, ssl=False)

    async with aiohttp.ClientSession(headers=HEADERS, connector=connector) as session:
        tasks = [detect_wordpress(session, d, semaphore) for d in domains]
        results = await asyncio.gather(*tasks, return_exceptions=True)

    # Convert exceptions to error results
    clean = []
    for i, r in enumerate(results):
        if isinstance(r, Exception):
            clean.append({
                'domain': domains[i],
                'is_wordpress': False,
                'confidence': 0,
                'signals': {},
                'error': str(r),
            })
        else:
            clean.append(r)

    return clean


def run_cli():
    """CLI entry point for standalone usage."""
    parser = argparse.ArgumentParser(description='Detect WordPress sites')
    parser.add_argument('domains', nargs='*', help='Domains to check')
    parser.add_argument('--file', '-f', help='File with one domain per line')
    parser.add_argument('--json', action='store_true', help='Output as JSON')
    args = parser.parse_args()

    domains = list(args.domains)
    if args.file:
        with open(args.file) as f:
            domains.extend(line.strip() for line in f if line.strip())

    if not domains:
        print("No domains provided. Pass domains as args or --file.")
        sys.exit(1)

    print(f"\nScanning {len(domains)} domains for WordPress...\n")
    start = time.time()
    results = asyncio.run(scan_batch(domains))
    elapsed = time.time() - start

    wp_count = sum(1 for r in results if r['is_wordpress'])

    if args.json:
        print(json.dumps(results, indent=2))
    else:
        for r in results:
            status = 'WordPress' if r['is_wordpress'] else 'Not WP'
            err = f" ({r['error']})" if r.get('error') else ''
            active_signals = [k for k, v in r['signals'].items() if v]
            sig_str = ', '.join(active_signals) if active_signals else 'none'
            print(f"  [{status:>12}] {r['domain']:<40} conf={r['confidence']:>3}  signals: {sig_str}{err}")

    print(f"\n  {wp_count}/{len(results)} confirmed WordPress ({elapsed:.1f}s)\n")


if __name__ == '__main__':
    run_cli()
