// generate-shared.mjs — Creates /src/app/modules/video/shared/ + feature 01-trimmer
import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

function w(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');
  console.log('CREATED:', path);
}

const base = 'src/app/modules/video';

// =====================================================================
// SHARED TYPES
// =====================================================================
w(`${base}/shared/types/video.types.ts`, `export type ProcessingStatus = 'idle' | 'loading' | 'processing' | 'done' | 'error';
export type TaskStatus = 'queued' | 'processing' | 'done' | 'error' | 'cancelled';
export type VideoOperation = 'trim' | 'merge' | 'convert' | 'compress' | 'stabilize' | 'reverse' | 'speed' | 'loop' | 'flip' | 'crop' | 'colorGrade' | 'subtitle' | 'thumbnail' | 'watermark' | 'extractAudio' | 'replaceAudio' | 'denoise' | 'interpolate' | 'metadata' | 'split' | 'record' | 'toGif' | 'pip' | 'blur' | 'transition' | 'compare' | 'slideshow' | 'batch' | 'analyse' | 'upscale';

export type VideoErrorCode =
  | 'FILE_TOO_LARGE' | 'INVALID_FILE_TYPE' | 'FILE_CORRUPTED' | 'FILE_READ_ERROR'
  | 'FFMPEG_LOAD_FAILED' | 'FFMPEG_TIMEOUT' | 'FFMPEG_COMMAND_FAILED' | 'FFMPEG_OOM' | 'FFMPEG_NO_STREAMS'
  | 'WORKER_INIT_FAILED' | 'WORKER_CRASHED' | 'WORKER_TRANSFER_FAILED'
  | 'INVALID_TIME_RANGE' | 'INVALID_DIMENSIONS' | 'INVALID_SPEED' | 'INVALID_CRF'
  | 'NO_AUDIO_STREAM' | 'SAB_NOT_SUPPORTED' | 'WEBGPU_NOT_AVAILABLE' | 'OPFS_NOT_AVAILABLE'
  | 'MEDIA_RECORDER_FAILED' | 'UNKNOWN_ERROR';

export interface VideoMeta {
  filename: string; fileSizeMB: number; duration: number;
  width: number; height: number; fps: number;
  codec: string; audioCodec: string | null;
  audioBitrate: number; videoBitrate: number;
  hasAudio: boolean; aspectRatio: string;
}

export interface BaseVideoState {
  status: ProcessingStatus; progress: number; outputBlob: Blob | null;
  outputSizeMB: number | null; errorCode: VideoErrorCode | null;
  errorMessage: string | null; retryable: boolean;
}

export interface WorkerMessage<T = unknown> {
  type: 'progress' | 'complete' | 'error' | 'log';
  value?: number; data?: T; message?: string; errorCode?: VideoErrorCode;
}

export interface ExportConfig {
  format: 'mp4' | 'webm' | 'mov' | 'avi' | 'mkv' | 'gif' | 'wav' | 'mp3';
  codec: string; quality: 'fast' | 'balanced' | 'best'; filename: string;
}
`);

