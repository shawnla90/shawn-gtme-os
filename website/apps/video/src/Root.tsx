import { Composition } from 'remotion';
import { LeadMagnet } from './LeadMagnet';
import { LeadMagnetV2, SHAWNOS_TOTAL_FRAMES } from './LeadMagnetV2';
import { GtmOsVideo, GTM_OS_TOTAL_FRAMES } from './GtmOsVideo';
import { ContentOsVideo } from './ContentOsVideo';
import { NioVideo } from './NioVideo';
import { ShawnOsThumbnail, GtmOsThumbnail, ContentOsThumbnail } from './Thumbnails';
import { NioBanner, ReconBanner, RemBanner, UnifiedBanner } from './Banners';
import { FPS, TOTAL_FRAMES, PRESETS } from './lib/timing';
import { FPS_V2, TOTAL_FRAMES_V2 } from './lib/timing-v2';
import { FPS_NIO, NIO_TOTAL_FRAMES } from './lib/timing-nio';
import { FPS_TT, TT_TOTAL_FRAMES, FRAMES_PER_SLIDE, TRANSITION_TT } from './lib/timing-tiktok';
import { FPS_REEL, REEL_1_TOTAL, REEL_2_TOTAL, REEL_3_TOTAL, REEL_4_TOTAL, REEL_5_TOTAL } from './lib/timing-reel';
import { TikTokSlideshow } from './TikTokSlideshow';
import { SLIDESHOWS } from './lib/slideshow-data';
import { ReelApiCosts } from './scenes/reel/ReelApiCosts';
import { ReelClaudeCodeWrong } from './scenes/reel/ReelClaudeCodeWrong';
import { ReelApiWrappers } from './scenes/reel/ReelApiWrappers';
import { ReelMcpServers } from './scenes/reel/ReelMcpServers';
import { ReelRemotionMeta } from './scenes/reel/ReelRemotionMeta';
import { NioSpritePreview } from './scenes/NioSpritePreview';
import {
  NioAnimClip,
  NioEvolveClip,
  ANIM_CLIP_FRAMES,
  EVOLVE_CLIP_FRAMES,
  ALL_TIERS,
  STANDALONE_ANIMS,
  EVOLVE_PAIRS,
} from './scenes/NioAnimClip';
import { JsonVideo } from './json-video';
import { CHAT_DEMO_SPEC } from './json-video';
import {
  GtmFlowThumb1,
  GtmFlowThumb2,
  GtmFlowThumb3,
  GtmFlowAnimated,
} from './GtmFlowCarousel';
import {
  ClaudeCodeMobile,
  CLAUDE_MOBILE_FRAMES,
  CLAUDE_MOBILE_FPS,
} from './scenes/ClaudeCodeMobile';
import { AntiSlopReel } from './AntiSlopReel';
import { AntiSlopReel60 } from './AntiSlopReel60';
import { FPS_SLOP, SLOP_TOTAL_FRAMES, SLOP_60_TOTAL_FRAMES } from './lib/timing-antislop';
import { RoiComparisonVideo } from './RoiComparisonVideo';
import { FPS_ROI, ROI_TOTAL_FRAMES } from './lib/timing-roi';

