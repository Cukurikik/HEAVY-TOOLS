"use client";
import { useAudioStore } from "../../store/useAudioStore";
import { Switch } from "@/components/ui/switch";

export function MergerOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-white/5">
        <div>
          <p className="font-bold text-white">Re-encode Output</p>
          <p className="text-xs text-slate-500 mt-1">
            Required if joining files with different sample rates or codecs. Off = instant lossless copy.
          </p>
        </div>
        <Switch
          checked={opts.reencode === true}
          onCheckedChange={(checked) => setOptions({ reencode: checked })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Output Format (Re-encode only)</label>
        <select
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          value={(opts.format as string) || "mp3"}
          onChange={(e) => setOptions({ format: e.target.value })}
          disabled={!opts.reencode}
        >
          <option value="mp3">MP3</option>
          <option value="wav">WAV</option>
          <option value="aac">AAC</option>
          <option value="ogg">OGG</option>
          <option value="flac">FLAC</option>
        </select>
      </div>
    </div>
  );
}
