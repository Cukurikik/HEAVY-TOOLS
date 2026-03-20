"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { SlowMotionOptions } from "@/modules/video-engine/components/tools/SlowMotionOptions";

export default function SlowMotionPage() {

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="slow-motion"
        title="Slow Motion"
        description="Slow motion hingga 0.1x"
        options={<SlowMotionOptions />}
        
        
      />
    </div>
  );
}
