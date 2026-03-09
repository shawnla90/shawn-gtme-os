# Safety Filters

## Pattern vs. Person Test

**Safe to critique**:
- CRM architectures (generic)
- GTM approaches (methodologies)
- Common mistakes (patterns)
- Tools/platforms (in general terms)

**Not safe to critique**:
- Specific clients (even anonymized if recognizable)
- Named competitors
- Individual practitioners
- Companies in your ecosystem

## Client Anonymization Rules

All external-facing content (posts, blog, video, images) must follow these rules:

- **Never use real partner/client names** - use placeholders: apex-staffing, northbeam, ridgeline, vektora, clearpoint, ironwood, stonebridge, havenport
- **Never reference identifiable details** that combined could identify a client (industry + size + location + tool stack)
- **Generic role labels only** - "partner strategist" not the person's name
- **Metrics must be directional** - "2x improvement" not "went from 12 to 24 meetings"
- **When in doubt, omit** - no content is worth a client relationship

## Pre-Push Blocklist Policy

The `.claude/blocklist.txt` file (gitignored) contains all sensitive terms. Enforcement:

- **Pre-push hook** (`.husky/pre-push`) scans all tracked files against the blocklist
- **Never bypass** with `--no-verify` - if the hook blocks, fix the content
- **Scan scope**: filenames + file contents of all `git ls-files`
- **On match**: untrack the file (`git rm --cached`), replace term with placeholder, or move to gitignored directory
- Run `/update-github` for the full safety scan before any push

## Ecosystem Protection Matrix

| Category | Rule | Example |
|----------|------|---------|
| Partners | Never critique by name | "some agencies do X wrong" not "[Partner] does X wrong" |
| Tools we use | Constructive only | "HeyReach could improve X" not "HeyReach is broken" |
| Competitors | Don't mention | Focus on what we build, not what others lack |
| Open source | Contribute, don't complain | File issues, submit PRs, share workarounds |
| Platforms (LinkedIn, X) | No algorithm gaming content | Share what works, don't expose exploits |
