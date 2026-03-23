"use client";
import React from "react";
import { usePdfStore } from "../../store/usePdfStore";

export function ExtractPagesOptions() {
  const { task, setOptions } = usePdfStore();
  const opts = task.options;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 mb-6">
        <h4 className="text-fuchsia-400 font-bold mb-1">Visual Page Extraction</h4>
        <p className="text-xs text-fuchsia-200/60 leading-relaxed font-medium">
          Upload a PDF to view all page thumbnails. Click on the thumbnails to select the exact pages you want to extract into a brand new PDF document.
        </p>
      </div>
    </div>
  );
}
