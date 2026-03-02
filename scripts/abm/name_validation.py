#!/usr/bin/env python3
"""Company name validation for ABM pipeline.

Consolidates junk-detection logic from research.py (is_junk) and
sync_attio.py (report_junk_names) into a single module.
"""

import re

# ---------------------------------------------------------------------------
# Junk domain set (Exa results / general filtering)
# ---------------------------------------------------------------------------

JUNK_DOMAINS = {
    'indeed.com', 'linkedin.com', 'medium.com', 'substack.com',
    'wikipedia.org', 'youtube.com', 'reddit.com', 'quora.com',
    'saasboomi.com', 'g2.com', 'capterra.com', 'trustradius.com',
}

# Title patterns that indicate articles, not companies
_ARTICLE_PATTERNS = [
    'how to ', 'top ', 'best ', 'guide', 'step-by-step', 'tutorial',
    'fastest growing', 'trends to watch', 'jobs -', 'jobs |',
    'series funding', 'what is ', 'review:', 'vs ', ' vs.',
    'an extensive guide', 'a complete guide',
]

# Patterns that indicate junk account names (emoji, page titles, taglines)
_JUNK_NAME_KEYWORDS = ['jobs', 'indeed', 'glassdoor', 'linkedin.com']
_TAGLINE_KEYWORDS = ['scale pipeline', 'hyper-personalized', 'www.']

_EMOJI_RE = re.compile(r'[\U0001F300-\U0001F9FF\u2600-\u26FF\u2700-\u27BF]')


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def is_junk_domain(domain):
    """Return True if domain is a known non-company domain."""
    return domain in JUNK_DOMAINS


def is_valid_company_name(name):
    """Return True if name looks like a real company name, not junk.

    Catches: page titles, emoji, job boards, taglines, excessive length,
    and article headline patterns.
    """
    if not name or not name.strip():
        return False

    # Emoji in name
    if _EMOJI_RE.search(name):
        return False

    # Page title pattern: long name with " - " separator
    if ' - ' in name and len(name) > 40:
        return False

    # Job board patterns
    if any(w in name.lower() for w in _JUNK_NAME_KEYWORDS):
        return False

    # Tagline / URL in name
    if any(w in name.lower() for w in _TAGLINE_KEYWORDS):
        return False

    # Article headline patterns (from research.py is_junk)
    name_lower = name.lower()
    for pattern in _ARTICLE_PATTERNS:
        if pattern in name_lower:
            return False

    # Excessive length — real company names are short
    if len(name) > 80:
        return False

    return True


def classify_junk_name(name):
    """Return a classification string for why a name is junk, or None if valid.

    Used for reporting / auditing bad account names.
    """
    if not name or not name.strip():
        return 'empty'

    if _EMOJI_RE.search(name):
        return 'contains emoji'

    if ' - ' in name and len(name) > 40:
        return 'page title pattern'

    if any(w in name.lower() for w in _JUNK_NAME_KEYWORDS):
        return 'job board'

    if any(w in name.lower() for w in _TAGLINE_KEYWORDS):
        return 'tagline/URL in name'

    name_lower = name.lower()
    for pattern in _ARTICLE_PATTERNS:
        if pattern in name_lower:
            return 'article headline'

    if len(name) > 80:
        return 'excessive length'

    return None
