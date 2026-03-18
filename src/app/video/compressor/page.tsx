"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { CompressorOptions } from "@/modules/video-engine/components/tools/CompressorOptions";

export default function CompressorPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("compressor");
  }, [setOperation]);

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="compressor"
        title="Video Compressor"
        description="Kompresi dengan kontrol CRF dan Bitrate"
        options={<CompressorOptions />}
        
        
      />
    </div>
  );
}
