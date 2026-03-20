"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { NoiseReducerOptions } from "@/modules/video-engine/components/tools/NoiseReducerOptions";

export default function NoiseReducerPage() {

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="noise-reducer"
        title="Noise Reducer"
        description="Kurangi noise visual via hqdn3d"
        options={<NoiseReducerOptions />}
        
        
      />
    </div>
  );
}
