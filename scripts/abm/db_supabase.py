#!/usr/bin/env python3
"""Shared Supabase client for ABM pipeline scripts."""

import os

from supabase import create_client, Client

from config import load_env

load_env()


def get_supabase() -> Client:
    """Return an authenticated Supabase client using service role key."""
    url = os.environ.get('SUPABASE_URL', '')
    key = os.environ.get('SUPABASE_SERVICE_KEY', '')
    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in scripts/abm/.env")
    return create_client(url, key)
