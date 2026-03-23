"use client";
import React from "react";

export function XrefAnalyzerOptions() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-red-600/10 border border-red-600/20">
        <h4 className="text-red-500 font-bold mb-1">Developer Cross-Reference Table</h4>
        <p className="text-xs text-red-200/60 leading-relaxed font-medium">
          Extracts and visualizes the raw low-level XREF (Cross-Reference) table and object streams inside the PDF file. Output is a readable TXT diagnostics log.
        </p>
      </div>
    </div>
  );
}
