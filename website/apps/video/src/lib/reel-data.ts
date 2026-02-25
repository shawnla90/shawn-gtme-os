/** Data for Nio Reel Clips — costs, commands, tools, evolution tiers */

/** Clip 1: API cost milestones ($1000 → $0 drain) */
export const COST_MILESTONES = [
  { amount: 1000, label: '$1,000', reaction: 'idle' as const },
  { amount: 750, label: '$750', reaction: 'idle' as const },
  { amount: 500, label: '$500', reaction: 'alert' as const },
  { amount: 250, label: '$250', reaction: 'alarm' as const },
  { amount: 100, label: '$100', reaction: 'alarm' as const },
  { amount: 0, label: '$0', reaction: 'alarm' as const },
] as const;

export const MAX_PLAN = {
  price: '$200/mo',
  label: 'Claude MAX',
  savings: 'Unlimited Opus',
} as const;

/** Clip 2: Terminal commands — things people do wrong */
export const CLAUDE_COMMANDS = [
  { cmd: '$ claude "write me an app"', output: '→ vague prompts = vague code', status: 'error' as const },
  { cmd: '$ claude --no-context', output: '→ no CLAUDE.md = starting blind', status: 'error' as const },
  { cmd: '$ claude "fix everything"', output: '→ scope explosion = wasted tokens', status: 'error' as const },
  { cmd: '$ claude --with-plan', output: '→ plan mode = surgical changes', status: 'success' as const },
  { cmd: '$ claude "read CLAUDE.md first"', output: '→ context-first = 10x output', status: 'success' as const },
] as const;

/** Clip 2: Evolution tiers */
export const EVOLUTION_TIERS = [
  { tier: 1, name: 'Spark', xp: 0, sprite: 'tier-1-static-256.png', color: '#4EC373' },
  { tier: 2, name: 'Blade', xp: 500, sprite: 'tier-2-static-256.png', color: '#6B8AFF' },
  { tier: 3, name: 'Prism', xp: 2000, sprite: 'tier-3-static-256.png', color: '#9B72CF' },
] as const;

/** Clip 3: API wrapper cost comparison */
export const WRAPPER_COSTS = {
  wrapper: {
    name: 'AI Wrapper',
    monthly: '$100/mo',
    yearly: 1200,
    color: '#E05555',
    items: ['$100/mo subscription', 'Rate limits', 'Vendor lock-in', 'Black box pricing'],
  },
  direct: {
    name: 'Direct API',
    monthly: '$30/mo avg',
    yearly: 360,
    color: '#4EC373',
    items: ['Pay per token', 'No rate limits', 'Full control', 'Transparent pricing'],
  },
  savings: 840, // $1200 - $360
} as const;

/** Clip 4: MCP server tools */
export const MCP_TOOLS = [
  { name: 'Filesystem', icon: '📁', color: '#4EC373' },
  { name: 'GitHub', icon: '🐙', color: '#E7E9EA' },
  { name: 'Slack', icon: '💬', color: '#E01E5A' },
  { name: 'Postgres', icon: '🐘', color: '#336791' },
  { name: 'Playwright', icon: '🎭', color: '#2EAD33' },
  { name: 'Firecrawl', icon: '🔥', color: '#FF6B35' },
  { name: 'Memory', icon: '🧠', color: '#9B72CF' },
  { name: 'Fetch', icon: '🌐', color: '#3DBFA0' },
  { name: 'SQLite', icon: '💾', color: '#003B57' },
] as const;

/** Clip 5: Remotion JSX code snippet */
export const REMOTION_CODE_LINES = [
  '<TransitionSeries>',
  '  <Sequence durationInFrames={450}>',
  '    <NioSprite tier={1} />',
  '    <CostMeter from={1000} to={0} />',
  '  </Sequence>',
  '  <Transition presentation={fade()} />',
  '  <Sequence durationInFrames={330}>',
  '    <EvolutionFlash />',
  '    <NioSprite tier={2} />',
  '  </Sequence>',
  '</TransitionSeries>',
] as const;
