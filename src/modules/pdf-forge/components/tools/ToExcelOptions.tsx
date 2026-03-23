"use client";
import React from "react";

export function ToExcelOptions() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-green-600/10 border border-green-600/20">
        <h4 className="text-green-500 font-bold mb-1">Convert to Microsoft Excel (.xlsx)</h4>
        <p className="text-xs text-green-200/60 leading-relaxed font-medium">
          Converts the uploaded PDF to an editable XLSX spreadsheet. The engine scans the document for grid structures and isolates tables into individual workbook sheets.
        </p>
      </div>
    </div>
  );
}
