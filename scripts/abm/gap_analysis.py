#!/usr/bin/env python3
"""
Lightweight website gap analysis for ABM touch-2 enrichment.

Checks meta tags, page structure, technical SEO basics, and
Google PageSpeed Insights. Stores results in accounts.gap_analysis JSONB.

Usage:
  python3 scripts/abm/gap_analysis.py --limit 10 --dry-run
  python3 scripts/abm/gap_analysis.py --limit 5
"""

import argparse
import json
import os
import sys
import time
from datetime import datetime, timezone
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

# Add scripts dir to path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

# Load .env
env_path = os.path.join(SCRIPT_DIR, '.env')
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, val = line.split('=', 1)
                os.environ.setdefault(key.strip(), val.strip())

from db_supabase import get_supabase

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
}
PAGESPEED_API = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeedTest'


def fetch_page(domain):
    """Fetch homepage HTML. Returns (html, final_url) or (None, None)."""
    for scheme in ('https://', 'http://'):
        try:
            resp = requests.get(f'{scheme}{domain}', headers=HEADERS, timeout=15, allow_redirects=True)
            if resp.status_code == 200:
                return resp.text, resp.url
        except requests.RequestException:
            continue
    return None, None


def check_meta(soup):
    """Analyze meta tags."""
    title_tag = soup.find('title')
    title_text = title_tag.get_text(strip=True) if title_tag else ''
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    desc_text = meta_desc.get('content', '') if meta_desc else ''
    og_title = soup.find('meta', attrs={'property': 'og:title'})
    canonical = soup.find('link', attrs={'rel': 'canonical'})

    return {
        'title_length': len(title_text),
        'has_description': bool(desc_text),
        'description_length': len(desc_text),
        'has_og': bool(og_title),
        'has_canonical': bool(canonical),
    }


def check_structure(soup):
    """Analyze page structure."""
    h1s = soup.find_all('h1')
    h2s = soup.find_all('h2')
    images = soup.find_all('img')
    images_with_alt = [img for img in images if img.get('alt', '').strip()]

    return {
        'h1_count': len(h1s),
        'h2_count': len(h2s),
        'images': len(images),
        'images_with_alt': len(images_with_alt),
    }


def check_technical(domain):
    """Check robots.txt, sitemap.xml, JSON-LD."""
    results = {'has_robots': False, 'has_sitemap': False, 'has_schema': False}

    for path, key in [('/robots.txt', 'has_robots'), ('/sitemap.xml', 'has_sitemap')]:
        try:
            resp = requests.get(f'https://{domain}{path}', headers=HEADERS, timeout=10)
            results[key] = resp.status_code == 200 and len(resp.text) > 20
        except requests.RequestException:
            pass

    return results


def check_schema(soup):
    """Check for JSON-LD structured data."""
    scripts = soup.find_all('script', attrs={'type': 'application/ld+json'})
    return bool(scripts)


def check_pagespeed(domain):
    """Query Google PageSpeed Insights (free, no key needed)."""
    try:
        resp = requests.get(PAGESPEED_API, params={
            'url': f'https://{domain}',
            'strategy': 'mobile',
            'category': 'performance',
        }, timeout=60)

        if resp.status_code != 200:
            return None

        data = resp.json()
        lighthouse = data.get('lighthouseResult', {})
        categories = lighthouse.get('categories', {})
        audits = lighthouse.get('audits', {})

        score = categories.get('performance', {}).get('score')
        score = int(score * 100) if score is not None else None

        lcp = audits.get('largest-contentful-paint', {}).get('numericValue')
        cls = audits.get('cumulative-layout-shift', {}).get('numericValue')
        inp_audit = audits.get('interaction-to-next-paint', {}) or audits.get('experimental-interaction-to-next-paint', {})
        inp = inp_audit.get('numericValue')

        return {
            'score': score,
            'lcp': round(lcp / 1000, 1) if lcp else None,
            'cls': round(cls, 3) if cls is not None else None,
            'inp': round(inp) if inp else None,
        }
    except Exception:
        return None


