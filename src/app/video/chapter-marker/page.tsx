"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { ChapterMarkerOptions } from "@/modules/video-engine/components/tools/ChapterMarkerOptions";

export default function ChapterMarkerPage() {

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="chapter-marker"
        title="Chapter Marker"
        description="Tambah chapter markers"
        options={<ChapterMarkerOptions />}
        
        
      />
    </div>
  );
}
