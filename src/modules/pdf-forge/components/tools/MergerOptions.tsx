"use client";
import React from "react";
import { usePdfStore } from "../../store/usePdfStore";

export function MergerOptions() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
        <h4 className="text-red-400 font-bold mb-1">Lossless Combination</h4>
        <p className="text-xs text-red-200/60 leading-relaxed font-medium">
          Upload 2 or more PDF files. Drag and drop to reorder them in the list.
          They will be combined in exact order without losing quality or text searchability.
        </p>
      </div>
    </div>
  );
}
