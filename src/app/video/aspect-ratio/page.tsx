"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { AspectRatioOptions } from "@/modules/video-engine/components/tools/AspectRatioOptions";

export default function AspectRatioPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("aspect-ratio");
  }, [setOperation]);

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="aspect-ratio"
        title="Aspect Ratio Tool"
        description="Ubah aspect ratio crop/letterbox"
        options={<AspectRatioOptions />}
        
        
      />
    </div>
  );
}
