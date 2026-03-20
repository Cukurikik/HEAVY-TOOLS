"use client";

import { VideoToolInterface } from "@/modules/video-engine/components/VideoToolInterface";
import { ProEditorOptions } from "@/modules/video-engine/components/tools/ProEditorOptions";

export default function ProEditorPage() {

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
