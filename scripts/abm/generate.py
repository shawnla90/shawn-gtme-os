#!/usr/bin/env python3
"""Page generation module - uses Exa deep research + Grok for personalized landing page copy."""

import json
import os
import re
import sys
import time
from datetime import datetime, timedelta, timezone

import requests

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from config import get_grok_headers, get_exa_client, XAI_BASE
from db_supabase import get_supabase

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


def grok_call(system_prompt, user_prompt, temperature=0.7):
    """Call Grok (xAI) API."""
    resp = requests.post(
        f'{XAI_BASE}/chat/completions',
        headers=get_grok_headers(),
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
    exa = get_exa_client()
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
    # Reject junk slugs from Exa returning blog post URLs instead of company names
    if len(slug) > 40:
        return None
    return slug


def page_exists(sb, slug):
    """Check if a landing page already exists in Supabase."""
    result = sb.table('landing_pages').select('id').eq('slug', slug).execute()
    return bool(result.data)


def run(limit=100, resume=True):
    """Main entry point for generate step."""
    print(f"\n[Step 3] Page Generation via Exa + Grok (limit={limit})")

    sb = get_supabase()

    # Get accounts with contacts
    accounts_result = sb.table('accounts').select('id, name, domain, exa_research').order('id').limit(limit).execute()
    accounts = accounts_result.data or []

    # Filter to accounts that have contacts
    accounts_with_contacts = []
    for account in accounts:
        count_result = sb.table('contacts').select('id', count='exact').eq('account_id', account['id']).execute()
        if count_result.count and count_result.count > 0:
            accounts_with_contacts.append(account)

    if not accounts_with_contacts:
        print("  No accounts with contacts. Run research + prospect steps first.")
        return 0

    print(f"  Found {len(accounts_with_contacts)} accounts with contacts\n")

    generated = 0
    for i, account in enumerate(accounts_with_contacts):
        account_id = account['id']
        name = account['name']
        domain = account['domain']
        exa_research = account.get('exa_research')
        slug = slugify(name)

        if not slug:
            print(f"  [{i+1}/{len(accounts_with_contacts)}] {name} - slug too long (junk data), skipping")
            continue

        if resume and page_exists(sb, slug):
            print(f"  [{i+1}/{len(accounts_with_contacts)}] {name} - page exists, skipping")
            continue

        print(f"  [{i+1}/{len(accounts_with_contacts)}] {name} ({domain})")

        # Get primary contact
        contact_result = sb.table('contacts').select(
            'id, first_name, last_name, email, title, linkedin_url'
        ).eq('account_id', account_id).order('is_primary', desc=True).order('id').limit(1).execute()

        if not contact_result.data:
            print(f"    [!] No contacts found, skipping")
            continue

        contact = contact_result.data[0]

        # Parse existing research (already a dict from JSONB)
        research_data = exa_research if isinstance(exa_research, dict) else {}

        # Exa deep dive
        print(f"    Deep researching...")
        deep_research = exa_deep_dive(name, domain)
        time.sleep(1)

        # Generate contact vibe
        print(f"    Generating vibe for {contact['first_name']}...")
        research_context = json.dumps(research_data)[:1000] if research_data else name
        vibe = generate_contact_vibe(contact, research_context)

        # Save vibe to Supabase
        sb.table('contacts').update({'vibe': vibe}).eq('id', contact['id']).execute()
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
        all_contacts_result = sb.table('contacts').select(
            'first_name, last_name, title'
        ).eq('account_id', account_id).order('is_primary', desc=True).order('id').execute()

        contacts_array = []
        seen_ids = set()
        for cr in (all_contacts_result.data or []):
            fname = (cr.get('first_name') or '').strip()
            lname = (cr.get('last_name') or '').strip()
            full = f"{fname} {lname}".strip() if lname else fname
            cid = re.sub(r'[^a-z0-9]', '', fname.lower())
            if cid in seen_ids or not cid:
                cid = re.sub(r'[^a-z0-9]', '', f"{fname}{lname}".lower())
            if cid in seen_ids or not cid:
                continue
            seen_ids.add(cid)
            contacts_array.append({'id': cid, 'name': full, 'role': cr.get('title') or ''})

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

        page_url = f"https://thegtmos.ai/for/{slug}"

        # Upsert to Supabase (primary store - goes live immediately via ISR)
        expires = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
        sb.table('landing_pages').upsert({
            'slug': slug,
            'url': page_url,
            'page_data': page_data,
            'template': 'abm-v1',
            'status': 'live',
            'account_id': account_id,
            'expires_at': expires,
        }, on_conflict='slug').execute()

        # Advance stage to page_live
        sb.table('accounts').update({'stage': 'page_live'}).eq('id', account_id).execute()

        print(f"    Live at {page_url}")
        generated += 1
        time.sleep(1)

    print(f"\n  Generation complete. {generated} pages created.")
    return generated


if __name__ == "__main__":
    run()
