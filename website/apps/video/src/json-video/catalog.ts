import { defineCatalog } from '@json-render/core';
import {
  schema,
  standardComponentDefinitions,
  standardTransitionDefinitions,
  standardEffectDefinitions,
} from '@json-render/remotion/server';
import type { ComponentDefinition } from '@json-render/remotion/server';
import { standardComponents } from '@json-render/remotion';
import type { ComponentRegistry } from '@json-render/remotion';

import {
  SceneWrapperSchema,
  ChatBubbleSchema,
  TypingDotsSchema,
  GraphNodeSchema,
  GraphEdgeSchema,
  TerminalCommandLineSchema,
  CostMeterSchema,
  XpBarSchema,
  NioReelMascotSchema,
  EvolutionFlashSchema,
} from './schemas';

import {
  SceneWrapperClip,
  ChatBubbleClip,
  TypingDotsClip,
  GraphNodeClip,
  GraphEdgeClip,
  TerminalCommandLineClip,
  CostMeterClip,
  XpBarClip,
  NioReelMascotClip,
  EvolutionFlashClip,
} from './adapters';

// ── Custom component definitions (for AI prompt generation) ──

const shawnosComponents: Record<string, ComponentDefinition> = {
  SceneWrapper: {
    props: SceneWrapperSchema,
    type: 'scene',
    defaultDuration: 150,
    description: 'Dark animated background with particle field and scanlines. Use as the base layer for every scene.',
  },
  ChatBubble: {
    props: ChatBubbleSchema,
    type: 'overlay',
    defaultDuration: 90,
    description: 'Chat message bubble. sender="user" renders right-aligned dark bubble, sender="agent" renders left-aligned blue bubble. Set typewriter=true for agent messages.',
  },
  TypingDots: {
    props: TypingDotsSchema,
    type: 'overlay',
    defaultDuration: 60,
    description: 'Animated "..." typing indicator. Place between a user ChatBubble and the agent reply.',
  },
  GraphNode: {
    props: GraphNodeSchema,
    type: 'overlay',
    defaultDuration: 120,
    description: 'Knowledge graph node with label and optional avatar. Position with absolute x/y coords (base 1080x1350).',
  },
  GraphEdge: {
    props: GraphEdgeSchema,
    type: 'overlay',
    defaultDuration: 60,
    description: 'Animated edge connecting two graph nodes. Uses draw-on animation.',
  },
  TerminalCommandLine: {
    props: TerminalCommandLineSchema,
    type: 'scene',
    defaultDuration: 300,
    description: 'Terminal UI showing sequential commands with typewriter output. Each command has a status indicator (success/error/info).',
  },
  CostMeter: {
    props: CostMeterSchema,
    type: 'overlay',
    defaultDuration: 300,
    description: 'API cost meter that drains from a starting amount to zero. Shows real-time dollar amount.',
  },
  XpBar: {
    props: XpBarSchema,
    type: 'overlay',
    defaultDuration: 120,
    description: 'XP progress bar with tier label. Animates fill from `from` to `to` over fillFrames.',
  },
  NioReelMascot: {
    props: NioReelMascotSchema,
    type: 'overlay',
    defaultDuration: 150,
    description: 'Nio mascot sprite with animation cues. Place in corner of scene. animationCues drive idle/think/chat/backflip transitions.',
  },
  EvolutionFlash: {
    props: EvolutionFlashSchema,
    type: 'overlay',
    defaultDuration: 120,
    description: 'Full-screen flash effect with "LEVEL UP" text. Trigger at evolution moments.',
  },
};

// ── Catalog (schema + all component definitions) ──

export const catalog = defineCatalog(schema, {
  components: {
    ...standardComponentDefinitions,
    ...shawnosComponents,
  },
  transitions: standardTransitionDefinitions,
  effects: standardEffectDefinitions,
});

// ── Component registry (maps component names → React clip renderers) ──

export const componentRegistry: ComponentRegistry = {
  ...standardComponents,
  SceneWrapper: SceneWrapperClip,
  ChatBubble: ChatBubbleClip,
  TypingDots: TypingDotsClip,
  GraphNode: GraphNodeClip,
  GraphEdge: GraphEdgeClip,
  TerminalCommandLine: TerminalCommandLineClip,
  CostMeter: CostMeterClip,
  XpBar: XpBarClip,
  NioReelMascot: NioReelMascotClip,
  EvolutionFlash: EvolutionFlashClip,
};
