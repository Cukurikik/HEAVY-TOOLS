"use client";
import { useAudioStore } from "../../store/useAudioStore";

export function MetadataEditorOptions() {
  const { task, setOptions } = useAudioStore();
  const opts = task.options;

  const fields = [
    { id: "title", label: "Title", placeholder: "Song Title" },
    { id: "artist", label: "Artist", placeholder: "Artist Name" },
    { id: "album", label: "Album", placeholder: "Album Name" },
    { id: "year", label: "Year", placeholder: "YYYY" },
    { id: "genre", label: "Genre", placeholder: "e.g. Rock, Pop, Jazz" },
    { id: "track", label: "Track Number", placeholder: "e.g. 1/12" },
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
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-slate-500 outline-none"
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500">
        Leave fields empty to keep original (if copy mode) or remove them.
      </p>
    </div>
  );
}
