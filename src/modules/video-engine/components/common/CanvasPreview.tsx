"use client";
import React, { useEffect, useRef } from "react";

interface CanvasPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  currentTime: number;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({ videoRef, currentTime }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // We can draw to canvas whenever the currentTime updates
    if (video.readyState >= 2) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
  }, [currentTime, videoRef]);

  return (
    <div className="w-full aspect-video bg-black/80 rounded-2xl overflow-hidden border border-white/5 shadow-2xl flex items-center justify-center relative">
      <canvas ref={canvasRef} className="w-full h-full object-contain" />
      <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-[10px] text-white font-black uppercase tracking-widest border border-white/10">
        Frame Preview
      </div>
    </div>
  );
};
