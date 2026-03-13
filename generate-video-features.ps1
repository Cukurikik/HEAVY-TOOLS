# PowerShell script to generate all 30 Video Tool feature files
# Run from: c:\Users\IKYY\Downloads\HEAVY-TOOLS

$base = "src\app\modules\video"

# A helper to create a directory and write a file
function WriteFile($path, $content) {
    $dir = Split-Path $path -Parent
    if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    $content | Out-File -FilePath $path -Encoding utf8NoBOM -Force
    Write-Host "  CREATED: $path"
}

# ================================================================
# FEATURE 01 — VIDEO TRIMMER
# ================================================================
$f = "$base\01-trimmer"

WriteFile "$f\trimmer.store.ts" @'
import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface TrimmerState {
  inputFile: File | null; videoMeta: VideoMeta | null;
  startTime: number; endTime: number;
  outputFormat: 'mp4' | 'webm' | 'mov';
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number; outputBlob: Blob | null;
  outputSizeMB: number | null; errorCode: VideoErrorCode | null;
  errorMessage: string | null; retryable: boolean;
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
export const { selectTrimmerState, selectStatus, selectProgress, selectOutputBlob, selectVideoMeta, selectErrorMessage } = trimmerFeature;
export const selectTrimmerCanProcess = createSelector(selectTrimmerState, s => !!s.inputFile && s.status === 'idle' && !!s.videoMeta);
export const selectTrimmerIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
'@

WriteFile "$f\trimmer.service.ts" @'
import { Injectable } from '@angular/core';
export interface TrimRange { startTime: number; endTime: number }
@Injectable({ providedIn: 'root' })
export class TrimmerService {
  buildArgs(inputName: string, startTime: number, endTime: number, outputFormat: string): string[] {
    const duration = endTime - startTime;
    return ['-ss', String(startTime), '-i', inputName, '-t', String(duration), '-c', 'copy', `output.${outputFormat}`];
  }
  validate(start: number, end: number): string | null {
    if (end <= start) return 'End time must be after start time';
    if ((end - start) < 0.1) return 'Clip must be at least 0.1 seconds';
    return null;
  }
  formatTime(s: number): string {
    const h = Math.floor(s/3600).toString().padStart(2,'0');
    const m = Math.floor((s%3600)/60).toString().padStart(2,'0');
    const sec = (s%60).toFixed(3).padStart(6,'0');
    return `${h}:${m}:${sec}`;
  }
}
'@

WriteFile "$f\trimmer.worker.ts" @'
/// <reference lib="webworker" />
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

async function loadFFmpeg() {
  if (ffmpeg) return;
  ffmpeg = new FFmpeg();
  const base = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
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

    const inputData = await fetchFile(config.file);
    const ext = config.outputFormat ?? 'mp4';
    const inputName = `in_${Date.now()}.${config.file.name.split('.').pop() ?? 'mp4'}`;
    const outputName = `out_${Date.now()}.${ext}`;

    ffmpeg.writeFile(inputName, inputData);
    await ffmpeg.exec(['-ss', String(config.startTime), '-i', inputName, '-t', String(config.endTime - config.startTime), '-c', 'copy', outputName]);

    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data], { type: `video/${ext}` });
    ffmpeg.deleteFile(inputName);
    ffmpeg.deleteFile(outputName);

    postMessage({ type: 'complete', data: blob });
  } catch (err: unknown) {
    postMessage({ type: 'error', errorCode: 'FFMPEG_COMMAND_FAILED', message: String(err) });
  }
});
'@

