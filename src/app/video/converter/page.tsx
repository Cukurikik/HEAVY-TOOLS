"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { ConverterOptions } from "@/modules/video-engine/components/tools/ConverterOptions";

export default function ConverterPage() {

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="converter"
        title="Video Converter"
        description="Konversi format: MP4/WebM/MKV/MOV/AVI"
        options={<ConverterOptions />}
        
        
      />
    </div>
  );
}
