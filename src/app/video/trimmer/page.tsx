"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { TrimmerOptions } from "@/modules/video-engine/components/tools/TrimmerOptions";

export default function TrimmerPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("trimmer");
  }, [setOperation]);

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="trimmer"
        title="Video Trimmer"
        description="Potong video presisi frame"
        options={<TrimmerOptions />}
        
        
      />
    </div>
  );
}
