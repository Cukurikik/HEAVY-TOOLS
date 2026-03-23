"use client";

import { useVideoStore } from "../../store/useVideoStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Metadata Editor — Configuration Panel
 * Edit title, author, copyright, comment, year, genre
 */
export function MetadataEditorOptions() {
  const { setOptions, task } = useVideoStore();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Title</Label>
        <Input type="text" placeholder="Video Title" className="bg-slate-800 border-slate-700 text-white" onChange={(e) => setOptions({ title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Author / Artist</Label>
        <Input type="text" placeholder="Author Name" className="bg-slate-800 border-slate-700 text-white" onChange={(e) => setOptions({ author: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Copyright</Label>
        <Input type="text" placeholder="© 2025" className="bg-slate-800 border-slate-700 text-white" onChange={(e) => setOptions({ copyright: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Year</Label>
          <Input type="text" placeholder="2025" className="bg-slate-800 border-slate-700 text-white font-mono" onChange={(e) => setOptions({ year: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Genre</Label>
          <Input type="text" placeholder="Tutorial" className="bg-slate-800 border-slate-700 text-white" onChange={(e) => setOptions({ genre: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300 text-xs font-bold uppercase tracking-widest">Comment</Label>
        <Input type="text" placeholder="Additional notes..." className="bg-slate-800 border-slate-700 text-white" onChange={(e) => setOptions({ comment: e.target.value })} />
      </div>
    </div>
  );
}
