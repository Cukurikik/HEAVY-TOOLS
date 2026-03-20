"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { ReverseOptions } from "@/modules/video-engine/components/tools/ReverseOptions";

export default function ReversePage() {

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="reverse"
        title="Video Reverser"
        description="Balik video frame-by-frame"
        options={<ReverseOptions />}
        
        
      />
    </div>
  );
}
