"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { SpeedControlOptions } from "@/modules/video-engine/components/tools/SpeedControlOptions";

export default function SpeedControlPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("speed-control");
  }, [setOperation]);

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
