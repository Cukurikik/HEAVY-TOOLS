"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { VideoSplitterOptions } from "@/modules/video-engine/components/tools/VideoSplitterOptions";

export default function VideoSplitterPage() {

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
