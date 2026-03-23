"use client";
import React from "react";

export function CropPagesOptions() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
        <h4 className="text-purple-400 font-bold mb-1">Interactive Crop Interface</h4>
        <p className="text-xs text-purple-200/60 leading-relaxed font-medium">
          Upload a PDF to open the interactive cropping canvas. Drag the borders to define the exact CropBox frame. The bounding box will be applied perfectly to all pages.
        </p>
      </div>
    </div>
  );
}
