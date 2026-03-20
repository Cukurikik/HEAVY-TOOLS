"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { TrimmerOptions } from "@/modules/video-engine/components/tools/TrimmerOptions";

export default function TrimmerPage() {

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="trimmer"
        title="Video Trimmer"
        description="Potong video presisi frame"
        options={<TrimmerOptions />}
        
        
      />
    </div>
  );
}
