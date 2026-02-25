import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { COLORS } from './lib/tokens';
import { AUDIO, VOLUMES } from './lib/sounds';
import { TRANSITION_REEL } from './lib/timing-reel';

interface ReelScene {
  component: React.FC;
  durationInFrames: number;
}

interface NioReelClipProps {
  scenes: ReelScene[];
  totalFrames: number;
}

/**
 * NioReelClip — wrapper for all reel clips.
 * Follows NioVideo.tsx pattern: AbsoluteFill → BgmLayer → TransitionSeries.
 * Output: 1080×960, 30fps, 45s.
 */
export const NioReelClip: React.FC<NioReelClipProps> = ({ scenes, totalFrames }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.canvas,
        fontFamily: 'JetBrains Mono, ui-monospace, Cascadia Code, Fira Code, monospace',
      }}
    >
      <ReelBgm totalFrames={totalFrames} />

      <TransitionSeries>
        {scenes.flatMap((scene, i) => {
          const Component = scene.component;
          const items = [
            <TransitionSeries.Sequence key={`scene-${i}`} durationInFrames={scene.durationInFrames}>
              <Component />
            </TransitionSeries.Sequence>,
          ];

          if (i < scenes.length - 1) {
            items.push(
              <TransitionSeries.Transition
                key={`trans-${i}`}
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION_REEL })}
              />,
            );
          }

          return items;
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

const ReelBgm: React.FC<{ totalFrames: number }> = ({ totalFrames }) => {
  const frame = useCurrentFrame();

  const volume = interpolate(
    frame,
    [0, 15, totalFrames - 20, totalFrames],
    [0, VOLUMES.bgm * 0.5, VOLUMES.bgm * 0.5, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <Sequence from={0} durationInFrames={totalFrames}>
      <Audio src={AUDIO.bgmLoop} volume={volume} />
    </Sequence>
  );
};
