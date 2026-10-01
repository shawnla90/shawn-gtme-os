#!/usr/bin/env python3
"""Apollo job-title search workflow.

Search Apollo for people by title + seniority + geo + company size (and optionally
a domain list), post-filter the titles so non-GTM roles don't leak through, cap
contacts per domain, dedupe, and write a CSV or SQLite table. Optional second step
enriches the survivors with people/bulk_match (this is the step that spends credits).

Zero dependencies beyond the Python standard library.

Setup:
  export APOLLO_API_KEY=...   # Settings -> Integrations -> API in Apollo

Examples:
  # Enterprise GTM leaders in the US, 1,000+ employees, preview the payload only
  python3 title_search_workflow.py \
    --titles "VP Sales" "VP Revenue" "Head of Growth" "Director Revenue Operations" \
    --seniorities vp director head \
    --locations "United States" \
    --employee-ranges 1001-5000 5001-10000 10001+ \
    --pages 3 --dry-run

  # Same search, but only inside a target account list, write CSV
  python3 title_search_workflow.py \
    --titles "VP Sales" "CRO" --seniorities vp c_suite \
    --domains-file accounts.txt --out contacts.csv

  # Search, then enrich the survivors (spends credits, max 10 ids per call)
  python3 title_search_workflow.py ... --out contacts.csv --enrich

Apollo API notes (checked against docs.apollo.io, Oct 2026; re-verify before relying on them):
  - POST /api/v1/mixed_people/api_search returns people + pagination. Search itself
    costs 0 credits but needs a master API key (or api_search access on your key).
    Search results do not include revealed emails or phones. That is what --enrich is for.
  - per_page max is 100. Apollo caps what search can display at 50,000 records (500 pages).
  - q_organization_domains_list takes up to 1,000 domains, no www or @.
  - POST /api/v1/people/bulk_match takes up to 10 ids per call and consumes credits
    (roughly 1 per revealed email; mobile numbers cost more).
  - Seniority values Apollo accepts: owner, founder, c_suite, partner, vp, head,
    director, manager, senior, entry, intern.
  - Employee ranges are strings like "1001,5000". Pass them here as 1001-5000 or 10001+.
"""

import argparse
import csv
import json
import os
import sqlite3
import sys
import time
import urllib.error
import urllib.request
from collections import defaultdict

APOLLO_BASE = "https://api.apollo.io/api/v1"
SEARCH_ENDPOINT = f"{APOLLO_BASE}/mixed_people/api_search"
BULK_MATCH_ENDPOINT = f"{APOLLO_BASE}/people/bulk_match"

VALID_SENIORITIES = {
    "owner", "founder", "c_suite", "partner", "vp", "head",
    "director", "manager", "senior", "entry", "intern",
}

# --- Title post-filter -------------------------------------------------------
# Apollo filters on seniority and title keywords, but a VP of People is still a VP.
# This pass keeps the function honest. Edit these lists for your own ICP.

ALLOWLIST = [
    "sales", "revenue", "growth", "marketing", "demand gen", "demand generation",
    "business development", "bdr", "sdr", "account exec", "account manager",
    "customer success", "client success", "enablement", "partnerships", "channel",
    "alliances", "go-to-market", "gtm", "commercial", "cro", "cmo", "cso",
    "chief revenue", "chief marketing", "chief sales", "chief commercial",
    "chief growth", "field marketing", "revops", "rev ops", "revenue operations",
    "sales operations", "marketing operations", "general manager", "managing director",
]

BLOCKLIST = [
    "recruit", "talent", "hr ", "hr,", "human resource", "people ops",
    "people operations", "people &", "hrbp", "software engineer",
    "engineering manager", "engineering lead", "developer", "devops",
    "platform engineer", "creative director", "art director", "ux ", "ui ",
    "community", "social media", "content creator", "product manager",
    "product lead", "product dir", "legal", "counsel", "compliance",
    "finance director", "controller", "accounting", "investment", "investor",
    "portfolio", "data scientist", "data engineer", "ml engineer",
    "machine learning", "research", "editor", "editorial", "journalist",
    "professor", "academic", "teacher",
]

SENIOR_PREFIXES = [
    "vp ", "vp,", "vp of", "vice president", "svp", "evp", "avp",
    "director", "sr director", "senior director", "head of",
]


def is_relevant_title(title):
    """True if the title reads as sales / marketing / revenue / growth / CS."""
    if not title:
        return False
    t = title.lower().strip()
    # "VP People" is a VP. It is not a buyer. Catch the people/HR family explicitly.
    if "people" in t and "salespeople" not in t:
        return False
    for blocked in BLOCKLIST:
        if blocked in t:
            return False
    for allowed in ALLOWLIST:
        if allowed in t:
            return True
    for prefix in SENIOR_PREFIXES:
        if t.startswith(prefix):
            return True
    return False


# --- HTTP -------------------------------------------------------------------

