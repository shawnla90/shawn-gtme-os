export interface CronJob {
  id: string
  label: string
  name: string
  system: 'ig' | 'x' | 'gtme' | 'clearbox'
  plistPath: string
  schedule: string
  scriptPath: string
  stdoutLog?: string
  stderrLog?: string
  logDir?: string
  logPattern?: string
  killSwitchPath?: string
}

const HOME = '/Users/shawnos.ai'
const LA = `${HOME}/Library/LaunchAgents`
const GTME_LD = `${HOME}/shawn-gtme-os/scripts/launchd`

export const CRON_REGISTRY: CronJob[] = [
  // ── Instagram Growth Engine ───────────────────────────────────────
  {
    id: 'ig-engage',
    label: 'com.shawnos.ig-engage',
    name: 'IG Engage',
    system: 'ig',
    plistPath: `${LA}/com.shawnos.ig-engage.plist`,
    schedule: 'Every 1h',
    scriptPath: `cd ${HOME}/ig-growth-engine && python3 ig-smart-engage.py --live`,
    stdoutLog: `${HOME}/ig-growth-engine/data/logs/cron.out.log`,
    stderrLog: `${HOME}/ig-growth-engine/data/logs/cron.err.log`,
    logDir: `${HOME}/ig-growth-engine/data/logs`,
    logPattern: 'engage_*.json',
  },
  {
    id: 'ig-reply',
    label: 'com.shawnos.ig-reply',
    name: 'IG Reply-Back',
    system: 'ig',
    plistPath: `${LA}/com.shawnos.ig-reply.plist`,
    schedule: 'Every 4h',
    scriptPath: `cd ${HOME}/ig-growth-engine && python3 ig-reply-back.py --live`,
    stdoutLog: `${HOME}/ig-growth-engine/data/logs/reply-cron.out.log`,
    stderrLog: `${HOME}/ig-growth-engine/data/logs/reply-cron.err.log`,
    logDir: `${HOME}/ig-growth-engine/data/logs`,
    logPattern: 'reply_*.json',
  },
  {
    id: 'ig-crossengage',
    label: 'com.shawnos.ig-crossengage',
    name: 'IG Cross-Engage',
    system: 'ig',
    plistPath: `${LA}/com.shawnos.ig-crossengage.plist`,
    schedule: 'Every 2h',
    scriptPath: `cd ${HOME}/ig-growth-engine && python3 ig-cross-engage.py --live`,
    stdoutLog: `${HOME}/ig-growth-engine/data/logs/cron.cross.out.log`,
    stderrLog: `${HOME}/ig-growth-engine/data/logs/cron.cross.err.log`,
  },
  {
    id: 'ig-follow',
    label: 'com.shawnos.ig-follow',
    name: 'IG Follow Engine',
    system: 'ig',
    plistPath: `${LA}/com.shawnos.ig-follow.plist`,
    schedule: 'Every 6h',
    scriptPath: `cd ${HOME}/ig-growth-engine && python3 ig-follow-engine.py --live`,
    stdoutLog: `${HOME}/ig-growth-engine/data/logs/cron.follow.out.log`,
    stderrLog: `${HOME}/ig-growth-engine/data/logs/cron.follow.err.log`,
  },
  // ── X Growth Engine ───────────────────────────────────────────────
  {
    id: 'x-reply',
    label: 'com.shawnos.x-reply',
    name: 'X Smart Reply',
    system: 'x',
    plistPath: `${LA}/com.shawnos.x-reply.plist`,
    schedule: 'Every 2h',
    scriptPath: `cd ${HOME}/x-growth-engine && python3 x-smart-reply.py --live`,
    stdoutLog: `${HOME}/x-growth-engine/data/logs/cron.out.log`,
    stderrLog: `${HOME}/x-growth-engine/data/logs/cron.err.log`,
    logDir: `${HOME}/x-growth-engine/data/logs`,
    logPattern: 'reply_*.json',
    killSwitchPath: `${HOME}/x-growth-engine/data/kill-switch.json`,
  },
  {
    id: 'x-content',
    label: 'com.shawnos.x-content',
    name: 'X Content Poster',
    system: 'x',
    plistPath: `${LA}/com.shawnos.x-content.plist`,
    schedule: '1pm + 6pm daily',
    scriptPath: `cd ${HOME}/x-growth-engine && python3 x-content-poster.py --live`,
    stdoutLog: `${HOME}/x-growth-engine/data/logs/content-cron.out.log`,
    stderrLog: `${HOME}/x-growth-engine/data/logs/content-cron.err.log`,
    killSwitchPath: `${HOME}/x-growth-engine/data/kill-switch.json`,
  },
  {
    id: 'x-replyback',
    label: 'com.shawnos.x-replyback',
    name: 'X Reply-Back',
    system: 'x',
    plistPath: `${LA}/com.shawnos.x-replyback.plist`,
    schedule: 'Every 6h',
    scriptPath: `cd ${HOME}/x-growth-engine && python3 x-reply-back.py --live`,
    stdoutLog: `${HOME}/x-growth-engine/data/logs/replyback-cron.out.log`,
    stderrLog: `${HOME}/x-growth-engine/data/logs/replyback-cron.err.log`,
    killSwitchPath: `${HOME}/x-growth-engine/data/kill-switch.json`,
  },
  // ── GTME-OS ───────────────────────────────────────────────────────
  {
    id: 'sync-main',
    label: 'com.shawnos.sync-main',
    name: 'Git Sync Main',
    system: 'gtme',
    plistPath: `${GTME_LD}/com.shawnos.sync-main.plist`,
    schedule: 'Daily 11:58 PM',
    scriptPath: `bash ${HOME}/shawn-gtme-os/scripts/sync_main.sh`,
    stdoutLog: `${HOME}/shawn-gtme-os/data/daily-log/sync-main-stdout.log`,
    stderrLog: `${HOME}/shawn-gtme-os/data/daily-log/sync-main-stderr.log`,
  },
  {
    id: 'abm-pipeline',
    label: 'com.shawnos.abm-pipeline',
    name: 'ABM Pipeline',
    system: 'gtme',
    plistPath: `${GTME_LD}/com.shawnos.abm-pipeline.plist`,
    schedule: 'Daily 10 PM',
    scriptPath: `python3 ${HOME}/shawn-gtme-os/scripts/abm/pipeline.py --step all --limit 10 --resume`,
    stdoutLog: `${HOME}/Library/Logs/abm-pipeline.log`,
  },
  {
    id: 'abm-depersonalize',
    label: 'com.shawnos.abm-depersonalize',
    name: 'ABM Depersonalize',
    system: 'gtme',
    plistPath: `${GTME_LD}/com.shawnos.abm-depersonalize.plist`,
    schedule: 'Daily 6 AM',
    scriptPath: `python3 ${HOME}/shawn-gtme-os/scripts/abm/depersonalize.py`,
    stdoutLog: `${HOME}/Library/Logs/abm-depersonalize.log`,
  },
  {
    id: 'check-replies',
    label: 'com.shawnos.check-replies',
    name: 'Check Replies',
    system: 'gtme',
    plistPath: `${GTME_LD}/com.shawnos.check-replies.plist`,
    schedule: 'Every 30m',
    scriptPath: `python3 ${HOME}/shawn-gtme-os/scripts/abm/check_replies.py`,
    stdoutLog: `${HOME}/Library/Logs/check-replies.log`,
  },
  {
    id: 'content-intel',
    label: 'com.shawnos.content-intel',
    name: 'Content Intel',
    system: 'gtme',
    plistPath: `${GTME_LD}/com.shawnos.content-intel.plist`,
    schedule: 'Daily 10 AM',
    scriptPath: `python3 ${HOME}/shawn-gtme-os/scripts/daily_content_intel.py`,
    stdoutLog: `${HOME}/shawn-gtme-os/data/daily-log/content-intel-stdout.log`,
    stderrLog: `${HOME}/shawn-gtme-os/data/daily-log/content-intel-stderr.log`,
  },
  {
    id: 'contentos-optimizer',
    label: 'com.shawnos.contentos-optimizer',
    name: 'ContentOS Optimizer',
    system: 'gtme',
    plistPath: `${GTME_LD}/com.shawnos.contentos-optimizer.plist`,
    schedule: 'Daily 11 PM',
    scriptPath: `python3 ${HOME}/shawn-gtme-os/scripts/contentos_optimizer.py`,
    stdoutLog: `${HOME}/shawn-gtme-os/data/daily-log/contentos-optimizer-stdout.log`,
    stderrLog: `${HOME}/shawn-gtme-os/data/daily-log/contentos-optimizer-stderr.log`,
  },
  {
    id: 'crypto-signal',
    label: 'com.shawnos.crypto-signal',
    name: 'Crypto Signals',
    system: 'gtme',
    plistPath: `${GTME_LD}/com.shawnos.crypto-signal.plist`,
    schedule: '7 AM + 5:30 PM',
    scriptPath: `bash ${HOME}/shawn-gtme-os/scripts/crypto/deploy_signals.sh`,
    stdoutLog: `${HOME}/.logs/crypto-signal.log`,
  },
  {
    id: 'linkedin-posts',
    label: 'com.shawnos.linkedin-posts',
    name: 'LinkedIn Posts',
    system: 'gtme',
    plistPath: `${GTME_LD}/com.shawnos.linkedin-posts.plist`,
    schedule: 'Daily 9 AM',
    scriptPath: `python3 ${HOME}/shawn-gtme-os/scripts/linkedin_post_generator.py`,
    stdoutLog: `${HOME}/shawn-gtme-os/data/daily-log/linkedin-posts-stdout.log`,
    stderrLog: `${HOME}/shawn-gtme-os/data/daily-log/linkedin-posts-stderr.log`,
  },
  {
    id: 'reddit-digest',
    label: 'com.shawnos.reddit-digest',
    name: 'Reddit Digest',
    system: 'gtme',
    plistPath: `${GTME_LD}/com.shawnos.reddit-digest.plist`,
    schedule: 'Daily 10 AM',
    scriptPath: `python3 ${HOME}/shawn-gtme-os/scripts/reddit_slack_digest.py`,
    stdoutLog: `${HOME}/shawn-gtme-os/data/daily-log/reddit-digest-stdout.log`,
    stderrLog: `${HOME}/shawn-gtme-os/data/daily-log/reddit-digest-stderr.log`,
  },
  {
    id: 'x-digest',
    label: 'com.shawnos.x-digest',
    name: 'X Digest',
    system: 'gtme',
    plistPath: `${GTME_LD}/com.shawnos.x-digest.plist`,
    schedule: 'Daily 10 AM',
    scriptPath: `python3 ${HOME}/shawn-gtme-os/scripts/x_slack_digest.py`,
    stdoutLog: `${HOME}/shawn-gtme-os/data/daily-log/x-digest-stdout.log`,
    stderrLog: `${HOME}/shawn-gtme-os/data/daily-log/x-digest-stderr.log`,
  },
  {
    id: 'scout',
    label: 'com.shawnos.scout',
    name: 'Agent Scout',
    system: 'gtme',
    plistPath: `${GTME_LD}/com.shawnos.scout.plist`,
    schedule: 'Daily 6 AM',
    scriptPath: `python3 ${HOME}/shawn-gtme-os/scripts/agents/scout.py`,
    stdoutLog: `${HOME}/.logs/scout.log`,
  },
  {
    id: 'security-audit',
    label: 'com.shawnos.security-audit',
    name: 'Security Audit',
    system: 'gtme',
    plistPath: `${GTME_LD}/com.shawnos.security-audit.plist`,
    schedule: 'Mon/Thu/Sun 2 AM',
    scriptPath: `bash ${HOME}/shawn-gtme-os/scripts/security_audit.sh`,
    stdoutLog: `${HOME}/shawn-gtme-os/data/daily-log/security-audit.log`,
    stderrLog: `${HOME}/shawn-gtme-os/data/daily-log/security-audit-error.log`,
  },
  {
    id: 'sync-reddit',
    label: 'com.shawnos.sync-reddit',
    name: 'Sync Reddit',
    system: 'gtme',
    plistPath: `${GTME_LD}/com.shawnos.sync-reddit.plist`,
    schedule: 'Every 24h',
    scriptPath: `bash ${HOME}/shawn-gtme-os/scripts/sync_reddit.sh`,
    stdoutLog: `${HOME}/shawn-gtme-os/data/daily-log/sync-reddit-stdout.log`,
    stderrLog: `${HOME}/shawn-gtme-os/data/daily-log/sync-reddit-stderr.log`,
  },
  {
    id: 'mission-control',
    label: 'com.shawnos.mission-control',
    name: 'Mission Control',
    system: 'gtme',
    plistPath: `${GTME_LD}/com.shawnos.mission-control.plist`,
    schedule: 'Always-on',
    scriptPath: `bash ${HOME}/shawn-gtme-os/scripts/mission_control_server.sh`,
    stdoutLog: `${HOME}/shawn-gtme-os/data/daily-log/mission-control.log`,
    stderrLog: `${HOME}/shawn-gtme-os/data/daily-log/mission-control-error.log`,
  },
  {
    id: 'obsidian-sync',
    label: 'com.shawnos.obsidian-sync',
    name: 'Obsidian Sync',
    system: 'gtme',
    plistPath: `${GTME_LD}/com.shawnos.obsidian-sync.plist`,
    schedule: 'Always-on',
    scriptPath: `${HOME}/shawn-gtme-os/scripts/obsidian_sync.sh`,
    stdoutLog: `${HOME}/shawn-gtme-os/data/daily-log/obsidian-sync.log`,
  },
  // ── Clearbox ──────────────────────────────────────────────────────
  {
    id: 'clearbox-warmup',
    label: 'clearbox-warmup',
    name: 'Email Warmup',
    system: 'clearbox',
    plistPath: '', // crontab entry, not launchd
    schedule: 'Every 30m (8AM-6PM weekdays)',
    scriptPath: `python3 ${HOME}/clearbox/scripts/outbound/warmup.py --cron`,
    stdoutLog: `${HOME}/clearbox/data/warmup.log`,
  },
]

export const SYSTEM_LABELS: Record<string, string> = {
  ig: 'Instagram',
  x: 'X / Twitter',
  gtme: 'GTME-OS',
  clearbox: 'Clearbox',
}

export function getJobById(id: string): CronJob | undefined {
  return CRON_REGISTRY.find((j) => j.id === id)
}

export function getJobsBySystem(system: string): CronJob[] {
  return CRON_REGISTRY.filter((j) => j.system === system)
}
