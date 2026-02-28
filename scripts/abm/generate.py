#!/usr/bin/env python3
"""Page generation module - uses Exa deep research + Grok for personalized landing page copy."""

import json
import os
import re
import sqlite3
import time
import requests

DB_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'crm.db')
PAGES_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'abm', 'pages')

# Voice rules injected into Grok prompts
VOICE_RULES = """
Voice rules:
- No em dashes. Use " - " (spaced hyphen) instead.
- No authority signaling ("as an expert", "in my experience")
- No hype words ("revolutionary", "game-changing", "cutting-edge")
- Tone: practitioner, not salesy. Show you've done the research.
- Every stat must be real (from the research provided). No fabrication.
- Challenges must be specific to the company, referencing their actual business context.
- Short, punchy sentences. No filler.
"""

PAGE_DATA_SCHEMA = """
Return a JSON object matching this exact schema:
{
  "headline": "Built for {Company}",
  "subheadline": "One line about what you'd build for them, specific to their business",
  "stats": [
    { "value": "$XXM", "label": "Label" }
  ],
  "challenges": [
    { "icon": "01", "title": "Short title", "desc": "2-3 sentences specific to their business" }
  ],
  "deliverables": [
    { "title": "System Name", "desc": "What this builds and how it integrates", "tags": ["Tag1", "Tag2", "Tag3"] }
  ],
  "engagementSteps": [
    { "title": "Step Name", "subtitle": "Month 1", "desc": "What happens" }
  ],
  "faqItems": [
    { "question": "Question?", "answer": "Answer." }
  ],
  "stackItems": [
    { "name": "Tool Name", "role": "What it does" }
  ],
  "theme": {
    "primary": "#hexcolor",
    "primaryLight": "#hexcolor",
    "primaryGlow": "rgba(r, g, b, 0.12)"
  }
}

Requirements:
- 5 stats (all real, from the research data)
- 4 challenges (specific to this company's business)
- 4 deliverables (mapped to their actual pain points)
- 3 engagement steps (Month 1, Month 2, Month 3)
- 6 FAQ items
- 5 stack items (based on their likely tech stack)
- Theme color should match their brand. Look at their website for brand color.
"""


def get_db():
    return sqlite3.connect(os.path.abspath(DB_PATH))


def grok_call(system_prompt, user_prompt, temperature=0.7):
    """Call Grok (xAI) API."""
    XAI_API_KEY = os.environ.get('XAI_API_KEY', '')
    if not XAI_API_KEY:
        raise ValueError("XAI_API_KEY not set")

    resp = requests.post(
        'https://api.x.ai/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {XAI_API_KEY}',
            'Content-Type': 'application/json',
        },
        json={
            'model': 'grok-3-mini',
            'messages': [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_prompt},
            ],
            'temperature': temperature,
        },
        timeout=120,
    )
    resp.raise_for_status()
    return resp.json()['choices'][0]['message']['content']


def exa_deep_dive(company_name, domain):
    """Additional deep research for page generation."""
    from exa_py import Exa

    exa = Exa(api_key=os.environ.get('EXA_API_KEY', ''))
    research = []

    queries = [
        f"{company_name} blog product updates",
        f"{company_name} press release funding news",
        f"{company_name} jobs careers sales marketing",
        f"site:{domain} about company",
    ]

    for query in queries:
        try:
            results = exa.search(
                query, num_results=2,
            )
            for r in results.results:
                research.append({
                    'title': getattr(r, 'title', ''),
                    'text': (getattr(r, 'text', '') or '')[:800],
                    'url': getattr(r, 'url', ''),
                })
            time.sleep(1)
        except Exception as e:
            print(f"    [!] Exa deep dive failed: {e}")
            time.sleep(1)

    return research


def generate_contact_vibe(contact, research_context):
    """Generate a professional vibe summary for the contact."""
    system = f"""You are a professional analyst. Generate a 2-sentence professional personality summary.
Focus on their role, likely priorities, and communication style based on their title and company context.
NOT personal - purely professional. {VOICE_RULES}"""

    user = f"""Contact: {contact['first_name']} {contact['last_name']}
Title: {contact.get('title', 'Unknown')}
Company context: {research_context[:1000]}
LinkedIn: {contact.get('linkedin_url', 'N/A')}

Generate a 2-sentence professional vibe summary. What matters to this person professionally?"""

    return grok_call(system, user, temperature=0.6)


