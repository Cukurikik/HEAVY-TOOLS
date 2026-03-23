"use client";
import { useAudioStore } from "../../store/useAudioStore";
import { Switch } from "@/components/ui/switch";

export function KaraokeMakerOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-6">
        <h4 className="text-purple-400 font-bold mb-1">Center Channel Cancellation</h4>
        <p className="text-xs text-purple-200/60 leading-relaxed font-medium">
          This uses phase inversion to cancel out audio mixed perfectly in the center (which is usually the lead vocal). Backing vocals that are spread wide will still be audible. Requires a true stereo file.
        </p>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-white/5">
        <div>
          <p className="font-bold text-white">Bass Frequencies Protection</p>
          <p className="text-xs text-slate-500 mt-1">
            Apply a 200Hz highpass filter to the cancellation effect. This prevents the kick drum and bass guitar (which are often center-panned) from being removed along with the vocals.
          </p>
        </div>
        <Switch
          checked={opts.bassCut === true}
          onCheckedChange={(checked) => setOptions({ bassCut: checked })}
        />
      </div>
    </div>
  );
}
