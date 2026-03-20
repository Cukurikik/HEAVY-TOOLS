import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVideoQueue } from "@/lib/queue";

/**
 * Video Tools API Route Handler
 * Layer 7: app/api/video/[tool]/route.ts
 *
 * Handles server-side video processing for:
 * - Video Stabilizer (requires vidstabdetect/vidstabtransform)
 * - Large files > 2GB (exceeds browser WASM memory)
 *
 * Uses InMemoryQueue (Layer 5) for rate-limiting with max concurrency of 2.
 * Most of the 30 tools run client-side via FFmpeg WASM.
 */

const UploadSchema = z.object({
  operation: z.string().min(1),
  options: z.record(z.string(), z.unknown()).optional(),
});

// Server-side tools that need this endpoint
const SERVER_TOOLS = ["stabilizer"] as const;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tool: string }> }
) {
  try {
    const { tool } = await params;

    // Validate tool is a server-side tool
    if (!SERVER_TOOLS.includes(tool as (typeof SERVER_TOOLS)[number])) {
      return NextResponse.json(
        {
          error: `Tool "${tool}" runs client-side. Use the FFmpeg WASM Worker instead.`,
          clientSide: true,
        },
        { status: 400 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const optionsRaw = formData.get("options") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided." },
        { status: 400 }
      );
    }

    // Validate options
    let options: Record<string, unknown> = {};
    if (optionsRaw) {
      try {
        const parsed = JSON.parse(optionsRaw);
        options = UploadSchema.parse({
          operation: tool,
          options: parsed,
        }).options || {};
      } catch {
        return NextResponse.json(
          { error: "Invalid options format." },
          { status: 400 }
        );
      }
    }

    // Save file to temp storage
    const tmpDir = `/tmp/omni/video`;
    const inputPath = `${tmpDir}/${crypto.randomUUID()}_${file.name}`;

    // Enqueue job via InMemoryQueue (Layer 5)
    const queue = getVideoQueue();
    const jobId = queue.enqueue(tool, inputPath, options);

    return NextResponse.json({
      success: true,
      jobId,
      tool,
      fileName: file.name,
      fileSize: file.size,
      status: "queued",
      message: `Job queued. Poll GET /api/video/${tool}?jobId=${jobId} or GET /api/download/${jobId} for status.`,
    });
  } catch (error) {
    console.error("Video API Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tool: string }> }
) {
  const { tool } = await params;
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  // If jobId provided, return job status from queue
  if (jobId) {
    const queue = getVideoQueue();
    const job = queue.getJob(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }
    return NextResponse.json({
      jobId: job.id,
      tool: job.tool,
      status: job.status,
      progress: job.progress,
      outputPath: job.outputPath,
      error: job.error,
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
    });
  }

  // No jobId — return tool info
  return NextResponse.json({
    tool,
    status: "available",
    engine: SERVER_TOOLS.includes(tool as (typeof SERVER_TOOLS)[number])
      ? "Server child_process"
      : "Client FFmpeg WASM",
    description: `Video tool endpoint for: ${tool}`,
  });
}
