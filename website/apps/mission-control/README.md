# Mission Control

Command center for your AI operating system.

## Features

### Phase 1 (Current)
- ✅ **Tasks Board** - Track what Shawn and Nio are working on
- ✅ **System Status** - Real-time system health and metrics
- ✅ **Recent Memories** - Browse and search through memory files

### Phase 2 (Coming Soon)
- 🚧 **Calendar** - Visualize cron jobs and scheduled tasks
- 🚧 **Team Management** - Sub-agent roster and roles
- 🚧 **Office View** - Fun visual of agents working

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Theme:** Terminal/Matrix-inspired dark theme
- **Data:** File system integration with GTM OS repo

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Integration

The Mission Control integrates directly with your GTM OS repo:

- **Memory files** from `memory/` directory
- **Daily logs** from `data/daily-log/`
- **System metrics** from git and OpenClaw
- **Active sessions** from sub-agent spawning

## Design Philosophy

**Matrix/Terminal Aesthetic:**
- Dark theme with green accents
- Monospace font (Courier New)
- Pulsing status indicators
- Command-line inspired UI

**Real-time Updates:**
- Live task tracking
- Session monitoring
- System health metrics
- Memory file syncing

This is your digital command center. 🤖⚡