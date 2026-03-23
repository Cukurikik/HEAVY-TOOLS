"use client";
import React from "react";

export function BookmarksEditorOptions() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-cyan-600/10 border border-cyan-600/20">
        <h4 className="text-cyan-500 font-bold mb-1">Outline / Bookmark Editor</h4>
        <p className="text-xs text-cyan-200/60 leading-relaxed font-medium">
          Upload a PDF to view its internal outline structure. You can rename, delete, and add new nested bookmarks pointing to specific pages.
        </p>
      </div>
    </div>
  );
}
