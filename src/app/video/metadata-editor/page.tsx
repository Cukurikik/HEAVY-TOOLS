"use client";

import { useEffect } from "react";
import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { useVideoStore } from "@/modules/video-engine/store/useVideoStore";
import { MetadataEditorOptions } from "@/modules/video-engine/components/tools/MetadataEditorOptions";

export default function MetadataEditorPage() {
  const { setOperation } = useVideoStore();

  useEffect(() => {
    setOperation("metadata-editor");
  }, [setOperation]);

  return (
    <div className="p-8">
      <VideoToolInterface
        toolId="metadata-editor"
        title="Metadata Editor"
        description="Edit title, author, copyright"
        options={<MetadataEditorOptions />}
        
        
      />
    </div>
  );
}
