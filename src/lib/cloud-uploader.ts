/**
 * Omni-Tool Cloud Uploader (Phase 21)
 * 
 * Bypasses Vercel/NextJS severe 4.5MB Serverless Body limits by talking 
 * Directly to Google Cloud Storage (or AWS S3 compatible) using Signed URLs.
 * Support resumeable streaming and XHR progress tracking for massive 4K Videos.
 */

import { z } from 'zod';

export interface UploadProgress {
  loadedBytes: number;
  totalBytes: number;
  progressPercentage: number;
}

export interface CloudUploadResult {
  success: boolean;
  storagePath: string;
  downloadUrl?: string; // Optional if we immediately need to fetch it back
  error?: string;
}

/**
 * Executes a direct XHR stream to GCP using the pre-signed URL.
 * We use XMLHttpRequest because `fetch` API doesn't natively support 
 * upload progress events cleanly across all older browsers.
 */
function streamToUrl(
  file: File, 
  signedUrl: string, 
  onProgress?: (progress: UploadProgress) => void
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          loadedBytes: event.loaded,
          totalBytes: event.total,
          progressPercentage: Math.round((event.loaded / event.total) * 100)
        });
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve(true);
      else reject(new Error(`Tus/XHR Upload Failed with status ${xhr.status}`));
    });

    xhr.addEventListener('error', () => reject(new Error('Network Error during XHR Upload')));
    xhr.addEventListener('abort', () => reject(new Error('Upload Aborted by Client')));

    xhr.open('PUT', signedUrl, true);
    // Explicitly set the Header to match what the V4 Signed URL expects
    xhr.setRequestHeader('Content-Type', file.type);
    
    xhr.send(file);
  });
}

/**
 * Main Invocation Module for any Omni-Tool Component needing Ephemeral Storage
 */
export async function uploadToEphemeralCloud(
  file: File,
  toolCategory: 'video' | 'audio' | 'image' | 'pdf' | 'converter' | 'llm',
  onProgress?: (progress: UploadProgress) => void
): Promise<CloudUploadResult> {
  try {
    // 1. Request Secure Minted URL from the Next.js API Edge
    const intentRes = await fetch('/api/ephemeral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        mimeType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
        toolCategory,
        intent: 'upload'
      }),
    });

    if (!intentRes.ok) {
      const errorJson = await intentRes.json();
      throw new Error(errorJson.error || 'Failed to mint Signed URL');
    }

    const { signedUrl, storagePath } = await intentRes.json();

    // 2. Stream Binary File Body directly to GCP/AWS via XHR Progress
    await streamToUrl(file, signedUrl, onProgress);

    // 3. Mark the Upload intent as successful (or we could wait relying purely on the Signed URL config)
    // For Phase 21 we assume immediate success if XHR succeeds.
    return { success: true, storagePath };

  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown upload error';
    console.error('[Omni-Tool Cloud Uploader] FATAL:', errorMsg);
    return { success: false, storagePath: '', error: errorMsg };
  }
}

/**
 * Instantly fetches a short-lived download URL from the bucket string
 */
export async function resolveEphemeralDownloadUrl(storagePath: string): Promise<string | null> {
  try {
    const res = await fetch('/api/ephemeral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: 'resolve_intent',
        mimeType: 'application/octet-stream',
        sizeBytes: 1,
        toolCategory: 'video', // Metadata categorization
        intent: 'download',
        storagePath
      }),
    });

    if (!res.ok) return null;
    const { signedUrl } = await res.json();
    return signedUrl;
  } catch (e) {
    return null;
  }
}
