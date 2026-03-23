"use client";
import React from "react";

export function ReorderPagesOptions() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20">
        <h4 className="text-pink-400 font-bold mb-1">Drag and Drop Organizer</h4>
        <p className="text-xs text-pink-200/60 leading-relaxed font-medium">
          Upload a PDF to view thumbnails of all pages. Simply drag and drop the thumbnails to reorder them visually, then click Process to save the new order.
        </p>
      </div>
    </div>
  );
}
