import { Composition } from 'remotion';
import { LeadMagnet } from './LeadMagnet';
import { FPS, TOTAL_FRAMES, PRESETS } from './lib/timing';

export const Root: React.FC = () => {
  return (
    <>
      {/* Primary: LinkedIn 4:5 — maximum feed real estate */}
      <Composition
        id="LeadMagnet"
        component={LeadMagnet}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      {/* Secondary: IG Reels / TikTok / Shorts 9:16 */}
      <Composition
        id="LeadMagnetReels"
        component={LeadMagnet}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={PRESETS.reels.width}
        height={PRESETS.reels.height}
      />

      {/* Tertiary: YouTube / website embed 16:9 */}
      <Composition
        id="LeadMagnetLandscape"
        component={LeadMagnet}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={PRESETS.landscape.width}
        height={PRESETS.landscape.height}
      />
    </>
  );
};
