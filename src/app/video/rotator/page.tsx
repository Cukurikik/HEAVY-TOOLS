"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { RotatorOptions } from "@/modules/video-engine/components/tools/RotatorOptions";

export default function RotatorPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("rotator");
  }, [setOperation]);

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="rotator"
        title="Video Rotator"
        description="Rotasi 90°/180°/270°"
        options={<RotatorOptions />}
        
        
      />
    </div>
  );
}
