"use client";
import React from "react";
import { usePdfStore } from "../../store/usePdfStore";
import { Switch } from "@/components/ui/switch";

export function FormFillerOptions() {
  const { task, setOptions } = usePdfStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 mb-6">
        <h4 className="text-orange-400 font-bold mb-1">Interactive AcroForm Filler</h4>
        <p className="text-xs text-orange-200/60 leading-relaxed font-medium">
          Upload an interactive PDF form. Click fields on the canvas to fill them out. Supported fields: Text inputs, Checkboxes, and Dropdowns.
        </p>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-white/5">
        <div>
          <p className="font-bold text-white">Flatten Form (Read-Only)</p>
          <p className="text-xs text-slate-500 mt-1">
            Embeds the values permanently and removes the interactive form fields, making it impossible to change them later.
          </p>
        </div>
        <Switch
          checked={opts.flatten !== false}
          onCheckedChange={(checked) => setOptions({ flatten: checked })}
        />
      </div>
    </div>
  );
}
