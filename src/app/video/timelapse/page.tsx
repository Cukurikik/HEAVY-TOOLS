"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { TimelapseOptions } from "@/modules/video-engine/components/tools/TimelapseOptions";

export default function TimelapsePage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("timelapse");
  }, [setOperation]);

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
