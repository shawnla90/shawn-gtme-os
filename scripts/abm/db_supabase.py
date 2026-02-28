#!/usr/bin/env python3
"""Shared Supabase client for ABM pipeline scripts."""

import os

from supabase import create_client, Client

# Load .env if present
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(SCRIPT_DIR, '.env')
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, val = line.split('=', 1)
                os.environ.setdefault(key.strip(), val.strip())


def get_supabase() -> Client:
    """Return an authenticated Supabase client using service role key."""
    url = os.environ.get('SUPABASE_URL', '')
    key = os.environ.get('SUPABASE_SERVICE_KEY', '')
    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in scripts/abm/.env")
    return create_client(url, key)
