#!/usr/bin/env python3
"""Exa company research module - finds and researches ICP-matched companies."""

import json
import os
import sqlite3
import time
from exa_py import Exa

DB_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'crm.db')
EXA_API_KEY = os.environ.get('EXA_API_KEY', '')

# ICP search queries - rotate through these for variety
SEARCH_QUERIES = [
    "B2B SaaS company series A B C D growth stage sales team",
    "fast-growing B2B software company sales development team",
    "B2B SaaS startup scaling sales outbound team",
    "enterprise software company expanding sales operations",
    "growth stage SaaS company hiring sales development reps",
]

# Deep research queries per company
DEEP_QUERIES = [
    "{company} company overview funding valuation",
    "{company} {domain} technology stack engineering blog",
    "{company} recent news product launch 2025 2026",
    "{company} hiring jobs sales development",
]


def get_exa():
    if not EXA_API_KEY:
        raise ValueError("EXA_API_KEY not set. Export it or add to .env")
    return Exa(api_key=EXA_API_KEY)


def get_db():
    return sqlite3.connect(os.path.abspath(DB_PATH))


def already_researched(conn):
    """Return set of domains that already have exa_research."""
    cur = conn.execute("SELECT domain FROM accounts WHERE exa_research IS NOT NULL AND exa_research != ''")
    return {row[0] for row in cur.fetchall()}


def find_companies(exa, limit=100):
    """Search Exa for ICP-matched companies."""
    companies = []
    seen_domains = set()
    per_query = max(limit // len(SEARCH_QUERIES), 10)

    for query in SEARCH_QUERIES:
        if len(companies) >= limit:
            break

        print(f"  Searching: {query[:60]}...")
        try:
            results = exa.search(
                query,
                num_results=per_query,
                type="company",
                use_autoprompt=True,
            )

            for r in results.results:
                domain = getattr(r, 'url', '') or ''
                # Extract domain from URL
                domain = domain.replace('https://', '').replace('http://', '').split('/')[0]
                if domain and domain not in seen_domains:
                    seen_domains.add(domain)
                    companies.append({
                        'title': getattr(r, 'title', '') or domain,
                        'domain': domain,
                        'url': getattr(r, 'url', ''),
                        'snippet': getattr(r, 'text', '')[:500] if hasattr(r, 'text') else '',
                    })

            time.sleep(1)  # Rate limit
        except Exception as e:
            print(f"  [!] Search failed: {e}")
            time.sleep(2)

    return companies[:limit]


def research_company(exa, company):
    """Deep research a single company via Exa."""
    research = {
        'domain': company['domain'],
        'name': company['title'],
        'initial_snippet': company.get('snippet', ''),
        'deep_research': [],
    }

    for query_template in DEEP_QUERIES:
        query = query_template.format(
            company=company['title'],
            domain=company['domain'],
        )

        try:
            results = exa.search_and_contents(
                query,
                num_results=3,
                text={"max_characters": 1000},
                use_autoprompt=True,
            )

            for r in results.results:
                research['deep_research'].append({
                    'query': query,
                    'title': getattr(r, 'title', ''),
                    'url': getattr(r, 'url', ''),
                    'text': getattr(r, 'text', '')[:1000] if hasattr(r, 'text') else '',
                })

            time.sleep(1)  # Rate limit
        except Exception as e:
            print(f"    [!] Deep research failed for query '{query[:40]}': {e}")
            time.sleep(2)

    return research


def save_account(conn, company, research):
    """Upsert account into CRM."""
    # Check if account exists by domain
    existing = conn.execute(
        "SELECT id FROM accounts WHERE domain = ?", (company['domain'],)
    ).fetchone()

    research_json = json.dumps(research, ensure_ascii=False)

    if existing:
        conn.execute(
            "UPDATE accounts SET exa_research = ?, name = ? WHERE id = ?",
            (research_json, company['title'], existing[0]),
        )
    else:
        conn.execute(
            """INSERT INTO accounts (name, domain, source, stage, exa_research, created_at, updated_at)
               VALUES (?, ?, 'exa_research', 'prospect', ?, datetime('now'), datetime('now'))""",
            (company['title'], company['domain'], research_json),
        )

    conn.commit()


def run(limit=100, resume=True):
    """Main entry point for research step."""
    print(f"\n[Step 1] Company Research via Exa (limit={limit})")

    exa = get_exa()
    conn = get_db()

    # Check what's already done
    done_domains = already_researched(conn) if resume else set()
    if done_domains:
        print(f"  Resuming - {len(done_domains)} accounts already researched")

    # Find companies
    print("\n  Finding companies...")
    companies = find_companies(exa, limit=limit + len(done_domains))

    # Filter out already-researched
    companies = [c for c in companies if c['domain'] not in done_domains][:limit]
    print(f"  Found {len(companies)} new companies to research\n")

    # Deep research each
    for i, company in enumerate(companies):
        print(f"  [{i+1}/{len(companies)}] Researching {company['title']} ({company['domain']})")
        research = research_company(exa, company)
        save_account(conn, company, research)
        print(f"    Saved. {len(research['deep_research'])} research entries.")

    conn.close()
    print(f"\n  Research complete. {len(companies)} accounts processed.")
    return len(companies)


if __name__ == "__main__":
    run()
