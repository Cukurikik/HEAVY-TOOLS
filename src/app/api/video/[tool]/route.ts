import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVideoQueue, Job } from "@/lib/queue";
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";

/**
 * Video Tools API Route Handler
 * Layer 7: app/api/video/[tool]/route.ts
 *
 * Handles server-side video processing for:
 * - Video Stabilizer (requires vidstabdetect/vidstabtransform)
 * - Large files > 2GB (exceeds browser WASM memory)
 *
 * Uses InMemoryQueue (Layer 5) for rate-limiting with max concurrency of 2.
 */

const UploadSchema = z.object({
  operation: z.string().min(1),
  options: z.record(z.string(), z.unknown()).optional(),
});

const SERVER_TOOLS = ["stabilizer"] as const;

// Ensure processor is set up exactly once per server instance runtime
const queue = getVideoQueue();
if (!queue.getAllJobs().length) {
  queue.setProcessor(async (job: Job, onProgress: (pct: number) => void) => {
    return new Promise(async (resolve, reject) => {
      try {
        const outDir = "/tmp/omni/video/output";
        await fs.mkdir(outDir, { recursive: true });
        
        const outputFilename = `job_${job.id}_output.mp4`;
        const outputPath = path.join(outDir, outputFilename);

        let args: string[] = [];

        if (job.tool === "stabilizer") {
          // Pass 1: Detect shakes
          const trfPath = path.join(outDir, `transform_${job.id}.trf`);
          const detectArgs = [
            "-y", "-i", job.inputPath,
            "-vf", `vidstabdetect=stepsize=32:shakiness=10:accuracy=10:result=${trfPath}`,
            "-f", "null", "-"
          ];

          await new Promise<void>((res, rej) => {
            const detectProp = spawn("ffmpeg", detectArgs);
            detectProp.on("close", (code) => {
              if (code === 0) res();
              else rej(new Error(`Stabilizer Pass 1 failed with code ${code}`));
            });
          });

          onProgress(50); // Pass 1 done

          // Pass 2: Transform
          args = [
            "-y", "-i", job.inputPath,
            "-vf", `vidstabtransform=input=${trfPath}:zoom=0:smoothing=10`,
            "-vcodec", "libx264", "-preset", "fast", "-crf", "22",
            "-acodec", "copy",
            outputPath
          ];
        } else {
          throw new Error("Unsupported server tool: " + job.tool);
        }

        const ffmpeg = spawn("ffmpeg", args);

        ffmpeg.stderr.on("data", (data) => {
          const log = data.toString();
          // Extremely basic progress parsing (time=xx:xx:xx) could go here
          // For now we just jump to 100 when closed
        });

        ffmpeg.on("close", (code) => {
          if (code === 0) {
            onProgress(100);
            resolve(outputPath);
          } else {
            reject(new Error(`FFmpeg processing failed with code ${code}`));
          }
        });

      } catch (error) {
        reject(error);
      }
    });
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tool: string }> }
) {
  try {
    const { tool } = await params;

    if (!SERVER_TOOLS.includes(tool as (typeof SERVER_TOOLS)[number])) {
      return NextResponse.json(
        { error: `Tool "${tool}" runs client-side. Use FFmpeg WASM.`, clientSide: true },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const optionsRaw = formData.get("options") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    let options: Record<string, unknown> = {};
    if (optionsRaw) {
      try {
        const parsed = JSON.parse(optionsRaw);
        options = UploadSchema.parse({ operation: tool, options: parsed }).options || {};
      } catch {
        return NextResponse.json({ error: "Invalid options format." }, { status: 400 });
      }
    }

    const tmpDir = `/tmp/omni/video`;
    await fs.mkdir(tmpDir, { recursive: true });

    // Prevent path traversal by extracting just the filename
    const safeFileName = path.basename(file.name);
    const inputPath = path.join(tmpDir, `${crypto.randomUUID()}_${safeFileName}`);
    
    // Write file to disk
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(inputPath, Buffer.from(arrayBuffer));

    const jobId = queue.enqueue(tool, inputPath, options);

    return NextResponse.json({
      success: true,
      jobId,
      tool,
      fileName: file.name,
      fileSize: file.size,
      status: "queued",
      message: `Job queued.`,
    });
  } catch (error) {
    console.error("Video API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
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

  if (jobId) {
    const job = queue.getJob(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }
    return NextResponse.json({
      jobId: job.id,
      tool: job.tool,
      status: job.status,
      progress: job.progress,
      outputPath: job.status === "success" ? `/api/download/${job.id}` : undefined,
      error: job.error,
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
    });
  }

  return NextResponse.json({
    tool,
    status: "available",
    engine: SERVER_TOOLS.includes(tool as (typeof SERVER_TOOLS)[number])
      ? "Server child_process"
      : "Client FFmpeg WASM",
  });
}
