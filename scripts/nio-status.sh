#!/bin/bash
# Nio Status Card - Quick level check from mobile or terminal
# Usage: bash scripts/nio-status.sh

DB="$HOME/.niobot/data/niobot.db"
NIO_DB="/Users/shawnos.ai/shawn-gtme-os/website/apps/nio-chat/niobot.db"

# Try nio-chat DB first (server-authoritative), fall back to niobot.db
if [ -f "$NIO_DB" ]; then
  SRC="$NIO_DB"
elif [ -f "$DB" ]; then
  SRC="$DB"
else
  echo "No database found."
  exit 1
fi

# Tier names
tier_name() {
  case $1 in
    1) echo "Spark" ;;
    2) echo "Blade" ;;
    3) echo "Warden" ;;
    4) echo "Sentinel" ;;
    5) echo "Ascended" ;;
    *) echo "Unknown" ;;
  esac
}

# Tier XP thresholds
tier_threshold() {
  case $1 in
    1) echo 0 ;;
    2) echo 500 ;;
    3) echo 2000 ;;
    4) echo 6000 ;;
    5) echo 15000 ;;
  esac
}

# Query each field individually to avoid pipe/JSON parsing issues
XP=$(sqlite3 "$SRC" "SELECT xp FROM dna_state WHERE user_id='default';")
TIER=$(sqlite3 "$SRC" "SELECT tier FROM dna_state WHERE user_id='default';")
LEVEL=$(sqlite3 "$SRC" "SELECT level FROM dna_state WHERE user_id='default';")
STREAK=$(sqlite3 "$SRC" "SELECT streak FROM dna_state WHERE user_id='default';")
LAST_ACTIVE=$(sqlite3 "$SRC" "SELECT last_active_date FROM dna_state WHERE user_id='default';")
MESSAGES=$(sqlite3 "$SRC" "SELECT total_messages FROM dna_state WHERE user_id='default';")
SKILL_XP=$(sqlite3 "$SRC" "SELECT skill_xp FROM dna_state WHERE user_id='default';")

if [ -z "$XP" ]; then
  echo "No evolution data found."
  exit 1
fi

# Parse skill XP from JSON
OPS=$(echo "$SKILL_XP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('ops',0))" 2>/dev/null || echo "0")
WRITING=$(echo "$SKILL_XP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('writing',0))" 2>/dev/null || echo "0")
ARCH=$(echo "$SKILL_XP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('architecture',0))" 2>/dev/null || echo "0")

# Calculate next tier
CURRENT_TIER_NAME=$(tier_name $TIER)
NEXT_TIER=$((TIER + 1))
if [ $NEXT_TIER -le 5 ]; then
  NEXT_TIER_NAME=$(tier_name $NEXT_TIER)
  NEXT_THRESHOLD=$(tier_threshold $NEXT_TIER)
  XP_TO_NEXT=$((NEXT_THRESHOLD - XP))
else
  NEXT_TIER_NAME="MAX"
  XP_TO_NEXT=0
fi

# XP earned today
XP_TODAY=$(sqlite3 "$SRC" "SELECT COALESCE(SUM(xp_gained),0) FROM evolution_history WHERE date(created_at)=date('now');" 2>/dev/null || echo "0")

# Streak multiplier
if [ "$STREAK" -ge 30 ]; then
  MULT="2.0x"
elif [ "$STREAK" -ge 14 ]; then
  MULT="1.75x"
elif [ "$STREAK" -ge 7 ]; then
  MULT="1.5x"
elif [ "$STREAK" -ge 3 ]; then
  MULT="1.25x"
else
  MULT="1.0x"
fi

# Output
echo ""
echo "  NIO STATUS"
echo "  =========="
echo ""
echo "  Tier $TIER: $CURRENT_TIER_NAME"
echo "  Level $LEVEL | $XP XP"
echo "  Streak: $STREAK days ($MULT)"
echo ""
if [ "$NEXT_TIER_NAME" != "MAX" ]; then
  echo "  Next: $NEXT_TIER_NAME in $XP_TO_NEXT XP"
fi
echo ""
echo "  Skills"
echo "  - ops: $OPS"
echo "  - writing: $WRITING"
echo "  - architecture: $ARCH"
echo ""
echo "  Today: +$XP_TODAY XP | $MESSAGES total messages"
echo "  Last active: $LAST_ACTIVE"
echo ""
