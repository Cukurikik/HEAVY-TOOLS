"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { SpeedControlOptions } from "@/modules/video-engine/components/tools/SpeedControlOptions";

export default function SpeedControlPage() {

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="speed-control"
        title="Speed Controller"
        description="Ubah kecepatan 0.25x–4x"
        options={<SpeedControlOptions />}
        
        
      />
    </div>
  );
}
