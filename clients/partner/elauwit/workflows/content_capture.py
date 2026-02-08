#!/usr/bin/env python3
"""
Content Capture Handler for Slack Bot

Parses Slack messages and saves content to categorized markdown files.
"""

import re
from datetime import datetime
from pathlib import Path
from typing import Optional, Tuple


# Category mapping
CATEGORY_MAP = {
    'content-idea': 'content-ideas.md',
    'content-ideas': 'content-ideas.md',
    'content': 'content-ideas.md',
    'workflow': 'workflow-notes.md',
    'workflow-note': 'workflow-notes.md',
    'workflow-notes': 'workflow-notes.md',
    'thought': 'thoughts.md',
    'thoughts': 'thoughts.md',
    'improvement': 'improvements.md',
    'improvements': 'improvements.md',
    'improve': 'improvements.md',
}

# Base directory for captures
BASE_DIR = Path(__file__).parent.parent.parent.parent.parent
CAPTURES_DIR = BASE_DIR / 'skills' / 'tier-3-content-ops' / 'captures'


def get_category_file(category: str) -> Optional[Path]:
    """
    Get the file path for a category.
    
    Args:
        category: Category name (e.g., 'content-idea', 'workflow')
    
    Returns:
        Path to the markdown file, or None if category not found
    """
    filename = CATEGORY_MAP.get(category.lower())
    if not filename:
        return None
    
    return CAPTURES_DIR / filename


def parse_message(text: str) -> Optional[Tuple[str, str]]:
    """
    Parse a Slack message to extract category and content.
    
    Supports multiple formats:
    - "content-idea: Your text here"
    - "@gtm-bot content-idea: Your text here"
    - "/capture content-idea Your text here"
    
    Args:
        text: Raw message text from Slack
    
    Returns:
        Tuple of (category, content) or None if parsing fails
    """
    if not text:
        return None
    
    # Remove bot mentions
    text = re.sub(r'<@[A-Z0-9]+>', '', text).strip()
    
    # Try to find category prefix
    # Pattern: "category: content" or "category content"
    patterns = [
        r'^(\w+(?:-\w+)*)\s*:\s*(.+)$',  # "category: content"
        r'^(\w+(?:-\w+)*)\s+(.+)$',      # "category content"
    ]
    
    for pattern in patterns:
        match = re.match(pattern, text, re.IGNORECASE)
        if match:
            category = match.group(1).strip().lower()
            content = match.group(2).strip()
            
            # Check if category is valid
            if category in CATEGORY_MAP:
                return (category, content)
    
    # If no category found, default to 'thoughts'
    if text:
        return ('thought', text)
    
    return None


def save_to_category(category: str, content: str) -> Tuple[bool, str]:
    """
    Save content to the appropriate categorized markdown file.
    
    Args:
        category: Category name
        content: Content to save
    
    Returns:
        Tuple of (success, message)
    """
    filepath = get_category_file(category)
    
    if not filepath:
        return (False, f"Unknown category: {category}")
    
    # Ensure directory exists
    filepath.parent.mkdir(parents=True, exist_ok=True)
    
    # Format timestamp
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M')
    
    # Format entry
    entry = f"""## {timestamp}

{content}

---
"""
    
    # Append to file
    try:
        with open(filepath, 'a', encoding='utf-8') as f:
            f.write(entry)
        
        filename = filepath.name
        return (True, f"Saved to {filename}")
    except Exception as e:
        return (False, f"Error saving: {str(e)}")


def list_categories() -> list:
    """Return list of available categories."""
    return list(CATEGORY_MAP.keys())
