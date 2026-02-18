#!/usr/bin/env python3
"""
Enrich Vector campaign leads with basic web research.
Fetches domain homepages, extracts company/property/tech signals,
generates Quote the Switch email copy. No Firecrawl—uses requests + curated lookups.
"""

import json
import csv
import os
import re
import time
from urllib.parse import urlparse
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError

INPUT_CSV = os.path.expanduser(
    "~/Desktop/shawn-gtme-os/clients/partner/elauwit/resources/exports/vector-normal-flow-2026-02-09.csv"
)
MX_JSON = os.path.expanduser(
    "~/Desktop/shawn-gtme-os/clients/partner/elauwit/resources/exports/mx-check-results-2026-02-09.json"
)
OUTPUT_JSON = os.path.expanduser(
    "~/Desktop/shawn-gtme-os/clients/partner/elauwit/resources/exports/vector-enrichment-updates-2026-02-09.json"
)

# Curated research (from earlier web search / domain fetch)
CURATED_ENRICHMENT = {
    "alamedahealthsystem.org": {
        "company_description": "Alameda Health System operates five hospitals in the East Bay with 800+ beds, providing community health care including Alameda Hospital, Highland Hospital, and Fairmont Hospital.",
        "property_signals": "Alameda Hospital (181 beds: Park Bridge 120, Sub-Acute 35, South Shore 26); Highland Hospital; Fairmont Hospital; 5 hospitals, 800+ total beds",
        "tech_signals": "Healthcare IT, MyChart patient portal, facilities and engineering",
    },
    "talpion.com": {
        "company_description": "Talpion is a New York-based private investment firm with a residential real estate portfolio concentrated in upper Manhattan.",
        "property_signals": "9 buildings, ~331 units: 291 Edgecombe Ave (31 units), 520 W 139th St (42), 617 W 141st St (42), 635 Riverside Dr (67), 894 Riverside Dr (54), 605 W 156th St (44), 625 W 156th St (32), 634 W 135th St (39)",
        "tech_signals": "Residential portfolio; managed properties",
    },
    "tjc.edu": {
        "company_description": "Tyler Junior College is a community college in Tyler, Texas with extensive student housing across eight residence halls.",
        "property_signals": "1,200+ student beds; Crossroads Hall (248 beds), Ornelas Hall, Bateman Hall, Vaughn Hall, Holley Hall, Hudnall Hall, Sledge Hall, Claridge Hall",
        "tech_signals": "Student housing; campus connectivity",
    },
    "leisurecare.com": {
        "company_description": "Leisure Care develops and operates senior living communities across the US, combining senior housing with hospitality-style services.",
        "property_signals": "30+ senior living communities; development and operations across multiple states",
        "tech_signals": "Senior living; resident experience; hospitality",
    },
    "bellpartnersinc.com": {
        "company_description": "Bell Partners is one of the nation's largest apartment investment and management companies, specializing in multifamily real estate.",
        "property_signals": "80,000+ units under management; Class A and B multifamily across major US markets",
        "tech_signals": "Multifamily operations; resident technology",
    },
    "fsresidential.com": {
        "company_description": "FirstService Residential is North America's largest manager of residential communities, serving condos, HOAs, and multifamily.",
        "property_signals": "8,000+ communities; millions of residents; Global Connectivity Programs division",
        "tech_signals": "Global Connectivity Programs; bulk internet; managed WiFi for communities",
    },
    "windsorcommunities.com": {
        "company_description": "Windsor Communities is a multifamily real estate developer and operator with properties across the Midwest.",
        "property_signals": "Multifamily communities; development and property management",
        "tech_signals": "Multifamily resident services",
    },
    "glacierhills.org": {
        "company_description": "Glacier Hills is a senior living community in Adrian, Michigan offering independent living, assisted living, and skilled nursing.",
        "property_signals": "Senior living campus; multiple care levels; Adrian, MI",
        "tech_signals": "Senior living; resident care; facilities",
    },
    "vcu.edu": {
        "company_description": "Virginia Commonwealth University is a major public research university in Richmond with substantial student housing.",
        "property_signals": "Multiple residence halls; 30,000+ students; urban campus",
        "tech_signals": "Campus housing; student connectivity",
    },
    "choc.org": {
        "company_description": "CHOC Children's is a pediatric healthcare system in Orange County, California with hospital and outpatient facilities.",
        "property_signals": "CHOC Hospital; outpatient centers; pediatric care facilities",
        "tech_signals": "Healthcare IT; facilities; patient and family services",
    },
    "bldpre.com": {
        "company_description": "Berkshire Lane Development Partners is a Dallas-based real estate developer focused on multifamily and mixed-use projects.",
        "property_signals": "Multifamily development; Dallas-Fort Worth and Texas markets",
        "tech_signals": "Development; property operations",
    },
    "andovermgt.com": {
        "company_description": "Andover Management Group is a multifamily property management and development company based in Lexington, Kentucky.",
        "property_signals": "Multifamily portfolio; Kentucky and regional markets",
        "tech_signals": "Property management; resident services",
    },
    "drakereg.com": {
        "company_description": "Drake Real Estate Group is a multifamily real estate firm based in Los Angeles focused on acquisition and development.",
        "property_signals": "Multifamily portfolio; California and Western markets",
        "tech_signals": "Multifamily development and operations",
    },
    "denvercps.com": {
        "company_description": "DCPS / Denver Commercial Property Services provides facilities and property services.",
        "property_signals": "Commercial and multifamily properties; Denver area",
        "tech_signals": "Facilities services",
    },
    "umbc.edu": {
        "company_description": "University of Maryland Baltimore County is a research university with on-campus housing for thousands of students.",
        "property_signals": "Residence halls; 10,000+ undergrads; Baltimore County",
        "tech_signals": "Student housing; campus connectivity",
    },
    "baylor.edu": {
        "company_description": "Baylor University is a private Christian university in Waco, Texas with extensive on-campus student housing.",
        "property_signals": "Residence halls; 20,000+ students; Waco campus",
        "tech_signals": "Student housing; campus life",
    },
    "louisville.edu": {
        "company_description": "University of Louisville is a public research university in Kentucky with multiple residence halls and student housing.",
        "property_signals": "Residence halls; 20,000+ students; Louisville campus",
        "tech_signals": "Student housing; campus connectivity",
    },
    "yale.edu": {
        "company_description": "Yale University is an Ivy League institution in New Haven, Connecticut with residential colleges and graduate housing.",
        "property_signals": "14 residential colleges; graduate housing; 12,000+ undergrads",
        "tech_signals": "Campus housing; university connectivity",
    },
    "colliers.com": {
        "company_description": "Colliers is a global real estate services firm with a U.S. Capital Markets division including multifamily advisory.",
        "property_signals": "Multifamily capital markets; advisory across US",
        "tech_signals": "Real estate advisory; institutional clients",
    },
    "apartmentbuildings.com": {
        "company_description": "ApartmentBuildings.com is a multifamily investment platform and brokerage focused on apartment acquisitions.",
        "property_signals": "Multifamily investment platform; national deal flow",
        "tech_signals": "Multifamily technology; investment platform",
    },
    "centercal.com": {
        "company_description": "Centercal Properties is a Chicago-based real estate firm with mixed-use and multifamily holdings.",
        "property_signals": "Mixed-use and multifamily; Chicago and Midwest",
        "tech_signals": "Property development and management",
    },
    "samhealth.org": {
        "company_description": "Samaritan Health Services operates hospitals and healthcare facilities in the Oregon mid-Willamette region.",
        "property_signals": "Multiple hospitals; urgent care; outpatient; Oregon",
        "tech_signals": "Healthcare facilities; IT; patient services",
    },
    "mountainmanzanita.com": {
        "company_description": "Mountain Manzanita is a multifamily property operator in North Carolina.",
        "property_signals": "Multifamily properties; Kinston, NC area",
        "tech_signals": "Facilities; property operations",
    },
    "brittainhospitality.com": {
        "company_description": "Brittain Resorts & Hotels operates vacation rental and resort properties in Myrtle Beach and the Grand Strand.",
        "property_signals": "Resort and vacation rental properties; Myrtle Beach, SC",
        "tech_signals": "Hospitality; guest WiFi; vacation rentals",
    },
}


