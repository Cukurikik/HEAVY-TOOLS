"use client";
import React, { forwardRef } from "react";

interface VideoPlayerProps {
  src: string;
  onTimeUpdate?: (time: number) => void;
  onDuration?: (duration: number) => void;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ src, onTimeUpdate, onDuration }, ref) => {
    return (
      <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
        <video
          ref={ref}
          src={src}
          className="w-full h-full object-contain"
          onTimeUpdate={(e) => onTimeUpdate?.(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => onDuration?.(e.currentTarget.duration)}
          controls
          preload="metadata"
        />
      </div>
    );
  }
);
VideoPlayer.displayName = "VideoPlayer";
