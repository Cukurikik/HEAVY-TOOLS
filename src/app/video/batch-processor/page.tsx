"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { BatchProcessorOptions } from "@/modules/video-engine/components/tools/BatchProcessorOptions";

export default function BatchProcessorPage() {

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="batch-processor"
        title="Batch Processor"
        description="Proses multiple video sekaligus"
        options={<BatchProcessorOptions />}
        
        isMultiFile={true}
      />
    </div>
  );
}
