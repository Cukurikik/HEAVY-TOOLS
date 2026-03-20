"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { AspectRatioOptions } from "@/modules/video-engine/components/tools/AspectRatioOptions";

export default function AspectRatioPage() {

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="aspect-ratio"
        title="Aspect Ratio Tool"
        description="Ubah aspect ratio crop/letterbox"
        options={<AspectRatioOptions />}
        
        
      />
    </div>
  );
}
