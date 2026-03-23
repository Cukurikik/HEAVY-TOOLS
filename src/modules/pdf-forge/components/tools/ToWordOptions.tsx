"use client";
import React from "react";

export function ToWordOptions() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
        <h4 className="text-blue-500 font-bold mb-1">Convert to Microsoft Word (.docx)</h4>
        <p className="text-xs text-blue-200/60 leading-relaxed font-medium">
          Converts the uploaded PDF to an editable DOCX file. The server engine uses advanced OCR layout recognition to maintain original margins, text flow, and image positioning.
        </p>
      </div>
    </div>
  );
}
