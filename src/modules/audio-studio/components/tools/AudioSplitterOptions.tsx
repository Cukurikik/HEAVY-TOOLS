"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function AudioSplitterOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
        <h4 className="text-red-400 font-bold mb-1">Lossless File Splitting</h4>
        <p className="text-xs text-red-200/60 leading-relaxed font-medium">
          Splits the audio file into multiple chunks of equal length without re-encoding. 
          The output will be downloaded as a ZIP containing all segments.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-bold text-slate-400">Segment Duration</label>
          <span className="text-red-400 font-mono text-xs bg-red-500/10 px-2 py-1 rounded">
            {(opts.segmentDuration as number) ?? 30} s
          </span>
        </div>
        <input
          type="range"
          min="10" max="300" step="10"
          value={(opts.segmentDuration as number) ?? 30}
          onChange={(e) => setOptions({ segmentDuration: parseInt(e.target.value) })}
          className="w-full accent-red-500"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase mt-2">
          <span>10s</span>
          <span>1m</span>
          <span>5m</span>
        </div>
      </div>
    </div>
  );
}
