"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { CompressorOptions } from "@/modules/video-engine/components/tools/CompressorOptions";

export default function CompressorPage() {

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
