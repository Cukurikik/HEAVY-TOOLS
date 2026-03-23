"use client";
import React from "react";

export function FromImageOptions() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-teal-600/10 border border-teal-600/20">
        <h4 className="text-teal-500 font-bold mb-1">Convert Images to PDF</h4>
        <p className="text-xs text-teal-200/60 leading-relaxed font-medium">
          Upload multiple images (JPEG, PNG). Drag to reorder them. The system will merge them perfectly into a single PDF document.
        </p>
      </div>
    </div>
  );
}
