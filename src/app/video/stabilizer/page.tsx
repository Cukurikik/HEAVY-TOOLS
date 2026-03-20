"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { StabilizerOptions } from "@/modules/video-engine/components/tools/StabilizerOptions";

export default function StabilizerPage() {

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="stabilizer"
        title="Video Stabilizer"
        description="Stabilisasi video dengan deshake filter"
        options={<StabilizerOptions />}
        
        
      />
    </div>
  );
}
