import { NextRequest, NextResponse } from "next/server";

/**
 * Download API Route Handler
 * Layer 7: app/api/download/[jobId]/route.ts
 *
 * Streams the processed file back to the client for server-side jobs.
 * Used when video processing happens on the server (stabilizer, large files).
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    // Validate jobId format
    if (!jobId || jobId.length < 10) {
      return NextResponse.json(
        { error: "Invalid job ID." },
        { status: 400 }
      );
    }

    // Placeholder: In production, look up the job from InMemoryQueue
    // and stream the output file from /tmp/omni/video/ or /storage/[userId]/
    return NextResponse.json({
      jobId,
      status: "pending",
      message: "Job processing. Poll this endpoint for completion.",
    });
  } catch (error) {
    console.error("Download API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