WriteFile "$f\trimmer.component.ts" @'
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
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
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
          ✂️ Video Trimmer
        </h1>
        <p class="text-white/50 text-sm">Precision frame-level trimming powered by FFmpeg WASM</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left: Input & Controls -->
        <div class="space-y-4">
          <app-file-drop-zone
            accept="video/*"
            label="Drop video file here or click to browse"
            (filesSelected)="onFileSelected($event)"
          />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-cyan-400">{{ formatTime(meta.duration) }}</p>
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

              <!-- Timeline scrubber -->
              <div class="space-y-2">
                <div class="flex items-center justify-between text-xs text-white/50">
                  <span>Start: {{ formatTime((state$ | async)?.startTime ?? 0) }}</span>
                  <span>End: {{ formatTime((state$ | async)?.endTime ?? meta.duration) }}</span>
                </div>
                <div class="relative h-8 flex items-center">
                  <div class="absolute inset-x-0 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div class="h-full bg-cyan-500/50 rounded-full"
                         [style.margin-left.%]="((state$ | async)?.startTime ?? 0) / meta.duration * 100"
                         [style.margin-right.%]="(1 - ((state$ | async)?.endTime ?? meta.duration) / meta.duration) * 100">
                    </div>
                  </div>
                  <!-- Start handle -->
                  <input type="range" min="0" [max]="meta.duration" step="0.1"
                    [value]="(state$ | async)?.startTime ?? 0"
                    (input)="onStartChange(+$any($event.target).value)"
                    class="absolute inset-x-0 h-8 w-full opacity-0 cursor-pointer z-10">
                </div>
                <div class="flex gap-2">
                  <div class="flex-1">
                    <label class="text-xs text-white/40">Start (s)</label>
                    <input type="number" min="0" [max]="meta.duration" step="0.1"
                      [value]="(state$ | async)?.startTime ?? 0"
                      (change)="onStartChange(+$any($event.target).value)"
                      class="w-full px-2 py-1 mt-1 text-sm bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400">
                  </div>
                  <div class="flex-1">
                    <label class="text-xs text-white/40">End (s)</label>
                    <input type="number" min="0" [max]="meta.duration" step="0.1"
                      [value]="(state$ | async)?.endTime ?? meta.duration"
                      (change)="onEndChange(+$any($event.target).value)"
                      class="w-full px-2 py-1 mt-1 text-sm bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400">
                  </div>
                </div>
              </div>

              <!-- Process button -->
              <button
                [disabled]="!(canProcess$ | async) || (isLoading$ | async)"
                (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2"
                [class.bg-gradient-to-r]="(canProcess$ | async) && !(isLoading$ | async)"
                [class.from-cyan-500]="(canProcess$ | async) && !(isLoading$ | async)"
                [class.to-blue-500]="(canProcess$ | async) && !(isLoading$ | async)"
                [class.text-black]="(canProcess$ | async) && !(isLoading$ | async)"
                [class.bg-white/5]="!(canProcess$ | async) || (isLoading$ | async)"
                [class.text-white/30]="!(canProcess$ | async) || (isLoading$ | async)"
              >
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                } @else {
                  ✂️ Trim Video
                }
              </button>
            </div>
          }

          <!-- Error display -->
          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              ⚠️ {{ (state$ | async)?.errorMessage }}
            </div>
          }
        </div>

        <!-- Right: Preview & Output -->
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) {
            <app-video-preview
              [file]="(state$ | async)?.inputFile ?? null"
              [showControls]="true"
            />
          }

          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8">
              <app-progress-ring
                [progress]="(state$ | async)?.progress ?? 0"
                label="Trimming video..."
                [size]="120"
              />
            </div>
          }

          @if ((state$ | async)?.status === 'done') {
            <app-export-panel
              [outputBlob]="(state$ | async)?.outputBlob ?? null"
              [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              [availableFormats]="['mp4', 'webm', 'mov']"
              defaultFilename="omni_trimmed"
            />
          }
        </div>
      </div>
    </div>
  `,
})
export class TrimmerComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state$ = this.store.select(selectTrimmerState);
  isLoading$ = this.store.select(selectTrimmerIsLoading);
  canProcess$ = this.store.select(selectTrimmerCanProcess);

  private worker: Worker | null = null;

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

  onStartChange(value: number) {
    this.store.dispatch(TrimmerActions.updateConfig({ startTime: value }));
  }

  onEndChange(value: number) {
    this.store.dispatch(TrimmerActions.updateConfig({ endTime: value }));
  }

  onProcess() {
    this.store.dispatch(TrimmerActions.startProcessing());
    // Get current state snapshot
    this.state$.subscribe(state => {
      if (!state.inputFile || !state.videoMeta) return;

      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./trimmer.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, startTime: state.startTime, endTime: state.endTime, outputFormat: state.outputFormat }
      ).subscribe(msg => {
        if (msg.type === 'progress') {
          this.store.dispatch(TrimmerActions.updateProgress({ progress: msg.value ?? 0 }));
        } else if (msg.type === 'complete' && msg.data) {
          const blob = msg.data as Blob;
          this.store.dispatch(TrimmerActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1_048_576 }));
        } else if (msg.type === 'error') {
          this.store.dispatch(TrimmerActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Unknown error' }));
        }
      });
    }).unsubscribe();
  }

  formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = (s % 60).toFixed(1).padStart(4, '0');
    return `${m}:${sec}`;
  }

  ngOnDestroy() {
    this.store.dispatch(TrimmerActions.resetState());
  }
}
'@

WriteFile "$f\index.ts" @'
export { TrimmerComponent } from './trimmer.component';
export { TrimmerService } from './trimmer.service';
export * from './trimmer.store';
'@

Write-Host "Feature 01 (Trimmer) created."

# ================================================================
# A GENERIC TEMPLATE FUNCTION for features 02-30
# Creates: component.ts, service.ts, store.ts, worker.ts, index.ts
# ================================================================

function CreateVideoFeature(
    [string]$num,
    [string]$folderName,
    [string]$className,   # e.g. Merger
    [string]$varName,     # e.g. merger
    [string]$route,       # e.g. /video/merger
    [string]$title,       # display title
    [string]$emoji,
    [string]$desc,
    [string]$workerArgs,  # the ffmpeg command string representation
    [string]$workerOutput, # output filename extension
    [string[]]$extraStateFields, # e.g. @("clips: ClipItem[]", "encodeMode: 'copy'|'reencode'")
    [string[]]$extraInitFields,  # e.g. @("clips: []", "encodeMode: 'copy'")
    [string[]]$extraInputs       # extra component inputs/controls description
) {
    $f = "$base\$folderName"
    $capVar = $varName.Substring(0,1).ToUpper() + $varName.Substring(1)

    # ---- store.ts ----
    $extraStateStr = if ($extraStateFields.Count -gt 0) { "`n  " + ($extraStateFields -join ";`n  ") + ";" } else { "" }
    $extraInitStr  = if ($extraInitFields.Count -gt 0)  { "`n  " + ($extraInitFields  -join ",`n  ") + "," } else { "" }

    $storeContent = @"
import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface ${className}State {
  inputFile: File | null;
  videoMeta: VideoMeta | null;$extraStateStr
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: ${className}State = {
  inputFile: null, videoMeta: null,$extraInitStr
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const ${className}Actions = {
  loadFile: createAction('[${className}] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[${className}] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[${className}] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[${className}] Update Config', props<{ config: Partial<${className}State> }>()),
  startProcessing: createAction('[${className}] Start'),
  updateProgress: createAction('[${className}] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[${className}] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[${className}] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[${className}] Download'),
  resetState: createAction('[${className}] Reset'),
};
export const ${varName}Feature = createFeature({
  name: '${varName}',
  reducer: createReducer(init,
    on(${className}Actions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(${className}Actions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(${className}Actions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(${className}Actions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(${className}Actions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(${className}Actions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(${className}Actions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(${className}Actions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(${className}Actions.resetState, () => init),
  )
});
export const { select${className}State, selectStatus, selectProgress, selectOutputBlob } = ${varName}Feature;
export const select${className}CanProcess = createSelector(select${className}State, s => !!s.inputFile && s.status === 'idle');
export const select${className}IsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
"@
    WriteFile "$f\${varName}.store.ts" $storeContent

    # ---- service.ts ----
    $serviceContent = @"
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ${className}Service {
  buildArgs(inputName: string, outputName: string, config: Record<string, unknown>): string[] {
    // TODO: Build FFmpeg args based on config
    return ['-i', inputName, outputName];
  }

  formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `+"`${m}:${sec}`+`';
  }
}
"@
    WriteFile "$f\${varName}.service.ts" $serviceContent

    # ---- worker.ts ----
    $workerContent = @"
