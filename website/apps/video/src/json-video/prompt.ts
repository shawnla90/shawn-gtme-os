import { catalog } from './catalog';
import { COLORS, FONTS, SITE_ACCENTS } from '../lib/tokens';

const DESIGN_SYSTEM_CONTEXT = `
## ShawnOS Design System

### Colors
- canvas: ${COLORS.canvas} (dark background — always use SceneWrapper, never raw bg)
- nioBlue: ${COLORS.nioBlue} (Nio accent — use for agent UI, XP bars, highlights)
- green: ${COLORS.green} (success states, ShawnOS accent)
- purple: ${COLORS.purple} (Content OS accent)
- teal: ${COLORS.teal} (GTM OS accent)
- amber: ${COLORS.amber} (warnings, cost indicators)
- trafficRed/Yellow/Green: status indicators

### Site Accents
- shawnos: ${SITE_ACCENTS.shawnos}
- gtmos: ${SITE_ACCENTS.gtmos}
- contentos: ${SITE_ACCENTS.contentos}
- nio: ${SITE_ACCENTS.nio}

### Typography
- Font: ${FONTS.mono} (monospace throughout — terminal aesthetic)

### Video Formats
- reelClip: 1080×960 @ 30fps (bottom half of 9:16, for TikTok/Reels clips)
- reels: 1080×1920 @ 30fps (full 9:16 vertical)
- linkedin: 1080×1350 @ 30fps (4:5 portrait)
- landscape: 1920×1080 @ 30fps (16:9)

### Composition Rules
1. Always start with a SceneWrapper on the bg track for the full duration
2. NioReelMascot goes on the overlay track — use animationCues to sync with content
3. ChatBubble sender="user" appears from right, sender="agent" from left
4. Place TypingDots between user message end and agent message start (30-60 frames)
5. TerminalCommandLine looks best with 2-4 commands, interval=45 between them
6. XpBar works as a closer — place in last 2-3 seconds
7. EvolutionFlash is a full-screen effect — use sparingly, once per video max
8. Track types: "scene" for backgrounds/full layouts, "overlay" for floating elements
9. Clips on the same track with overlapping frames will z-stack (later = on top)
10. Use motion.enter for smooth appearances (opacity: 0, y: 20-40, duration: 10-15)
`.trim();

export interface PromptOptions {
  /** Video format preset */
  format?: 'reelClip' | 'reels' | 'linkedin' | 'landscape';
  /** Target duration in seconds */
  durationSeconds?: number;
  /** Additional context for the AI */
  additionalContext?: string;
}

/**
 * Build an AI prompt that includes the full component catalog + ShawnOS design
 * system context. Feed this to Claude/Nio to generate TimelineSpec JSON.
 */
export function buildVideoPrompt(userPrompt: string, options: PromptOptions = {}): string {
  const { format = 'reelClip', durationSeconds = 10, additionalContext } = options;

  const catalogPrompt = catalog.prompt();

  const formatPresets: Record<string, { width: number; height: number }> = {
    reelClip: { width: 1080, height: 960 },
    reels: { width: 1080, height: 1920 },
    linkedin: { width: 1080, height: 1350 },
    landscape: { width: 1920, height: 1080 },
  };

  const preset = formatPresets[format];
  const fps = 30;
  const totalFrames = durationSeconds * fps;

  return `You are a video composition generator for ShawnOS. Generate a TimelineSpec JSON object.

## Target Format
- Format: ${format}
- Dimensions: ${preset.width}×${preset.height}
- FPS: ${fps}
- Duration: ${totalFrames} frames (${durationSeconds}s)

${DESIGN_SYSTEM_CONTEXT}

## Available Components & Schema
${catalogPrompt}

## User Request
${userPrompt}

${additionalContext ? `## Additional Context\n${additionalContext}\n` : ''}
## Output
Return ONLY a valid JSON object matching the TimelineSpec schema. No markdown, no explanation.
The composition.id must be "JsonVideo".`;
}
