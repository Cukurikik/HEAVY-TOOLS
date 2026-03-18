"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { ScreenRecorderOptions } from "@/modules/video-engine/components/tools/ScreenRecorderOptions";

export default function ScreenRecorderPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("screen-recorder");
  }, [setOperation]);

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="screen-recorder"
        title="Screen Recorder"
        description="Rekam layar via getDisplayMedia()"
        options={<ScreenRecorderOptions />}
        isScreenRecorder={true}
        
      />
    </div>
  );
}
