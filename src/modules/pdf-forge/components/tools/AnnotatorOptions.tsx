"use client";
import React from "react";

export function AnnotatorOptions() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
        <h4 className="text-teal-400 font-bold mb-1">Interactive Annotation Canvas</h4>
        <p className="text-xs text-teal-200/60 leading-relaxed font-medium">
          Upload a PDF. Use the toolbar on the left to highlight text, draw freehand shapes with Konva, and add sticky notes. Click Export when finished.
        </p>
      </div>
    </div>
  );
}
