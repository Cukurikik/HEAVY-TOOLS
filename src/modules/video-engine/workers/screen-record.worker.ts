/**
 * Screen Record Worker
 * Manages MediaRecorder chunks in a separate thread.
 * The actual getDisplayMedia() call must happen on the main thread,
 * but chunk assembly and encoding happens here.
 */

export interface ScreenRecordWorkerMessage {
  type: 'ADD_CHUNK' | 'FINALIZE' | 'RESET';
  payload?: {
    chunk: Uint8Array;
    mimeType?: string;
  };
}

export interface ScreenRecordWorkerResponse {
  type: 'PROGRESS' | 'DONE' | 'ERROR';
  progress?: number;
  outputBlob?: Blob;
  error?: string;
}

const chunks: Uint8Array[] = [];
let mimeType = 'video/webm;codecs=vp9';

self.onmessage = (e: MessageEvent<ScreenRecordWorkerMessage>) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'ADD_CHUNK': {
      if (payload?.chunk) {
        chunks.push(payload.chunk);
        if (payload.mimeType) {
          mimeType = payload.mimeType;
        }
        (self as unknown as Worker).postMessage({
          type: 'PROGRESS',
          progress: chunks.length, // Simple chunk count as progress indicator
        } satisfies ScreenRecordWorkerResponse);
      }
      break;
    }

    case 'FINALIZE': {
      try {
        if (chunks.length === 0) {
          throw new Error('No recording chunks available');
        }

        // Combine all chunks into a single Blob
        const blobParts = chunks.map((chunk) => new Blob([chunk.buffer as ArrayBuffer]));
        const finalBlob = new Blob(blobParts, { type: mimeType });

        (self as unknown as Worker).postMessage({
          type: 'DONE',
          outputBlob: finalBlob,
        } satisfies ScreenRecordWorkerResponse);
      } catch (error) {
        (self as unknown as Worker).postMessage({
          type: 'ERROR',
          error: error instanceof Error ? error.message : 'Screen record finalize failed',
        } satisfies ScreenRecordWorkerResponse);
      }
      break;
    }

    case 'RESET': {
      chunks.length = 0;
      mimeType = 'video/webm;codecs=vp9';
      break;
    }
  }
};
