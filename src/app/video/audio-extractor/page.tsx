"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { AudioExtractorOptions } from "@/modules/video-engine/components/tools/AudioExtractorOptions";

export default function AudioExtractorPage() {

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
