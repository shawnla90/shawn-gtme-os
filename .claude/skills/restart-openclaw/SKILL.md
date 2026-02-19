---
name: restart-openclaw
description: Diagnose and restart the OpenClaw gateway. Checks if the LaunchAgent is loaded, stops any stale processes, reloads the service, and confirms it's running. Use when the user types /restart-openclaw or says OpenClaw is disconnecting, not responding, or needs a restart.
allowed-tools: Bash
---

# Restart OpenClaw Gateway

The OpenClaw gateway runs as a macOS LaunchAgent (`ai.openclaw.gateway`) with `KeepAlive: true`. This skill diagnoses the current state, fixes it, and confirms the gateway is healthy.

---

## Step 1: Check current status

Run:
```bash
openclaw gateway status
```

Note whether the service is:
- `loaded` + `running` → already healthy, report and stop
- `loaded` + NOT running → launchd should restart it automatically; if not, proceed to Step 3
- `not loaded` → proceed to Step 2

---

## Step 2: Load the LaunchAgent (if not loaded)

```bash
launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

If this errors with "already loaded", proceed to Step 3 for a full restart.

---

## Step 3: Full restart (if needed)

Stop the gateway cleanly:
```bash
openclaw gateway stop
```

Wait 2 seconds, then start:
```bash
openclaw gateway start
```

If `openclaw gateway start` fails, load directly via launchctl:
```bash
launchctl unload ~/Library/LaunchAgents/ai.openclaw.gateway.plist 2>/dev/null || true
launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

---

## Step 4: Confirm healthy

Wait 2 seconds then run:
```bash
openclaw gateway status
```

Confirm output shows:
- `Service: LaunchAgent (loaded)`
- `Runtime: running (pid ..., state active)`
- `RPC probe: ok`

---

## Step 5: Check error log for root cause

```bash
tail -20 ~/.openclaw/logs/gateway.err.log
```

Report any notable errors to the user (version mismatches, invalid config keys, port conflicts).

---

## Step 6: Report

Tell the user:
- Whether it was already running or needed a restart
- The PID the gateway is now running on
- Any errors found in the log
- If `KeepAlive: true` is confirmed in the plist (so they know it will auto-recover on crashes/reboots)
