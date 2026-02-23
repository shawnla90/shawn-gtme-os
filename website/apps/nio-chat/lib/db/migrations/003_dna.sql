-- NioBot V3: DNA — Unified persistence layer
-- Server-authoritative evolution, memory search, daily flags

-- ============================================================
-- dna_state: Single-row identity snapshot (fast reads every request)
-- ============================================================

CREATE TABLE IF NOT EXISTS dna_state (
  user_id TEXT PRIMARY KEY DEFAULT 'default',
  xp INTEGER NOT NULL DEFAULT 0,
  tier INTEGER NOT NULL DEFAULT 1,
  level INTEGER NOT NULL DEFAULT 1,
  streak INTEGER NOT NULL DEFAULT 0,
  last_active_date TEXT,
  daily_bonus_claimed INTEGER NOT NULL DEFAULT 0,
  skill_xp TEXT NOT NULL DEFAULT '{}',             -- JSON: {"ops":0,"architecture":0,"writing":0}
  active_soul_traits TEXT NOT NULL DEFAULT '[]',    -- JSON array
  personality_flags TEXT NOT NULL DEFAULT '{}',     -- JSON: tier-unlocked behaviors
  total_messages INTEGER NOT NULL DEFAULT 0,
  total_conversations INTEGER NOT NULL DEFAULT 0,
  total_cost_cents REAL NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
);

-- Seed default row
INSERT OR IGNORE INTO dna_state (user_id) VALUES ('default');

-- Migrate existing evolution data if present
INSERT OR REPLACE INTO dna_state (user_id, xp, streak, last_active_date, skill_xp, created_at, updated_at)
SELECT
  e.user_id,
  e.xp,
  e.streak,
  e.last_active_date,
  COALESCE(
    (SELECT json_group_object(es.skill_id, es.xp)
     FROM evolution_skills es WHERE es.user_id = e.user_id),
    '{}'
  ),
  COALESCE(
    CASE WHEN typeof(e.created_at) = 'text'
      THEN CAST(strftime('%s', e.created_at) AS INTEGER) * 1000
      ELSE e.created_at END,
    unixepoch('now') * 1000
  ),
  unixepoch('now') * 1000
FROM evolution e
WHERE e.user_id = 'default'
  AND e.xp > 0;

-- ============================================================
-- dna_daily_flags: Server-side daily bonus/flag tracking
-- ============================================================

CREATE TABLE IF NOT EXISTS dna_daily_flags (
  user_id TEXT NOT NULL DEFAULT 'default',
  date TEXT NOT NULL,
  flag TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  PRIMARY KEY (user_id, date, flag)
);

-- ============================================================
-- ALTER memory: add structured fields
-- ============================================================

ALTER TABLE memory ADD COLUMN tags TEXT DEFAULT '[]';
ALTER TABLE memory ADD COLUMN importance REAL DEFAULT 0.5;
ALTER TABLE memory ADD COLUMN decay_rate REAL;
ALTER TABLE memory ADD COLUMN last_accessed_at INTEGER;
ALTER TABLE memory ADD COLUMN access_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE memory ADD COLUMN conversation_id TEXT;
ALTER TABLE memory ADD COLUMN extracted INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_memory_importance ON memory(importance DESC);
CREATE INDEX IF NOT EXISTS idx_memory_conversation ON memory(conversation_id) WHERE conversation_id IS NOT NULL;

-- FTS5 for memory search
CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
  content,
  content=memory,
  content_rowid=rowid
);

-- Triggers to keep memory FTS in sync
CREATE TRIGGER IF NOT EXISTS memory_fts_ai AFTER INSERT ON memory BEGIN
  INSERT INTO memory_fts(rowid, content) VALUES (new.rowid, new.content);
END;

CREATE TRIGGER IF NOT EXISTS memory_fts_ad AFTER DELETE ON memory BEGIN
  INSERT INTO memory_fts(memory_fts, rowid, content) VALUES ('delete', old.rowid, old.content);
END;

CREATE TRIGGER IF NOT EXISTS memory_fts_au AFTER UPDATE ON memory BEGIN
  INSERT INTO memory_fts(memory_fts, rowid, content) VALUES ('delete', old.rowid, old.content);
  INSERT INTO memory_fts(rowid, content) VALUES (new.rowid, new.content);
END;

-- ============================================================
-- ALTER evolution_history: add context columns
-- ============================================================

ALTER TABLE evolution_history ADD COLUMN conversation_id TEXT;
ALTER TABLE evolution_history ADD COLUMN agent_id TEXT;
ALTER TABLE evolution_history ADD COLUMN details TEXT DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_evolution_history_agent ON evolution_history(agent_id) WHERE agent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_evolution_history_source ON evolution_history(source);

-- ============================================================
-- Views
-- ============================================================

-- v_dna_snapshot: everything the client needs in one query
CREATE VIEW IF NOT EXISTS v_dna_snapshot AS
SELECT
  d.user_id,
  d.xp,
  d.tier,
  d.level,
  d.streak,
  d.last_active_date,
  d.daily_bonus_claimed,
  d.skill_xp,
  d.active_soul_traits,
  d.personality_flags,
  d.total_messages,
  d.total_conversations,
  d.total_cost_cents,
  d.created_at,
  d.updated_at,
  -- XP earned in last 24 hours
  COALESCE(
    (SELECT SUM(eh.xp_gained) FROM evolution_history eh
     WHERE eh.user_id = d.user_id
       AND (
         -- Handle both datetime strings (002) and epoch ms timestamps
         CASE WHEN typeof(eh.created_at) = 'text'
           THEN CAST(strftime('%s', eh.created_at) AS INTEGER) * 1000
           ELSE eh.created_at
         END
       ) > (unixepoch('now') * 1000 - 86400000)
    ), 0
  ) AS xp_last_24h,
  -- Memory count
  COALESCE(
    (SELECT COUNT(*) FROM memory m WHERE m.agent_id IS NOT NULL
      AND (m.expires_at IS NULL OR m.expires_at > unixepoch('now') * 1000)
    ), 0
  ) AS memory_count,
  -- Conversations today
  COALESCE(
    (SELECT COUNT(*) FROM conversations c
     WHERE date(c.created_at / 1000, 'unixepoch') = date('now')
    ), 0
  ) AS conversations_today,
  -- Cost today
  COALESCE(
    (SELECT SUM(dc.cost_cents) FROM daily_costs dc
     WHERE dc.date = date('now')
    ), 0
  ) AS cost_today_cents
FROM dna_state d
WHERE d.user_id = 'default';

-- v_xp_daily_summary: XP trend data grouped by date
CREATE VIEW IF NOT EXISTS v_xp_daily_summary AS
SELECT
  CASE WHEN typeof(eh.created_at) = 'text'
    THEN date(eh.created_at)
    ELSE date(eh.created_at / 1000, 'unixepoch')
  END AS day,
  SUM(eh.xp_gained) AS total_xp,
  COUNT(*) AS event_count,
  GROUP_CONCAT(DISTINCT eh.source) AS sources
FROM evolution_history eh
WHERE eh.user_id = 'default'
GROUP BY day
ORDER BY day DESC;
