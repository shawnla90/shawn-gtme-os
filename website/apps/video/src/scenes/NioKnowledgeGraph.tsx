import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { SceneWrapper } from '../components/SceneWrapper';
import { GraphNode } from '../components/GraphNode';
import { GraphEdge } from '../components/GraphEdge';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { COLORS, FONTS } from '../lib/tokens';
import { AUDIO, VOLUMES } from '../lib/sounds';
import { NIO_DOMAINS, NIO_CROSS_LINKS } from '../lib/data';
import { useScale } from '../lib/useScale';

/**
 * Scene 2: Knowledge Graph Construction — 570f / 19s
 *
 * 3 domain nodes emerge from core with bezier connections.
 * 12 leaf nodes spawn staggered (20f apart each).
 * 3 cross-domain connections draw in.
 * Running counter: "X nodes connected" (1→16).
 * Network enters breathing/pulse phase once complete.
 */

// Layout positions (base 1080×1350 coords)
// Tree grows upward: core at bottom, domains in middle, leaves at top
const CORE = { x: 540, y: 1020 };

const DOMAIN_POSITIONS = [
  { x: 200, y: 640 },  // Ops (left)
  { x: 540, y: 420 },  // Architecture (top center)
  { x: 880, y: 640 },  // Writing (right)
];

// Leaf positions (absolute coords) — radiate above/around their domain
const LEAF_OFFSETS = [
  // Ops leaves (spread upper-left) — OpenClaw pushed out/isolated
  [{ x: 80, y: 340 }, { x: 140, y: 500 }, { x: 310, y: 280 }, { x: 80, y: 620 }],
  // Architecture leaves (spread across top)
  [{ x: 340, y: 160 }, { x: 660, y: 120 }, { x: 800, y: 250 }, { x: 240, y: 220 }],
  // Writing leaves (spread upper-right)
  [{ x: 720, y: 350 }, { x: 780, y: 500 }, { x: 970, y: 330 }, { x: 980, y: 510 }],
];

// Deprecated nodes — shown red with X marker, siloed from graph
const DEPRECATED_NODES = new Set(['OpenClaw']);

// Timing
const DOMAIN_START = 30;     // First domain appears at frame 30
const DOMAIN_GAP = 60;       // 60 frames between each domain
const DOMAIN_EDGE_DRAW = 40; // Edge draw-on duration

const LEAF_START = 210;      // Leaves start after domains
const LEAF_GAP = 20;         // 20 frames between each leaf
const LEAF_EDGE_DRAW = 25;

const CROSS_LINK_START = 470; // Cross-links start near end
const CROSS_LINK_GAP = 20;
const CROSS_LINK_DRAW = 30;

const COUNTER_START = 30;
const COUNTER_END = 450;       // Counter completes when all 16 nodes are in
const BREATHING_START = 480;   // Network enters breathing mode

