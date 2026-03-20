"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { ResolutionUpscalerOptions } from "@/modules/video-engine/components/tools/ResolutionUpscalerOptions";

export default function ResolutionUpscalerPage() {

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="resolution-upscaler"
        title="AI Upscaler"
        description="Upscale resolusi via bicubic"
        options={<ResolutionUpscalerOptions />}
        
        
      />
    </div>
  );
}
