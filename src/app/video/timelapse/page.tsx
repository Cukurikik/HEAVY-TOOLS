"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { TimelapseOptions } from "@/modules/video-engine/components/tools/TimelapseOptions";

export default function TimelapsePage() {

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="timelapse"
        title="Timelapse Maker"
        description="Buat timelapse skip-frame"
        options={<TimelapseOptions />}
        
        
      />
    </div>
  );
}
