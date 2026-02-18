#!/usr/bin/env python3
"""Generate Touch 2 copy for qualified leads (contact or company score > 5) with email."""

import json
import re
import sys
from pathlib import Path

# Column indices (0-based) - current sheet: MX_Route(18), Touch2(19), Touch1(20)
IDX = {
    "company": 0,
    "contact": 1,
    "contact_score": 2,
    "company_score": 3,
    "mx_route": 18,
    "email_body_t1": 20,  # Touch1 - used to filter leads that got enrichment
    "property_signals": 16,
}

def parse_score(val):
    try:
        return int(val) if val else 0
    except (ValueError, TypeError):
        return 0

def has_touch1(row):
    t1 = row[IDX["email_body_t1"]] if len(row) > IDX["email_body_t1"] else ""
    return bool(t1 and t1.strip())

def qualifies(row):
    c_score = parse_score(row[IDX["contact_score"]] if len(row) > IDX["contact_score"] else 0)
    co_score = parse_score(row[IDX["company_score"]] if len(row) > IDX["company_score"] else 0)
    return c_score > 5 or co_score > 5

def is_emailable(row):
    mx = (row[IDX["mx_route"]] or "").strip().lower() if len(row) > IDX["mx_route"] else ""
    return mx in ("instantly", "heyreach")

# Spin variations for deliverability - no two emails identical
# (no quotes around "switch to Elauwit" - sounds unnatural)
SPIN_GREETINGS = ("Hey ", "Hi ", "")
SPIN_WHO_WIFI = (
    "who on your team ensures WiFi is a good experience for residents",
    "who handles WiFi for residents",
    "who oversees resident connectivity",
    "who manages WiFi across your properties",
)
SPIN_CTA = (
    "I'd like to earn the opportunity to quote the switch to Elauwit for {company}.",
    "Happy to quote the switch to Elauwit for {company} if it's worth exploring.",
    "We can quote the switch to Elauwit for {company} — including any upgrades needed.",
    "I'd love to quote the switch to Elauwit for {company}.",
)
SPIN_PROPERTY_LINE = (
    "And any property that may benefit from an upgraded Managed WiFi experience.",
    "Plus any property that could use an upgraded Managed WiFi experience.",
    "And any that would benefit from upgraded Managed WiFi.",
)
SPIN_EVENTS = (
    "Also, are you attending any industry events this year? Happy to skip the messages and grab 10 minutes in-person if so.",
    "Are you going to any conferences or events this year? Happy to connect face-to-face instead of over email.",
    "Planning to hit any industry events? I'd rather grab 10 minutes in-person than fill your inbox.",
    "Will you be at any events this year? Prefer to say hi in person than keep pinging.",
)


def gen_touch2(first_name: str, company: str, property_signals: str, sheet_row: int) -> str:
    """Touch 2 from Instantly Vector campaign - threaded follow-up with spin variations."""
    i = sheet_row % 100  # deterministic variation per row
    greeting = SPIN_GREETINGS[i % len(SPIN_GREETINGS)]
    who = SPIN_WHO_WIFI[(i // 3) % len(SPIN_WHO_WIFI)]
    cta = SPIN_CTA[(i // 7) % len(SPIN_CTA)].format(company=company)
    prop_line = SPIN_PROPERTY_LINE[(i // 11) % len(SPIN_PROPERTY_LINE)]
    events = SPIN_EVENTS[(i // 13) % len(SPIN_EVENTS)]

    opener = f"{greeting}{first_name}, " if greeting else f"{first_name}, "
    has_prop = False
    prop_phrase = ""
    if property_signals and property_signals.strip() and "not found" not in property_signals.lower():
        match = re.search(r"([A-Za-z0-9\s\-\.]+)\s*\(\s*(\d+)\s*(?:units?|beds?)\s*\)", property_signals)
        if match:
            prop_name, units = match.group(1).strip(), match.group(2)
            prop_phrase = f" — including properties like {prop_name} ({units} units)"
            if len(prop_phrase) < 55:
                has_prop = True

    if has_prop:
        cta_part = cta.rstrip(".") + prop_phrase + "."
        body = f"{opener}{who}?\n\n{cta_part}\n\n{prop_line}\n\n{events}\n\n{{{{accountSignature}}}}"
    else:
        body = f"{opener}{who}?\n\n{cta} {prop_line}\n\n{events}\n\n{{{{accountSignature}}}}"
    return body

def main():
    # Try multiple cached sheet files (agent-tools output varies by request); prefer most recent
    base = Path.home() / ".cursor/projects/Users-shawntenam-Desktop-shawn-gtme-os/agent-tools"
    sheet_path = base / "ab38be16-a4c6-4f58-8f1e-1086196cdf50.txt"
    if not sheet_path.exists() and base.exists():
        # Find any agent-tools file with sheet data (contains valueRanges)
        for f in sorted(base.glob("*.txt"), key=lambda p: p.stat().st_mtime, reverse=True):
            try:
                d = json.loads(f.read_text())
                if "valueRanges" in d and d.get("valueRanges"):
                    sheet_path = f
                    break
            except (json.JSONDecodeError, OSError):
                continue
    if not sheet_path.exists():
        # Fallback: try loading from stdin
        data = json.load(sys.stdin)
    else:
        with open(sheet_path) as f:
            data = json.load(f)

    rows = data["valueRanges"][0]["values"]
    header = rows[0]
    data_rows = rows[1:]

    updates = []
    for i, row in enumerate(data_rows):
        sheet_row = i + 2  # 1-based, row 1 = header
        if len(row) < 5:
            continue
        if not qualifies(row):
            continue
        if not is_emailable(row):
            continue
        if not has_touch1(row):
            continue
        # Skip competitor (Smart City Telecom has MX_Route COMPETITOR_FLAG in some rows - check)
        mx = (row[IDX["mx_route"]] or "").strip().upper() if len(row) > IDX["mx_route"] else ""
        if "COMPETITOR" in mx:
            continue

        first_name = (row[IDX["contact"]] or "").strip() or "there"
        company = (row[IDX["company"]] or "").strip() or "your organization"
        prop_signals = (row[IDX["property_signals"]] or "").strip() if len(row) > IDX["property_signals"] else ""

        touch2 = gen_touch2(first_name, company, prop_signals, sheet_row)
        updates.append({"sheet_row": sheet_row, "touch2": touch2, "company": company, "contact": first_name})

    print(json.dumps(updates, indent=2))

if __name__ == "__main__":
    main()