/// <reference lib="webworker" />
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

async function loadFFmpeg() {
  if (ffmpeg) return;
  ffmpeg = new FFmpeg();
  const base = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(`+"`${base}/ffmpeg-core.js`"+`, 'text/javascript'),
    wasmURL: await toBlobURL(`+"`${base}/ffmpeg-core.wasm`"+`, 'application/wasm'),
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

    const ext = config.outputFormat ?? '${workerOutput}';
    const inputName = `+"`in_${Date.now()}.mp4`"+`;
    const outputName = `+"`out_${Date.now()}.`"+`+"`${ext}`"+``;
    const inputData = await fetchFile(config.file ?? config.inputFile);
    ffmpeg.writeFile(inputName, inputData);

    // ${workerArgs}
    await ffmpeg.exec(['-i', inputName, outputName]);

    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data], { type: `+"`video/${ext}`"+` });
    ffmpeg.deleteFile(inputName);
    ffmpeg.deleteFile(outputName);
    postMessage({ type: 'complete', data: blob });
  } catch (err: unknown) {
    postMessage({ type: 'error', errorCode: 'FFMPEG_COMMAND_FAILED', message: String(err) });
  }
});
"@
    WriteFile "$f\${varName}.worker.ts" $workerContent

    # ---- component.ts ----
    $componentContent = @"
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { ${className}Actions, select${className}State, select${className}IsLoading, select${className}CanProcess } from './${varName}.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-${varName}',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `+"`"+`
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
          ${emoji} ${title}
        </h1>
        <p class="text-white/50 text-sm">${desc}</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone
            accept="video/*"
            label="Drop video file here or click to browse"
            (filesSelected)="onFileSelected(`$`event)"
          />

          @if ((state` + '`' + ` | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-cyan-400">{{ meta.duration | number:'1.0-0' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Resolution</p>
                  <p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Codec</p>
                  <p class="text-sm font-semibold text-white">{{ meta.codec }}</p>
                </div>
              </div>

              <button
                [disabled]="!(canProcess` + '`' + ` | async) || (isLoading` + '`' + ` | async)"
                (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                @if (isLoading` + '`' + ` | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                } @else { ${emoji} Process ${title} }
              </button>
            </div>
          }

          @if ((state` + '`' + ` | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              ⚠️ {{ (state` + '`' + ` | async)?.errorMessage }}
            </div>
          }
        </div>

        <div class="space-y-4">
          @if ((state` + '`' + ` | async)?.inputFile) {
            <app-video-preview [file]="(state` + '`' + ` | async)?.inputFile ?? null" [showControls]="true" />
          }
          @if ((state` + '`' + ` | async)?.status === 'processing') {
            <div class="flex justify-center p-8">
              <app-progress-ring [progress]="(state` + '`' + ` | async)?.progress ?? 0" label="Processing..." [size]="120" />
            </div>
          }
          @if ((state` + '`' + ` | async)?.status === 'done') {
            <app-export-panel
              [outputBlob]="(state` + '`' + ` | async)?.outputBlob ?? null"
              [outputSizeMB]="(state` + '`' + ` | async)?.outputSizeMB ?? null"
              defaultFilename="omni_${varName}"
            />
          }
        </div>
      </div>
    </div>
  `+"`"+`
})
export class ${className}Component implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state` + '`' + ` = this.store.select(select${className}State);
  isLoading` + '`' + ` = this.store.select(select${className}IsLoading);
  canProcess` + '`' + ` = this.store.select(select${className}CanProcess);

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(${className}Actions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(${className}Actions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(${className}Actions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' }));
    }
  }

  onProcess() {
    this.store.dispatch(${className}Actions.startProcessing());
    this.state` + '`' + `.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./${varName}.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(${className}Actions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) {
          const blob = msg.data as Blob;
          this.store.dispatch(${className}Actions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1_048_576 }));
        } else if (msg.type === 'error') {
          this.store.dispatch(${className}Actions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Unknown error' }));
        }
      });
    }).unsubscribe();
  }

  ngOnDestroy() { this.store.dispatch(${className}Actions.resetState()); }
}
"@
    # Fix backtick issues
    $componentContent = $componentContent -replace '`\$`event', '`$event'
    $componentContent = $componentContent -replace "state``", 'state$'
    $componentContent = $componentContent -replace "isLoading``", 'isLoading$'
    $componentContent = $componentContent -replace "canProcess``", 'canProcess$'
    WriteFile "$f\${varName}.component.ts" $componentContent

    # ---- index.ts ----
    WriteFile "$f\index.ts" @"
