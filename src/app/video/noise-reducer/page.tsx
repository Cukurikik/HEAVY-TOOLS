"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { NoiseReducerOptions } from "@/modules/video-engine/components/tools/NoiseReducerOptions";

export default function NoiseReducerPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("noise-reducer");
  }, [setOperation]);

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="noise-reducer"
        title="Noise Reducer"
        description="Kurangi noise visual via hqdn3d"
        options={<NoiseReducerOptions />}
        
        
      />
    </div>
  );
}
