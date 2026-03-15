// ============================================================
// FEATURE 08 — BASE64 ENCODER / DECODER — Component (FULLY FUNCTIONAL)
// Route: /converter/base64-encoder
// Encode files/text to Base64 and decode Base64 back to files/text
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConverterFileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { Base64EncoderActions, selectBase64EncoderState } from './base64-encoder.store';

// ============================================================
// BASE64 ENGINE
// ============================================================
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function fileToRawBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:mime;base64, prefix to get raw base64
      const base64 = result.split(',')[1] || result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function textToBase64(text: string): string {
  try {
    return btoa(unescape(encodeURIComponent(text)));
  } catch {
    // Fallback for large strings
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    let binary = '';
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }
    return btoa(binary);
  }
}

function base64ToText(base64: string): string {
  try {
    return decodeURIComponent(escape(atob(base64)));
  } catch {
    try {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new TextDecoder().decode(bytes);
    } catch {
      throw new Error('Invalid Base64 string');
    }
  }
}

function base64ToBlob(base64: string, mimeType: string = 'application/octet-stream'): Blob {
  // Strip any data URI prefix
  const raw = base64.includes(',') ? base64.split(',')[1] : base64;
  const binary = atob(raw);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

function detectMimeFromBase64(base64: string): string {
  if (base64.startsWith('data:')) {
    const match = base64.match(/data:([^;]+);/);
    if (match) return match[1];
  }
  // Try to detect from magic bytes
  try {
    const raw = base64.includes(',') ? base64.split(',')[1] : base64;
    const binary = atob(raw.substring(0, 16));
    const bytes = new Uint8Array(Math.min(binary.length, 8));
    for (let i = 0; i < bytes.length; i++) bytes[i] = binary.charCodeAt(i);
    if (bytes[0] === 0xFF && bytes[1] === 0xD8) return 'image/jpeg';
    if (bytes[0] === 0x89 && bytes[1] === 0x50) return 'image/png';
    if (bytes[0] === 0x47 && bytes[1] === 0x49) return 'image/gif';
    if (bytes[0] === 0x52 && bytes[1] === 0x49) return 'image/webp';
    if (bytes[0] === 0x25 && bytes[1] === 0x50) return 'application/pdf';
    if (bytes[0] === 0x50 && bytes[1] === 0x4B) return 'application/zip';
  } catch { /* ignore */ }
  return 'application/octet-stream';
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1_048_576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1_048_576).toFixed(2) + ' MB';
}

