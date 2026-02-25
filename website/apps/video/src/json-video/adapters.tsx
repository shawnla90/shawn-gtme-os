import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ClipWrapper } from '@json-render/remotion';
import type { Clip } from '@json-render/remotion';

import { SceneWrapper } from '../components/SceneWrapper';
import { ChatBubble } from '../components/ChatBubble';
import { TypingDots } from '../components/TypingDots';
import { GraphNode } from '../components/GraphNode';
import { GraphEdge } from '../components/GraphEdge';
import { TerminalCommandLine } from '../components/TerminalCommandLine';
import { CostMeter } from '../components/CostMeter';
import { XpBar } from '../components/XpBar';
import { NioReelMascot } from '../components/NioReelMascot';
import { EvolutionFlash } from '../components/EvolutionFlash';

import type { z } from 'zod';
import type {
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

// ── Helpers ──

type Props<T extends z.ZodType> = z.infer<T>;

/** Centered flex wrapper for components that need positioning */
const CenteredFill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </AbsoluteFill>
);

// ── Adapters ──

export function SceneWrapperClip({ clip }: { clip: Clip }) {
  const props = clip.props as Props<typeof SceneWrapperSchema>;
  return (
    <ClipWrapper clip={clip}>
      <SceneWrapper {...props}>
        <AbsoluteFill />
      </SceneWrapper>
    </ClipWrapper>
  );
}

export function ChatBubbleClip({ clip }: { clip: Clip }) {
  const props = clip.props as Props<typeof ChatBubbleSchema>;
  return (
    <ClipWrapper clip={clip}>
      <ChatBubble {...props} />
    </ClipWrapper>
  );
}

export function TypingDotsClip({ clip }: { clip: Clip }) {
  const props = clip.props as Props<typeof TypingDotsSchema>;
  return (
    <ClipWrapper clip={clip}>
      <TypingDots {...props} />
    </ClipWrapper>
  );
}

export function GraphNodeClip({ clip }: { clip: Clip }) {
  const props = clip.props as Props<typeof GraphNodeSchema>;
  return (
    <ClipWrapper clip={clip}>
      <GraphNode {...props} />
    </ClipWrapper>
  );
}

export function GraphEdgeClip({ clip }: { clip: Clip }) {
  const props = clip.props as Props<typeof GraphEdgeSchema>;
  return (
    <ClipWrapper clip={clip}>
      <GraphEdge {...props} />
    </ClipWrapper>
  );
}

export function TerminalCommandLineClip({ clip }: { clip: Clip }) {
  const props = clip.props as Props<typeof TerminalCommandLineSchema>;
  return (
    <ClipWrapper clip={clip}>
      <CenteredFill>
        <TerminalCommandLine {...props} />
      </CenteredFill>
    </ClipWrapper>
  );
}

export function CostMeterClip({ clip }: { clip: Clip }) {
  const props = clip.props as Props<typeof CostMeterSchema>;
  return (
    <ClipWrapper clip={clip}>
      <CostMeter {...props} />
    </ClipWrapper>
  );
}

export function XpBarClip({ clip }: { clip: Clip }) {
  const props = clip.props as Props<typeof XpBarSchema>;
  return (
    <ClipWrapper clip={clip}>
      <CenteredFill>
        <XpBar {...props} />
      </CenteredFill>
    </ClipWrapper>
  );
}

export function NioReelMascotClip({ clip }: { clip: Clip }) {
  const props = clip.props as Props<typeof NioReelMascotSchema>;
  return (
    <ClipWrapper clip={clip}>
      <NioReelMascot {...props} />
    </ClipWrapper>
  );
}

export function EvolutionFlashClip({ clip }: { clip: Clip }) {
  const props = clip.props as Props<typeof EvolutionFlashSchema>;
  return (
    <ClipWrapper clip={clip}>
      <EvolutionFlash {...props} />
    </ClipWrapper>
  );
}
