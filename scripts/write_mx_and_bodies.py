#!/usr/bin/env python3
"""Write MX results and email bodies back to Google Sheet via JSON output."""

import json
import csv
import os

INPUT_CSV = os.path.expanduser(
    "~/Desktop/shawn-gtme-os/clients/partner/elauwit/resources/exports/vector-normal-flow-2026-02-09.csv"
)
MX_JSON = os.path.expanduser(
    "~/Desktop/shawn-gtme-os/clients/partner/elauwit/resources/exports/mx-check-results-2026-02-09.json"
)

def generate_touch1_body(lead, enrichment=None):
    """Generate a personalized Touch 1 email body matching proven Elauwit tone."""
    
    name = lead.get("name", "").strip()
    company = lead.get("company", "").strip()
    job_title = lead.get("job_title", "").strip()
    asset_class = lead.get("asset_class", "").strip()
    industry = lead.get("industry", "").strip()
    
    # Determine product angle based on asset class
    if asset_class in ["Multifamily", "Student Housing"]:
        product_angle = "managed WiFi"
        pain_frame = "resident connectivity"
    elif asset_class == "Residential Realty":
        product_angle = "managed WiFi"
        pain_frame = "resident experience"
    else:
        product_angle = "connectivity"
        pain_frame = "network infrastructure"
    
    # Build the company context line
    # If we have enrichment data, use it; otherwise use industry
    if enrichment and enrichment.get("company_description"):
        context_line = f"I came across {company} and noticed your focus on {_extract_focus(enrichment['company_description'])}."
    elif industry:
        context_line = f"I came across {company} in the {industry.lower()} space."
    else:
        context_line = f"I came across {company}."
    
    # Build property reference if available from enrichment
    property_line = ""
    if enrichment and enrichment.get("property_names") and enrichment["property_names"] != "Not found":
        # Extract first property name for specificity
        props = enrichment["property_names"]
        first_prop = props.split(";")[0].strip()
        if first_prop and len(first_prop) < 80:
            property_line = f"\n\nI noticed properties like {first_prop} — any idea when the WiFi agreement is set to renew?"
    
    # Build the body
    if property_line:
        body = (
            f"Hi {name}!\n\n"
            f"{context_line}\n\n"
            f"I'm with Elauwit (Nasdaq: ELWT), we're a publicly-traded connectivity MSP purpose-built for multifamily."
            f"{property_line}\n\n"
            f"If it's worth exploring, we can quote the switch to Elauwit — including any network upgrades needed.\n\n"
            f"{{{{accountSignature}}}}"
        )
    else:
        body = (
            f"Hi {name}!\n\n"
            f"{context_line}\n\n"
            f"I'm with Elauwit (Nasdaq: ELWT), we're a publicly-traded connectivity MSP purpose-built for multifamily. "
            f"We help companies like yours upgrade their {pain_frame} — and we can usually quote the switch at $0 CapEx.\n\n"
            f"Who on your team oversees {product_angle} for residents? Happy to send over what an upgrade looks like.\n\n"
            f"{{{{accountSignature}}}}"
        )
    
    return body


def _extract_focus(description):
    """Extract a short focus phrase from a company description."""
    # Take the key phrases after common words
    desc_lower = description.lower()
    
    # Try to find the core business focus
    for trigger in ["specializing in", "focused on", "providing", "that develops", "that manages"]:
        if trigger in desc_lower:
            idx = desc_lower.index(trigger) + len(trigger)
            rest = description[idx:].strip()
            # Take up to the first period or comma
            end = min(
                rest.find(".") if rest.find(".") > 0 else 999,
                rest.find(",") if rest.find(",") > 0 else 999,
                80
            )
            return rest[:end].strip().rstrip(".,")
    
    # Fallback: just use first part of description
    if len(description) > 60:
        return description[:60].rstrip(".,").strip() + "..."
    return description.rstrip(".,").strip()


def main():
    # Load MX results
    with open(MX_JSON) as f:
        mx_data = json.load(f)
    
    # Build row -> mx mapping
    mx_by_row = {}
    for route in ["instantly", "heyreach", "skip"]:
        for lead in mx_data[route]:
            row = lead["sheet_row"]
            mx_by_row[row] = {
                "route": route,
                "reason": lead["mx_reason"]
            }
    
    # Load leads
    leads = []
    with open(INPUT_CSV) as f:
        reader = csv.DictReader(f)
        for row in reader:
            leads.append(row)
    
    # Generate output for sheet updates
    # Format: row_number, mx_route, email_body
    updates = []
    for lead in leads:
        row = lead.get("sheet_row", "")
        if not row:
            continue
        
        mx_info = mx_by_row.get(row, {"route": "unknown", "reason": ""})
        
        # Only generate email body for Instantly-routable leads
        body = ""
        if mx_info["route"] == "instantly":
            body = generate_touch1_body(lead)
        
        updates.append({
            "row": row,
            "mx_route": mx_info["route"],
            "mx_reason": mx_info["reason"],
            "email_body": body
        })
    
    # Print updates as JSON for consumption
    output_path = os.path.expanduser(
        "~/Desktop/shawn-gtme-os/clients/partner/elauwit/resources/exports/sheet-updates-2026-02-09.json"
    )
    with open(output_path, "w") as f:
        json.dump(updates, f, indent=2)
    
    # Print summary
    instantly_with_body = [u for u in updates if u["mx_route"] == "instantly" and u["email_body"]]
    heyreach = [u for u in updates if u["mx_route"] == "heyreach"]
    skip = [u for u in updates if u["mx_route"] == "skip"]
    
    print(f"Generated {len(instantly_with_body)} email bodies for Instantly leads")
    print(f"{len(heyreach)} leads routed to HeyReach")
    print(f"{len(skip)} leads skipped (no email)")
    print(f"\nSample email body (first Instantly lead):")
    if instantly_with_body:
        print(instantly_with_body[0]["email_body"])
    
    print(f"\nOutput saved to: {output_path}")


if __name__ == "__main__":
    main()
