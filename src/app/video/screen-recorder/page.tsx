"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { ScreenRecorderOptions } from "@/modules/video-engine/components/tools/ScreenRecorderOptions";

export default function ScreenRecorderPage() {

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