export { ${className}Component } from './${varName}.component';
export { ${className}Service } from './${varName}.service';
export * from './${varName}.store';
"@
    Write-Host "Feature $num ($className) created."
}

# Now create all remaining features
CreateVideoFeature "02" "02-merger" "Merger" "merger" "/video/merger" "Video Merger" "🔗" "Concatenate multiple video files in custom order" "ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4" "mp4" @("clips: { id: string; file: File; duration: number }[]"; "encodeMode: 'copy' | 'reencode'"; "outputFormat: 'mp4' | 'webm'") @("clips: []"; "encodeMode: 'copy'"; "outputFormat: 'mp4'") @()

CreateVideoFeature "03" "03-converter" "Converter" "converter" "/video/converter" "Format Converter" "🔄" "Convert video between MP4, WebM, MOV, AVI, MKV, GIF" "ffmpeg -i input.mp4 -c:v libx264 output.mp4" "mp4" @("targetFormat: 'mp4'|'webm'|'mov'|'avi'|'mkv'|'gif'"; "codec: string"; "qualityPreset: 'fast'|'balanced'|'best'"; "estimatedSizeMB: number") @("targetFormat: 'mp4'"; "codec: 'libx264'"; "qualityPreset: 'balanced'"; "estimatedSizeMB: 0") @()

