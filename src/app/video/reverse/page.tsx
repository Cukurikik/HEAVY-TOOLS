"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { ReverseOptions } from "@/modules/video-engine/components/tools/ReverseOptions";

export default function ReversePage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("reverse");
  }, [setOperation]);

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
