#!/usr/bin/env python3
"""Shared configuration, env loading, API clients, and retry logic for ABM pipeline."""

import os
import time

import requests

from log import log

# ---------------------------------------------------------------------------
# Env loading
# ---------------------------------------------------------------------------

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

_env_loaded = False


def load_env():
    """Idempotent .env loader — reads scripts/abm/.env into os.environ."""
    global _env_loaded
    if _env_loaded:
        return
    env_path = os.path.join(SCRIPT_DIR, '.env')
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, val = line.split('=', 1)
                    os.environ.setdefault(key.strip(), val.strip())
    _env_loaded = True


# Auto-load on import
load_env()

# ---------------------------------------------------------------------------
# URL constants
# ---------------------------------------------------------------------------

ATTIO_BASE = 'https://api.attio.com/v2'
APOLLO_BASE = 'https://api.apollo.io/api/v1'
XAI_BASE = 'https://api.x.ai/v1'
POSTHOG_BASE = 'https://us.posthog.com'
PROSPEO_BASE = 'https://api.prospeo.io'

# ---------------------------------------------------------------------------
# Header helpers
# ---------------------------------------------------------------------------


def get_attio_headers():
    """Return Attio API auth + content-type headers."""
    token = os.environ.get('ATTIO_API_TOKEN', '')
    if not token:
        raise ValueError("ATTIO_API_TOKEN not set. Export it or add to scripts/abm/.env")
    return {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }


def get_apollo_headers():
    """Return Apollo API headers with X-Api-Key."""
    key = os.environ.get('APOLLO_API_KEY', '')
    if not key:
        raise ValueError("APOLLO_API_KEY not set. Export it or add to scripts/abm/.env")
    return {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': key,
    }


def get_grok_headers():
    """Return xAI/Grok API auth headers."""
    key = os.environ.get('XAI_API_KEY', '')
    if not key:
        raise ValueError("XAI_API_KEY not set. Export it or add to scripts/abm/.env")
    return {
        'Authorization': f'Bearer {key}',
        'Content-Type': 'application/json',
    }


def get_posthog_headers():
    """Return PostHog API auth headers."""
    key = os.environ.get('POSTHOG_API_KEY', '')
    if not key:
        raise ValueError("POSTHOG_API_KEY not set. Export it or add to scripts/abm/.env")
    return {'Authorization': f'Bearer {key}'}


def get_exa_client():
    """Return an authenticated Exa client instance."""
    from exa_py import Exa
    key = os.environ.get('EXA_API_KEY', '')
    if not key:
        raise ValueError("EXA_API_KEY not set. Export it or add to scripts/abm/.env")
    return Exa(api_key=key)


def get_prospeo_headers():
    """Return Prospeo API headers with X-KEY auth."""
    key = os.environ.get('PROSPEO_API_KEY', '')
    if not key:
        raise ValueError("PROSPEO_API_KEY not set. Export it or add to scripts/abm/.env")
    return {
        'Content-Type': 'application/json',
        'X-KEY': key,
    }


# ---------------------------------------------------------------------------
# Retry-aware HTTP wrapper
# ---------------------------------------------------------------------------


def api_request(method, url, max_retries=3, backoff_base=2, **kwargs):
    """HTTP request with exponential backoff on 429 and transient errors.

    Args:
        method: HTTP method string ('GET', 'POST', 'PUT', 'PATCH', 'DELETE')
        url: Full URL
        max_retries: Number of attempts (default 3)
        backoff_base: Base for exponential backoff (default 2)
        **kwargs: Passed through to requests.request (json, headers, timeout, etc.)

    Returns:
        requests.Response object

    Raises:
        requests.exceptions.RequestException on final failure
    """
    kwargs.setdefault('timeout', 30)
    last_exc = None

    for attempt in range(max_retries):
        try:
            resp = requests.request(method, url, **kwargs)

            if resp.status_code == 429:
                wait = min(backoff_base ** (attempt + 1), 30)
                log.warn(f"Rate limited. Waiting {wait}s...")
                time.sleep(wait)
                continue

            return resp

        except requests.exceptions.RequestException as e:
            last_exc = e
            log.warn(f"Request failed (attempt {attempt + 1}): {e}")
            if hasattr(e, 'response') and e.response is not None:
                log.error(f"Response: {e.response.text[:300]}")
            time.sleep(backoff_base ** attempt)

    # All retries exhausted — raise last exception or return last 429 response
    if last_exc:
        raise last_exc
    return resp