CreateVideoFeature "04" "04-compressor" "Compressor" "compressor" "/video/compressor" "Video Compressor" "📦" "Reduce video file size with target size or CRF quality control" "ffmpeg -crf 23 -preset medium output.mp4" "mp4" @("mode: 'targetSize'|'crf'"; "targetSizeMB: number"; "crfValue: number"; "originalSizeMB: number"; "estimatedOutputMB: number") @("mode: 'crf'"; "targetSizeMB: 50"; "crfValue: 23"; "originalSizeMB: 0"; "estimatedOutputMB: 0") @()

CreateVideoFeature "05" "05-stabilizer" "Stabilizer" "stabilizer" "/video/stabilizer" "Video Stabilizer" "🎯" "Remove camera shake using FFmpeg vidstab filter" "ffmpeg -i input.mp4 -vf vidstabtransform output.mp4" "mp4" @("shakiness: number"; "smoothing: number"; "cropMode: 'black'|'fill'"; "analysisComplete: boolean") @("shakiness: 5"; "smoothing: 30"; "cropMode: 'black'"; "analysisComplete: false") @()

CreateVideoFeature "06" "06-reverser" "Reverser" "reverser" "/video/reverser" "Video Reverser" "⏪" "Reverse video playback direction with optional audio reverse" "ffmpeg -i input.mp4 -vf reverse -af areverse output.mp4" "mp4" @("reverseAudio: boolean"; "durationWarning: boolean") @("reverseAudio: false"; "durationWarning: false") @()

CreateVideoFeature "07" "07-speed-controller" "SpeedController" "speedController" "/video/speed" "Speed Controller" "⚡" "Change video playback speed 0.25x to 4x with pitch-corrected audio" "ffmpeg -vf setpts output.mp4" "mp4" @("speed: number"; "audioMode: 'keep'|'mute'|'pitchCorrect'"; "originalDuration: number"; "newDuration: number") @("speed: 1"; "audioMode: 'pitchCorrect'"; "originalDuration: 0"; "newDuration: 0") @()

CreateVideoFeature "08" "08-looper" "Looper" "looper" "/video/looper" "Video Looper" "🔁" "Loop a video N times or to a target duration with crossfade" "ffmpeg -f concat -safe 0 -i list.txt output.mp4" "mp4" @("mode: 'count'|'duration'"; "loopCount: number"; "targetDuration: number"; "crossfade: boolean"; "crossfadeDuration: number"; "outputDuration: number") @("mode: 'count'"; "loopCount: 3"; "targetDuration: 60"; "crossfade: false"; "crossfadeDuration: 0.5"; "outputDuration: 0") @()

CreateVideoFeature "09" "09-flip-rotate" "FlipRotate" "flipRotate" "/video/flip-rotate" "Flip & Rotate" "🔄" "Flip video horizontally/vertically and rotate by arbitrary degrees" "ffmpeg -vf hflip,vflip output.mp4" "mp4" @("flipH: boolean"; "flipV: boolean"; "rotation: number") @("flipH: false"; "flipV: false"; "rotation: 0") @()

CreateVideoFeature "10" "10-crop-resize" "CropResize" "cropResize" "/video/crop-resize" "Smart Crop & Resize" "✂️" "Crop video to custom region or resize to preset dimensions" "ffmpeg -vf crop=w:h:x:y output.mp4" "mp4" @("mode: 'crop'|'resize'"; "cropRegion: { x: number; y: number; w: number; h: number }"; "targetWidth: number"; "targetHeight: number"; "lockAspectRatio: boolean"; "padMode: 'stretch'|'pad'|'crop-to-fit'") @("mode: 'resize'"; "cropRegion: { x: 0, y: 0, w: 1920, h: 1080 }"; "targetWidth: 1920"; "targetHeight: 1080"; "lockAspectRatio: true"; "padMode: 'pad'") @()

