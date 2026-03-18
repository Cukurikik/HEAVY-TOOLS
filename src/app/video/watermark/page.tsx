"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { WatermarkOptions } from "@/modules/video-engine/components/tools/WatermarkOptions";

export default function WatermarkPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("watermark");
  }, [setOperation]);

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