def generate_page_copy(company, contact, research_data, deep_research, vibe):
    """Generate all landing page content via Grok."""
    # Compile all research into context
    research_text = json.dumps(research_data, indent=2)[:3000] if research_data else "No prior research available."
    deep_text = "\n".join([
        f"- {r.get('title', '')}: {(r.get('text', '') or '')[:300]}"
        for r in deep_research
    ])[:2000]

    system = f"""You are a sales infrastructure consultant writing personalized landing page content.
You're writing for Shawn - a practitioner who builds AI-powered sales infrastructure for B2B SaaS companies.

{VOICE_RULES}

{PAGE_DATA_SCHEMA}

CRITICAL: Return ONLY valid JSON. No markdown fencing, no explanation, just the JSON object."""

    user = f"""Company: {company['name']}
Domain: {company['domain']}
Contact: {contact['first_name']} {contact['last_name']} - {contact.get('title', '')}
Contact Vibe: {vibe}

Research data:
{research_text}

Deep research:
{deep_text}

Generate the complete PageData JSON for this company's personalized landing page."""

    for attempt in range(3):
        try:
            raw = grok_call(system, user, temperature=0.7)

            # Strip markdown fences if present
            raw = raw.strip()
            if raw.startswith('```'):
                raw = re.sub(r'^```(?:json)?\n?', '', raw)
                raw = re.sub(r'\n?```$', '', raw)

            return json.loads(raw)
        except (json.JSONDecodeError, KeyError) as e:
            print(f"    [!] JSON parse failed (attempt {attempt+1}): {e}")
            if attempt < 2:
                time.sleep(2)

    return None


def slugify(name):
    """Convert company name to URL slug."""
    slug = name.lower().strip()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug


def page_exists(slug):
    """Check if a page JSON already exists."""
    return os.path.exists(os.path.join(PAGES_DIR, f'{slug}.json'))


def save_page(slug, page_data):
    """Save PageData JSON to disk."""
    os.makedirs(PAGES_DIR, exist_ok=True)
    filepath = os.path.join(PAGES_DIR, f'{slug}.json')
    with open(filepath, 'w') as f:
        json.dump(page_data, f, indent=2, ensure_ascii=False)
    return filepath


