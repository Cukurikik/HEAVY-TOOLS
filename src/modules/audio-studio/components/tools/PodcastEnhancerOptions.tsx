"use client";
import { useAudioStore } from "../../store/useAudioStore";
import { Switch } from "@/components/ui/switch";

export function PodcastEnhancerOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-bold text-slate-400">Target Loudness</label>
            <span className="text-violet-400 font-mono text-xs bg-violet-500/10 px-2 py-1 rounded">
              {(opts.loudness as number) ?? -16} LUFS
            </span>
          </div>
          <input
            type="range"
            min="-24" max="-12" step="1"
            value={(opts.loudness as number) ?? -16}
            onChange={(e) => setOptions({ loudness: parseFloat(e.target.value) })}
            className="w-full accent-violet-500"
          />
          <p className="text-xs text-slate-500 mt-2">-16 LUFS is standard for Apple Podcasts.</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-bold text-slate-400">Rumble Filter (Highpass)</label>
            <span className="text-violet-400 font-mono text-xs bg-violet-500/10 px-2 py-1 rounded">
              {(opts.highpass as number) ?? 80} Hz
            </span>
          </div>
          <input
            type="range"
            min="40" max="150" step="5"
            value={(opts.highpass as number) ?? 80}
            onChange={(e) => setOptions({ highpass: parseFloat(e.target.value) })}
            className="w-full accent-violet-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-white/5">
        <div>
          <p className="font-bold text-white">De-esser (Harsh 'S' Reduction)</p>
          <p className="text-xs text-slate-500 mt-1">
            Applies a dynamic EQ cut at 6kHz to soften piercing sibilance in speech.
          </p>
        </div>
        <Switch
          checked={opts.deesser !== false}
          onCheckedChange={(checked) => setOptions({ deesser: checked })}
        />
      </div>
    </div>
  );
}
