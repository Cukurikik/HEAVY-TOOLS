"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { AudioExtractorOptions } from "@/modules/video-engine/components/tools/AudioExtractorOptions";

export default function AudioExtractorPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("audio-extractor");
  }, [setOperation]);

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="audio-extractor"
        title="Audio Extractor"
        description="Ekstrak audio tanpa re-encoding"
        options={<AudioExtractorOptions />}
        
        
      />
    </div>
  );
}
