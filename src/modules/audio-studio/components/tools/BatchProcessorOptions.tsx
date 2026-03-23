"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function BatchProcessorOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  const operation = (opts.batchOperation as string) || "normalize";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Batch Operation</label>
        <select
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
          value={operation}
          onChange={(e) => setOptions({ batchOperation: e.target.value })}
        >
          <option value="normalize">Normalize (EBU R128 Loudness)</option>
          <option value="compress">Dynamic Range Compression</option>
          <option value="convert">Convert to MP3</option>
          <option value="trim">Truncate to Duration</option>
        </select>
        <p className="text-xs text-slate-500 mt-2">
          {operation === "normalize" && "Standardizes volume across all files to -16 LUFS (YouTube/Spotify standard)."}
          {operation === "compress" && "Applies a standard 4:1 compressor to reduce dynamic range on all files."}
          {operation === "convert" && "Converts all selected files to 192kbps MP3 format."}
          {operation === "trim" && "Trims all files from the beginning to the specified duration."}
        </p>
      </div>

      {operation === "trim" && (
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-bold text-slate-400">Target Duration</label>
            <span className="text-blue-400 font-mono text-xs bg-blue-500/10 px-2 py-1 rounded">
              {(opts.trimDuration as number) ?? 30} s
            </span>
          </div>
          <input
            type="range"
            min="5" max="120" step="5"
            value={(opts.trimDuration as number) ?? 30}
            onChange={(e) => setOptions({ trimDuration: parseInt(e.target.value) })}
            className="w-full accent-blue-500"
          />
        </div>
      )}
    </div>
  );
}
