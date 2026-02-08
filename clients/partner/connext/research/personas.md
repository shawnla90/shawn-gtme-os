# Connext Buyer Personas

## 6-Tier Persona Hierarchy

### Tier 1: Champion / Technical Decision Maker (The "Yes")

- **Focus**: Consistency, minimizing downtime, managing complexity
- **Titles**: VP of IT, Director of IT, Director of Network Infrastructure, Director of Technology Operations
- **Role in deal**: The person who says "yes, this is the right solution"

### Tier 2: Influencer / Operational Gatekeeper (The "Must Work")

- **Focus**: Site readiness, protecting store revenue, "First-visit success"
- **Titles**: VP of Store Operations, Director of Store Operations, Director of Field Operations, VP of Retail Operations
- **Role in deal**: Validates that the solution won't disrupt operations

### Tier 3: Day-to-Day Lead / Project Champion (The Execution)

- **Focus**: Hitting aggressive rollout timelines, managing vendor logistics
- **Titles**: Program Manager, Deployment Manager, IT Project Manager
- **Role in deal**: Owns the execution and becomes the daily contact

### Tier 4: Executive Sponsor (The Budget)

- **Focus**: Strategic alignment, scalability, vendor risk
- **Titles**: CIO, CTO, SVP Technology
- **Role in deal**: Signs off on budget and strategic fit

### Tier 5: Contract Gatekeeper (The Terms)

- **Focus**: Cost control, TCO, vendor management
- **Titles**: Director of Procurement, Strategic Sourcing Manager
- **Role in deal**: Negotiates terms, manages vendor selection process

### Tier 6: Secondary Influencers

- **Focus**: Physical site readiness, compliance
- **Titles**: Director of Facilities, Engineering Operations Manager, Security Architect, Compliance Officer
- **Role in deal**: Weighs in on specific technical or compliance requirements

## Clay/Claygent Job Title Queries

### Full Boolean Query (All Personas)

```
VP of IT, Director of IT, VP of Network Infrastructure, Director of Technology Operations, VP of Store Operations, Director of Field Operations, VP of Retail Operations, IT Program Manager, Director of Technology Deployment, CIO, CTO, SVP Technology, Director of Procurement, Strategic Sourcing Manager, Director of Facilities, Director of Engineering Operations, Security Architect, Compliance Officer
```

### Bracketed by Persona Tier

**Tier 1 — Champion / Technical Decision Maker**:
```
[VP of IT, Director of IT, Director of Network Infrastructure, Director of Technology Operations]
```

**Tier 2 — Influencer / Operational Gatekeeper**:
```
[VP of Store Operations, Director of Store Operations, Director of Field Operations, VP of Retail Operations]
```

**Tier 3 — Day-to-Day Lead / Project Champion**:
```
[Program Manager, Deployment Manager, IT Project Manager, IT Program Manager, Director of Technology Deployment]
```

**Tier 4 — Executive Sponsor**:
```
[CIO, CTO, SVP Technology]
```

**Tier 5 — Contract Gatekeeper**:
```
[Director of Procurement, Strategic Sourcing Manager]
```

**Tier 6 — Secondary Influencers**:
```
[Director of Facilities, Engineering Operations Manager, Security Architect, Compliance Officer]
```

### Separated by Outreach Priority

**Primary outreach (Tier 1 + Tier 2 — the people who make it happen)**:
```
VP of IT, Director of IT, Director of Network Infrastructure, Director of Technology Operations, VP of Store Operations, Director of Store Operations, Director of Field Operations, VP of Retail Operations
```

**Executive outreach (Tier 4 — budget authority)**:
```
CIO, CTO, SVP Technology
```

**Execution contacts (Tier 3 — post-meeting champions)**:
```
Program Manager, Deployment Manager, IT Project Manager, IT Program Manager
```

## Query Usage Notes

- Always validate 100+ locations BEFORE enriching contacts — don't waste credits on sub-threshold companies
- Tier 1 + Tier 2 are the primary campaign targets for direct outreach
- Tier 4 (Executive Sponsor) should be approached via Executive Thread plays, not cold SDR sequences
- Tier 5 (Procurement) enters later in the deal cycle, not for initial outreach
- Tier 6 (Secondary) are stakeholders to map but not to cold-email
