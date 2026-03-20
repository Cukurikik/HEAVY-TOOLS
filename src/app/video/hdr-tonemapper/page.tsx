"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { HdrTonemapperOptions } from "@/modules/video-engine/components/tools/HdrTonemapperOptions";

export default function HdrTonemapperPage() {

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="hdr-tonemapper"
        title="HDR Tonemapper"
        description="HDR ke SDR via tonemap"
        options={<HdrTonemapperOptions />}
        
        
      />
    </div>
  );
}
