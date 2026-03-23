"use client";
import React from "react";
import { usePdfStore } from "../../store/usePdfStore";

export function FromHtmlOptions() {
  const { task, setOptions } = usePdfStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-600/10 border border-slate-600/20 mb-6">
        <h4 className="text-slate-400 font-bold mb-1">HTML to PDF Generation</h4>
        <p className="text-xs text-slate-300/60 leading-relaxed font-medium">
          Input a valid web address (URL) below OR upload an HTML file. The Puppeteer engine will render an identical, print-ready PDF version of the webpage.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400">Target URL (Optional if uploading HTML file)</label>
        <input
          type="url"
          placeholder="https://example.com"
          value={(opts.url as string) || ""}
          onChange={(e) => setOptions({ url: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-slate-400 outline-none placeholder:text-slate-600"
        />
      </div>
    </div>
  );
}
