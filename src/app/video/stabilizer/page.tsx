"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { StabilizerOptions } from "@/modules/video-engine/components/tools/StabilizerOptions";

export default function StabilizerPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("stabilizer");
  }, [setOperation]);

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="stabilizer"
        title="Video Stabilizer"
        description="Stabilisasi video dengan deshake filter"
        options={<StabilizerOptions />}
        
        
      />
    </div>
  );
}
