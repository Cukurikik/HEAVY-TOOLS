"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { ThumbnailExtractorOptions } from "@/modules/video-engine/components/tools/ThumbnailExtractorOptions";

export default function ThumbnailExtractorPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("thumbnail-extractor");
  }, [setOperation]);

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="thumbnail-extractor"
        title="Thumbnail Extractor"
        description="Ekstrak frame sebagai gambar"
        options={<ThumbnailExtractorOptions />}
        
        
      />
    </div>
  );
}
