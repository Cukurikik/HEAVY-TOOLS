"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { ChapterMarkerOptions } from "@/modules/video-engine/components/tools/ChapterMarkerOptions";

export default function ChapterMarkerPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("chapter-marker");
  }, [setOperation]);

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
