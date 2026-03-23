"use client";
import React from "react";

export function EditorOptions() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <h4 className="text-emerald-400 font-bold mb-1">Direct Content Editor</h4>
        <p className="text-xs text-emerald-200/60 leading-relaxed font-medium">
          Upload a PDF to open the interactive canvas. You can add new text blocks, images, and shapes directly onto the pages before exporting the final document.
        </p>
      </div>
    </div>
  );
}
