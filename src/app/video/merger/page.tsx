"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { MergerOptions } from "@/modules/video-engine/components/tools/MergerOptions";

export default function MergerPage() {

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
