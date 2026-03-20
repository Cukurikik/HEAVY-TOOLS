"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { FlipperOptions } from "@/modules/video-engine/components/tools/FlipperOptions";

export default function FlipperPage() {

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="flipper"
        title="Video Flipper"
        description="Flip horizontal/vertical"
        options={<FlipperOptions />}
        
        
      />
    </div>
  );
}
