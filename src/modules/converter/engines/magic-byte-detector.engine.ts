import { ConverterTask } from '../types';

// A small dictionary of common magic bytes
const MAGIC_BYTES: Record<string, { label: string; offset: number; pattern: (number | null)[] }> = {
  "JPEG": { label: "JPEG Image", offset: 0, pattern: [0xFF, 0xD8, 0xFF] },
  "PNG": { label: "PNG Image", offset: 0, pattern: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] },
  "WEBP": { label: "WebP Image", offset: 8, pattern: [0x57, 0x45, 0x42, 0x50] }, // RIFF header at 0, WEBP at 8
  "PDF": { label: "PDF Document", offset: 0, pattern: [0x25, 0x50, 0x44, 0x46, 0x2D] }, // %PDF-
  "ZIP": { label: "ZIP Archive", offset: 0, pattern: [0x50, 0x4B, 0x03, 0x04] },
  "RAR": { label: "RAR Archive", offset: 0, pattern: [0x52, 0x61, 0x72, 0x21, 0x1A, 0x07] }, // Rar!...
  "MP4": { label: "MP4 Video", offset: 4, pattern: [0x66, 0x74, 0x79, 0x70] }, // ftyp
  "WEBM": { label: "WebM Media", offset: 0, pattern: [0x1A, 0x45, 0xDF, 0xA3] }, // EBML header
  "MP3": { label: "MP3 Audio", offset: 0, pattern: [0x49, 0x44, 0x33] }, // ID3v2 container usually matches
  "MKV": { label: "Matroska Video", offset: 0, pattern: [0x1A, 0x45, 0xDF, 0xA3] }, // Same EBML root as Webm
  "FLAC": { label: "FLAC Audio", offset: 0, pattern: [0x66, 0x4C, 0x61, 0x43] }, // fLaC
  "WAV": { label: "WAV Audio", offset: 8, pattern: [0x57, 0x41, 0x56, 0x45] }, // RIFF...WAVE
  "GZIP": { label: "GZip Archive", offset: 0, pattern: [0x1F, 0x8B, 0x08] },
  "BZIP2": { label: "BZip2 Archive", offset: 0, pattern: [0x42, 0x5A, 0x68] },
};

export const processMagicByteDetector = async (task: ConverterTask, onProgress: (p: number) => void): Promise<string> => {
  onProgress(20);
  const file = task.files[0];
  if (!file) throw new Error("No file provided to inspect.");

  onProgress(50);
  
  // We only need the first 32 bytes to identify 99% of files
  const slice = file.slice(0, 32);
  const buffer = await slice.arrayBuffer();
  const view = new Uint8Array(buffer);
  
  onProgress(80);

  let detected = "UNKNOWN RAW BINARY / TEXT-BASED FILE";

  for (const [key, test] of Object.entries(MAGIC_BYTES)) {
    let match = true;
    for (let i = 0; i < test.pattern.length; i++) {
        const val = test.pattern[i];
        if (val !== null && view[test.offset + i] !== val) {
            match = false;
            break; // Pattern mismatch
        }
    }
    if (match) {
        detected = test.label;
        break; // Stop at first strong match
    }
  }

  // Formatting Hex Header Printout
  const hexValues = Array.from(view).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');

  onProgress(100);
  return `Detected Signature:\n[ ${detected} ]\n\nFile Analyzed: ${file.name}\nSize: ${file.size} bytes\n\nRaw Head Hex Dump (Max 32 Bytes):\n${hexValues}`;
};
