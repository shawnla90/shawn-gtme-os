#!/usr/bin/env python3
"""Find qualified leads that are missing Touch 2 copy."""

import json
import sys
from pathlib import Path

# Column indices from current sheet (0-based)
# Company, Contact, Score contact, Score company, ..., MX_Route(18), Touch2(19), Touch1(20), Enrichment(21)
IDX = {
    "company": 0,
    "contact": 1,
    "contact_score": 2,
    "company_score": 3,
    "mx_route": 18,
    "touch2": 19,
    "touch1": 20,
    "property_signals": 16,
}

def parse_score(val):
    try:
        return int(val) if val and str(val).strip() else 0
    except (ValueError, TypeError):
        return 0

def qualifies(row):
    c = parse_score(row[IDX["contact_score"]] if len(row) > IDX["contact_score"] else 0)
    co = parse_score(row[IDX["company_score"]] if len(row) > IDX["company_score"] else 0)
    return c > 5 or co > 5

def is_emailable(row):
    mx = (row[IDX["mx_route"]] or "").strip().lower() if len(row) > IDX["mx_route"] else ""
    return mx in ("instantly", "heyreach")

def has_touch1(row):
    t1 = row[IDX["touch1"]] if len(row) > IDX["touch1"] else ""
    return bool(t1 and str(t1).strip())

def has_touch2(row):
    t2 = row[IDX["touch2"]] if len(row) > IDX["touch2"] else ""
    return bool(t2 and str(t2).strip())

def main():
    path = Path.home() / ".cursor/projects/Users-shawntenam-Desktop-shawn-gtme-os/agent-tools/3fa1c269-74e4-4450-90c5-d6fa630e01dd.txt"
    if not path.exists():
        print("Sheet data file not found", file=sys.stderr)
        sys.exit(1)
    with open(path) as f:
        data = json.load(f)
    rows = data["valueRanges"][0]["values"]
    data_rows = rows[1:]

    missing = []
    for i, row in enumerate(data_rows):
        sheet_row = i + 2
        if len(row) < 5:
            continue
        if not qualifies(row):
            continue
        if not is_emailable(row):
            continue
        if not has_touch1(row):
            continue
        mx = (row[IDX["mx_route"]] or "").strip().upper() if len(row) > IDX["mx_route"] else ""
        if "COMPETITOR" in mx:
            continue
        if not has_touch2(row):
            first_name = (row[IDX["contact"]] or "").strip() or "there"
            company = (row[IDX["company"]] or "").strip() or "your organization"
            missing.append({"sheet_row": sheet_row, "company": company, "contact": first_name, "property_signals": (row[IDX["property_signals"]] or "").strip() if len(row) > IDX["property_signals"] else ""})
    print(json.dumps(missing, indent=2))

if __name__ == "__main__":
    main()
