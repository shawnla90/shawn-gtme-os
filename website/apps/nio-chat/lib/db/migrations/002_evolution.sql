-- NioBot V3: Evolution system tables (prepared for future server sync)

CREATE TABLE IF NOT EXISTS evolution (
  user_id TEXT PRIMARY KEY DEFAULT 'default',
  xp INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  last_active_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS evolution_skills (
  user_id TEXT NOT NULL DEFAULT 'default',
  skill_id TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, skill_id),
  FOREIGN KEY (user_id) REFERENCES evolution(user_id)
);

CREATE TABLE IF NOT EXISTS evolution_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL DEFAULT 'default',
  xp_gained INTEGER NOT NULL,
  source TEXT NOT NULL,
  skill_id TEXT,
  multiplier REAL NOT NULL DEFAULT 1.0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES evolution(user_id)
);

-- Index for querying XP history by date
CREATE INDEX IF NOT EXISTS idx_evolution_history_date ON evolution_history(created_at);
