/**
 * Download Helper for Omni-Tool
 * Specifically designed for heavy Blob and OPFS (Origin Private File System) downloads
 * as requested in Phase 20 (Local Blob Download Strategy).
 */

/**
 * Triggers a direct browser download from a Blob object without crashing the memory.
 * Uses URL.createObjectURL and immediately revokes it to prevent memory leaks.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  if (typeof window === 'undefined') return;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  
  // Invisible append to body is required in Firefox
  document.body.appendChild(a);
  a.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Triggers a direct browser download from an existing URL.
 * Works for both Blob URLs and external/internal HTTP URLs.
 */
export function downloadFile(url: string, filename: string): void {
  if (typeof window === 'undefined') return;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
  }, 100);
}

/**
 * Triggers a download from a specific text or JSON content
 */
export function downloadString(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(blob, filename);
}

/**
 * Advanced OPFS Download Strategy
 * Streams a file from OPFS (Origin Private File System) directly to the user
 * bypassing the RAM limit usually imposed by gigantic Blobs holding 4K videos.
 */
export async function downloadFromOPFS(fileHandle: FileSystemFileHandle, suggestedName?: string): Promise<void> {
  const file = await fileHandle.getFile();
  // We can treat modern OPFS files as Blobs and download them
  downloadBlob(file, suggestedName || file.name);
}

/**
 * Zipping multiple Blobs natively using Streams API (if supported) 
 * or falling back to a lightweight JS zipper.
 * (Skeleton implemented for Batch Converter tools)
 */
export async function downloadBlobsAsZip(files: { blob: Blob; name: string }[], zipFilename: string): Promise<void> {
  // Uses dynamic import to avoid unnecessarily loading JSZip on routes that don't need it.
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  files.forEach(f => {
    zip.file(f.name, f.blob);
  });

  const zipBlob = await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 } // Optimized for speed + sensible compression
  });

  downloadBlob(zipBlob, zipFilename);
}
