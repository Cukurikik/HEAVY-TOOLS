"use client";
import React from "react";

interface TimelineSliderProps {
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
}

export const TimelineSlider: React.FC<TimelineSliderProps> = ({ duration, currentTime, onSeek }) => {
  const formatTime = (secs: number) => {
    if (!isFinite(secs)) return "00:00:00";
    return new Date(Math.max(0, secs) * 1000).toISOString().substring(11, 19);
  };
  
  return (
    <div className="flex items-center space-x-4 w-full p-4 bg-slate-900/80 rounded-2xl border border-white/5 shadow-inner backdrop-blur-xl">
      <span className="text-xs font-mono font-bold text-indigo-400">{formatTime(currentTime)}</span>
      <input
        type="range"
        min={0}
        max={duration || 100}
        step={0.01}
        value={currentTime}
        onChange={(e) => onSeek(parseFloat(e.target.value))}
        className="flex-1 accent-indigo-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
      />
      <span className="text-xs font-mono font-bold text-slate-500">{formatTime(duration)}</span>
    </div>
  );
};
