"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { ThumbnailExtractorOptions } from "@/modules/video-engine/components/tools/ThumbnailExtractorOptions";

export default function ThumbnailExtractorPage() {

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