// =====================================================================
// SHARED ERRORS
// =====================================================================
w(`${base}/shared/errors/video.errors.ts`, `import type { VideoErrorCode } from '../types/video.types';

export const VideoErrorMessages: Record<VideoErrorCode, string> = {
  FILE_TOO_LARGE: 'File is too large. Maximum supported size is 2GB.',
  INVALID_FILE_TYPE: 'Please upload a valid video file (MP4, WebM, MOV, AVI, MKV).',
  FILE_CORRUPTED: 'This file appears to be corrupted or unreadable.',
  FILE_READ_ERROR: 'Failed to read file. Please try again.',
  FFMPEG_LOAD_FAILED: 'Video engine failed to load. Please refresh the page.',
  FFMPEG_TIMEOUT: 'Operation timed out after 15 seconds. Try with a shorter clip.',
  FFMPEG_COMMAND_FAILED: 'Processing failed. The video format may not be supported.',
  FFMPEG_OOM: 'Not enough memory. Try with a smaller file.',
  FFMPEG_NO_STREAMS: 'No video or audio streams found in this file.',
  WORKER_INIT_FAILED: 'Processing engine could not start. Please refresh.',
  WORKER_CRASHED: 'Processing engine crashed unexpectedly. Please try again.',
  WORKER_TRANSFER_FAILED: 'Data transfer failed. Please try again.',
  INVALID_TIME_RANGE: 'End time must be after start time.',
  INVALID_DIMENSIONS: 'Width and height must be greater than 0.',
  INVALID_SPEED: 'Speed must be between 0.25x and 4.0x.',
  INVALID_CRF: 'Quality value (CRF) must be between 0 and 51.',
  NO_AUDIO_STREAM: 'This video has no audio track.',
  SAB_NOT_SUPPORTED: 'Your browser does not support SharedArrayBuffer. Enable COOP/COEP headers.',
  WEBGPU_NOT_AVAILABLE: 'WebGPU is not available. AI Upscaler requires a modern browser.',
  OPFS_NOT_AVAILABLE: 'File system API not available. Try Chrome or Edge.',
  MEDIA_RECORDER_FAILED: 'Screen capture permission was denied.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

const RETRYABLE_CODES = new Set<VideoErrorCode>(['FFMPEG_TIMEOUT','FFMPEG_OOM','WORKER_CRASHED','FILE_READ_ERROR','WORKER_TRANSFER_FAILED']);

export function getVideoError(code: VideoErrorCode): { code: VideoErrorCode; message: string; retryable: boolean } {
  return { code, message: VideoErrorMessages[code], retryable: RETRYABLE_CODES.has(code) };
}
`);

// =====================================================================
// SHARED SCHEMAS
// =====================================================================
w(`${base}/shared/schemas/video.schemas.ts`, `import { z } from 'zod';

export const VideoFileSchema = z.instanceof(File)
  .refine(f => f.size <= 2_147_483_648, 'File is too large. Maximum size is 2GB.')
  .refine(f => f.type.startsWith('video/'), 'Please upload a valid video file');

export const TimestampSchema = z.number().nonnegative().finite();
export const ProgressSchema = z.number().min(0).max(100);
export const ExportFormatSchema = z.enum(['mp4', 'webm', 'mov', 'avi', 'mkv', 'gif']);
`);