CreateVideoFeature "11" "11-color-grading" "ColorGrading" "colorGrading" "/video/color-grading" "Color Grading" "🎨" "Adjust brightness, contrast, saturation, hue, gamma and apply LUT files" "ffmpeg -vf eq=brightness=0:contrast=1:saturation=1 output.mp4" "mp4" @("brightness: number"; "contrast: number"; "saturation: number"; "hue: number"; "gamma: number"; "lutFile: File | null"; "activeLutPreset: string | null") @("brightness: 0"; "contrast: 1"; "saturation: 1"; "hue: 0"; "gamma: 1.0"; "lutFile: null"; "activeLutPreset: null") @()

CreateVideoFeature "12" "12-subtitle-burner" "SubtitleBurner" "subtitleBurner" "/video/subtitles" "Subtitle Burner" "💬" "Burn SRT/VTT/ASS subtitles into video with custom font and style" "ffmpeg -vf subtitles=file.srt output.mp4" "mp4" @("videoFile: File | null"; "subtitleFile: File | null"; "subtitleContent: string"; "fontFamily: string"; "fontSize: number"; "fontColor: string"; "outlineColor: string"; "position: 'top'|'bottom'"; "offsetSeconds: number"; "aiGenerating: boolean") @("videoFile: null"; "subtitleFile: null"; "subtitleContent: ''"; "fontFamily: 'Arial'"; "fontSize: 24"; "fontColor: '#FFFFFF'"; "outlineColor: '#000000'"; "position: 'bottom'"; "offsetSeconds: 0"; "aiGenerating: false") @()

CreateVideoFeature "13" "13-thumbnail-generator" "ThumbnailGenerator" "thumbnailGenerator" "/video/thumbnail" "Thumbnail Generator" "🖼️" "Extract frames from video as images or generate contact sheets" "ffmpeg -ss 10 -frames:v 1 thumbnail.jpg" "jpg" @("mode: 'single'|'grid'|'interval'"; "timestamp: number"; "gridCols: number"; "gridRows: number"; "intervalSeconds: number"; "imageFormat: 'jpg'|'png'|'webp'"; "jpgQuality: number"; "outputBlobs: Blob[]") @("mode: 'single'"; "timestamp: 0"; "gridCols: 3"; "gridRows: 3"; "intervalSeconds: 5"; "imageFormat: 'jpg'"; "jpgQuality: 85"; "outputBlobs: []") @()

CreateVideoFeature "14" "14-watermark" "Watermark" "watermark" "/video/watermark" "Watermark Adder" "💧" "Overlay image or text watermark on video with position and opacity control" "ffmpeg -i input.mp4 -i logo.png -filter_complex overlay=10:10 output.mp4" "mp4" @("videoFile: File | null"; "mode: 'image'|'text'"; "watermarkFile: File | null"; "text: string"; "fontFamily: string"; "fontSize: number"; "fontColor: string"; "position: 'TL'|'TC'|'TR'|'ML'|'MC'|'MR'|'BL'|'BC'|'BR'"; "opacity: number"; "scale: number") @("videoFile: null"; "mode: 'text'"; "watermarkFile: null"; "text: 'OMNI-TOOL'"; "fontFamily: 'Arial'"; "fontSize: 36"; "fontColor: '#FFFFFF'"; "position: 'BR'"; "opacity: 0.7"; "scale: 0.2") @()

CreateVideoFeature "15" "15-audio-extractor" "AudioExtractor" "audioExtractor" "/video/extract-audio" "Audio Extractor" "🎵" "Extract audio track from video in WAV, MP3, AAC, OGG, or FLAC format" "ffmpeg -i input.mp4 -vn -c:a pcm_s16le output.wav" "wav" @("outputFormat: 'wav'|'mp3'|'aac'|'ogg'|'flac'"; "bitrate: 128|192|256|320"; "waveformData: Float32Array | null") @("outputFormat: 'mp3'"; "bitrate: 192"; "waveformData: null") @()

CreateVideoFeature "16" "16-audio-replacer" "AudioReplacer" "audioReplacer" "/video/replace-audio" "Audio Replacer" "🔊" "Replace original audio with a new audio track with volume mix control" "ffmpeg -i video.mp4 -i audio.mp3 -c:v copy -map 0:v -map 1:a output.mp4" "mp4" @("audioFile: File | null"; "mode: 'replace'|'mix'"; "originalVolume: number"; "newAudioVolume: number"; "loopAudio: boolean") @("audioFile: null"; "mode: 'replace'"; "originalVolume: 1"; "newAudioVolume: 1"; "loopAudio: false") @()

