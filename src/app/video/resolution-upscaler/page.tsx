"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { ResolutionUpscalerOptions } from "@/modules/video-engine/components/tools/ResolutionUpscalerOptions";

export default function ResolutionUpscalerPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("resolution-upscaler");
  }, [setOperation]);

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