// =====================================================================
// FFMPEG SERVICE
// =====================================================================
w(`${base}/shared/engine/ffmpeg.service.ts`, `import { Injectable, signal } from '@angular/core';
import type { VideoMeta } from '../types/video.types';

@Injectable({ providedIn: 'root' })
export class FFmpegService {
  private ffmpeg: unknown = null;
  private isLoaded = signal(false);
  private isLoading = signal(false);
  private loadPromise: Promise<void> | null = null;

  async load(): Promise<void> {
    if (this.isLoaded()) return;
    if (this.loadPromise) return this.loadPromise;
    this.loadPromise = this._doLoad();
    return this.loadPromise;
  }

  private async _doLoad(): Promise<void> {
    try {
      this.isLoading.set(true);
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      const { toBlobURL } = await import('@ffmpeg/util');
      const ff = new FFmpeg();
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
      await ff.load({
        coreURL: await toBlobURL(\`\${baseURL}/ffmpeg-core.js\`, 'text/javascript'),
        wasmURL: await toBlobURL(\`\${baseURL}/ffmpeg-core.wasm\`, 'application/wasm'),
      });
      this.ffmpeg = ff;
      this.isLoaded.set(true);
    } catch {
      this.loadPromise = null;
      throw new Error('FFMPEG_LOAD_FAILED');
    } finally {
      this.isLoading.set(false);
    }
  }

  async getMetadata(file: File): Promise<VideoMeta> {
    await this.load();
    const ff = this.ffmpeg as any;
    const { fetchFile } = await import('@ffmpeg/util');
    const inputName = \`meta_\${Date.now()}.mp4\`;
    try {
      ff.writeFile(inputName, await fetchFile(file));
      let output = '';
      ff.on('log', ({ message }: any) => { output += message + '\\n'; });
      try { await ff.exec(['-i', inputName, '-f', 'null', '/dev/null']); } catch { /* ffprobe always errors */ }
      return this._parseMetaFromLog(output, file);
    } finally {
      try { ff.deleteFile(inputName); } catch { /**/ }
    }
  }

  private _parseMetaFromLog(log: string, file: File): VideoMeta {
    const durMatch = log.match(/Duration:\\s*(\\d+):(\\d+):([\\d.]+)/);
    const duration = durMatch ? parseInt(durMatch[1])*3600 + parseInt(durMatch[2])*60 + parseFloat(durMatch[3]) : 0;
    const resMatch = log.match(/(\\d{2,5})x(\\d{2,5})/);
    const width = resMatch ? parseInt(resMatch[1]) : 0;
    const height = resMatch ? parseInt(resMatch[2]) : 0;
    const fpsMatch = log.match(/(\\d+(?:\\.\\d+)?)\\s*fps/);
    const fps = fpsMatch ? parseFloat(fpsMatch[1]) : 30;
    const videoCodecMatch = log.match(/Video:\\s*(\\w+)/);
    const codec = videoCodecMatch ? videoCodecMatch[1] : 'unknown';
    const audioCodecMatch = log.match(/Audio:\\s*(\\w+)/);
    const audioCodec = audioCodecMatch ? audioCodecMatch[1] : null;
    const bitrateMatch = log.match(/bitrate:\\s*(\\d+)\\s*kb\\/s/);
    const videoBitrate = bitrateMatch ? parseInt(bitrateMatch[1]) : 0;
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const g = (width && height) ? gcd(width, height) : 1;
    const aspectRatio = (width && height) ? \`\${width/g}:\${height/g}\` : '16:9';
    return {
      filename: file.name, fileSizeMB: file.size/1_048_576, duration, width, height, fps,
      codec, audioCodec, audioBitrate: 128, videoBitrate, hasAudio: !!audioCodec, aspectRatio
    };
  }

  async runCommand(args: string[], onProgress?: (p: number) => void): Promise<Uint8Array> {
    await this.load();
    const ff = this.ffmpeg as any;
    if (onProgress) ff.on('progress', ({ progress }: any) => { onProgress(Math.min(Math.round(progress*100), 99)); });
    await ff.exec(args);
    const outputName = args[args.length - 1];
    try { return await ff.readFile(outputName) as Uint8Array; } catch { return new Uint8Array(0); }
  }

  deleteFile(name: string): void {
    if (!this.ffmpeg) return;
    try { (this.ffmpeg as any).deleteFile(name); } catch { /**/ }
  }

  isReady() { return this.isLoaded.asReadonly(); }
}
`);

// =====================================================================
// WORKER BRIDGE SERVICE
// =====================================================================
w(`${base}/shared/engine/worker-bridge.service.ts`, `import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import type { WorkerMessage } from '../types/video.types';

@Injectable({ providedIn: 'root' })
export class WorkerBridgeService {
  process<TConfig, TOutput>(workerFactory: () => Worker, config: TConfig): Observable<WorkerMessage<TOutput>> {
    const subject = new Subject<WorkerMessage<TOutput>>();
    let worker: Worker | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let done = false;

    const cleanup = () => {
      done = true;
      if (timeoutId !== null) clearTimeout(timeoutId);
      if (worker) { try { worker.terminate(); } catch { /**/ } }
      worker = null;
    };

    try { worker = workerFactory(); }
    catch {
      subject.error({ type: 'error', errorCode: 'WORKER_INIT_FAILED', message: 'Worker could not be started.' });
      return subject.asObservable();
    }

    timeoutId = setTimeout(() => {
      if (!done) {
        cleanup();
        subject.next({ type: 'error', errorCode: 'FFMPEG_TIMEOUT', message: 'Operation timed out after 15 seconds.' });
        subject.complete();
      }
    }, 15_000);

    worker.onmessage = (event: MessageEvent<WorkerMessage<TOutput>>) => {
      const msg = event.data;
      subject.next(msg);
      if (msg.type === 'complete' || msg.type === 'error') { cleanup(); subject.complete(); }
    };

    worker.onerror = (err: ErrorEvent) => {
      if (!done) { cleanup(); subject.next({ type: 'error', errorCode: 'WORKER_CRASHED', message: err.message }); subject.complete(); }
    };

    worker.postMessage({ type: 'start', config });
    return subject.asObservable();
  }

  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 150);
  }
}
`);

