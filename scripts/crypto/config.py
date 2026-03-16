"""
Crypto OS — Configuration
Free API endpoints, asset lists, and analysis thresholds.
"""

# ── CoinGecko (free, no key) ────────────────────────────────────
COINGECKO_BASE = "https://api.coingecko.com/api/v3"
COINGECKO_PRICES = f"{COINGECKO_BASE}/simple/price"
COINGECKO_GLOBAL = f"{COINGECKO_BASE}/global"

# ── Fear & Greed Index (alternative.me, free, no key) ───────────
FEAR_GREED_URL = "https://api.alternative.me/fng/?limit=1"

# ── Tracked assets ──────────────────────────────────────────────
TRACKED_ASSETS = {
    "bitcoin": "BTC",
    "ethereum": "ETH",
    "solana": "SOL",
}

# ── Reddit targets ──────────────────────────────────────────────
SUBREDDITS = [
    "cryptocurrency",
    "CryptoTechnology",
    "algotrading",
]
REDDIT_POST_LIMIT = 10  # hot posts per subreddit

# ── Signal thresholds ──────────────────────────────────────────
# Conservative defaults — bias toward hold
SIGNAL_THRESHOLDS = {
    "extreme_fear": 20,       # Fear & Greed <= 20
    "extreme_greed": 80,      # Fear & Greed >= 80
    "large_drop_pct": -8.0,   # 24h drop threshold
    "large_pump_pct": 10.0,   # 24h pump threshold
}

# ── Budget rules ────────────────────────────────────────────────
STARTING_BUDGET = 100.0
MAX_SINGLE_POSITION_PCT = 0.30  # never more than 30% in one asset
