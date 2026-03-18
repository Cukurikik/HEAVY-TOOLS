"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { LoopEngineOptions } from "@/modules/video-engine/components/tools/LoopEngineOptions";

export default function LoopEnginePage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("loop-engine");
  }, [setOperation]);

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
