"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function TrimmerOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400">Start Time (HH:MM:SS)</label>
          <input
            type="text"
            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
            value={(opts.start as string) || "00:00:00"}
            onChange={(e) => setOptions({ start: e.target.value })}
            placeholder="00:00:00"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400">End Time (HH:MM:SS)</label>
          <input
            type="text"
            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
            value={(opts.end as string) || "00:00:10"}
            onChange={(e) => setOptions({ end: e.target.value })}
            placeholder="00:00:10"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400">Mode</label>
          <select
            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
            value={(opts.codec as string) || "copy"}
            onChange={(e) => setOptions({ codec: e.target.value })}
          >
            <option value="copy">Lossless Copy (Super Fast)</option>
            <option value="reencode">Re-encode (Allows Format Change)</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400">Output Format (Re-encode only)</label>
          <select
            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            value={(opts.format as string) || "mp3"}
            onChange={(e) => setOptions({ format: e.target.value })}
            disabled={(opts.codec as string) === "copy" || !opts.codec}
          >
            <option value="mp3">MP3</option>
            <option value="wav">WAV</option>
            <option value="aac">AAC</option>
            <option value="ogg">OGG</option>
            <option value="flac">FLAC</option>
          </select>
        </div>
      </div>
    </div>
  );
}
