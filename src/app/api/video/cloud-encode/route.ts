import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { mapToFirebaseParams } from '@/lib/ffmpeg-mapper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, operation, options, durationSeconds } = body;
    const userId = "dev-user-id"; // In reality, get from auth

    // 60. Firebase / GCP Cost Quota Limiter
    // Refuse fallback if video is too long (e.g. > 10 minutes)
    if (durationSeconds && durationSeconds > 600) {
      return NextResponse.json({ 
        error: 'Tugas terlalu berat. Max durasi Fallback Cloud Video adalah 10 menit.' 
      }, { status: 413 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin not initialized.' }, { status: 500 });
    }

    // 55. FFmpeg Parameter Mapper (GCP)
    const firebaseParams = mapToFirebaseParams(operation, options);

    // 52. API cloud-encode
    // Create a new job document to trigger Firebase Cloud Functions
    const docRef = await adminDb.collection('videoJobs').add({
      userId,
      videoId,
      operation,
      params: firebaseParams,
      status: 'queued',
      progress: 0,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, jobId: docRef.id });
  } catch (error) {
    console.error('Cloud encode trigger error:', error);
    return NextResponse.json({ error: 'Internal server error triggering cloud encode' }, { status: 500 });
  }
}
