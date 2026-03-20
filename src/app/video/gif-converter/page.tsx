"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { GifConverterOptions } from "@/modules/video-engine/components/tools/GifConverterOptions";

export default function GifConverterPage() {

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
