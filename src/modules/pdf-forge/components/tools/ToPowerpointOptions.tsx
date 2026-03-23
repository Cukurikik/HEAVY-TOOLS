"use client";
import React from "react";

export function ToPowerpointOptions() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-orange-600/10 border border-orange-600/20">
        <h4 className="text-orange-500 font-bold mb-1">Convert to Microsoft PowerPoint (.pptx)</h4>
        <p className="text-xs text-orange-200/60 leading-relaxed font-medium">
          Converts the uploaded PDF to an editable PPTX presentation. Each page of the PDF will be translated into an individual PowerPoint slide with movable assets.
        </p>
      </div>
    </div>
  );
}