def apollo_post(url, payload, api_key, max_retries=4):
    """POST JSON to Apollo with exponential backoff on 429 / 5xx."""
    body = json.dumps(payload).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "X-Api-Key": api_key,
    }
    for attempt in range(max_retries):
        req = urllib.request.Request(url, data=body, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and attempt < max_retries - 1:
                wait = 2 ** (attempt + 1)
                print(f"  [retry] HTTP {e.code}, sleeping {wait}s", file=sys.stderr)
                time.sleep(wait)
                continue
            detail = e.read().decode("utf-8", errors="replace")[:300]
            raise SystemExit(f"Apollo HTTP {e.code}: {detail}")
        except urllib.error.URLError as e:
            if attempt < max_retries - 1:
                time.sleep(2 ** (attempt + 1))
                continue
            raise SystemExit(f"Network error: {e}")


# --- Payload ----------------------------------------------------------------

def normalize_range(r):
    """Accept 1001-5000, 1001,5000 or 10001+ and return Apollo's 'min,max' string."""
    r = r.strip()
    if r.endswith("+"):
        return f"{r[:-1]},1000000"
    if "-" in r:
        lo, hi = r.split("-", 1)
        return f"{lo.strip()},{hi.strip()}"
    return r


def build_payload(args, page):
    payload = {
        "page": page,
        "per_page": args.per_page,
    }
    if args.titles:
        payload["person_titles"] = args.titles
        payload["include_similar_titles"] = not args.exact_titles
    if args.seniorities:
        payload["person_seniorities"] = args.seniorities
    if args.locations:
        payload["person_locations"] = args.locations
    if args.employee_ranges:
        payload["organization_num_employees_ranges"] = [
            normalize_range(r) for r in args.employee_ranges
        ]
    if args.domains:
        payload["q_organization_domains_list"] = args.domains
    if args.keywords:
        payload["q_keywords"] = args.keywords
    return payload


# --- Row shaping ------------------------------------------------------------

def person_to_row(p):
    org = p.get("organization") or {}
    return {
        "apollo_id": p.get("id", ""),
        "first_name": p.get("first_name", ""),
        "last_name": p.get("last_name", ""),
        "title": p.get("title", ""),
        "seniority": p.get("seniority", ""),
        "linkedin_url": p.get("linkedin_url", ""),
        "email": p.get("email", ""),
        "email_status": p.get("email_status", ""),
        "city": p.get("city", ""),
        "state": p.get("state", ""),
        "country": p.get("country", ""),
        "company_name": org.get("name", ""),
        "company_domain": (org.get("primary_domain") or "").lower(),
        "company_employees": org.get("estimated_num_employees", ""),
        "company_industry": org.get("industry", ""),
        "title_relevant": "",
        "source": "apollo_api_search",
    }


FIELDNAMES = list(person_to_row({}).keys())


# --- Output -----------------------------------------------------------------

def write_csv(rows, path):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDNAMES)
        w.writeheader()
        w.writerows(rows)


def write_sqlite(rows, path, table="apollo_contacts"):
    con = sqlite3.connect(path)
    cols = ", ".join(f"{c} TEXT" for c in FIELDNAMES)
    con.execute(f"CREATE TABLE IF NOT EXISTS {table} ({cols}, PRIMARY KEY (apollo_id))")
    placeholders = ", ".join("?" for _ in FIELDNAMES)
    con.executemany(
        f"INSERT OR REPLACE INTO {table} ({', '.join(FIELDNAMES)}) VALUES ({placeholders})",
        [[r.get(c, "") for c in FIELDNAMES] for r in rows],
    )
    con.commit()
    con.close()


# --- Enrich -----------------------------------------------------------------

def enrich_rows(rows, api_key, reveal_personal_emails=False):
    """Hit people/bulk_match in batches of 10. This step spends credits."""
    enriched = {}
    ids = [r["apollo_id"] for r in rows if r["apollo_id"]]
    for i in range(0, len(ids), 10):
        batch = ids[i:i + 10]
        payload = {
            "details": [{"id": pid} for pid in batch],
            "reveal_personal_emails": reveal_personal_emails,
        }
        data = apollo_post(BULK_MATCH_ENDPOINT, payload, api_key)
        for m in data.get("matches") or []:
            if m and m.get("id"):
                enriched[m["id"]] = m
        print(f"  [enrich] {min(i + 10, len(ids))}/{len(ids)}", file=sys.stderr)
        time.sleep(0.5)
    for r in rows:
        m = enriched.get(r["apollo_id"])
        if m:
            r["email"] = m.get("email") or r["email"]
            r["email_status"] = m.get("email_status") or r["email_status"]
            r["linkedin_url"] = m.get("linkedin_url") or r["linkedin_url"]
    return rows


