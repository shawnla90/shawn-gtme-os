-- NioBot V3: Self-Learning Layer — Initiative tracking
-- Captures ideas, tool evaluations, deferred work across sessions

-- ============================================================
-- initiatives: Persistent backlog of ideas, evaluations, plans
-- ============================================================

CREATE TABLE IF NOT EXISTS initiatives (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'idea'
    CHECK (status IN ('idea', 'planned', 'in_progress', 'blocked', 'completed', 'dropped')),
  source TEXT NOT NULL DEFAULT 'manual'
    CHECK (source IN ('manual', 'evaluate', 'discuss', 'phase_report', 'morning')),
  source_url TEXT,
  pillar TEXT
    CHECK (pillar IS NULL OR pillar IN ('messaging', 'chimes', 'evolution', 'ops', 'content', 'infra')),
  priority INTEGER NOT NULL DEFAULT 3
    CHECK (priority BETWEEN 1 AND 5),
  depends_on TEXT NOT NULL DEFAULT '[]',      -- JSON array of initiative IDs
  blocked_by TEXT,                             -- Free-text reason (nullable)
  notes TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_initiatives_status ON initiatives(status);
CREATE INDEX IF NOT EXISTS idx_initiatives_status_priority ON initiatives(status, priority DESC);
CREATE INDEX IF NOT EXISTS idx_initiatives_pillar ON initiatives(pillar);
CREATE INDEX IF NOT EXISTS idx_initiatives_source ON initiatives(source);

-- ============================================================
-- Trigger: auto-update updated_at on row modification
-- ============================================================

CREATE TRIGGER IF NOT EXISTS initiatives_updated_at
AFTER UPDATE ON initiatives
BEGIN
  UPDATE initiatives SET updated_at = unixepoch('now') * 1000 WHERE id = NEW.id;
END;

-- ============================================================
-- Views
-- ============================================================

-- v_initiatives_unblocked: ideas/planned with no blockers and all deps resolved
CREATE VIEW IF NOT EXISTS v_initiatives_unblocked AS
SELECT i.*
FROM initiatives i
WHERE i.status IN ('idea', 'planned')
  AND (i.blocked_by IS NULL OR i.blocked_by = '')
  AND NOT EXISTS (
    SELECT 1
    FROM json_each(i.depends_on) AS dep
    WHERE dep.value IN (
      SELECT id FROM initiatives WHERE status NOT IN ('completed', 'dropped')
    )
  )
ORDER BY i.priority DESC, i.created_at ASC;

-- v_initiatives_active: currently in progress or blocked
CREATE VIEW IF NOT EXISTS v_initiatives_active AS
SELECT i.*
FROM initiatives i
WHERE i.status IN ('in_progress', 'blocked')
ORDER BY i.priority DESC, i.updated_at DESC;
