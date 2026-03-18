"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { FrameInterpolatorOptions } from "@/modules/video-engine/components/tools/FrameInterpolatorOptions";

export default function FrameInterpolatorPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("frame-interpolator");
  }, [setOperation]);

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="frame-interpolator"
        title="Frame Interpolator"
        description="Tingkatkan FPS via minterpolate"
        options={<FrameInterpolatorOptions />}
        
        
      />
    </div>
  );
}
