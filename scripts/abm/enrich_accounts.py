#!/usr/bin/env python3
"""Account enrichment via Exa company research + Grok extraction.

Uses Exa to research company websites (with Firecrawl as optional upgrade
when credits are available), then Grok to extract structured
firmographic/technographic data. Fills in industry, tech_stack, icp_score
for accounts that Apollo didn't cover.

Usage:
  python3 scripts/abm/enrich_accounts.py --limit 10 --dry-run
  python3 scripts/abm/enrich_accounts.py --limit 50
  python3 scripts/abm/enrich_accounts.py --limit 50 --force
  python3 scripts/abm/enrich_accounts.py --limit 20 --source firecrawl
"""

import argparse
import json
import os
import sys
import time

import requests

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

# Grok extraction prompt
EXTRACT_PROMPT_TEMPLATE = (
    "Analyze this company research data and extract structured data.\n"
    "Return ONLY valid JSON with these fields (use null if unknown):\n\n"
    '{\n'
    '  "industry": "string - the company\'s primary industry (e.g. Sales Technology, Marketing Automation, Revenue Intelligence)",\n'
    '  "product_description": "string - 1-2 sentence description of what they sell",\n'
    '  "tech_signals": ["array of technologies/integrations mentioned (e.g. Salesforce, HubSpot, Slack)"],\n'
    '  "employee_signals": "string - any mention of team size, hiring, or office locations",\n'
    '  "funding_signals": "string - any mention of investors, funding rounds, or valuations",\n'
    '  "market_segment": "string - one of: SMB, Mid-Market, Enterprise, or Mixed",\n'
    '  "use_cases": ["array of 2-4 key use cases or problems they solve"],\n'
    '  "icp_fit": "string - how well this company fits as a B2B SaaS GTM prospect: strong, moderate, weak, or not_fit"\n'
    '}\n\n'
)


# --- Content Sources ---

def exa_research(domain, company_name):
    """Research a company via Exa search API. Returns text content."""
    from exa_py import Exa

    api_key = os.environ.get('EXA_API_KEY', '')
    if not api_key:
        return None

    exa = Exa(api_key=api_key)
    texts = []

    queries = [
        f"{company_name} {domain} company overview product",
        f"{company_name} funding investors technology stack",
    ]

    for query in queries:
        try:
            results = exa.search(query, num_results=3)
            for r in results.results:
                text = getattr(r, 'text', '') or ''
                title = getattr(r, 'title', '') or ''
                if text:
                    texts.append(f"## {title}\n{text[:1500]}")
            time.sleep(0.5)
        except Exception as e:
            print(f"    [!] Exa search failed: {e}")

    if not texts:
        return None

    return {
        'source': 'exa',
        'content': '\n\n'.join(texts)[:6000],
        'query_count': len(queries),
    }


def firecrawl_scrape(domain):
    """Scrape a domain homepage with Firecrawl, return markdown."""
    api_key = os.environ.get('FIRECRAWL_API_KEY', '')
    if not api_key:
        return None

    try:
        resp = requests.post(
            'https://api.firecrawl.dev/v1/scrape',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json',
            },
            json={'url': f'https://{domain}', 'formats': ['markdown']},
            timeout=30,
        )

        if resp.status_code == 200:
            data = resp.json().get('data', {})
            markdown = data.get('markdown', '')
            if markdown:
                return {
                    'source': 'firecrawl',
                    'content': markdown[:6000],
                    'metadata': data.get('metadata', {}),
                }
        elif resp.status_code == 402:
            return None  # Credits exhausted, silent fail
        else:
            print(f"    [!] Firecrawl {resp.status_code}")

    except Exception as e:
        print(f"    [!] Firecrawl error: {e}")

    return None


def get_content(domain, company_name, source='exa'):
    """Get company content from the specified source."""
    if source == 'firecrawl':
        result = firecrawl_scrape(domain)
        if result:
            return result
        # Fall through to Exa if Firecrawl fails
        print(f"    [fallback] Firecrawl unavailable, using Exa")

    return exa_research(domain, company_name)


# --- Grok Extraction ---

def grok_extract(company_name, domain, content):
    """Use Grok to extract structured data from company content."""
    api_key = os.environ.get('XAI_API_KEY', '')
    if not api_key:
        raise ValueError("XAI_API_KEY not set")

    content_trimmed = content[:5000]

    prompt = (
        EXTRACT_PROMPT_TEMPLATE
        + f"Company: {company_name}\n"
        + f"Domain: {domain}\n\n"
        + f"Research content:\n{content_trimmed}"
    )

    try:
        resp = requests.post(
            'https://api.x.ai/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json',
            },
            json={
                'model': 'grok-3-mini',
                'messages': [{'role': 'user', 'content': prompt}],
                'temperature': 0.1,
            },
            timeout=30,
        )

        if resp.status_code != 200:
            print(f"    [!] Grok {resp.status_code}: {resp.text[:100]}")
            return None

        text = resp.json()['choices'][0]['message']['content']

        # Extract JSON from response
        if '```json' in text:
            text = text.split('```json')[1].split('```')[0]
        elif '```' in text:
            text = text.split('```')[1].split('```')[0]

        return json.loads(text.strip())

    except (json.JSONDecodeError, KeyError, IndexError) as e:
        print(f"    [!] Failed to parse Grok response: {e}")
        return None
    except Exception as e:
        print(f"    [!] Grok error: {e}")
        return None