# --- Main -------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--titles", nargs="*", default=[], help="Job titles to search (space separated, quote each)")
    ap.add_argument("--exact-titles", action="store_true", help="Disable Apollo's similar-title expansion")
    ap.add_argument("--seniorities", nargs="*", default=[], help=f"Any of: {', '.join(sorted(VALID_SENIORITIES))}")
    ap.add_argument("--locations", nargs="*", default=[], help='Person locations, e.g. "United States" "Toronto, Canada"')
    ap.add_argument("--employee-ranges", nargs="*", default=[], help="Company size bands, e.g. 201-500 1001-5000 10001+")
    ap.add_argument("--domains", nargs="*", default=[], help="Company domains to restrict the search to")
    ap.add_argument("--domains-file", help="Text file with one domain per line")
    ap.add_argument("--keywords", help="Free-text keyword filter (q_keywords)")
    ap.add_argument("--pages", type=int, default=1, help="Pages to pull (default 1)")
    ap.add_argument("--per-page", type=int, default=100, help="Results per page, max 100")
    ap.add_argument("--max-per-domain", type=int, default=10, help="Contact cap per company domain (default 10)")
    ap.add_argument("--no-title-filter", action="store_true", help="Skip the function post-filter")
    ap.add_argument("--out", default="apollo_contacts.csv", help="Output path (.csv or .db/.sqlite)")
    ap.add_argument("--enrich", action="store_true", help="Run people/bulk_match on survivors (spends credits)")
    ap.add_argument("--reveal-personal-emails", action="store_true", help="Pass reveal_personal_emails=true on enrich")
    ap.add_argument("--dry-run", action="store_true", help="Print the first request payload and exit")
    args = ap.parse_args()

    if args.domains_file:
        with open(args.domains_file, encoding="utf-8") as f:
            args.domains += [d.strip().lower() for d in f if d.strip() and not d.startswith("#")]
    args.domains = sorted(set(d.replace("https://", "").replace("http://", "").split("/")[0].removeprefix("www.") for d in args.domains))

    bad = [s for s in args.seniorities if s not in VALID_SENIORITIES]
    if bad:
        raise SystemExit(f"Unknown seniority values: {bad}. Valid: {sorted(VALID_SENIORITIES)}")
    if not (args.titles or args.seniorities or args.domains or args.keywords):
        raise SystemExit("Give at least one of --titles, --seniorities, --domains, --keywords")
    args.per_page = max(1, min(args.per_page, 100))

    first_payload = build_payload(args, page=1)
    if args.dry_run:
        print(json.dumps(first_payload, indent=2))
        print(f"\n[dry-run] would POST to {SEARCH_ENDPOINT} for {args.pages} page(s)")
        return

    api_key = os.environ.get("APOLLO_API_KEY", "")
    if not api_key:
        raise SystemExit("APOLLO_API_KEY not set. export APOLLO_API_KEY=... and rerun.")

    # 1. Search
    raw = []
    for page in range(1, args.pages + 1):
        data = apollo_post(SEARCH_ENDPOINT, build_payload(args, page), api_key)
        people = data.get("people") or []
        pag = data.get("pagination") or {}
        print(f"  [search] page {page}: {len(people)} people (total_entries={pag.get('total_entries', '?')})", file=sys.stderr)
        raw.extend(people)
        if not people or (pag.get("total_pages") and page >= int(pag["total_pages"])):
            break
        time.sleep(0.5)

    # 2. Dedupe on apollo_id
    seen, rows = set(), []
    for p in raw:
        pid = p.get("id")
        if not pid or pid in seen:
            continue
        seen.add(pid)
        rows.append(person_to_row(p))
    deduped = len(rows)

    # 3. Title post-filter
    dropped_title = 0
    for r in rows:
        r["title_relevant"] = "yes" if is_relevant_title(r["title"]) else "no"
    if not args.no_title_filter:
        kept = [r for r in rows if r["title_relevant"] == "yes"]
        dropped_title = len(rows) - len(kept)
        rows = kept

    # 4. Domain cap
    per_domain = defaultdict(int)
    capped = []
    dropped_cap = 0
    for r in rows:
        key = r["company_domain"] or r["company_name"]
        if per_domain[key] >= args.max_per_domain:
            dropped_cap += 1
            continue
        per_domain[key] += 1
        capped.append(r)
    rows = capped

    # 5. Optional enrich
    if args.enrich and rows:
        rows = enrich_rows(rows, api_key, args.reveal_personal_emails)

    # 6. Write
    if args.out.endswith((".db", ".sqlite", ".sqlite3")):
        write_sqlite(rows, args.out)
    else:
        write_csv(rows, args.out)

    print("\n  Summary")
    print(f"    raw results:        {len(raw)}")
    print(f"    after dedupe:       {deduped}")
    print(f"    dropped (title):    {dropped_title}")
    print(f"    dropped (cap {args.max_per_domain}/domain): {dropped_cap}")
    print(f"    written:            {len(rows)} -> {args.out}")
    if not args.enrich:
        print("    emails: not revealed. Rerun with --enrich to spend credits on the survivors only.")


if __name__ == "__main__":
    main()
