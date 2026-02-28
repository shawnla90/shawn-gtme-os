#!/usr/bin/env node
/**
 * heartbeat.js — Write Claude Code activity status to .hypernovum-status.json
 *
 * Called by Claude Code hooks on tool use. Writes a JSON file that the
 * Mission Control heartbeat API reads.
 *
 * Usage:
 *   node scripts/heartbeat.js                    # record activity
 *   node scripts/heartbeat.js --project=myproj   # with project context
 *   node scripts/heartbeat.js --tool=Edit         # with tool name
 */

const fs = require('fs')
const path = require('path')

const REPO_ROOT = path.resolve(__dirname, '..')
const STATUS_FILE = path.join(REPO_ROOT, '.hypernovum-status.json')

function writeHeartbeat() {
  const args = process.argv.slice(2)
  const params = {}
  for (const arg of args) {
    const match = arg.match(/^--(\w+)=(.+)$/)
    if (match) params[match[1]] = match[2]
  }

  const now = new Date().toISOString()

  // Read existing status to preserve history
  let existing = {}
  try {
    existing = JSON.parse(fs.readFileSync(STATUS_FILE, 'utf-8'))
  } catch {
    // File doesn't exist yet
  }

  const status = {
    active: true,
    lastActivity: now,
    project: params.project || existing.project || null,
    tool: params.tool || null,
    sessionStart: existing.sessionStart || now,
    activityCount: (existing.activityCount || 0) + 1,
    machine: require('os').hostname(),
  }

  fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2))
}

writeHeartbeat()