// =====================================================================
// SHARED COMPONENTS
// =====================================================================
w(`${base}/shared/components/file-drop-zone/file-drop-zone.component.ts`, `import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { VideoErrorCode } from '../../types/video.types';

@Component({
  selector: 'app-file-drop-zone',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div
      class="relative flex flex-col items-center justify-center w-full min-h-[180px] rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer select-none"
      [class.border-cyan-400]="isDragOver()"
      [class.bg-cyan-500/5]="isDragOver()"
      [class.border-red-500]="errorMsg()"
      [class.border-green-500]="hasFile() && !errorMsg()"
      [class.border-white/20]="!isDragOver() && !hasFile() && !errorMsg()"
      [class.bg-white/3]="!isDragOver()"
      [class.opacity-50]="disabled"
      [class.pointer-events-none]="disabled"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave()"
      (drop)="onDrop($event)"
      (click)="fileInput.click()"
    >
      <input #fileInput type="file" [accept]="accept" [multiple]="multiple" class="hidden" (change)="onFileChange($event)" />

      @if (isValidating()) {
        <div class="flex flex-col items-center gap-3">
          <div class="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-sm text-white/60">Validating file...</p>
        </div>
      } @else if (hasFile()) {
        <div class="flex flex-col items-center gap-2 px-6 text-center">
          <div class="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <p class="text-sm font-medium text-white">{{ selectedFileName() }}</p>
          <p class="text-xs text-white/50">{{ selectedFileSize() }}</p>
        </div>
      } @else if (errorMsg()) {
        <div class="flex flex-col items-center gap-2 px-6 text-center">
          <div class="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <p class="text-sm text-red-400">{{ errorMsg() }}</p>
          <p class="text-xs text-white/50">Click to try again</p>
        </div>
      } @else {
        <div class="flex flex-col items-center gap-3 px-6 text-center pointer-events-none">
          <div class="w-14 h-14 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <svg class="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-white">{{ label }}</p>
            <p class="text-xs text-white/40 mt-1">Max {{ maxSizeMB >= 1024 ? (maxSizeMB / 1024).toFixed(0) + 'GB' : maxSizeMB + 'MB' }}</p>
          </div>
        </div>
      }
    </div>
  \`
})
export class FileDropZoneComponent {
  @Input() accept = 'video/*';
  @Input() multiple = false;
  @Input() maxSizeMB = 2048;
  @Input() disabled = false;
  @Input() label = 'Drop video file here or click to browse';
  @Output() filesSelected = new EventEmitter<File[]>();
  @Output() validationError = new EventEmitter<VideoErrorCode>();

  isDragOver = signal(false);
  isValidating = signal(false);
  hasFile = signal(false);
  selectedFileName = signal('');
  selectedFileSize = signal('');
  errorMsg = signal('');

  onDragOver(event: DragEvent) { event.preventDefault(); event.stopPropagation(); this.isDragOver.set(true); }
  onDragLeave() { this.isDragOver.set(false); }
  onDrop(event: DragEvent) {
    event.preventDefault(); event.stopPropagation();
    this.isDragOver.set(false);
    const files = Array.from(event.dataTransfer?.files ?? []);
    if (files.length) this.processFiles(files);
  }
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length) this.processFiles(files);
    input.value = '';
  }
  private processFiles(files: File[]) {
    this.isValidating.set(true);
    this.errorMsg.set('');
    const selected = this.multiple ? files : [files[0]];
    const maxBytes = this.maxSizeMB * 1_048_576;
    for (const file of selected) {
      if (file.size > maxBytes) {
        this.isValidating.set(false);
        this.errorMsg.set('File too large. Max ' + (this.maxSizeMB >= 1024 ? (this.maxSizeMB/1024)+'GB' : this.maxSizeMB+'MB'));
        this.validationError.emit('FILE_TOO_LARGE');
        return;
      }
    }
    this.isValidating.set(false);
    this.hasFile.set(true);
    this.selectedFileName.set(selected.length === 1 ? selected[0].name : \`\${selected.length} files selected\`);
    const totalMB = selected.reduce((s, f) => s + f.size, 0) / 1_048_576;
    this.selectedFileSize.set(\`\${totalMB.toFixed(2)} MB\`);
    this.filesSelected.emit(selected);
  }
}
`);

