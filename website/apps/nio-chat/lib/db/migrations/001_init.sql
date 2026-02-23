-- NioBot V2 — Initial Schema
-- All timestamps are Unix epoch milliseconds (JavaScript Date.now())

-- Conversations map 1:1 to Claude CLI sessions
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  session_id TEXT UNIQUE,
  agent_id TEXT NOT NULL,
  title TEXT,
  model TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  total_input_tokens INTEGER NOT NULL DEFAULT 0,
  total_output_tokens INTEGER NOT NULL DEFAULT 0,
  total_cost_cents REAL NOT NULL DEFAULT 0,
  turn_count INTEGER NOT NULL DEFAULT 0,
  archived INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_conversations_agent ON conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_session ON conversations(session_id);

-- Messages — full chat history
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  agent_id TEXT,
  model TEXT,
  input_tokens INTEGER,
  output_tokens INTEGER,
  cost_cents REAL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at);

-- FTS5 full-text search index on messages
CREATE VIRTUAL TABLE IF NOT EXISTS messages_fts USING fts5(
  content,
  content=messages,
  content_rowid=rowid
);

-- Triggers to keep FTS index in sync
CREATE TRIGGER IF NOT EXISTS messages_ai AFTER INSERT ON messages BEGIN
  INSERT INTO messages_fts(rowid, content) VALUES (new.rowid, new.content);
END;

CREATE TRIGGER IF NOT EXISTS messages_ad AFTER DELETE ON messages BEGIN
  INSERT INTO messages_fts(messages_fts, rowid, content) VALUES ('delete', old.rowid, old.content);
END;

CREATE TRIGGER IF NOT EXISTS messages_au AFTER UPDATE ON messages BEGIN
  INSERT INTO messages_fts(messages_fts, rowid, content) VALUES ('delete', old.rowid, old.content);
  INSERT INTO messages_fts(rowid, content) VALUES (new.rowid, new.content);
END;

-- Memory — structured knowledge entries
CREATE TABLE IF NOT EXISTS memory (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('fact', 'preference', 'decision', 'task', 'summary')),
  content TEXT NOT NULL,
  source TEXT,
  ttl_ms INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  expires_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_memory_agent_type ON memory(agent_id, type);
CREATE INDEX IF NOT EXISTS idx_memory_expires ON memory(expires_at) WHERE expires_at IS NOT NULL;

-- Session logs — per-session metadata
CREATE TABLE IF NOT EXISTS session_logs (
  id TEXT PRIMARY KEY,
  conversation_id TEXT REFERENCES conversations(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL,
  model TEXT,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  cost_cents REAL NOT NULL DEFAULT 0,
  turn_count INTEGER NOT NULL DEFAULT 0,
  summary TEXT,
  flush_count INTEGER NOT NULL DEFAULT 0,
  started_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  ended_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_session_logs_conversation ON session_logs(conversation_id);
CREATE INDEX IF NOT EXISTS idx_session_logs_agent ON session_logs(agent_id, started_at DESC);

-- Monitor checks — guardian check results
CREATE TABLE IF NOT EXISTS monitor_checks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site TEXT NOT NULL,
  check_type TEXT NOT NULL CHECK(check_type IN ('uptime', 'freshness', 'broken_links', 'deploy', 'ssl', 'performance')),
  status TEXT NOT NULL CHECK(status IN ('ok', 'warning', 'critical', 'unknown')),
  message TEXT,
  response_ms INTEGER,
  checked_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
);

CREATE INDEX IF NOT EXISTS idx_monitor_checks_site ON monitor_checks(site, check_type, checked_at DESC);

-- Monitor alerts — active issues
CREATE TABLE IF NOT EXISTS monitor_alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site TEXT NOT NULL,
  check_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK(severity IN ('info', 'warning', 'critical')),
  message TEXT NOT NULL,
  acknowledged INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  resolved_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_monitor_alerts_active ON monitor_alerts(resolved_at) WHERE resolved_at IS NULL;

-- Daily costs — aggregated cost tracking
CREATE TABLE IF NOT EXISTS daily_costs (
  date TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  model TEXT NOT NULL,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  cost_cents REAL NOT NULL DEFAULT 0,
  request_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (date, agent_id, model)
);

-- Schema version tracking
CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  applied_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
);