CreateVideoFeature "17" "17-denoiser" "Denoiser" "denoiser" "/video/denoiser" "Video Denoiser" "🧹" "Remove visual noise and grain using FFmpeg hqdn3d and nlmeans filters" "ffmpeg -vf hqdn3d=4:4:3:3 output.mp4" "mp4" @("algorithm: 'hqdn3d'|'nlmeans'"; "lumaStrength: number"; "chromaStrength: number"; "temporalStrength: number"; "denoiseAudio: boolean"; "audioNoiseLevel: number") @("algorithm: 'hqdn3d'"; "lumaStrength: 4"; "chromaStrength: 4"; "temporalStrength: 3"; "denoiseAudio: false"; "audioNoiseLevel: 50") @()

CreateVideoFeature "18" "18-interpolator" "Interpolator" "interpolator" "/video/interpolate" "Frame Interpolator" "📈" "Increase video frame rate using motion interpolation" "ffmpeg -vf minterpolate fps=60 output.mp4" "mp4" @("inputFPS: number"; "targetFPS: number"; "algorithm: 'duplicate'|'motion'") @("inputFPS: 30"; "targetFPS: 60"; "algorithm: 'duplicate'") @()

CreateVideoFeature "19" "19-metadata-editor" "MetadataEditor" "metadataEditor" "/video/metadata" "Metadata Editor" "📋" "Read and write video metadata tags (title, author, description, date)" "ffmpeg -i input.mp4 -metadata title=Title -c copy output.mp4" "mp4" @("rawMetadata: Record<string, string>"; "editedFields: { title: string; artist: string; album: string; year: string; description: string; comment: string }"; "coverArt: File | null"; "stripAll: boolean") @("rawMetadata: {}"; "editedFields: { title: '', artist: '', album: '', year: '', description: '', comment: '' }"; "coverArt: null"; "stripAll: false") @()

CreateVideoFeature "20" "20-splitter" "Splitter" "splitter" "/video/splitter" "Video Splitter" "✂️" "Split one video into multiple segments by time markers or equal parts" "ffmpeg -i input.mp4 -ss 0 -to 30 -c copy seg1.mp4" "mp4" @("mode: 'markers'|'equal'"; "markers: number[]"; "equalParts: number"; "outputSegments: Blob[]") @("mode: 'equal'"; "markers: []"; "equalParts: 3"; "outputSegments: []") @()

CreateVideoFeature "21" "21-screen-recorder" "ScreenRecorder" "screenRecorder" "/video/screen-recorder" "Screen Recorder" "🎥" "Record screen and microphone/system audio using MediaRecorder API" "MediaRecorder API" "mp4" @("duration: number"; "audioSource: 'mic'|'system'|'both'|'none'"; "resolution: '1080p'|'720p'|'480p'"; "outputFormat: 'mp4'|'webm'"; "recordingStatus: 'idle'|'requesting'|'recording'|'paused'|'processing'") @("duration: 0"; "audioSource: 'mic'"; "resolution: '1080p'"; "outputFormat: 'webm'"; "recordingStatus: 'idle'") @()

CreateVideoFeature "22" "22-video-to-gif" "VideoToGif" "videoToGif" "/video/to-gif" "Video to GIF" "🎞️" "Convert video segment to high-quality animated GIF with palette optimization" "ffmpeg -vf fps=10,scale=480:-1:flags=lanczos,palettegen palette.png" "gif" @("startTime: number"; "endTime: number"; "fps: number"; "width: number | 'auto'"; "dither: 'none'|'bayer'|'floyd_steinberg'"; "estimatedSizeKB: number") @("startTime: 0"; "endTime: 10"; "fps: 10"; "width: 480"; "dither: 'bayer'"; "estimatedSizeKB: 0") @()

CreateVideoFeature "23" "23-pip" "Pip" "pip" "/video/pip" "Picture in Picture" "📺" "Overlay a second video as a floating picture-in-picture" "ffmpeg -filter_complex [1:v]scale=320:240[pip];[0:v][pip]overlay=10:10 output.mp4" "mp4" @("mainFile: File | null"; "overlayFile: File | null"; "pipWidth: number"; "position: 'TL'|'TR'|'BL'|'BR'"; "startTime: number | null"; "endTime: number | null"; "borderRadius: number") @("mainFile: null"; "overlayFile: null"; "pipWidth: 25"; "position: 'TR'"; "startTime: null"; "endTime: null"; "borderRadius: 8") @()

