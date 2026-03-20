"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { WatermarkOptions } from "@/modules/video-engine/components/tools/WatermarkOptions";

export default function WatermarkPage() {

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="watermark"
        title="Watermark Tool"
        description="Tambah watermark teks"
        options={<WatermarkOptions />}
        
        
      />
    </div>
  );
}