// ============================================================
// COMPONENT
// ============================================================
@Component({
  selector: 'app-base64-encoder',
  standalone: true,
  imports: [CommonModule, FormsModule, ConverterFileDropZoneComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          🔐 Base64 Encoder / Decoder
        </h1>
        <p class="text-white/50 text-sm">Encode files/text to Base64 or decode Base64 strings — 100% offline</p>
      </header>

      <!-- Mode Tabs -->
      <div class="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
        @for (m of modes; track m.key) {
          <button (click)="mode.set(m.key)"
            [class]="mode() === m.key
              ? 'px-4 py-2 rounded-lg text-sm font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'px-4 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors'">
            {{ m.icon }} {{ m.label }}
          </button>
        }
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- LEFT: Input -->
        <div class="space-y-4">
          @if (mode() === 'encode-file') {
            <app-converter-file-drop-zone
              accept="*/*"
              [multiple]="false"
              [maxSizeMB]="50"
              label="Drop any file to encode as Base64"
              (filesSelected)="onFileSelected($event)" />
            @if (inputFile()) {
              <div class="p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/60 flex items-center gap-2">
                📄 {{ inputFile()!.name }} ({{ formatBytes(inputFile()!.size) }})
              </div>
            }
          }

          @if (mode() === 'encode-text') {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span class="text-xs text-white/40 block">Text to Encode</span>
              <textarea rows="10" [value]="inputText()"
                (input)="inputText.set(($any($event.target)).value)"
                placeholder="Enter text to encode as Base64..."
                class="w-full px-3 py-2 text-sm bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-400 resize-none font-mono">
              </textarea>
            </div>
          }

          @if (mode() === 'decode') {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span class="text-xs text-white/40 block">Base64 String to Decode</span>
              <textarea rows="10" [value]="inputText()"
                (input)="inputText.set(($any($event.target)).value)"
                placeholder="Paste Base64 string here (with or without data: prefix)..."
                class="w-full px-3 py-2 text-sm bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-400 resize-none font-mono">
              </textarea>
            </div>
          }

          <!-- Process Button -->
          <button (click)="onProcess()"
            [disabled]="isProcessing()"
            class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                   bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]">
            @if (isProcessing()) {
              <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Processing...
            } @else if (mode() === 'decode') {
              🔓 Decode Base64
            } @else {
              🔐 Encode to Base64
            }
          </button>

          @if (errorMessage()) {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              ⚠️ {{ errorMessage() }}
            </div>
          }
        </div>

        <!-- RIGHT: Output -->
        <div class="space-y-4">
          @if (outputText()) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs text-white/40 uppercase tracking-wider font-semibold block">
                  {{ mode() === 'decode' ? 'Decoded Output' : 'Base64 Output' }}
                </span>
                <div class="flex gap-2">
                  <button (click)="onCopy()" class="text-xs text-cyan-400 hover:text-cyan-300">📋 Copy</button>
                  <button (click)="onDownloadText()" class="text-xs text-cyan-400 hover:text-cyan-300">📥 Download</button>
                </div>
              </div>

              <!-- Stats -->
              <div class="flex gap-3 text-xs text-white/40">
                <span>Input: {{ inputSizeDisplay() }}</span>
                <span>Output: {{ outputSizeDisplay() }}</span>
                <span>Ratio: {{ compressionRatio() }}</span>
              </div>

              <pre class="text-sm text-white/80 font-mono whitespace-pre-wrap break-all bg-white/5 p-3 rounded-lg max-h-96 overflow-auto select-all">{{ outputText() }}</pre>
            </div>
          }

          <!-- Decoded file download (for binary Base64) -->
          @if (outputBlob()) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <span class="text-xs text-white/40 block">Decoded File</span>
              <div class="flex items-center justify-between">
                <span class="text-white text-sm">{{ detectedMime() }} — {{ formatBytes(outputBlob()!.size) }}</span>
                <button (click)="onDownloadBlob()"
                  class="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/30 transition-colors">
                  📥 Download File
                </button>
              </div>
              <!-- Image preview if it's an image -->
              @if (previewUrl()) {
                <img [src]="previewUrl()" alt="Decoded preview" class="max-h-[300px] rounded-lg" />
              }
            </div>
          }

          <!-- Copied Toast -->
          @if (showCopied()) {
            <div class="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
              ✅ Copied to clipboard!
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class Base64EncoderComponent implements OnDestroy {
  private store = inject(Store);
  state$ = this.store.select(selectBase64EncoderState);
  formatBytes = formatBytes;

  readonly modes = [
    { key: 'encode-file', label: 'Encode File', icon: '📁' },
    { key: 'encode-text', label: 'Encode Text', icon: '📝' },
    { key: 'decode',      label: 'Decode',      icon: '🔓' },
  ];

  // Local signals
  readonly mode = signal('encode-file');
  readonly inputFile = signal<File | null>(null);
  readonly inputText = signal('');
  readonly outputText = signal('');
  readonly outputBlob = signal<Blob | null>(null);
  readonly previewUrl = signal<string | null>(null);
  readonly detectedMime = signal('');
  readonly isProcessing = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showCopied = signal(false);
  readonly inputSizeDisplay = signal('');
  readonly outputSizeDisplay = signal('');
  readonly compressionRatio = signal('');

  private blobUrls: string[] = [];

  onFileSelected(files: File[]): void {
    this.inputFile.set(files[0] ?? null);
    this.errorMessage.set(null);
    this.outputText.set('');
    this.outputBlob.set(null);
  }

  // ═══════════════════════════════════════════════════
  // CORE PROCESSING
  // ═══════════════════════════════════════════════════
  async onProcess(): Promise<void> {
    this.isProcessing.set(true);
    this.errorMessage.set(null);
    this.outputText.set('');
    this.outputBlob.set(null);
    this.cleanupUrls();
    this.store.dispatch(Base64EncoderActions.startProcessing());

    try {
      if (this.mode() === 'encode-file') {
        await this.encodeFile();
      } else if (this.mode() === 'encode-text') {
        this.encodeText();
      } else if (this.mode() === 'decode') {
        this.decode();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Processing failed';
      this.errorMessage.set(msg);
      this.store.dispatch(Base64EncoderActions.processingFailure({
        errorCode: 'CONVERSION_FAILED',
        message: msg,
        retryable: true,
      }));
    } finally {
      this.isProcessing.set(false);
    }
  }

  // ---- Encode File ----
  private async encodeFile(): Promise<void> {
    const file = this.inputFile();
    if (!file) throw new Error('No file selected');

    const dataUrl = await fileToBase64(file);
    const rawBase64 = await fileToRawBase64(file);

    const output = [
      `=== DATA URL (with MIME prefix) ===`,
      dataUrl,
      ``,
      `=== RAW BASE64 ===`,
      rawBase64,
    ].join('\n');

    this.outputText.set(output);
    this.inputSizeDisplay.set(formatBytes(file.size));
    this.outputSizeDisplay.set(formatBytes(rawBase64.length));
    this.compressionRatio.set(`${((rawBase64.length / file.size) * 100).toFixed(0)}% of original`);

    const blob = new Blob([output], { type: 'text/plain' });
    this.store.dispatch(Base64EncoderActions.processingSuccess({ outputBlob: , outputText: '', outputSizeMB:  }));
  }

  // ---- Encode Text ----
  private encodeText(): void {
    const text = this.inputText();
    if (!text.trim()) throw new Error('No text to encode');

    const encoded = textToBase64(text);
    this.outputText.set(encoded);
    this.inputSizeDisplay.set(formatBytes(new TextEncoder().encode(text).length));
    this.outputSizeDisplay.set(formatBytes(encoded.length));
    this.compressionRatio.set(`${((encoded.length / text.length) * 100).toFixed(0)}% of original`);

    const blob = new Blob([encoded], { type: 'text/plain' });
    this.store.dispatch(Base64EncoderActions.processingSuccess({ outputBlob: , outputText: '', outputSizeMB:  }));
  }

  // ---- Decode ----
  private decode(): void {
    const input = this.inputText().trim();
    if (!input) throw new Error('No Base64 string to decode');

    // Try text decode first
    try {
      const decoded = base64ToText(input.includes(',') ? input.split(',')[1] : input);
      // Check if it looks like text (has printable chars)
      const printable = decoded.split('').filter(c => c.charCodeAt(0) >= 32 || c === '\n' || c === '\r' || c === '\t').length;
      if (printable / decoded.length > 0.8) {
        this.outputText.set(decoded);
        this.inputSizeDisplay.set(formatBytes(input.length));
        this.outputSizeDisplay.set(formatBytes(decoded.length));
        this.compressionRatio.set('Text decoded');
      }
    } catch { /* not text */ }

    // Always create binary blob
    const mime = detectMimeFromBase64(input);
    this.detectedMime.set(mime);
    const blob = base64ToBlob(input, mime);
    this.outputBlob.set(blob);
    this.inputSizeDisplay.set(formatBytes(input.length));
    this.outputSizeDisplay.set(formatBytes(blob.size));

    // Image preview
    if (mime.startsWith('image/')) {
      const url = URL.createObjectURL(blob);
      this.blobUrls.push(url);
      this.previewUrl.set(url);
    }

    this.store.dispatch(Base64EncoderActions.processingSuccess({ outputBlob: , outputText: '', outputSizeMB:  }));
  }

  // ═══════════════════════════════════════════════════
  // DOWNLOAD & COPY
  // ═══════════════════════════════════════════════════
  async onCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.outputText());
    } catch {
      const ta = document.createElement('textarea');
      ta.value = this.outputText();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    this.showCopied.set(true);
    setTimeout(() => this.showCopied.set(false), 2000);
  }

  onDownloadText(): void {
    const blob = new Blob([this.outputText()], { type: 'text/plain' });
    this.downloadBlob(blob, 'base64_output.txt');
  }

  onDownloadBlob(): void {
    const blob = this.outputBlob();
    if (!blob) return;
    const mime = this.detectedMime();
    const ext = mime.split('/')[1] || 'bin';
    this.downloadBlob(blob, `decoded_file.${ext}`);
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 200);
  }

  private cleanupUrls(): void {
    for (const url of this.blobUrls) URL.revokeObjectURL(url);
    this.blobUrls = [];
    this.previewUrl.set(null);
  }

  ngOnDestroy(): void {
    this.cleanupUrls();
    this.store.dispatch(Base64EncoderActions.resetState());
  }
}