# --- Database Updates ---

def update_account(sb, account_id, extracted, research_data, has_industry):
    """Update account with extracted firmographic/technographic data."""
    updates = {}

    # Store research data in exa_research JSONB
    updates['exa_research'] = {
        'source': research_data.get('source', 'unknown'),
        'content': research_data.get('content', '')[:3000],
        'extracted': extracted,
    }

    if extracted:
        # Only fill in missing structured fields
        industry = extracted.get('industry')
        if industry and not has_industry:
            updates['industry'] = industry

        tech_signals = extracted.get('tech_signals') or []
        if tech_signals:
            updates['tech_stack'] = ', '.join(tech_signals[:20])

        icp_fit = extracted.get('icp_fit', '')
        score_map = {'strong': 85, 'moderate': 65, 'weak': 40, 'not_fit': 15}
        if icp_fit in score_map:
            updates['icp_score'] = score_map[icp_fit]

    sb.table('accounts').update(updates).eq('id', account_id).execute()
    return bool(extracted)


# --- Main ---

def run(limit=20, dry_run=False, force=False, source='exa'):
    """Main enrichment: research + Grok extraction for all accounts."""
    print(f"\n{'=' * 60}")
    print(f"  Account Enrichment via {source.title()} + Grok {'(DRY RUN)' if dry_run else ''}")
    print(f"{'=' * 60}\n")

    sb = get_supabase()

    # Get accounts needing enrichment
    query = sb.table('accounts').select(
        'id, name, domain, industry, tech_stack, exa_research, icp_score'
    ).not_.is_('domain', 'null').neq('domain', '')

    if not force:
        query = query.is_('exa_research', 'null')

    result = query.order('id').limit(limit).execute()
    accounts = result.data or []

    if not accounts:
        print("  No accounts need enrichment.")
        return 0

    print(f"  Found {len(accounts)} accounts to enrich\n")

    enriched = 0
    content_ok = 0
    failed_content = 0
    failed_extract = 0

    for i, account in enumerate(accounts):
        account_id = account['id']
        name = account['name']
        domain = account['domain']
        has_industry = bool(account.get('industry'))

        status = "has industry" if has_industry else "needs enrichment"
        print(f"  [{i + 1}/{len(accounts)}] {name} ({domain}) - {status}")

        if dry_run:
            print(f"    [DRY RUN] Would research {domain}")
            enriched += 1
            continue

        # Step 1: Get content
        research_data = get_content(domain, name, source=source)
        if not research_data or not research_data.get('content'):
            failed_content += 1
            print(f"    [!] No content found")
            sb.table('accounts').update({
                'exa_research': {'error': 'no_content', 'domain': domain},
            }).eq('id', account_id).execute()
            time.sleep(0.5)
            continue

        content_ok += 1
        src = research_data.get('source', '?')
        content_len = len(research_data['content'])
        print(f"    + {src}: {content_len:,} chars")

        # Step 2: Grok extraction
        extracted = grok_extract(name, domain, research_data['content'])
        if not extracted:
            failed_extract += 1
            sb.table('accounts').update({
                'exa_research': {
                    'source': src,
                    'content': research_data['content'][:3000],
                },
            }).eq('id', account_id).execute()
            print(f"    [!] Grok extraction failed, stored raw content")
            time.sleep(0.5)
            continue

        # Step 3: Update account
        updated = update_account(sb, account_id, extracted, research_data, has_industry)
        if updated:
            enriched += 1
            ind = extracted.get('industry', '?')
            fit = extracted.get('icp_fit', '?')
            techs = ', '.join((extracted.get('tech_signals') or [])[:3])
            print(f"    + {ind} | ICP: {fit} | Tech: {techs}")

        time.sleep(1)

    # Summary
    print(f"\n{'=' * 60}")
    print(f"  SUMMARY {'(DRY RUN)' if dry_run else ''}")
    print(f"{'=' * 60}")
    print(f"  Accounts processed:    {len(accounts)}")
    print(f"  Content retrieved:     {content_ok}")
    print(f"  Successfully enriched: {enriched}")
    print(f"  Content failures:      {failed_content}")
    print(f"  Extraction failures:   {failed_extract}")
    print(f"{'=' * 60}\n")

    return enriched


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Enrich accounts via Exa/Firecrawl + Grok')
    parser.add_argument('--limit', type=int, default=20, help='Max accounts to process')
    parser.add_argument('--dry-run', action='store_true', help='Preview without changes')
    parser.add_argument('--force', action='store_true', help='Re-enrich all accounts')
    parser.add_argument('--source', choices=['exa', 'firecrawl'], default='exa',
                        help='Content source (default: exa, falls back to exa if firecrawl fails)')
    args = parser.parse_args()
    run(limit=args.limit, dry_run=args.dry_run, force=args.force, source=args.source)
