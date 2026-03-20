"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { FrameInterpolatorOptions } from "@/modules/video-engine/components/tools/FrameInterpolatorOptions";

export default function FrameInterpolatorPage() {

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="frame-interpolator"
        title="Frame Interpolator"
        description="Tingkatkan FPS via minterpolate"
        options={<FrameInterpolatorOptions />}
        
        
      />
    </div>
  );
}