export const NioKnowledgeGraph: React.FC = () => {
  const frame = useCurrentFrame();
  const { s, sv } = useScale();

  // Build flat list of all leaf positions with their names
  const allLeaves: { x: number; y: number; name: string; color: string; domainIdx: number }[] = [];
  NIO_DOMAINS.forEach((domain, di) => {
    domain.leaves.forEach((leafName, li) => {
      allLeaves.push({
        ...LEAF_OFFSETS[di][li],
        name: leafName,
        color: domain.color,
        domainIdx: di,
      });
    });
  });

  // Map leaf names to positions for cross-links
  const leafPositionMap: Record<string, { x: number; y: number }> = {};
  allLeaves.forEach((leaf) => {
    leafPositionMap[leaf.name] = { x: leaf.x, y: leaf.y };
  });

  // Counter: how many nodes are currently visible
  // 1 (core) + domains (appear at 30,90,150) + 12 leaves (appear staggered from 210)
  const getVisibleNodes = () => {
    let count = 1; // core always visible
    for (let i = 0; i < 3; i++) {
      if (frame >= DOMAIN_START + i * DOMAIN_GAP) count++;
    }
    for (let i = 0; i < 12; i++) {
      if (frame >= LEAF_START + i * LEAF_GAP) count++;
    }
    return Math.min(count, 16);
  };

  // Breathing pulse for the whole graph after completion
  const breathingOpacity = frame >= BREATHING_START
    ? 1
    : 1;

  return (
    <SceneWrapper
      accentColor={COLORS.nioBlue}
      particleCount={15}
      scanlineOpacity={0.02}
    >
      {/* SFX: whoosh per domain */}
      {[0, 1, 2].map((i) => (
        <Sequence key={`whoosh-${i}`} from={DOMAIN_START + i * DOMAIN_GAP} durationInFrames={20}>
          <Audio src={AUDIO.whoosh} volume={VOLUMES.whoosh * 0.7} />
        </Sequence>
      ))}

      {/* SFX: keyClick per leaf node */}
      {allLeaves.map((_, i) => (
        <Sequence key={`click-${i}`} from={LEAF_START + i * LEAF_GAP} durationInFrames={10}>
          <Audio src={AUDIO.keyClick} volume={VOLUMES.keyClick * 0.5} />
        </Sequence>
      ))}

      <AbsoluteFill>
        {/* ── EDGES ── */}

        {/* Core → Domain edges */}
        {DOMAIN_POSITIONS.map((pos, i) => (
          <GraphEdge
            key={`core-domain-${i}`}
            from={CORE}
            to={pos}
            color={NIO_DOMAINS[i].color}
            startFrame={DOMAIN_START + i * DOMAIN_GAP}
            durationFrames={DOMAIN_EDGE_DRAW}
            strokeWidth={3}
            curvature={-30}
          />
        ))}

        {/* Domain → Leaf edges */}
        {allLeaves.map((leaf, i) => {
          const isDeprecated = DEPRECATED_NODES.has(leaf.name);
          return (
            <GraphEdge
              key={`domain-leaf-${i}`}
              from={DOMAIN_POSITIONS[leaf.domainIdx]}
              to={{ x: leaf.x, y: leaf.y }}
              color={isDeprecated ? COLORS.red : leaf.color}
              startFrame={LEAF_START + i * LEAF_GAP}
              durationFrames={LEAF_EDGE_DRAW}
              strokeWidth={isDeprecated ? 1 : 2}
              curvature={-20}
            />
          );
        })}

        {/* Cross-domain edges */}
        {NIO_CROSS_LINKS.map((link, i) => {
          const fromPos = leafPositionMap[link.from];
          const toPos = leafPositionMap[link.to];
          if (!fromPos || !toPos) return null;
          return (
            <GraphEdge
              key={`cross-${i}`}
              from={fromPos}
              to={toPos}
              color={COLORS.textMuted}
              startFrame={CROSS_LINK_START + i * CROSS_LINK_GAP}
              durationFrames={CROSS_LINK_DRAW}
              strokeWidth={1.5}
              curvature={-30}
            />
          );
        })}

        {/* ── NODES ── */}

        {/* Core node (always visible) */}
        <GraphNode
          label="Nio"
          color={COLORS.nioBlue}
          x={CORE.x}
          y={CORE.y}
          radius={60}
          appearFrame={0}
          avatar="nio-tier-2-static.png"
          pulse={frame >= BREATHING_START}
          labelSize={20}
        />

        {/* Domain nodes */}
        {NIO_DOMAINS.map((domain, i) => (
          <GraphNode
            key={`domain-${i}`}
            label={domain.name}
            color={domain.color}
            x={DOMAIN_POSITIONS[i].x}
            y={DOMAIN_POSITIONS[i].y}
            radius={40}
            appearFrame={DOMAIN_START + i * DOMAIN_GAP}
            pulse={frame >= BREATHING_START}
            labelSize={16}
          />
        ))}

        {/* Leaf nodes */}
        {allLeaves.map((leaf, i) => {
          const isDeprecated = DEPRECATED_NODES.has(leaf.name);
          return (
            <React.Fragment key={`leaf-${i}`}>
              <GraphNode
                label={leaf.name}
                color={isDeprecated ? COLORS.red : leaf.color}
                x={leaf.x}
                y={leaf.y}
                radius={26}
                appearFrame={LEAF_START + i * LEAF_GAP}
                pulse={!isDeprecated && frame >= BREATHING_START}
                labelSize={13}
              />
              {/* Deprecated X marker */}
              {isDeprecated && frame >= LEAF_START + i * LEAF_GAP + 10 && (
                <div
                  style={{
                    position: 'absolute',
                    left: s(leaf.x),
                    top: sv(leaf.y) - sv(56),
                    transform: 'translateX(-50%)',
                    fontSize: s(30),
                    fontFamily: FONTS.mono,
                    fontWeight: 700,
                    color: COLORS.red,
                    opacity: interpolate(
                      frame,
                      [LEAF_START + i * LEAF_GAP + 10, LEAF_START + i * LEAF_GAP + 20],
                      [0, 0.95],
                      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
                    ),
                    textShadow: `0 0 ${s(10)}px ${COLORS.red}99`,
                  }}
                >
                  ✕
                </div>
              )}
            </React.Fragment>
          );
        })}

        {/* ── COUNTER ── */}
        <div
          style={{
            position: 'absolute',
            bottom: sv(60),
            width: '100%',
            textAlign: 'center',
            fontFamily: FONTS.mono,
            fontSize: s(20),
            color: COLORS.textSecondary,
            opacity: interpolate(frame, [COUNTER_START, COUNTER_START + 15], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <AnimatedCounter
            from={1}
            to={16}
            startFrame={COUNTER_START}
            durationFrames={COUNTER_END - COUNTER_START}
            fontSize={s(28)}
            color={COLORS.textPrimary}
          />
          <span style={{ marginLeft: s(8), color: COLORS.textSecondary, fontSize: s(18) }}>
            nodes connected
          </span>
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  );
};
