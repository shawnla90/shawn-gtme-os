import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { COLORS } from './lib/tokens';
import { AUDIO, VOLUMES } from './lib/sounds';
import { FRAMES_PER_SLIDE, TRANSITION_TT, TT_TOTAL_FRAMES } from './lib/timing-tiktok';
import { NIO_INTRO_SLIDES } from './lib/slideshow-data';
import type { Slide } from './lib/slideshow-data';
import { SceneWrapper } from './components/SceneWrapper';
import { TikTokSlide } from './scenes/TikTokSlide';

interface TikTokSlideshowProps {
  slides?: Slide[];
}

/**
 * TikTok Slideshow — 9:16 vertical carousel video.
 *
 * 5 slides × 3s each with slide transitions.
 * Hook-first: first slide is the attention grabber.
 * CTA: last slide drives to bio link.
 *
 * Audio: card flip on each transition, BGM loop underneath.
 */
export const TikTokSlideshow: React.FC<TikTokSlideshowProps> = ({
  slides: slidesProp,
}) => {
  const allSlides = slidesProp ?? NIO_INTRO_SLIDES;
  const totalFrames = allSlides.length * FRAMES_PER_SLIDE - (allSlides.length - 1) * TRANSITION_TT;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.canvas,
        fontFamily: 'JetBrains Mono, ui-monospace, Cascadia Code, Fira Code, monospace',
      }}
    >
      <SlideshowBgm totalFrames={totalFrames} />

      {/* Card flip sounds — outside TransitionSeries */}
      {allSlides.map((_, i) =>
        i < allSlides.length - 1 ? (
          <Sequence
            key={`flip-${i}`}
            from={FRAMES_PER_SLIDE * (i + 1) - TRANSITION_TT * i - 4}
            durationInFrames={8}
            layout="none"
          >
            <Audio src={AUDIO.cardFlip} volume={VOLUMES.cardFlip * 0.5} />
          </Sequence>
        ) : null,
      )}

      <TransitionSeries>
        {allSlides.flatMap((s, i) => {
          const items = [
            <TransitionSeries.Sequence key={`slide-${i}`} durationInFrames={FRAMES_PER_SLIDE}>
              <SceneWrapper accentColor={s.accent} particleCount={20} scanlineOpacity={0.02}>
                <TikTokSlide
                  slide={s}
                  slideIndex={i}
                  totalSlides={allSlides.length}
                />
              </SceneWrapper>
            </TransitionSeries.Sequence>,
          ];
          if (i < allSlides.length - 1) {
            items.push(
              <TransitionSeries.Transition
                key={`trans-${i}`}
                presentation={slide({ direction: 'from-right' })}
                timing={linearTiming({ durationInFrames: TRANSITION_TT })}
              />,
            );
          }
          return items;
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

const SlideshowBgm: React.FC<{ totalFrames: number }> = ({ totalFrames }) => {
  const frame = useCurrentFrame();

  const volume = interpolate(
    frame,
    [0, 10, totalFrames - 15, totalFrames],
    [0, VOLUMES.bgm * 0.6, VOLUMES.bgm * 0.6, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <Sequence from={0} durationInFrames={totalFrames}>
      <Audio src={AUDIO.bgmLoop} volume={volume} />
    </Sequence>
  );
};
