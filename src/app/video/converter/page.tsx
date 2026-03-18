"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { ConverterOptions } from "@/modules/video-engine/components/tools/ConverterOptions";

export default function ConverterPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("converter");
  }, [setOperation]);

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
