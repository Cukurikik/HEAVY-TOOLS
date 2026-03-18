"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { GifConverterOptions } from "@/modules/video-engine/components/tools/GifConverterOptions";

export default function GifConverterPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("gif-converter");
  }, [setOperation]);

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="gif-converter"
        title="GIF Converter"
        description="Konversi video ke GIF"
        options={<GifConverterOptions />}
        
        
      />
    </div>
  );
}
