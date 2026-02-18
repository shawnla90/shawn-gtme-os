#!/usr/bin/env python3
"""Check MX records for qualified leads to route Instantly vs HeyReach."""

import csv
import dns.resolver
import os
import json

INPUT_CSV = os.path.expanduser(
    "~/Desktop/shawn-gtme-os/clients/partner/elauwit/resources/exports/vector-normal-flow-2026-02-09.csv"
)

# High-security MX providers that block cold email
HIGH_SECURITY_PROVIDERS = [
    "proofpoint",
    "pphosted",
    "barracuda",
    "mimecast",
    "forcepoint",
    "ironport",
    "cisco",
    "fireeye",
    "trendmicro",
    "sophos",
    "messagelabs",
    "symantec",
    "broadcom",
]

# Government/edu domains that should go to HeyReach regardless
HEYREACH_DOMAIN_PATTERNS = [
    ".gov",
    ".mil",
    ".edu",
]


def check_mx(domain):
    """Check MX records for a domain and return routing decision."""
    if not domain:
        return "no_domain", "No domain provided", []

    # Check domain patterns first
    for pattern in HEYREACH_DOMAIN_PATTERNS:
        if domain.lower().endswith(pattern):
            return "heyreach", f"Protected domain pattern: {pattern}", []

    try:
        mx_records = dns.resolver.resolve(domain, "MX")
        mx_hosts = [str(r.exchange).lower().rstrip(".") for r in mx_records]

        # Check for high-security providers
        for mx_host in mx_hosts:
            for provider in HIGH_SECURITY_PROVIDERS:
                if provider in mx_host:
                    return "heyreach", f"High-security MX: {provider} ({mx_host})", mx_hosts

        # Check for Google Workspace (generally safe)
        for mx_host in mx_hosts:
            if "google" in mx_host or "gmail" in mx_host or "googlemail" in mx_host:
                return "instantly", f"Google Workspace ({mx_host})", mx_hosts

        # Check for Microsoft 365 (generally safe)
        for mx_host in mx_hosts:
            if "outlook" in mx_host or "microsoft" in mx_host:
                return "instantly", f"Microsoft 365 ({mx_host})", mx_hosts

        # Default: route to Instantly for standard providers
        return "instantly", f"Standard MX ({mx_hosts[0] if mx_hosts else 'unknown'})", mx_hosts

    except dns.resolver.NXDOMAIN:
        return "skip", f"Domain does not exist: {domain}", []
    except dns.resolver.NoAnswer:
        return "skip", f"No MX records: {domain}", []
    except dns.resolver.NoNameservers:
        return "skip", f"No nameservers: {domain}", []
    except Exception as e:
        return "skip", f"Error: {str(e)}", []


def main():
    # Read the normal flow CSV
    leads = []
    with open(INPUT_CSV, "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            leads.append(row)

    print(f"Checking MX records for {len(leads)} leads...")
    print(f"{'='*70}")

    # Track unique email domains to avoid redundant lookups
    domain_cache = {}
    results = {"instantly": [], "heyreach": [], "skip": []}

    for lead in leads:
        email = lead.get("email", "").strip()
        if not email:
            results["skip"].append({**lead, "mx_route": "no_email", "mx_reason": "No email address"})
            continue

        # Extract email domain
        email_domain = email.split("@")[-1].lower()

        # Check cache first
        if email_domain not in domain_cache:
            route, reason, mx_hosts = check_mx(email_domain)
            domain_cache[email_domain] = (route, reason, mx_hosts)

        route, reason, mx_hosts = domain_cache[email_domain]
        lead_with_mx = {**lead, "mx_route": route, "mx_reason": reason}
        results[route].append(lead_with_mx)

    # Print results
    print(f"\n--- INSTANTLY (safe to cold email) ---")
    print(f"Count: {len(results['instantly'])}")
    for lead in results["instantly"]:
        print(f"  {lead['name']} @ {lead['company']} ({lead['email']}) - {lead['mx_reason']}")

    print(f"\n--- HEYREACH (high-security / .gov / .edu / .mil) ---")
    print(f"Count: {len(results['heyreach'])}")
    for lead in results["heyreach"]:
        print(f"  {lead['name']} @ {lead['company']} ({lead['email']}) - {lead['mx_reason']}")

    print(f"\n--- SKIP (no email or domain issues) ---")
    print(f"Count: {len(results['skip'])}")
    for lead in results["skip"]:
        print(f"  {lead['name']} @ {lead['company']} - {lead.get('mx_reason', 'unknown')}")

    # Write results as JSON for sheet update
    output = {
        "instantly": [],
        "heyreach": [],
        "skip": [],
    }
    for route_name in ["instantly", "heyreach", "skip"]:
        for lead in results[route_name]:
            output[route_name].append({
                "sheet_row": lead.get("sheet_row", ""),
                "name": lead.get("name", ""),
                "company": lead.get("company", ""),
                "email": lead.get("email", ""),
                "domain": lead.get("domain", ""),
                "mx_route": lead.get("mx_route", ""),
                "mx_reason": lead.get("mx_reason", ""),
            })

    output_path = os.path.expanduser(
        "~/Desktop/shawn-gtme-os/clients/partner/elauwit/resources/exports/mx-check-results-2026-02-09.json"
    )
    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)
    print(f"\nResults saved to: {output_path}")

    # Summary
    print(f"\n{'='*70}")
    print(f"SUMMARY:")
    print(f"  Instantly-routable: {len(results['instantly'])}")
    print(f"  HeyReach-routable:  {len(results['heyreach'])}")
    print(f"  Skip (no email):    {len(results['skip'])}")
    print(f"  Total:              {len(leads)}")


if __name__ == "__main__":
    main()
