"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { ColorGraderOptions } from "@/modules/video-engine/components/tools/ColorGraderOptions";

export default function ColorGraderPage() {

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
