"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { LoopEngineOptions } from "@/modules/video-engine/components/tools/LoopEngineOptions";

export default function LoopEnginePage() {

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="loop-engine"
        title="Loop Engine"
        description="Buat video loop kustom"
        options={<LoopEngineOptions />}
        
        
      />
    </div>
  );
}
