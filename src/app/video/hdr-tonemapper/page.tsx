"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { HdrTonemapperOptions } from "@/modules/video-engine/components/tools/HdrTonemapperOptions";

export default function HdrTonemapperPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("hdr-tonemapper");
  }, [setOperation]);

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