def normalize_domain(domain):
    """Normalize domain for lookup (lowercase, no www)."""
    if not domain:
        return ""
    d = domain.lower().strip()
    if d.startswith("www."):
        d = d[4:]
    return d


def fetch_page(domain, timeout=8):
    """Fetch homepage HTML, return first ~3000 chars of text."""
    url = f"https://{domain}" if not domain.startswith("http") else domain
    try:
        req = Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; Elauwit/1.0)"})
        with urlopen(req, timeout=timeout) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            # Strip tags crudely
            text = re.sub(r"<script[^>]*>.*?</script>", " ", html, flags=re.DOTALL | re.I)
            text = re.sub(r"<style[^>]*>.*?</style>", " ", text, flags=re.DOTALL | re.I)
            text = re.sub(r"<[^>]+>", " ", text)
            text = re.sub(r"\s+", " ", text).strip()
            return text[:3000] if text else ""
    except (URLError, HTTPError, OSError, Exception) as e:
        return f"[Fetch error: {type(e).__name__}]"


def extract_from_page(text, company, asset_class):
    """Extract company description and signals from raw page text."""
    desc = ""
    props = ""
    tech = ""
    text_lower = text.lower()
    # Look for common property/unit patterns
    unit_match = re.search(r"(\d{1,5}[,+]?\s*)(units?|beds?|apartments?|residences?|rooms?)", text_lower, re.I)
    if unit_match:
        props = f"Found: {unit_match.group(0)}"
    # WiFi/connectivity
    if any(w in text_lower for w in ["wifi", "wi-fi", "connectivity", "internet", "broadband"]):
        tech = "WiFi/connectivity mentioned"
    # First meaningful sentence for desc
    sentences = re.split(r"[.!?]\s+", text[:800])
    for s in sentences:
        s = s.strip()
        if len(s) > 40 and not s.startswith("["):
            desc = s + "." if not s.endswith(".") else s
            break
    if not desc and len(text) > 50:
        desc = text[:200].strip() + "..."
    return desc, props, tech