w(`${base}/shared/components/progress-ring/progress-ring.component.ts`, `import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-ring',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="flex flex-col items-center gap-2">
      <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 100 100">
        <circle cx="50" cy="50" [attr.r]="radius" fill="none" stroke="rgba(255,255,255,0.08)" [attr.stroke-width]="strokeWidth"/>
        <circle cx="50" cy="50" [attr.r]="radius" fill="none" [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
          stroke-linecap="round" [attr.stroke-dasharray]="circumference" [attr.stroke-dashoffset]="dashOffset"
          transform="rotate(-90 50 50)" style="transition: stroke-dashoffset 0.4s ease"
          [style.filter]="'drop-shadow(0 0 6px ' + color + ')'"/>
        <text x="50" y="50" text-anchor="middle" dominant-baseline="central"
          fill="white" font-size="18" font-weight="700" font-family="monospace">{{ progress }}%</text>
      </svg>
      @if (label) { <p class="text-xs text-white/60 text-center">{{ label }}</p> }
    </div>
  \`
})
export class ProgressRingComponent {
  @Input() progress = 0;
  @Input() size = 80;
  @Input() strokeWidth = 6;
  @Input() color = '#00f5ff';
  @Input() label = '';
  get radius() { return (100 - this.strokeWidth * 2) / 2; }
  get circumference() { return 2 * Math.PI * this.radius; }
  get dashOffset() { return this.circumference * (1 - this.progress / 100); }
}
`);

w(`${base}/shared/components/video-preview/video-preview.component.ts`, `import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input,
  OnChanges, OnDestroy, Output, SimpleChanges, ViewChild, signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { VideoMeta } from '../../types/video.types';

@Component({
  selector: 'app-video-preview',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="flex flex-col gap-3">
      <div class="relative rounded-xl overflow-hidden bg-black/40 border border-white/10" style="aspect-ratio:16/9">
        @if (isLoading()) {
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
        @if (objectUrl()) {
          <video #videoEl class="w-full h-full object-contain"
            [src]="objectUrl()" [controls]="showControls" [autoplay]="autoPlay" muted
            (loadedmetadata)="onMetadataLoad()"
            (loadstart)="isLoading.set(true)"
            (canplay)="isLoading.set(false)">
          </video>
        }
      </div>
    </div>
  \`
})
export class VideoPreviewComponent implements OnChanges, OnDestroy {
  @Input() file: File | null = null;
  @Input() currentTime = 0;
  @Input() showControls = true;
  @Input() autoPlay = false;
  @Output() durationDetected = new EventEmitter<number>();
  @Output() metadataLoaded = new EventEmitter<VideoMeta>();

  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;

  objectUrl = signal<string | null>(null);
  isLoading = signal(false);
  private _prevUrl: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['file'] && this.file) {
      if (this._prevUrl) URL.revokeObjectURL(this._prevUrl);
      const url = URL.createObjectURL(this.file);
      this._prevUrl = url;
      this.objectUrl.set(url);
      this.isLoading.set(true);
    }
  }

  ngOnDestroy() {
    if (this._prevUrl) URL.revokeObjectURL(this._prevUrl);
  }

  onMetadataLoad() {
    const el = this.videoEl?.nativeElement;
    if (el) this.durationDetected.emit(el.duration);
    this.isLoading.set(false);
  }
}
`);

