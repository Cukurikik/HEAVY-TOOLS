"use client";
import React from "react";

export function CompareOptions() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-yellow-600/10 border border-yellow-600/20">
        <h4 className="text-yellow-500 font-bold mb-1">Visual & Textual Differences</h4>
        <p className="text-xs text-yellow-200/60 leading-relaxed font-medium">
          Upload exactly two PDF files. The engine will generate a comprehensive view highlighting exactly what text, images, or formatting changed between the two versions.
        </p>
      </div>
    </div>
  );
}