CreateVideoFeature "24" "24-blur" "Blur" "blur" "/video/blur" "Video Blur" "🌁" "Apply full-frame blur, region blur, or background blur effect" "ffmpeg -vf boxblur=10 output.mp4" "mp4" @("mode: 'full'|'region'|'background'"; "strength: number"; "region: { x: number; y: number; w: number; h: number } | null"; "startTime: number | null"; "endTime: number | null") @("mode: 'full'"; "strength: 10"; "region: null"; "startTime: null"; "endTime: null") @()

CreateVideoFeature "25" "25-transitions" "Transitions" "transitions" "/video/transitions" "Video Transitions" "🎬" "Add fade, dissolve, wipe, and slide transition effects between clips" "ffmpeg -filter_complex [0][1]xfade=transition=fade:duration=0.5 output.mp4" "mp4" @("clips: { file: File; id: string }[]"; "transitions: { afterClipId: string; type: string; duration: number }[]"; "applyAllType: string | null"; "applyAllDuration: number | null") @("clips: []"; "transitions: []"; "applyAllType: 'fade'"; "applyAllDuration: 0.5") @()

CreateVideoFeature "26" "26-compare" "Compare" "compare" "/video/compare" "Video Compare" "👁️" "Compare two videos side-by-side or with a drag-divider overlay" "ffmpeg -filter_complex [0][1]hstack output.mp4" "mp4" @("fileA: File | null"; "fileB: File | null"; "mode: 'sidebyside'|'divider'|'difference'"; "dividerPosition: number"; "syncPlayback: boolean") @("fileA: null"; "fileB: null"; "mode: 'divider'"; "dividerPosition: 50"; "syncPlayback: true") @()

CreateVideoFeature "27" "27-slideshow" "Slideshow" "slideshow" "/video/slideshow" "Slideshow Maker" "🖼️" "Create a video slideshow from a sequence of images with Ken Burns effect" "ffmpeg -loop 1 -i img.jpg -t 3 -vf scale=1920:1080 clip.mp4" "mp4" @("images: { file: File; id: string; duration: number }[]"; "defaultDuration: number"; "kenBurns: boolean"; "musicFile: File | null"; "transitionType: string"; "transitionDuration: number"; "outputResolution: '1080p'|'720p'") @("images: []"; "defaultDuration: 3"; "kenBurns: false"; "musicFile: null"; "transitionType: 'fade'"; "transitionDuration: 0.5"; "outputResolution: '1080p'") @()

CreateVideoFeature "28" "28-batch" "Batch" "batch" "/video/batch" "Batch Processor" "⚙️" "Apply the same operation to multiple videos in a sequential queue" "Sequential FFmpeg processing per file" "mp4" @("files: { id: string; file: File; status: string; progress: number; outputBlob: Blob | null; error: string | null }[]"; "operation: 'compress'|'convert'|'trim'|'resize'"; "operationConfig: Record<string, unknown>"; "isRunning: boolean"; "currentIndex: number"; "completedCount: number"; "failedCount: number") @("files: []"; "operation: 'compress'"; "operationConfig: {}"; "isRunning: false"; "currentIndex: 0"; "completedCount: 0"; "failedCount: 0") @()

CreateVideoFeature "29" "29-analyser" "Analyser" "analyser" "/video/analyser" "Video Analyser" "🔍" "Inspect video technical metadata: codec, resolution, bitrate, FPS, audio streams" "ffprobe -v quiet -print_format json -show_format" "json" @("metadata: { format: Record<string,string>; videoStreams: unknown[]; audioStreams: unknown[]; subtitleStreams: unknown[]; chapters: unknown[] } | null") @("metadata: null") @()

CreateVideoFeature "30" "30-upscaler" "Upscaler" "upscaler" "/video/upscaler" "AI Video Upscaler" "🚀" "Upscale video resolution using Real-ESRGAN ONNX model via WebGPU" "ONNX Real-ESRGAN frame-by-frame upscaling" "mp4" @("scaleFactor: 2|4"; "model: 'realesrgan'|'esrgan'|'swinir'"; "webGpuAvailable: boolean"; "totalFrames: number"; "processedFrames: number"; "currentFrameIndex: number"; "modelLoaded: boolean"; "memoryWarning: boolean") @("scaleFactor: 2"; "model: 'realesrgan'"; "webGpuAvailable: false"; "totalFrames: 0"; "processedFrames: 0"; "currentFrameIndex: 0"; "modelLoaded: false"; "memoryWarning: false") @()

Write-Host ""
Write-Host "All 30 video features created successfully!"
