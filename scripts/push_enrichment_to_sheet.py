#!/usr/bin/env python3
"""Push vector enrichment updates to Google Sheet via MCP-style JSON for manual update.
Alternatively outputs ranges for use with Google Sheets API."""

import json
import os

INPUT = os.path.expanduser(
    "~/Desktop/shawn-gtme-os/clients/partner/elauwit/resources/exports/vector-enrichment-updates-2026-02-09.json"
)
SPREADSHEET_ID = "1WNTYo9hI5yEidHOARX_nZwwkBGScVVgiAwP8z3eWPTE"
SHEET = "Sheet1"

def main():
    with open(INPUT) as f:
        updates = json.load(f)

    # Build batch: ranges -> 2D data
    # P=Company_Description, Q=Property_Signals, R=Tech_Signals, T=Email_Body_Touch1, U=Enrichment_Status
    ranges = {}
    for u in updates:
        row = u["row"]
        ranges[f"P{row}:R{row}"] = [[
            u["company_description"],
            u["property_signals"],
            u["tech_signals"],
        ]]
        ranges[f"T{row}"] = [[u["email_body_touch1"]]]
        ranges[f"U{row}"] = [["Enriched"]]

    # Output for MCP batch_update_cells (as multiple smaller batches to avoid timeout)
    batch_size = 25
    items = list(ranges.items())
    batches = [dict(items[i:i+batch_size]) for i in range(0, len(items), batch_size)]

    out = {
        "spreadsheet_id": SPREADSHEET_ID,
        "sheet": SHEET,
        "batches": batches,
        "total_ranges": len(ranges),
    }
    out_path = INPUT.replace(".json", "-batches.json")
    with open(out_path, "w") as f:
        json.dump(out, f, indent=2)

    print(f"Prepared {len(ranges)} ranges in {len(batches)} batches")
    print(f"Saved to {out_path}")

if __name__ == "__main__":
    main()
