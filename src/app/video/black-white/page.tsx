"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { BlackWhiteOptions } from "@/modules/video-engine/components/tools/BlackWhiteOptions";

export default function BlackWhitePage() {

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="black-white"
        title="Black & White"
        description="Grayscale via hue=s=0"
        options={<BlackWhiteOptions />}
        
        
      />
    </div>
  );
}