def build_issues(meta, structure, technical, has_schema, pagespeed):
    """Convert raw checks into prioritized issue list."""
    issues = []

    # Meta issues
    if meta['title_length'] < 20:
        issues.append({'category': 'meta', 'severity': 'high', 'title': 'Short or missing page title',
                        'detail': f"Title is {meta['title_length']} chars. Aim for 50-60 for search visibility."})
    elif meta['title_length'] > 60:
        issues.append({'category': 'meta', 'severity': 'low', 'title': 'Title too long',
                        'detail': f"Title is {meta['title_length']} chars. Google truncates at ~60."})

    if not meta['has_description']:
        issues.append({'category': 'meta', 'severity': 'high', 'title': 'Missing meta description',
                        'detail': 'No meta description found on homepage. Search engines will auto-generate one.'})

    if not meta['has_og']:
        issues.append({'category': 'meta', 'severity': 'medium', 'title': 'Missing Open Graph tags',
                        'detail': 'No OG tags found. Social shares will look generic.'})

    if not meta['has_canonical']:
        issues.append({'category': 'meta', 'severity': 'low', 'title': 'No canonical URL set',
                        'detail': 'Missing canonical link tag. Could cause duplicate content issues.'})

    # Structure issues
    if structure['h1_count'] == 0:
        issues.append({'category': 'structure', 'severity': 'high', 'title': 'No H1 heading found',
                        'detail': 'Homepage has no H1 tag. This hurts SEO and accessibility.'})
    elif structure['h1_count'] > 1:
        issues.append({'category': 'structure', 'severity': 'low', 'title': f"Multiple H1 tags ({structure['h1_count']})",
                        'detail': 'Best practice is one H1 per page.'})

    if structure['images'] > 0:
        alt_pct = int(100 * structure['images_with_alt'] / structure['images'])
        if alt_pct < 50:
            issues.append({'category': 'structure', 'severity': 'medium', 'title': f"Low image alt text coverage ({alt_pct}%)",
                            'detail': f"{structure['images_with_alt']}/{structure['images']} images have alt text."})

    # Technical issues
    if not technical['has_robots']:
        issues.append({'category': 'technical', 'severity': 'medium', 'title': 'No robots.txt found',
                        'detail': 'Missing robots.txt. Search engines have no crawl directives.'})

    if not technical['has_sitemap']:
        issues.append({'category': 'technical', 'severity': 'medium', 'title': 'No sitemap.xml found',
                        'detail': 'No sitemap at /sitemap.xml. Harder for search engines to discover all pages.'})

    if not has_schema:
        issues.append({'category': 'technical', 'severity': 'low', 'title': 'No structured data (JSON-LD)',
                        'detail': 'No schema.org markup found. Missing rich snippet opportunities.'})

    # Performance issues
    if pagespeed:
        if pagespeed.get('score') is not None and pagespeed['score'] < 50:
            issues.append({'category': 'performance', 'severity': 'high', 'title': f"Poor mobile PageSpeed ({pagespeed['score']}/100)",
                            'detail': f"LCP: {pagespeed.get('lcp', '?')}s, CLS: {pagespeed.get('cls', '?')}"})
        elif pagespeed.get('score') is not None and pagespeed['score'] < 80:
            issues.append({'category': 'performance', 'severity': 'medium', 'title': f"Moderate mobile PageSpeed ({pagespeed['score']}/100)",
                            'detail': f"LCP: {pagespeed.get('lcp', '?')}s, CLS: {pagespeed.get('cls', '?')}"})

        if pagespeed.get('lcp') and pagespeed['lcp'] > 4.0:
            issues.append({'category': 'performance', 'severity': 'high', 'title': f"Slow LCP ({pagespeed['lcp']}s)",
                            'detail': 'Largest Contentful Paint over 4s. Target is under 2.5s.'})

    # Sort by severity
    severity_order = {'high': 0, 'medium': 1, 'low': 2}
    issues.sort(key=lambda x: severity_order.get(x['severity'], 3))

    return issues


def analyze_domain(domain):
    """Run full analysis on a domain. Returns gap_analysis dict or None."""
    html, final_url = fetch_page(domain)
    if not html:
        return None

    soup = BeautifulSoup(html, 'html.parser')

    meta = check_meta(soup)
    structure = check_structure(soup)
    technical = check_technical(domain)
    has_schema = check_schema(soup)
    pagespeed = check_pagespeed(domain)

    issues = build_issues(meta, structure, technical, has_schema, pagespeed)

    # Compute overall score (start at 100, deduct per issue)
    deductions = {'high': 15, 'medium': 8, 'low': 3}
    score = 100
    for issue in issues:
        score -= deductions.get(issue['severity'], 5)
    score = max(0, score)

    return {
        'analyzed_at': datetime.now(timezone.utc).isoformat(),
        'domain': domain,
        'score': score,
        'issues_count': len(issues),
        'issues': issues,
        'pagespeed': pagespeed,
        'meta': meta,
        'structure': structure,
        'technical': technical,
    }


def run(limit=10, dry_run=False):
    """Run gap analysis on eligible accounts."""
    print(f"\n[Gap Analysis] {'DRY RUN - ' if dry_run else ''}Analyzing up to {limit} domains\n")

    sb = get_supabase()

    # Eligible: emailed accounts with no gap analysis yet
    result = sb.table('accounts').select('id, name, domain').eq(
        'outreach_status', 'emailed'
    ).is_('gap_analysis', 'null').order('id').limit(limit).execute()
    accounts = result.data or []

    if not accounts:
        print("  No eligible accounts (need outreach_status='emailed' + no gap_analysis).")
        return 0

    print(f"  Found {len(accounts)} eligible accounts\n")

    analyzed = 0
    for i, account in enumerate(accounts):
        domain = account['domain']
        print(f"  [{i+1}/{len(accounts)}] {account['name']} ({domain})")

        if dry_run:
            print(f"    [DRY RUN] Would analyze {domain}")
            analyzed += 1
            continue

        result = analyze_domain(domain)
        if not result:
            print(f"    [!] Could not fetch {domain}")
            continue

        # Store results
        sb.table('accounts').update({
            'gap_analysis': result
        }).eq('id', account['id']).execute()

        print(f"    Score: {result['score']}/100 | {result['issues_count']} issues found")
        for issue in result['issues'][:3]:
            print(f"      [{issue['severity'].upper()}] {issue['title']}")

        analyzed += 1
        time.sleep(1)  # Be polite

    print(f"\n  Done. {analyzed} domains {'would be ' if dry_run else ''}analyzed.")
    return analyzed


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run website gap analysis for ABM accounts')
    parser.add_argument('--limit', type=int, default=10, help='Max domains to analyze')
    parser.add_argument('--dry-run', action='store_true', help='Preview without analyzing')
    args = parser.parse_args()
    run(limit=args.limit, dry_run=args.dry_run)
