import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { COLORS } from './lib/tokens';
import { AUDIO, VOLUMES } from './lib/sounds';
import { TRANSITION_ROI, SCENES_ROI, ROI_TOTAL_FRAMES } from './lib/timing-roi';
import type { RoiVideoData } from './lib/roi-schema';
import { RoiHook } from './scenes/roi/RoiHook';
import { RoiComparison } from './scenes/roi/RoiComparison';
import { RoiFunnel } from './scenes/roi/RoiFunnel';
import { RoiDelta } from './scenes/roi/RoiDelta';
import { RoiCta } from './scenes/roi/RoiCta';

// Default client — swap via inputProps at render time
import { JESSE_BROWN } from './lib/roi-clients/jesse-brown';

interface RoiComparisonVideoProps {
  data?: RoiVideoData;
}

export const RoiComparisonVideo: React.FC<RoiComparisonVideoProps> = ({
  data = JESSE_BROWN,
}) => {
  const scenes = [
    { component: () => <RoiHook data={data} />, durationInFrames: SCENES_ROI.hook },
    { component: () => <RoiComparison data={data} />, durationInFrames: SCENES_ROI.comparison },
    { component: () => <RoiFunnel data={data} />, durationInFrames: SCENES_ROI.funnel },
    { component: () => <RoiDelta data={data} />, durationInFrames: SCENES_ROI.delta },
    { component: () => <RoiCta data={data} />, durationInFrames: SCENES_ROI.cta },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.canvas,
        fontFamily: 'JetBrains Mono, ui-monospace, Cascadia Code, Fira Code, monospace',
      }}
    >
      <RoiBgm />

      <TransitionSeries>
        {scenes.flatMap((scene, i) => {
          const Component = scene.component;
          const items = [
            <TransitionSeries.Sequence
              key={`scene-${i}`}
              durationInFrames={scene.durationInFrames}
            >
              <Component />
            </TransitionSeries.Sequence>,
          ];

          if (i < scenes.length - 1) {
            items.push(
              <TransitionSeries.Transition
                key={`trans-${i}`}
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION_ROI })}
              />,
            );
          }

          return items;
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

const RoiBgm: React.FC = () => {
  const frame = useCurrentFrame();

  const volume = interpolate(
    frame,
    [0, 15, ROI_TOTAL_FRAMES - 20, ROI_TOTAL_FRAMES],
    [0, VOLUMES.bgm * 0.5, VOLUMES.bgm * 0.5, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <Sequence from={0} durationInFrames={ROI_TOTAL_FRAMES}>
      <Audio src={AUDIO.bgmLoop} volume={volume} />
    </Sequence>
  );
};
