"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { SlowMotionOptions } from "@/modules/video-engine/components/tools/SlowMotionOptions";

export default function SlowMotionPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("slow-motion");
  }, [setOperation]);

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="slow-motion"
        title="Slow Motion"
        description="Slow motion hingga 0.1x"
        options={<SlowMotionOptions />}
        
        
      />
    </div>
  );
}
