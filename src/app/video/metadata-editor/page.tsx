"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { MetadataEditorOptions } from "@/modules/video-engine/components/tools/MetadataEditorOptions";

export default function MetadataEditorPage() {

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
