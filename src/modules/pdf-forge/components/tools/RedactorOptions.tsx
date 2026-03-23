"use client";
import React from "react";

export function RedactorOptions() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
        <h4 className="text-rose-400 font-bold mb-1">Permanent Blackout Redaction</h4>
        <p className="text-xs text-rose-200/60 leading-relaxed font-medium">
          Upload a PDF to view its pages. Drag a selection box over sensitive information (text, images, PII). The engine will draw solid black blocks and attempt to strip the underlying data.
        </p>
      </div>
    </div>
  );
}
