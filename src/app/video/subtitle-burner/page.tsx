"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { SubtitleBurnerOptions } from "@/modules/video-engine/components/tools/SubtitleBurnerOptions";

export default function SubtitleBurnerPage() {

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="subtitle-burner"
        title="Subtitle Burner"
        description="Burn subtitle SRT ke video"
        options={<SubtitleBurnerOptions />}
        
        
      />
    </div>
  );
}