w(`${base}/shared/components/export-panel/export-panel.component.ts`, `import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkerBridgeService } from '../../engine/worker-bridge.service';
import type { ExportConfig } from '../../types/video.types';

@Component({
  selector: 'app-export-panel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="flex flex-col gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
      <div class="flex flex-wrap gap-2">
        @for (fmt of availableFormats; track fmt) {
          <button (click)="selectedFormat.set(fmt)"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all"
            [class.bg-cyan-500]="selectedFormat() === fmt"
            [class.text-black]="selectedFormat() === fmt"
            [class.bg-white/10]="selectedFormat() !== fmt"
            [class.text-white/70]="selectedFormat() !== fmt">{{ fmt }}</button>
        }
      </div>
      <div class="flex items-center gap-2">
        <input type="text" [value]="customFilename() || defaultFilename"
          (input)="onFilenameInput($event)"
          placeholder="Output filename"
          class="flex-1 px-3 py-2 text-sm bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"/>
        <span class="text-sm text-white/40">.{{ selectedFormat() }}</span>
      </div>
      @if (outputSizeMB !== null) {
        <p class="text-sm text-white/60">Output size: <span class="text-white font-medium">{{ outputSizeMB.toFixed(2) }} MB</span></p>
      }
      <button [disabled]="!outputBlob" (click)="onDownload()"
        class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2"
        [class.bg-gradient-to-r]="!!outputBlob" [class.from-cyan-500]="!!outputBlob" [class.to-cyan-400]="!!outputBlob"
        [class.text-black]="!!outputBlob" [class.bg-white/5]="!outputBlob" [class.text-white/30]="!outputBlob"
        [class.cursor-not-allowed]="!outputBlob">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        {{ outputBlob ? 'Download ' + selectedFormat().toUpperCase() : 'No output yet' }}
      </button>
    </div>
  \`
})
export class ExportPanelComponent {
  @Input() outputBlob: Blob | null = null;
  @Input() availableFormats: string[] = ['mp4', 'webm', 'mov'];
  @Input() defaultFilename = 'omni_output';
  @Input() outputSizeMB: number | null = null;
  @Output() download = new EventEmitter<ExportConfig>();

  selectedFormat = signal('mp4');
  customFilename = signal('');

  constructor(private bridge: WorkerBridgeService) {}

  onFilenameInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.customFilename.set(val);
  }

  onDownload() {
    if (!this.outputBlob) return;
    const config: ExportConfig = {
      format: this.selectedFormat() as ExportConfig['format'],
      codec: '', quality: 'balanced',
      filename: (this.customFilename() || this.defaultFilename) + '.' + this.selectedFormat()
    };
    this.download.emit(config);
    this.bridge.downloadBlob(this.outputBlob, config.filename);
  }
}
`);

// =====================================================================
// SHARED INDEX BARREL
// =====================================================================
w(`${base}/shared/index.ts`, `export * from './types/video.types';
export * from './errors/video.errors';
export * from './schemas/video.schemas';
export { FFmpegService } from './engine/ffmpeg.service';
export { WorkerBridgeService } from './engine/worker-bridge.service';
export { FileDropZoneComponent } from './components/file-drop-zone/file-drop-zone.component';
export { VideoPreviewComponent } from './components/video-preview/video-preview.component';
export { ProgressRingComponent } from './components/progress-ring/progress-ring.component';
export { ExportPanelComponent } from './components/export-panel/export-panel.component';
`);

