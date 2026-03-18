"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { BatchProcessorOptions } from "@/modules/video-engine/components/tools/BatchProcessorOptions";

export default function BatchProcessorPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("batch-processor");
  }, [setOperation]);

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
