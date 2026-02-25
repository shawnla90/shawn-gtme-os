import { z } from 'zod';

// ── SceneWrapper ──
export const SceneWrapperSchema = z.object({
  accentColor: z.string().optional(),
  particleCount: z.number().optional(),
  scanlineOpacity: z.number().min(0).max(1).optional(),
});

// ── ChatBubble ──
export const ChatBubbleSchema = z.object({
  text: z.string(),
  sender: z.enum(['user', 'agent']),
  appearFrame: z.number().optional(),
  typewriter: z.boolean().optional(),
  typewriterSpeed: z.number().optional(),
});

// ── TypingDots ──
export const TypingDotsSchema = z.object({
  appearFrame: z.number().optional(),
  durationFrames: z.number().optional(),
});

// ── GraphNode ──
export const GraphNodeSchema = z.object({
  label: z.string(),
  color: z.string(),
  x: z.number(),
  y: z.number(),
  radius: z.number().optional(),
  appearFrame: z.number().optional(),
  avatar: z.string().optional(),
  pulse: z.boolean().optional(),
  labelSize: z.number().optional(),
});

// ── GraphEdge ──
export const GraphEdgeSchema = z.object({
  from: z.object({ x: z.number(), y: z.number() }),
  to: z.object({ x: z.number(), y: z.number() }),
  color: z.string(),
  startFrame: z.number().optional(),
  durationFrames: z.number().optional(),
  strokeWidth: z.number().optional(),
  curvature: z.number().optional(),
});

// ── TerminalCommandLine ──
const CommandEntrySchema = z.object({
  cmd: z.string(),
  output: z.string(),
  status: z.enum(['success', 'error', 'info']),
});

export const TerminalCommandLineSchema = z.object({
  commands: z.array(CommandEntrySchema),
  interval: z.number().optional(),
  startFrame: z.number().optional(),
  width: z.number().optional(),
});

// ── CostMeter ──
export const CostMeterSchema = z.object({
  from: z.number().optional(),
  to: z.number().optional(),
  startFrame: z.number().optional(),
  drainFrames: z.number().optional(),
  rightOffset: z.number().optional(),
});

// ── XpBar ──
export const XpBarSchema = z.object({
  from: z.number().optional(),
  to: z.number(),
  max: z.number(),
  tierLabel: z.string(),
  tierColor: z.string().optional(),
  startFrame: z.number().optional(),
  fillFrames: z.number().optional(),
  width: z.number().optional(),
});

// ── NioReelMascot ──
const AnimationCueSchema = z.object({
  animation: z.enum(['idle', 'blink', 'think', 'chat', 'backflip', 'evolve_out', 'evolve_in']),
  startFrame: z.number(),
  evolveTo: z.number().optional(),
  loop: z.boolean().optional(),
});

const EvolutionConfigSchema = z.object({
  tierFrom: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  tierTo: z.union([z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  triggerFrame: z.number(),
  accentColor: z.string().optional(),
});

export const NioReelMascotSchema = z.object({
  tier: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
  size: z.number().optional(),
  position: z.enum(['bottom-right', 'bottom-left', 'bottom-center', 'center', 'center-left']).optional(),
  animationCues: z.array(AnimationCueSchema).optional(),
  enterDelay: z.number().optional(),
  evolution: EvolutionConfigSchema.optional(),
});

// ── EvolutionFlash ──
export const EvolutionFlashSchema = z.object({
  flashFrame: z.number().optional(),
  accentColor: z.string().optional(),
  levelUpText: z.string().optional(),
});