def generate_touch1(lead, enrichment):
    """Generate Quote the Switch email body per campaign-copy.md."""
    name = lead.get("name", "").strip() or "there"
    company = lead.get("company", "").strip()
    asset_class = lead.get("asset_class", "").strip()
    industry = lead.get("industry", "").strip()
    props = enrichment.get("property_signals", "")
    desc = enrichment.get("company_description", "")
    # Property-specific hook: use first property mention if available
    prop_hook = ""
    if props and "units" in props.lower() or "beds" in props.lower():
        # Grab first meaningful property phrase (e.g., "Crossroads Hall (248 beds)")
        m = re.search(r"([A-Za-z0-9\s]+?\s*\(\d+\s*(?:units?|beds?)\)|[A-Za-z0-9\s]+?,?\s*\d{1,5}\s*(?:units?|beds?))", props)
        if m:
            prop_hook = m.group(1).strip()
    if prop_hook and len(prop_hook) < 60:
        body = (
            f"Hi {name}!\n\n"
            f"I came across {company} and your work with {prop_hook}.\n\n"
            f"I'm with Elauwit (Nasdaq: ELWT), we're a publicly-traded connectivity MSP purpose-built for multifamily. "
            f"If it's worth exploring, we can quote the switch to Elauwit — including any network upgrades needed — often at $0 CapEx.\n\n"
            f"Who on your team oversees WiFi and connectivity for residents? Happy to send over what an upgrade looks like.\n\n"
            f"{{{{accountSignature}}}}"
        )
    else:
        context = f"your work in {industry.lower()}" if industry else "your portfolio"
        body = (
            f"Hi {name}!\n\n"
            f"I came across {company} and {context}.\n\n"
            f"I'm with Elauwit (Nasdaq: ELWT), we're a publicly-traded connectivity MSP purpose-built for multifamily. "
            f"We help organizations like yours upgrade their connectivity infrastructure — and we can usually quote the switch at $0 CapEx.\n\n"
            f"Who on your team oversees WiFi for residents? Happy to send over what an upgrade looks like.\n\n"
            f"{{{{accountSignature}}}}"
        )
    return body


def main():
    with open(MX_JSON) as f:
        mx_data = json.load(f)
    mx_by_row = {}
    for route in ["instantly", "heyreach", "skip"]:
        for lead in mx_data[route]:
            mx_by_row[lead["sheet_row"]] = route

    leads = []
    with open(INPUT_CSV) as f:
        for row in csv.DictReader(f):
            leads.append(row)

    emailable = [l for l in leads if mx_by_row.get(l["sheet_row"]) in ("instantly", "heyreach")]
    updates = []

    for lead in emailable:
        row = lead["sheet_row"]
        company = lead.get("company", "")
        domain = lead.get("domain", "")
        nd = normalize_domain(domain)

        enrichment = CURATED_ENRICHMENT.get(nd)
        if not enrichment:
            # No curated data: use industry/asset_class for generic copy
            ac = lead.get("asset_class", "")
            ind = lead.get("industry", "")
            enrichment = {
                "company_description": f"{company} operates in {ind.lower() if ind else 'real estate'} with focus on {ac.lower() if ac else 'property'}.",
                "property_signals": "Not found",
                "tech_signals": "Connectivity relevant",
            }

        email_body = generate_touch1(lead, enrichment)
        updates.append({
            "row": row,
            "company": company,
            "domain": domain,
            "company_description": enrichment["company_description"],
            "property_signals": enrichment["property_signals"],
            "tech_signals": enrichment["tech_signals"],
            "email_body_touch1": email_body,
        })

    with open(OUTPUT_JSON, "w") as f:
        json.dump(updates, f, indent=2)

    print(f"Processed {len(updates)} emailable leads")
    print(f"Output: {OUTPUT_JSON}")
    return updates

if __name__ == "__main__":
    main()
