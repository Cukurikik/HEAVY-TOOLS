"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { FlipperOptions } from "@/modules/video-engine/components/tools/FlipperOptions";

export default function FlipperPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("flipper");
  }, [setOperation]);

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="flipper"
        title="Video Flipper"
        description="Flip horizontal/vertical"
        options={<FlipperOptions />}
        
        
      />
    </div>
  );
}
