---
title: "Terminal Mastery"
subtitle: "The terminal is your cockpit. Learn to fly it."
part: 3
order: 10
date: "2026-03-27"
---

*This is the web edition of Chapter 10 from the [GTM Coding Agent Playbook](https://github.com/shawnla90/gtm-coding-agent/blob/main/chapters/10-terminal-mastery.md). Expanded with more practical workflows, shell customization, and the progression from beginner to power user.*

---

The first time I opened a terminal, I typed `ls` and felt like a hacker. The second time, I typed something wrong and panicked that I'd broken my computer. The third time, I figured out `cd` and spent twenty minutes navigating to a folder I could have found with one click in Finder.

That was ten years ago. Today the terminal is where I spend most of my working hours. Not because I enjoy the aesthetic of a black screen with green text (though I do). Because the terminal is the fastest interface for the kind of work I do. And if you're running GTM with coding agents, it's about to become the fastest interface for the kind of work you do too.

Claude Code runs in a terminal. Every chapter in this book has been building toward workflows that live in the terminal. Your enrichment scripts, your data pipelines, your content generation, your CRM integration. All of it happens through text commands in a terminal window.

This chapter is about making that environment feel like home instead of a scary black box. You don't need to become a systems administrator. You need about 20 commands, one tool called tmux, and a willingness to be uncomfortable for about a week before it clicks.

## The Progression

Let me map out what the journey actually looks like, because knowing where you're headed makes the first steps less intimidating.

**Stage 1: Copy-paste.** You follow instructions. Someone says "run this command" and you paste it into the terminal. You don't fully understand what's happening, but things work. This is where everyone starts and there's no shame in staying here while you learn.

**Stage 2: Navigation.** You can move around the filesystem. You know where your files live. You can run scripts, check output, and pipe results between commands. The terminal feels functional if not yet comfortable.

**Stage 3: Customization.** You've set up aliases for your common commands. Your prompt shows you useful info. You have tmux configured with your preferred layout. The terminal feels like your workspace, not someone else's.

**Stage 4: Orchestration.** Multiple agent sessions running simultaneously. Log files streaming in one pane while you give instructions in another. Remote sessions that survive closing your laptop. You can't imagine going back to doing this work through a GUI.

Most people reading this are at Stage 1 or 2. By the end of this chapter, you'll have the knowledge to reach Stage 3. Stage 4 comes naturally after a few weeks of practice.

## tmux: The Most Important Tool You've Never Heard Of

tmux stands for "terminal multiplexer." In plain terms: it lets you run multiple terminal sessions inside one window, and those sessions keep running even if you close your terminal or disconnect from a remote machine.

That second part is the real superpower. Without tmux, if you're running an enrichment script and you close your laptop, the script dies. With tmux, you close your laptop, go to lunch, open it back up, and the script is still running exactly where you left it.

### Why it matters for coding agents

Claude Code sometimes works for minutes at a stretch on a complex task. During that time, you want to be doing other things. Watching output files. Running quick queries against your database. Testing an API endpoint. Without tmux, you're stuck watching the agent work in a single terminal window with nothing to do but wait.

With tmux, you have the agent in one pane, a log watcher in another, and a general-purpose shell in a third. You're productive the entire time the agent is working.

### Getting started

Install it:

```bash
# Mac (with Homebrew)
brew install tmux

# Ubuntu/Debian
sudo apt install tmux
```

The seven operations you need. That's it. Seven things and you've got 90% of tmux covered:

```bash
# 1. Create a new named session
tmux new -s gtm

# 2. Split the window vertically (side by side panes)
# Press: Ctrl-b then %

# 3. Split the window horizontally (top and bottom panes)
# Press: Ctrl-b then "

# 4. Move between panes
# Press: Ctrl-b then arrow key (left/right/up/down)

# 5. Detach from the session (it keeps running in the background)
# Press: Ctrl-b then d

# 6. List running sessions
tmux ls

# 7. Reattach to your session
tmux attach -t gtm
```

A note on the keyboard shortcuts: `Ctrl-b` is the prefix key. You press Ctrl and b together, release them, then press the next key. It feels weird at first. After a day or two of using tmux, your fingers do it automatically.

### The GTM three-pane layout

This is the layout I use daily and the one I recommend for anyone running coding agents:

```
+-----------------------------+----------------------+
|                             |                      |
|   Pane 1: Claude Code       |  Pane 2: Logs        |
|                             |                      |
|   (your agent session)      |  tail -f output.log  |
|                             |                      |
|                             |                      |
+-----------------------------+----------------------+
|                                                     |
|   Pane 3: Shell / scratch pad                       |
|                                                     |
|   Quick commands, database queries, API tests       |
|                                                     |
+-----------------------------------------------------+
```

To build it:

```bash
tmux new -s gtm         # Start a session
# Ctrl-b %              # Split right (creates Pane 2)
# Ctrl-b left-arrow     # Move back to left pane
# Ctrl-b "              # Split down (creates Pane 3)
```

Now you have three panes. Pane 1 (top left) is where you run `claude` and give it tasks. Pane 2 (right) runs `tail -f` on whatever output file the agent is writing to, so you see results streaming in real time. Pane 3 (bottom left) is your scratch pad for quick commands.

This layout transforms the experience of working with a coding agent. Instead of sitting in a single pane waiting for the agent to finish, you're actively monitoring, testing, and preparing your next task. It turns the terminal from a single-track tool into a command center.

### Making tmux yours

The default tmux configuration is functional but spartan. A small config file makes it significantly more comfortable.

Create `~/.tmux.conf`:

```bash
# Use mouse to resize panes and select them (game changer for beginners)
set -g mouse on

# Start window numbering at 1 instead of 0
set -g base-index 1

# Increase scrollback buffer (default is tiny)
set -g history-limit 50000

# Reduce escape key delay (makes vim users happy)
set -sg escape-time 10

# Status bar styling (optional, but nice)
set -g status-style 'bg=colour235 fg=colour136'
set -g status-left '#[fg=colour46][#S] '
set -g status-right '%H:%M %d-%b'
```

After saving the file, reload it: `tmux source-file ~/.tmux.conf`

The `set -g mouse on` line alone is worth the config file. It lets you click on panes to select them, drag borders to resize them, and scroll with your trackpad. For someone transitioning from GUI tools, this removes most of the friction.

## SSH: Running Agents on Remote Machines

SSH lets you connect to machines that aren't in front of you. A cloud server, a Mac Mini sitting in a closet, a beefy desktop at home while you're at a coffee shop. The commands work the same way. The terminal looks the same. But the work is happening on a different computer.

Why this matters for GTM:

- **Always-on scripts.** Your enrichment pipeline runs overnight on a server that never sleeps. You don't leave your laptop open.
- **More power.** That $599 Mac Mini in the closet with 24GB of RAM is a better agent host than your laptop.
- **Location independence.** Start a job at the office, check on it from home, review the output from your phone.

The basics:

```bash
# Connect to a remote machine
ssh user@your-server.com

# Copy a file to the remote machine
scp local-file.csv user@your-server.com:~/data/

# Copy a file back
scp user@your-server.com:~/output.csv ./
```

### The real pattern: SSH + tmux

This is where remote work with agents becomes genuinely powerful. SSH into a machine. Start a tmux session. Run your agent. Detach. Walk away.

```bash
# From your laptop
ssh user@your-server.com

# On the remote machine
tmux new -s enrichment

# Start your work
claude
> Enrich the top 500 accounts from the target list using Apollo.
> Save results to output/enriched_accounts.csv

# Agent starts working. Time to detach.
# Ctrl-b d

# Disconnect from the remote machine
exit
```

The agent keeps running. The tmux session keeps running. The remote machine keeps doing its thing. Go to dinner. Come back later:

```bash
ssh user@your-server.com
tmux attach -t enrichment
# Right back where you left off. Output file has been growing the whole time.
```

This is how you run overnight enrichment jobs, content generation batches, and recurring pipeline scripts without paying for a SaaS platform to host them. The infrastructure is a machine you already own (or a $5/month VPS) plus tmux plus SSH.

## Terminal Commands That Actually Matter for GTM

You don't need to memorize 200 commands. Here are the ones that come up constantly in GTM work, organized by what you're actually trying to do.

### Inspecting data files

Your agents produce output files. Your scripts generate CSVs. You need to check them quickly without opening a spreadsheet app.

```bash
# How many rows in this CSV? (subtract 1 for the header)
wc -l prospects.csv

# What do the column headers look like?
head -1 prospects.csv

# What does the last batch of data look like?
tail -10 output.csv

# How many unique values are in column 3?
cut -d',' -f3 prospects.csv | sort | uniq -c | sort -rn

# Quick peek at a file without opening it
less prospects.csv    # scroll with arrows, quit with q
```

That last one, `less`, is worth learning. It opens any file in a scrollable viewer. Arrow keys to move around. `/` to search for text. `q` to quit. When your agent produces a large output file, `less` is how you inspect it without leaving the terminal.

### Working with JSON

API responses come back as JSON. Your agents produce JSON outputs. Being able to read and query JSON from the command line saves you from copy-pasting into a browser tool every time.

```bash
# Pretty-print JSON (readable formatting)
python3 -m json.tool < response.json

# Extract specific fields with jq
jq '.results[].company_name' response.json

# Count results
jq '.results | length' response.json

# Filter results (companies with more than 100 employees)
jq '.results[] | select(.employee_count > 100)' response.json
```

If you don't have `jq` installed: `brew install jq` (Mac) or `sudo apt install jq` (Linux). It's a small tool that earns its disk space immediately. Every time you'd open a JSON file in a text editor and scroll around trying to find the field you need, `jq` gets you there in one command.

### Querying your local database

If you're using SQLite for your GTM data (and you should consider it for early-stage setups), the command-line interface is fast and surprisingly powerful.

```bash
# Run a quick query
sqlite3 gtm.db "SELECT COUNT(*) FROM prospects WHERE status = 'enriched';"

# Export query results as CSV
sqlite3 -header -csv gtm.db "SELECT * FROM prospects WHERE score > 80;" > hot_leads.csv

# Interactive mode for exploring
sqlite3 gtm.db
sqlite> .tables                    -- list all tables
sqlite> .schema prospects          -- show table structure
sqlite> SELECT * FROM prospects LIMIT 5;
sqlite> .quit
```

The ability to query your data from the terminal means you can check on pipeline status without opening a browser, switching to your CRM, waiting for it to load, and navigating to the right view. `sqlite3 gtm.db "SELECT COUNT(*) FROM deals WHERE stage = 'negotiation';"` takes two seconds.

### Monitoring running processes

When agents and scripts are running, you need to keep tabs on them.

```bash
# Follow a log file in real time (new lines appear as they're written)
tail -f enrichment.log

# Watch a file's line count change every 2 seconds
watch -n 2 wc -l output.csv

# Check if a Python process is still running
ps aux | grep python

# See what's using your CPU
top       # press q to quit
htop      # a nicer version, install with: brew install htop
```

`tail -f` is the one you'll use most. Put it in your Pane 2 and you have a live dashboard showing you what the agent is producing.

### Quick Python from the command line

Sometimes you need a quick calculation or data transformation and a full script is overkill.

```bash
# Today's date
python3 -c "from datetime import datetime; print(datetime.now().strftime('%Y-%m-%d'))"

# URL-encode a string for API calls
python3 -c "import urllib.parse; print(urllib.parse.quote('VP of Engineering'))"

# Quick math
python3 -c "print(f'{3247/89:.1f} emails per day')"

# Parse and reformat a JSON string
python3 -c "import json; print(json.dumps({'name': 'test'}, indent=2))"
```

These one-liners are for your Pane 3. Quick utilities you fire off while the agent works in Pane 1.

## Making the Terminal Feel Like Home

The difference between "I use the terminal because I have to" and "I use the terminal because it's the fastest way to work" is customization. A few small tweaks make the environment feel like yours.

### Aliases

If you type the same command more than three times a week, make it an alias. Add these to your `~/.zshrc` (Mac) or `~/.bashrc` (Linux):

```bash
# Open Claude Code in your GTM workspace
alias gtm="cd ~/gtm-workspace && claude"

# Quick CSV row count
alias rows="wc -l"

# Query your GTM database
alias db="sqlite3 ~/gtm-workspace/data/gtm.db"

# Start your three-pane tmux layout in one command
alias gtmux="tmux new-session -s gtm -d && tmux split-window -h -t gtm && tmux split-window -v -t gtm:0.0 && tmux attach -t gtm"

# Check on running enrichment jobs
alias jobs="ps aux | grep python"

# Tail the most recent log file in a directory
alias lastlog="ls -t *.log | head -1 | xargs tail -f"
```

After adding aliases, reload your shell: `source ~/.zshrc`

Now `gtm` opens Claude Code in your workspace. `gtmux` builds your three-pane layout in one keystroke. `db "SELECT COUNT(*) FROM prospects"` queries your database. These save minutes every day. Over a month, that's hours.

### Your prompt

The default terminal prompt shows your username and current directory. That's fine, but you can make it more useful.

Add to `~/.zshrc`:

```bash
# Show current directory (shortened), git branch, and a clean prompt
PROMPT='%F{cyan}%1~%f %F{yellow}$(git branch --show-current 2>/dev/null)%f $ '
```

Now your prompt shows where you are and which git branch you're on. Small thing, but it prevents the "wait, which directory am I in?" confusion that happens when you have multiple panes open.

### Shell history

Your shell keeps a history of every command you've run. This is more valuable than most people realize.

```bash
# Search your command history (press Ctrl-r, then start typing)
# Ctrl-r then type "apollo" finds your last Apollo-related command

# Increase history size (add to ~/.zshrc)
HISTSIZE=50000
SAVEHIST=50000
```

`Ctrl-r` is the shortcut that saves the most time. Instead of retyping a complex command, press `Ctrl-r` and type the first few characters. Your shell finds the most recent matching command. Press Enter to run it. Press `Ctrl-r` again to cycle through older matches.

I use `Ctrl-r` dozens of times a day. Every complex query, every multi-flag command, every long pipeline. Type it once, recall it forever.

## Running Multiple Agent Workflows

Once you're comfortable with tmux, the natural next step is running multiple coding agent sessions in parallel. One agent enriches your target list. Another generates personalized email copy. A third monitors your competitor's pricing page for changes.

### Multiple tmux sessions

```bash
# Create separate sessions for different workflows
tmux new -s enrichment -d    # -d starts it detached
tmux new -s content -d
tmux new -s monitoring -d

# Switch between them
tmux switch -t enrichment
tmux switch -t content
tmux switch -t monitoring

# List all running sessions
tmux ls
```

Each session is isolated. The enrichment agent can't interfere with the content agent. If one crashes, the others keep running. You can detach from all of them, go to lunch, come back, and reattach to whichever one you want to check first.

### The morning workflow

Here's what a productive morning looks like once you've internalized this:

```
1. Open terminal
2. tmux attach -t gtm          (or gtmux if starting fresh)
3. Check overnight results      Pane 3: db "SELECT COUNT(*) FROM enriched_today;"
4. Review agent output          Pane 2: less output/overnight_enrichment.csv
5. Start today's agent task     Pane 1: claude
6. Give it the day's work       "Score yesterday's enriched accounts and generate
                                 personalized first lines for the top 50"
7. While it works               Pane 3: check email, review pipeline, prep next task
8. Review output when ready     Pane 2: tail -f output/scored_accounts.csv
9. Iterate or ship              Push to CRM, load into sequencer, send
```

The whole thing happens in one terminal window. No browser tabs to manage. No tool switching. No context switching. Just you, your agent, and your data.

## For Beginners: Start Here

If everything above feels overwhelming, start smaller. You don't need tmux on day one. You don't need SSH. You don't need aliases. You need one thing: comfort with having a terminal window open.

**If you're on a Mac:** Install [iTerm2](https://iterm2.com). It's a better terminal than the built-in one, with split panes built in. `Cmd-D` splits vertically. `Cmd-Shift-D` splits horizontally. No tmux required. You get 80% of the multi-pane benefit with zero configuration.

**If you're on Windows:** Use [Windows Terminal](https://aka.ms/terminal). It supports tabs and split panes natively. `Alt-Shift-D` splits the current pane.

**The progression, honestly:**

1. Start with iTerm2 or Windows Terminal. Open two panes. Run Claude Code in one and watch output in the other. Get used to this being your workspace.
2. Learn `ls`, `cd`, `cat`, `head`, `tail`, `wc -l`. These six commands let you navigate and inspect files. That's enough for the first week.
3. When you notice yourself wanting sessions that survive closing your terminal, install tmux. The need will feel natural, not forced.
4. When you notice yourself wanting to run agents on a more powerful machine or keep things running overnight, learn SSH. Again, the need drives the learning.
5. When you find yourself typing the same long command for the fifth time, create your first alias. Customization happens when the pain of not customizing outweighs the effort of setting it up.

There's no rush. Each step unlocks more capability. But even step 1, just having Claude Code in one pane and output in another, makes you meaningfully more productive than working in a single window.

## The Shift

Something happens after about two weeks of daily terminal use. You stop thinking of it as "the command line." You start thinking of it as your workspace. The same way a carpenter stops noticing the workshop and just sees the project.

The terminal becomes the place where things happen. You open your laptop and your fingers go to tmux before your mouse goes to Chrome. You check your pipeline with a database query instead of loading a dashboard. You generate content by talking to an agent instead of staring at a blank document.

This isn't about terminal elitism or pretending that GUIs are inferior. Some things are genuinely better in a GUI. Design work. Spreadsheet exploration. Anything where spatial layout matters.

But for GTM work with coding agents, the terminal is the right tool. It's where the agents live. It's where scripts run. It's where data flows through pipes from one tool to another. Getting comfortable here isn't optional if you want to get the most out of everything this book teaches.

The good news is that comfort comes from use, not from study. Open a terminal. Start typing. Break nothing (it's actually hard to break things as a regular user). Build the muscle memory. In two weeks, you'll wonder why you ever found it intimidating.

The best GTM system is the one you actually use. Make the terminal yours, and you'll use it every day.