def run(limit=100, resume=True):
    """Main entry point for generate step."""
    print(f"\n[Step 3] Page Generation via Exa + Grok (limit={limit})")

    conn = get_db()

    # Get accounts with contacts
    accounts = conn.execute(
        """SELECT a.id, a.name, a.domain, a.exa_research
           FROM accounts a
           WHERE EXISTS (SELECT 1 FROM contacts c WHERE c.account_id = a.id)
           ORDER BY a.id LIMIT ?""",
        (limit,),
    ).fetchall()

    if not accounts:
        print("  No accounts with contacts. Run research + prospect steps first.")
        return 0

    print(f"  Found {len(accounts)} accounts with contacts\n")

    generated = 0
    for i, (account_id, name, domain, exa_research) in enumerate(accounts):
        slug = slugify(name)

        if resume and page_exists(slug):
            print(f"  [{i+1}/{len(accounts)}] {name} - page exists, skipping")
            continue

        print(f"  [{i+1}/{len(accounts)}] {name} ({domain})")

        # Get primary contact
        contact_row = conn.execute(
            """SELECT id, first_name, last_name, email, title, linkedin_url
               FROM contacts WHERE account_id = ? ORDER BY is_primary DESC, id LIMIT 1""",
            (account_id,),
        ).fetchone()

        if not contact_row:
            print(f"    [!] No contacts found, skipping")
            continue

        contact = {
            'id': contact_row[0],
            'first_name': contact_row[1],
            'last_name': contact_row[2],
            'email': contact_row[3],
            'title': contact_row[4],
            'linkedin_url': contact_row[5],
        }

        # Parse existing research
        research_data = {}
        if exa_research:
            try:
                research_data = json.loads(exa_research)
            except json.JSONDecodeError:
                pass

        # Exa deep dive
        print(f"    Deep researching...")
        deep_research = exa_deep_dive(name, domain)
        time.sleep(1)

        # Generate contact vibe
        print(f"    Generating vibe for {contact['first_name']}...")
        research_context = json.dumps(research_data)[:1000] if research_data else name
        vibe = generate_contact_vibe(contact, research_context)

        # Save vibe to contacts table
        conn.execute("UPDATE contacts SET vibe = ? WHERE id = ?", (vibe, contact['id']))
        conn.commit()

        # Dual-write vibe to Supabase
        try:
            from db_supabase import get_supabase
            sb = get_supabase()
            acct = sb.table('accounts').select('id').eq('domain', domain).single().execute()
            if acct.data:
                sb.table('contacts').update({'vibe': vibe}).eq(
                    'account_id', acct.data['id']
                ).eq('first_name', contact['first_name']).execute()
        except Exception as e:
            print(f"    [supabase] vibe warning: {e}")

        time.sleep(1)

        # Generate page copy
        print(f"    Generating page copy...")
        page_copy = generate_page_copy(
            {'name': name, 'domain': domain},
            contact, research_data, deep_research, vibe,
        )

        if not page_copy:
            print(f"    [!] Failed to generate page copy")
            continue

        # Build contacts array from all contacts for this account
        all_contacts_rows = conn.execute(
            """SELECT first_name, last_name, title
               FROM contacts WHERE account_id = ?
               ORDER BY is_primary DESC, id""",
            (account_id,),
        ).fetchall()
        contacts_array = []
        seen_ids = set()
        for cr in all_contacts_rows:
            fname = (cr[0] or '').strip()
            lname = (cr[1] or '').strip()
            full = f"{fname} {lname}".strip() if lname else fname
            cid = re.sub(r'[^a-z0-9]', '', fname.lower())
            if cid in seen_ids or not cid:
                cid = re.sub(r'[^a-z0-9]', '', f"{fname}{lname}".lower())
            if cid in seen_ids or not cid:
                continue
            seen_ids.add(cid)
            contacts_array.append({'id': cid, 'name': full, 'role': cr[2] or ''})

        # Assemble full PageData
        page_data = {
            'slug': slug,
            'company': name,
            'domain': domain,
            'contactName': f"{contact['first_name']} {contact['last_name']}",
            'contactRole': contact.get('title', ''),
            'contacts': contacts_array,
            'theme': page_copy.get('theme', {
                'primary': '#F97316',
                'primaryLight': '#FB923C',
                'primaryGlow': 'rgba(249, 115, 22, 0.12)',
            }),
            'headline': page_copy.get('headline', f'Built for {name}'),
            'subheadline': page_copy.get('subheadline', ''),
            'stats': page_copy.get('stats', []),
            'challenges': page_copy.get('challenges', []),
            'deliverables': page_copy.get('deliverables', []),
            'engagementSteps': page_copy.get('engagementSteps', []),
            'faqItems': page_copy.get('faqItems', []),
            'stackItems': page_copy.get('stackItems', []),
            'generatedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        }

        filepath = save_page(slug, page_data)
        print(f"    Saved: {filepath}")

        # Update landing_pages table
        existing_lp = conn.execute(
            "SELECT id FROM landing_pages WHERE account_id = ? AND slug = ?",
            (account_id, slug),
        ).fetchone()

        page_url = f"https://thegtmos.ai/for/{slug}"
        if existing_lp:
            conn.execute(
                "UPDATE landing_pages SET page_data = ?, url = ?, status = 'draft', updated_at = datetime('now') WHERE id = ?",
                (json.dumps(page_data), page_url, existing_lp[0]),
            )
        else:
            conn.execute(
                """INSERT INTO landing_pages
                   (account_id, contact_id, slug, url, page_data, template, status, views, created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?, 'abm-v1', 'draft', 0, datetime('now'), datetime('now'))""",
                (account_id, contact['id'], slug, page_url, json.dumps(page_data)),
            )

        conn.commit()

        # Dual-write landing page to Supabase
        try:
            from db_supabase import get_supabase
            sb = get_supabase()
            sb.table('landing_pages').upsert({
                'slug': slug,
                'url': page_url,
                'page_data': page_data,
                'template': 'abm-v1',
                'status': 'draft',
            }, on_conflict='slug').execute()
            print(f"    [supabase] Synced to Supabase - live at {page_url}")
        except Exception as e:
            print(f"    [supabase] Warning: {e}")
        generated += 1
        time.sleep(1)

    conn.close()
    print(f"\n  Generation complete. {generated} pages created.")
    return generated


if __name__ == "__main__":
    run()
