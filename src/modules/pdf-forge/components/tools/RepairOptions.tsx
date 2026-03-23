"use client";
import React from "react";

export function RepairOptions() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-lime-600/10 border border-lime-600/20">
        <h4 className="text-lime-500 font-bold mb-1">Deep Structural Repair</h4>
        <p className="text-xs text-lime-200/60 leading-relaxed font-medium">
          Upload a broken, corrupted, or unreadable PDF file. The engine will attempt to bypass severe errors, rebuild the XREF table, and synthesize a healthy PDF document.
        </p>
      </div>
    </div>
  );
}
