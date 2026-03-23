"use client";
import React from "react";

export function TableExtractorOptions() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-emerald-600/10 border border-emerald-600/20">
        <h4 className="text-emerald-500 font-bold mb-1">AI-Powered Table Extraction</h4>
        <p className="text-xs text-emerald-200/60 leading-relaxed font-medium">
          The engine will scan the PDF for tabular data structures and output a ZIP file containing pure CSV files for every data grid discovered.
        </p>
      </div>
    </div>
  );
}
