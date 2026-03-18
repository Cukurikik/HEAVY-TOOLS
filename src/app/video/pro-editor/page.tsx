"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { ProEditorOptions } from "@/modules/video-engine/components/tools/ProEditorOptions";

export default function ProEditorPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("pro-editor");
  }, [setOperation]);

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="pro-editor"
        title="Pro Editor"
        description="CRF, Bitrate, Codec, Profile"
        options={<ProEditorOptions />}
        
        
      />
    </div>
  );
}