// =====================================================================
// FEATURE 01 — Trimmer (the only one not created by Node script)
// =====================================================================
w(`${base}/01-trimmer/trimmer.store.ts`, `import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface TrimmerState {
  inputFile: File | null; videoMeta: VideoMeta | null;
  startTime: number; endTime: number; outputFormat: 'mp4' | 'webm' | 'mov';
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number; outputBlob: Blob | null; outputSizeMB: number | null;
  errorCode: VideoErrorCode | null; errorMessage: string | null; retryable: boolean;
}
const init: TrimmerState = {
  inputFile: null, videoMeta: null, startTime: 0, endTime: 0, outputFormat: 'mp4',
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const TrimmerActions = {
  loadFile: createAction('[Trimmer] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Trimmer] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Trimmer] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[Trimmer] Update Config', props<Partial<Pick<TrimmerState,'startTime'|'endTime'|'outputFormat'>>>()),
  startProcessing: createAction('[Trimmer] Start'),
  updateProgress: createAction('[Trimmer] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Trimmer] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Trimmer] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[Trimmer] Download'),
  resetState: createAction('[Trimmer] Reset'),
};
export const trimmerFeature = createFeature({
  name: 'trimmer',
  reducer: createReducer(init,
    on(TrimmerActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(TrimmerActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, endTime: a.meta.duration, status: 'idle' as const })),
    on(TrimmerActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(TrimmerActions.updateConfig, (s, a) => ({ ...s, ...a })),
    on(TrimmerActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(TrimmerActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(TrimmerActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(TrimmerActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(TrimmerActions.resetState, () => init),
  )
});
export const { selectTrimmerState, selectStatus, selectProgress } = trimmerFeature;
export const selectTrimmerCanProcess = createSelector(selectTrimmerState, s => !!s.inputFile && s.status === 'idle' && !!s.videoMeta);
export const selectTrimmerIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
`);

w(`${base}/01-trimmer/trimmer.service.ts`, `import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TrimmerService {
  buildArgs(inputName: string, startTime: number, endTime: number, outputFormat: string): string[] {
    return ['-ss', String(startTime), '-i', inputName, '-t', String(endTime - startTime), '-c', 'copy', \`output.\${outputFormat}\`];
  }
  validate(start: number, end: number): string | null {
    if (end <= start) return 'End time must be after start time';
    if ((end - start) < 0.1) return 'Clip must be at least 0.1 seconds';
    return null;
  }
  formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = (s % 60).toFixed(1).padStart(4, '0');
    return \`\${m}:\${sec}\`;
  }
}
`);

w(`${base}/01-trimmer/trimmer.worker.ts`, `/// <reference lib="webworker" />
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

async function loadFFmpeg() {
  if (ffmpeg) return;
  ffmpeg = new FFmpeg();
  const base = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(\`\${base}/ffmpeg-core.js\`, 'text/javascript'),
    wasmURL: await toBlobURL(\`\${base}/ffmpeg-core.wasm\`, 'application/wasm'),
  });
}

addEventListener('message', async (e: MessageEvent) => {
  const { config } = e.data;
  try {
    await loadFFmpeg();
    if (!ffmpeg) throw new Error('FFmpeg not loaded');
    ffmpeg.on('progress', ({ progress }: { progress: number }) => {
      postMessage({ type: 'progress', value: Math.round(progress * 100) });
    });
    const ext = config.outputFormat ?? 'mp4';
    const inputName = \`in_\${Date.now()}.\${config.file.name.split('.').pop() ?? 'mp4'}\`;
    const outputName = \`out_\${Date.now()}.\${ext}\`;
    const inputData = await fetchFile(config.file);
    ffmpeg.writeFile(inputName, inputData);
    await ffmpeg.exec(['-ss', String(config.startTime), '-i', inputName, '-t', String(config.endTime - config.startTime), '-c', 'copy', outputName]);
    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data], { type: \`video/\${ext}\` });
    ffmpeg.deleteFile(inputName);
    ffmpeg.deleteFile(outputName);
    postMessage({ type: 'complete', data: blob });
  } catch (err: unknown) {
    postMessage({ type: 'error', errorCode: 'FFMPEG_COMMAND_FAILED', message: String(err) });
  }
});
`);

