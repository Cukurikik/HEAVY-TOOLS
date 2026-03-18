"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { MergerOptions } from "@/modules/video-engine/components/tools/MergerOptions";

export default function MergerPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("merger");
  }, [setOperation]);

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="merger"
        title="Video Merger"
        description="Gabungkan multiple video via concat"
        options={<MergerOptions />}
        
        isMultiFile={true}
      />
    </div>
  );
}
