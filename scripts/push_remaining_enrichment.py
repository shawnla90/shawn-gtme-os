#!/usr/bin/env python3
"""
Push remaining Vector enrichment updates to Google Sheet.
Requires: pip install gspread google-auth
Uses default application credentials (gcloud auth application-default login)
or GOOGLE_APPLICATION_CREDENTIALS env var.
"""

import json
import os

SPREADSHEET_ID = "1WNTYo9hI5yEidHOARX_nZwwkBGScVVgiAwP8z3eWPTE"
INPUT = os.path.expanduser(
    "~/Desktop/shawn-gtme-os/clients/partner/elauwit/resources/exports/vector-enrichment-updates-2026-02-09.json"
)

# Rows already pushed via MCP
DONE_ROWS = {
    "6", "9", "16", "17", "24", "26", "33", "44", "61", "62", "65",
    "78", "83", "86", "89", "90", "99"
}


def main():
    try:
        import gspread
        from google.auth.default import default
    except ImportError:
        print("Install: pip install gspread google-auth")
        return 1

    with open(INPUT) as f:
        updates = json.load(f)

    remaining = [u for u in updates if u["row"] not in DONE_ROWS]
    if not remaining:
        print("All updates already applied.")
        return 0

    creds, _ = default(scopes=["https://www.googleapis.com/auth/spreadsheets"])
    gc = gspread.authorize(creds)
    sh = gc.open_by_key(SPREADSHEET_ID)
    sheet = sh.sheet1

    for u in remaining:
        row = int(u["row"])
        sheet.update(f"P{row}:R{row}", [[u["company_description"], u["property_signals"], u["tech_signals"]]])
        sheet.update(f"T{row}", [[u["email_body_touch1"]]])
        sheet.update(f"U{row}", [["Enriched"]])

    print(f"Updated {len(remaining)} rows.")
    return 0


if __name__ == "__main__":
    exit(main())
