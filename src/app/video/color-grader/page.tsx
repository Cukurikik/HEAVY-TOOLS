"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { ColorGraderOptions } from "@/modules/video-engine/components/tools/ColorGraderOptions";

export default function ColorGraderPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("color-grader");
  }, [setOperation]);

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="color-grader"
        title="Color Grader"
        description="Brightness, contrast, saturation, hue"
        options={<ColorGraderOptions />}
        
        
      />
    </div>
  );
}
