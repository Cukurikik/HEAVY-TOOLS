"use client";
import React from "react";
import { usePdfStore } from "../../store/usePdfStore";

export function MetadataEditorOptions() {
  const { task, setOptions } = usePdfStore();
  const opts = task.options;

  const fields = [
    { id: "title", label: "Title", placeholder: "Document Title" },
    { id: "author", label: "Author", placeholder: "Author Name" },
    { id: "subject", label: "Subject", placeholder: "Document Topic" },
    { id: "keywords", label: "Keywords", placeholder: "Comma separated e.g. report, 2026, q1" },
    { id: "producer", label: "Producer", placeholder: "Software Name" },
    { id: "creator", label: "Creator", placeholder: "Application Name" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-bold text-slate-400">{field.label}</label>
            <input
              type="text"
              placeholder={field.placeholder}
              value={(opts[field.id] as string) || ""}
              onChange={(e) => setOptions({ [field.id]: e.target.value })}
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gray-500 outline-none"
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500">
        Leave fields empty to keep original metadata. Modifications embed deeply into the PDF dictionary.
      </p>
    </div>
  );
}
