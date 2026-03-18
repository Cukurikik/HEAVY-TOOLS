"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { SubtitleBurnerOptions } from "@/modules/video-engine/components/tools/SubtitleBurnerOptions";

export default function SubtitleBurnerPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("subtitle-burner");
  }, [setOperation]);

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
