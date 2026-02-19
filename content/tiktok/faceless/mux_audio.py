#!/usr/bin/env python3
"""Mux audio into a lip-synced video. Uses moviepy (bundles ffmpeg)."""
import sys
from pathlib import Path
from typing import Optional

def mux_audio(video_path: str, audio_path: str, output_path: Optional[str] = None) -> None:
    from moviepy import VideoFileClip, AudioFileClip

    video = VideoFileClip(video_path)
    audio = AudioFileClip(audio_path)

    # Trim to shortest duration
    duration = min(video.duration, audio.duration)
    video = video.subclipped(0, duration)
    video = video.with_audio(audio.subclipped(0, duration))

    out = output_path or str(Path(video_path).with_name(
        Path(video_path).stem.replace("temp_", "") + "_with_voice.mp4"
    ))
    video.write_videofile(out, codec="libx264", audio_codec="aac")
    video.close()
    audio.close()
    print(out)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: mux_audio.py <video.mp4> <audio.mp3> [output.mp4]")
        sys.exit(1)
    mux_audio(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
