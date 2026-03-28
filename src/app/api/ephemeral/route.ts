/**
 * Omni-Tool Ephemeral Signed URL Generator API (Phase 21)
 * 
 * Secure Edge Endpoint (Node.js runtime required for Firebase Admin)
 * Responsible for granting 1-Hour strict upload/download tokens 
 * to bypass standard server bottlenecks, allowing direct Client -> GCP operations.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminStorage } from '@/lib/firebase-admin';
import { EphemeralDB } from '@/lib/ephemeral-db';
import { enforceRateLimit, buildRateLimitResponse } from '@/lib/rate-limit';
import { z } from 'zod';

export const maxDuration = 15; // Fast timeout, just generating tokens

const RequestPayloadSchema = z.object({
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().positive(),
  toolCategory: z.enum(['video', 'audio', 'image', 'pdf', 'converter', 'llm']),
  intent: z.enum(['upload', 'download']),
  storagePath: z.string().optional(), // Expected if downloading
});

export async function POST(req: NextRequest) {
  try {
    // 1. Strict Enterprise Rate Limiting & Bot Defense
    const ip = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // We strictly limit Signed URL minting to 15 per minute to prevent bucket exhaustion costs
    const rateLimit = await enforceRateLimit(ip, { sustained: 15, burst: 5 });
    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit);
    }

    // 2. Parse & Validate Incoming Request Body
    const bodyText = await req.text();
    let parsedBody;
    try {
      parsedBody = JSON.parse(bodyText);
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const payload = RequestPayloadSchema.safeParse(parsedBody);
    
    if (!payload.success) {
      return NextResponse.json(
        { error: 'Invalid Payload', details: payload.error.format() }, 
        { status: 400 }
      );
    }

    const data = payload.data;
    const bucket = getAdminStorage().bucket();

    // =====================================
    // UPLOAD INTENT LOGIC
    // =====================================
    if (data.intent === 'upload') {
      // Create a unique, randomized storage path to prevent collision & traversal attacks
      const secureUUID = crypto.randomUUID();
      const storagePath = `ephemeral/${data.toolCategory}/${secureUUID}_${data.filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      // Register the intent in Firestore for 1-hour TTL tracking
      const recordId = await EphemeralDB.registerUploadIntent({
        uploaderIpHash: ip, // Note: Usually we'd hash this, but we'll store as string in this example
        originalName: data.filename,
        mimeType: data.mimeType,
        sizeBytes: data.sizeBytes,
        toolCategory: data.toolCategory,
        storagePath: storagePath
      });

      const fileRef = bucket.file(storagePath);
      
      // Generate a V4 signed write-only URL valid for precisely 1 hour
      const [signedUrl] = await fileRef.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 60 * 60 * 1000, 
        contentType: data.mimeType,
      });

      return NextResponse.json({
        success: true,
        recordId,
        storagePath,
        signedUrl,
        expiresInSeconds: 3600,
      });
    }

    // =====================================
    // DOWNLOAD INTENT LOGIC
    // =====================================
    if (data.intent === 'download') {
      if (!data.storagePath) {
        return NextResponse.json({ error: 'storagePath required for download intent' }, { status: 400 });
      }

      // Security check: ensure they aren't trying to traverse directories or access eternal storage
      if (!data.storagePath.startsWith('ephemeral/')) {
        return NextResponse.json({ error: 'Access Denied: Path is outside ephemeral bucket bounds.' }, { status: 403 });
      }

      const fileRef = bucket.file(data.storagePath);
      
      // Check if file exists to prevent throwing 500s on the client
      const [exists] = await fileRef.exists();
      if (!exists) {
        return NextResponse.json({ error: 'File Not Found or Expired by TTL' }, { status: 404 });
      }

      // Read-only URL valid for exactly 1 hour
      const [signedUrl] = await fileRef.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000,
      });

      return NextResponse.json({ success: true, signedUrl });
    }

  } catch (error) {
    console.error('[Omni-Tool] /api/ephemeral FATAL:', error);
    return NextResponse.json(
      { error: 'Internal Cloud Error. Check Firebase Admin Service Account Configuration.' }, 
      { status: 500 }
    );
  }
}
