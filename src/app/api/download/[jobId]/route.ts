import { NextRequest, NextResponse } from "next/server";
import { getVideoQueue } from "@/lib/queue";
import fs from "fs/promises";
import { createReadStream } from "fs";

/**
 * Download API Route Handler
 * Layer 7: app/api/download/[jobId]/route.ts
 *
 * Streams the processed file back to the client for server-side jobs.
 * Used when video processing happens on the server (stabilizer).
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

    const queue = getVideoQueue();
    const job = queue.getJob(jobId);

    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    if (job.status !== "success" || !job.outputPath) {
      return NextResponse.json({ error: "Job not completed yet." }, { status: 400 });
    }

    // Check if file exists
    try {
      await fs.access(job.outputPath);
    } catch {
      return NextResponse.json({ error: "Output file not found on server." }, { status: 404 });
    }

    const fileStat = await fs.stat(job.outputPath);
    
    // Create a readable stream from the file with Node
    // Then convert to Web ReadableStream for Next.js 
    const stream = createReadStream(job.outputPath);
    
    const readableStream = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => controller.enqueue(chunk));
        stream.on('end', () => controller.close());
        stream.on('error', (err) => controller.error(err));
      },
      cancel() {
        stream.destroy();
      }
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": fileStat.size.toString(),
        "Content-Disposition": `attachment; filename="stabilized_${job.id}.mp4"`,
      },
    });
  } catch (error) {
    console.error("Download API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
