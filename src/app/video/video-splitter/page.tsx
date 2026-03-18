"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { VideoSplitterOptions } from "@/modules/video-engine/components/tools/VideoSplitterOptions";

export default function VideoSplitterPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("video-splitter");
  }, [setOperation]);

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="video-splitter"
        title="Video Splitter"
        description="Pecah video berdasarkan waktu"
        options={<VideoSplitterOptions />}
        
        
      />
    </div>
  );
}
