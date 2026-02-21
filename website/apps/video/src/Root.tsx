import { Composition } from 'remotion';
import { LeadMagnet } from './LeadMagnet';
import { LeadMagnetV2 } from './LeadMagnetV2';
import { FPS, TOTAL_FRAMES, PRESETS } from './lib/timing';
import { FPS_V2, TOTAL_FRAMES_V2 } from './lib/timing-v2';

export const Root: React.FC = () => {
  return (
    <>
      {/* ── V2 Compositions (30s, with audio + transitions) ── */}

      {/* V2 Primary: LinkedIn 4:5 */}
      <Composition
        id="LeadMagnetV2"
        component={LeadMagnetV2}
        durationInFrames={TOTAL_FRAMES_V2}
        fps={FPS_V2}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      {/* V2 Secondary: IG Reels / TikTok / Shorts 9:16 */}
      <Composition
        id="LeadMagnetV2Reels"
        component={LeadMagnetV2}
        durationInFrames={TOTAL_FRAMES_V2}
        fps={FPS_V2}
        width={PRESETS.reels.width}
        height={PRESETS.reels.height}
      />

      {/* V2 Tertiary: YouTube / website embed 16:9 */}
      <Composition
        id="LeadMagnetV2Landscape"
        component={LeadMagnetV2}
        durationInFrames={TOTAL_FRAMES_V2}
        fps={FPS_V2}
        width={PRESETS.landscape.width}
        height={PRESETS.landscape.height}
      />

      {/* ── V1 Compositions (60s, silent — kept for reference) ── */}

      {/* V1 Primary: LinkedIn 4:5 */}
      <Composition
        id="LeadMagnet"
        component={LeadMagnet}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      {/* V1 Secondary: IG Reels / TikTok / Shorts 9:16 */}
      <Composition
        id="LeadMagnetReels"
        component={LeadMagnet}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={PRESETS.reels.width}
        height={PRESETS.reels.height}
      />

      {/* V1 Tertiary: YouTube / website embed 16:9 */}
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
