"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { BlackWhiteOptions } from "@/modules/video-engine/components/tools/BlackWhiteOptions";

export default function BlackWhitePage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("black-white");
  }, [setOperation]);

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="black-white"
        title="Black & White"
        description="Grayscale via hue=s=0"
        options={<BlackWhiteOptions />}
        
        
      />
    </div>
  );
}