export const Root: React.FC = () => {
  return (
    <>
      {/* ── V4 Lead Magnet (shawnos.ai) — 8.2s ── */}

      <Composition
        id="LeadMagnetV3"
        component={LeadMagnetV2}
        durationInFrames={SHAWNOS_TOTAL_FRAMES}
        fps={FPS_V2}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      <Composition
        id="LeadMagnetV3Reels"
        component={LeadMagnetV2}
        durationInFrames={SHAWNOS_TOTAL_FRAMES}
        fps={FPS_V2}
        width={PRESETS.reels.width}
        height={PRESETS.reels.height}
      />

      <Composition
        id="LeadMagnetV3Landscape"
        component={LeadMagnetV2}
        durationInFrames={SHAWNOS_TOTAL_FRAMES}
        fps={FPS_V2}
        width={PRESETS.landscape.width}
        height={PRESETS.landscape.height}
      />

      {/* ── GTM OS (thegtmos.ai) — 8.2s ── */}

      <Composition
        id="GtmOsLandscape"
        component={GtmOsVideo}
        durationInFrames={GTM_OS_TOTAL_FRAMES}
        fps={FPS_V2}
        width={PRESETS.landscape.width}
        height={PRESETS.landscape.height}
      />

      <Composition
        id="GtmOsLinkedIn"
        component={GtmOsVideo}
        durationInFrames={GTM_OS_TOTAL_FRAMES}
        fps={FPS_V2}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      <Composition
        id="GtmOsReels"
        component={GtmOsVideo}
        durationInFrames={GTM_OS_TOTAL_FRAMES}
        fps={FPS_V2}
        width={PRESETS.reels.width}
        height={PRESETS.reels.height}
      />

      {/* ── Content OS (thecontentos.ai) ── */}

      <Composition
        id="ContentOsLandscape"
        component={ContentOsVideo}
        durationInFrames={TOTAL_FRAMES_V2}
        fps={FPS_V2}
        width={PRESETS.landscape.width}
        height={PRESETS.landscape.height}
      />

      <Composition
        id="ContentOsLinkedIn"
        component={ContentOsVideo}
        durationInFrames={TOTAL_FRAMES_V2}
        fps={FPS_V2}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      <Composition
        id="ContentOsReels"
        component={ContentOsVideo}
        durationInFrames={TOTAL_FRAMES_V2}
        fps={FPS_V2}
        width={PRESETS.reels.width}
        height={PRESETS.reels.height}
      />

      {/* ── Nio (shawnos.ai/nio) — ~43.7s ── */}

      <Composition
        id="NioLandscape"
        component={NioVideo}
        durationInFrames={NIO_TOTAL_FRAMES}
        fps={FPS_NIO}
        width={PRESETS.landscape.width}
        height={PRESETS.landscape.height}
      />

      <Composition
        id="NioLinkedIn"
        component={NioVideo}
        durationInFrames={NIO_TOTAL_FRAMES}
        fps={FPS_NIO}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      <Composition
        id="NioReels"
        component={NioVideo}
        durationInFrames={NIO_TOTAL_FRAMES}
        fps={FPS_NIO}
        width={PRESETS.reels.width}
        height={PRESETS.reels.height}
      />

      {/* ── Static Thumbnails (LinkedIn carousel images) ── */}

      <Composition
        id="ShawnOsThumb"
        component={ShawnOsThumbnail}
        durationInFrames={1}
        fps={1}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      <Composition
        id="GtmOsThumb"
        component={GtmOsThumbnail}
        durationInFrames={1}
        fps={1}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      <Composition
        id="ContentOsThumb"
        component={ContentOsThumbnail}
        durationInFrames={1}
        fps={1}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      {/* ── Social Profile Banners (1500×500) ── */}

      <Composition
        id="NioBanner"
        component={NioBanner}
        durationInFrames={1}
        fps={1}
        width={PRESETS.banner.width}
        height={PRESETS.banner.height}
      />

      <Composition
        id="ReconBanner"
        component={ReconBanner}
        durationInFrames={1}
        fps={1}
        width={PRESETS.banner.width}
        height={PRESETS.banner.height}
      />

      <Composition
        id="RemBanner"
        component={RemBanner}
        durationInFrames={1}
        fps={1}
        width={PRESETS.banner.width}
        height={PRESETS.banner.height}
      />

      <Composition
        id="UnifiedBanner"
        component={UnifiedBanner}
        durationInFrames={1}
        fps={1}
        width={PRESETS.banner.width}
        height={PRESETS.banner.height}
      />

      {/* ── GTM Automation Flow Carousel (LinkedIn 4:5) ── */}

      <Composition
        id="GtmFlowThumb1"
        component={GtmFlowThumb1}
        durationInFrames={1}
        fps={1}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      <Composition
        id="GtmFlowThumb2"
        component={GtmFlowThumb2}
        durationInFrames={1}
        fps={1}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      <Composition
        id="GtmFlowThumb3"
        component={GtmFlowThumb3}
        durationInFrames={1}
        fps={1}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      <Composition
        id="GtmFlowAnimated"
        component={GtmFlowAnimated}
        durationInFrames={150}
        fps={30}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      {/* ── Nio Reel Clips (1080×960, ~45s each) ── */}

      <Composition
        id="NioReel-ApiCosts"
        component={ReelApiCosts}
        durationInFrames={REEL_1_TOTAL}
        fps={FPS_REEL}
        width={PRESETS.reelClip.width}
        height={PRESETS.reelClip.height}
      />

      <Composition
        id="NioReel-ClaudeCodeWrong"
        component={ReelClaudeCodeWrong}
        durationInFrames={REEL_2_TOTAL}
        fps={FPS_REEL}
        width={PRESETS.reelClip.width}
        height={PRESETS.reelClip.height}
      />

      <Composition
        id="NioReel-ApiWrappers"
        component={ReelApiWrappers}
        durationInFrames={REEL_3_TOTAL}
        fps={FPS_REEL}
        width={PRESETS.reelClip.width}
        height={PRESETS.reelClip.height}
      />

      <Composition
        id="NioReel-McpServers"
        component={ReelMcpServers}
        durationInFrames={REEL_4_TOTAL}
        fps={FPS_REEL}
        width={PRESETS.reelClip.width}
        height={PRESETS.reelClip.height}
      />

      <Composition
        id="NioReel-RemotionMeta"
        component={ReelRemotionMeta}
        durationInFrames={REEL_5_TOTAL}
        fps={FPS_REEL}
        width={PRESETS.reelClip.width}
        height={PRESETS.reelClip.height}
      />

      {/* ── Nio Sprite Animation Preview ── */}

      <Composition
        id="NioSpritePreview"
        component={NioSpritePreview}
        durationInFrames={500}
        fps={FPS_REEL}
        width={PRESETS.landscape.width}
        height={PRESETS.landscape.height}
      />

      {/* ── Nio Standalone Animation Clips (512×512, short) ── */}

      {ALL_TIERS.flatMap((tier) =>
        STANDALONE_ANIMS.map((anim) => (
          <Composition
            key={`NioAnim-${anim}-T${tier}`}
            id={`NioAnim-${anim}-T${tier}`}
            component={NioAnimClip}
            defaultProps={{ tier, animation: anim, size: 256 }}
            durationInFrames={ANIM_CLIP_FRAMES[anim]}
            fps={FPS_REEL}
            width={512}
            height={512}
          />
        )),
      )}

      {EVOLVE_PAIRS.map(({ from, to }) => (
        <Composition
          key={`NioEvolve-${from}to${to}`}
          id={`NioEvolve-${from}to${to}`}
          component={NioEvolveClip}
          defaultProps={{ tierFrom: from, tierTo: to, size: 256 }}
          durationInFrames={EVOLVE_CLIP_FRAMES}
          fps={FPS_REEL}
          width={512}
          height={512}
        />
      ))}

      {/* ── TikTok Slideshows (9:16, ~16s each) ── */}

      {Object.entries(SLIDESHOWS).map(([id, slides]) => {
        const count = slides.length;
        const frames = count * FRAMES_PER_SLIDE - (count - 1) * TRANSITION_TT;
        return (
          <Composition
            key={id}
            id={`TikTok-${id}`}
            component={TikTokSlideshow}
            defaultProps={{ slides }}
            durationInFrames={frames}
            fps={FPS_TT}
            width={PRESETS.reels.width}
            height={PRESETS.reels.height}
          />
        );
      })}

      {/* ── JSON Video (AI-driven compositions) ── */}

      <Composition
        id="JsonVideo"
        component={JsonVideo}
        defaultProps={{ spec: CHAT_DEMO_SPEC }}
        durationInFrames={CHAT_DEMO_SPEC.composition!.durationInFrames}
        fps={CHAT_DEMO_SPEC.composition!.fps}
        width={CHAT_DEMO_SPEC.composition!.width}
        height={CHAT_DEMO_SPEC.composition!.height}
        calculateMetadata={({ props }) => {
          const spec = (props as { spec: typeof CHAT_DEMO_SPEC }).spec;
          return {
            durationInFrames: spec.composition!.durationInFrames,
            fps: spec.composition!.fps,
            width: spec.composition!.width,
            height: spec.composition!.height,
          };
        }}
      />

      {/* ── Anti-Slop Reel (TikTok 9:16 primary, also LinkedIn 4:5 + Landscape) ── */}

      <Composition
        id="AntiSlopReels"
        component={AntiSlopReel}
        durationInFrames={SLOP_TOTAL_FRAMES}
        fps={FPS_SLOP}
        width={PRESETS.reels.width}
        height={PRESETS.reels.height}
      />

      <Composition
        id="AntiSlopLinkedIn"
        component={AntiSlopReel}
        durationInFrames={SLOP_TOTAL_FRAMES}
        fps={FPS_SLOP}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      <Composition
        id="AntiSlopLandscape"
        component={AntiSlopReel}
        durationInFrames={SLOP_TOTAL_FRAMES}
        fps={FPS_SLOP}
        width={PRESETS.landscape.width}
        height={PRESETS.landscape.height}
      />

      {/* ── Anti-Slop 60s Reel (NPC hook, full breakdown) ── */}

      <Composition
        id="AntiSlop60Reels"
        component={AntiSlopReel60}
        durationInFrames={SLOP_60_TOTAL_FRAMES}
        fps={FPS_SLOP}
        width={PRESETS.reels.width}
        height={PRESETS.reels.height}
      />

      <Composition
        id="AntiSlop60LinkedIn"
        component={AntiSlopReel60}
        durationInFrames={SLOP_60_TOTAL_FRAMES}
        fps={FPS_SLOP}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      <Composition
        id="AntiSlop60Landscape"
        component={AntiSlopReel60}
        durationInFrames={SLOP_60_TOTAL_FRAMES}
        fps={FPS_SLOP}
        width={PRESETS.landscape.width}
        height={PRESETS.landscape.height}
      />

      {/* ── Claude Code Mobile GIF (LinkedIn horizontal + X) ── */}

      <Composition
        id="ClaudeCodeMobile"
        component={ClaudeCodeMobile}
        durationInFrames={CLAUDE_MOBILE_FRAMES}
        fps={CLAUDE_MOBILE_FPS}
        width={1200}
        height={628}
      />

      {/* ── ROI Comparison (1920×1080 landscape + 1080×1350 LinkedIn) ── */}

      <Composition
        id="RoiComparison"
        component={RoiComparisonVideo}
        durationInFrames={ROI_TOTAL_FRAMES}
        fps={FPS_ROI}
        width={PRESETS.landscape.width}
        height={PRESETS.landscape.height}
      />

      <Composition
        id="RoiComparisonLinkedIn"
        component={RoiComparisonVideo}
        durationInFrames={ROI_TOTAL_FRAMES}
        fps={FPS_ROI}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      {/* ── V1 Compositions (60s, silent — kept for reference) ── */}

      <Composition
        id="LeadMagnet"
        component={LeadMagnet}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={PRESETS.linkedin.width}
        height={PRESETS.linkedin.height}
      />

      <Composition
        id="LeadMagnetReels"
        component={LeadMagnet}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={PRESETS.reels.width}
        height={PRESETS.reels.height}
      />

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