w(`${base}/01-trimmer/trimmer.component.ts`, `import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { TrimmerActions, selectTrimmerState, selectTrimmerIsLoading, selectTrimmerCanProcess } from './trimmer.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-trimmer',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
          ✂️ Video Trimmer
        </h1>
        <p class="text-white/50 text-sm">Precision frame-level trimming powered by FFmpeg WASM</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here or click to browse" (filesSelected)="onFileSelected(\$event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-cyan-400">{{ meta.duration | number:'1.0-1' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Resolution</p>
                  <p class="text-sm font-semibold text-white">{{ meta.width }}×{{ meta.height }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">FPS</p>
                  <p class="text-sm font-semibold text-white">{{ meta.fps | number:'1.0-1' }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <div class="flex-1">
                  <label class="text-xs text-white/40">Start (s)</label>
                  <input type="number" min="0" [max]="meta.duration" step="0.1"
                    [value]="(state$ | async)?.startTime ?? 0"
                    (change)="onStartChange(+($any($event.target)).value)"
                    class="w-full px-2 py-1 mt-1 text-sm bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400">
                </div>
                <div class="flex-1">
                  <label class="text-xs text-white/40">End (s)</label>
                  <input type="number" min="0" [max]="meta.duration" step="0.1"
                    [value]="(state$ | async)?.endTime ?? meta.duration"
                    (change)="onEndChange(+($any($event.target)).value)"
                    class="w-full px-2 py-1 mt-1 text-sm bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400">
                </div>
              </div>
              <button
                [disabled]="!(canProcess$ | async) || (isLoading$ | async)"
                (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                } @else { ✂️ Trim Video }
              </button>
            </div>
          }

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              ⚠️ {{ (state$ | async)?.errorMessage }}
            </div>
          }
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) {
            <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" />
          }
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8">
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Trimming video..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_trimmed" />
          }
        </div>
      </div>
    </div>
  \`
})
export class TrimmerComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state$ = this.store.select(selectTrimmerState);
  isLoading$ = this.store.select(selectTrimmerIsLoading);
  canProcess$ = this.store.select(selectTrimmerCanProcess);

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(TrimmerActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(TrimmerActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(TrimmerActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' }));
    }
  }

  onStartChange(value: number) { this.store.dispatch(TrimmerActions.updateConfig({ startTime: value })); }
  onEndChange(value: number) { this.store.dispatch(TrimmerActions.updateConfig({ endTime: value })); }

  onProcess() {
    this.store.dispatch(TrimmerActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile || !state.videoMeta) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./trimmer.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, startTime: state.startTime, endTime: state.endTime, outputFormat: state.outputFormat }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(TrimmerActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) {
          const blob = msg.data as Blob;
          this.store.dispatch(TrimmerActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1_048_576 }));
        } else if (msg.type === 'error') {
          this.store.dispatch(TrimmerActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Processing failed' }));
        }
      });
    }).unsubscribe();
  }

  ngOnDestroy() { this.store.dispatch(TrimmerActions.resetState()); }
}
`);

w(`${base}/01-trimmer/index.ts`, `export { TrimmerComponent } from './trimmer.component';
export { TrimmerService } from './trimmer.service';
export * from './trimmer.store';
`);

console.log('\\n✅ All shared infrastructure + Feature 01 Trimmer created successfully!');
