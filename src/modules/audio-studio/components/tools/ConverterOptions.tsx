"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function ConverterOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400">Target Format</label>
          <select
            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
            value={(opts.format as string) || "mp3"}
            onChange={(e) => setOptions({ format: e.target.value })}
          >
            <option value="mp3">MP3 (Universal)</option>
            <option value="wav">WAV (Lossless Uncompressed)</option>
            <option value="flac">FLAC (Lossless Compressed)</option>
            <option value="aac">AAC (High Quality)</option>
            <option value="ogg">OGG (Web Optimized)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400">Sample Rate</label>
          <select
            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
            value={(opts.sampleRate as string) || "44100"}
            onChange={(e) => setOptions({ sampleRate: e.target.value })}
          >
            <option value="48000">48000 Hz (Pro Audio / Video)</option>
            <option value="44100">44100 Hz (CD Audio)</option>
            <option value="32000">32000 Hz (FM Radio)</option>
            <option value="22050">22050 Hz (Low Quality)</option>
            <option value="16000">16000 Hz (Voice)</option>
            <option value="8000">8000 Hz (Telephone)</option>
          </select>
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-bold text-slate-400">Bitrate (kbps)</label>
            <span className="text-violet-400 font-mono text-xs bg-violet-500/10 px-2 py-1 rounded">
              {(opts.bitrate as string) || "192"} kbps
            </span>
          </div>
          <input
            type="range"
            min="64"
            max="320"
            step="32"
            value={parseInt((opts.bitrate as string) || "192")}
            onChange={(e) => setOptions({ bitrate: e.target.value })}
            className="w-full accent-violet-500 disabled:opacity-50"
            disabled={opts.format === "wav" || opts.format === "flac"}
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase mt-2">
            <span>64 (Low)</span>
            <span>192 (Standard)</span>
            <span>320 (High)</span>
          </div>
          {(opts.format === "wav" || opts.format === "flac") && (
            <p className="text-xs text-violet-400/80 mt-2 italic">Bitrate is ignored for lossless formats.</p>
          )}
        </div>
      </div>
    </div>
  );
}
