import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { ScreenRecorderActions, selectScreenRecorderState, selectScreenRecorderIsLoading } from './screenRecorder.store';

@Component({
  selector: 'app-screen-recorder',
  standalone: true,
  imports: [CommonModule, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
    <div class="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div class="relative bg-[#0a0a0f]/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
        <div class="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 space-y-8">
      <header class="space-y-1">
        <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg tracking-tight" class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">🖥️ Screen Recorder</h1>
        <p class="text-white/50 text-sm">Record screen, window, or browser tab with optional audio capture</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <!-- Source -->
            <div class="space-y-2">
              <p class="text-sm text-white/60">Capture Source</p>
              <div class="grid grid-cols-3 gap-2">
                @for (src of sources; track src.value) {
                  <button (click)="source=src.value"
                    [class]="source===src.value ? 'p-3 rounded-xl border-2 border-red-400 bg-red-400/10 text-red-300 text-sm font-semibold' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                    {{ src.icon }}<br/>{{ src.label }}
                  </button>
                }
              </div>
            </div>

            <!-- Audio -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div><p class="text-sm text-white/80">🎤 Include Audio</p><p class="text-xs text-white/40">System audio + microphone</p></div>
              <button (click)="includeAudio=!includeAudio"
                [class]="includeAudio ? 'w-12 h-6 rounded-full bg-red-500 relative transition-colors' : 'w-12 h-6 rounded-full bg-white/20 relative transition-colors'">
                <span [class]="includeAudio ? 'absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all' : 'absolute left-1 top-1 w-4 h-4 bg-white/60 rounded-full transition-all'"></span>
              </button>
            </div>

            <!-- Quality -->
            <div class="space-y-2">
              <p class="text-sm text-white/60">Recording Quality</p>
              <div class="grid grid-cols-3 gap-2">
                @for (q of qualities; track q.value) {
                  <button (click)="quality=q.value"
                    [class]="quality===q.value ? 'p-2 rounded-lg border-2 border-red-400 bg-red-400/10 text-red-300 text-sm font-bold' : 'p-2 rounded-lg border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                    {{ q.label }}
                  </button>
                }
              </div>
            </div>

            <!-- Timer display -->
            @if (isRecording()) {
              <div class="text-center p-6 rounded-2xl bg-red-500/10 border border-red-500/30">
                <div class="text-4xl font-mono text-red-400 animate-pulse">🔴 {{ recordingTime() }}</div>
                <p class="text-sm text-white/50 mt-2">Recording in progress...</p>
              </div>
            }

            @if (!isRecording()) {
              <button (click)="startRecording()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                🔴 Start Recording
              </button>
            } @else {
              <button (click)="stopRecording()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white hover:bg-white/20">
                ⏹️ Stop Recording
              </button>
            }
          </div>
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_recording" />
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div> }
        </div>
      </div>
          </div>
      </div>
    </div>
  </div>
  `,
})
export class ScreenRecorderComponent implements OnDestroy {
  private store = inject(Store);
  state$ = this.store.select(selectScreenRecorderState);
  isLoading$ = this.store.select(selectScreenRecorderIsLoading);

  source = 'screen'; includeAudio = true; quality = 'high';
  isRecording = signal(false);
  recordingTime = signal('00:00');
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;
  private startTime = 0;

  sources = [
    { value: 'screen', label: 'Screen', icon: '🖥️' },
    { value: 'window', label: 'Window', icon: '🪟' },
    { value: 'tab', label: 'Tab', icon: '🔖' },
  ];
  qualities = [
    { value: 'low', label: '720p' },
    { value: 'high', label: '1080p' },
    { value: 'ultra', label: '4K' },
  ];

  async startRecording() {
    try {
      const displayMediaOptions: DisplayMediaStreamOptions = { video: true, audio: this.includeAudio };
      const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      if (this.includeAudio) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioStream.getAudioTracks().forEach(t => stream.addTrack(t));
        } catch { /* mic not available, continue without */ }
      }
      this.chunks = [];
      this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
      this.mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) this.chunks.push(e.data); };
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'video/webm' });
        this.store.dispatch(ScreenRecorderActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1_048_576 }));
        stream.getTracks().forEach(t => t.stop());
        this.isRecording.set(false);
        if (this.timer) clearInterval(this.timer);
      };
      this.mediaRecorder.start(100);
      this.isRecording.set(true);
      this.startTime = Date.now();
      this.timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const secs = String(elapsed % 60).padStart(2, '0');
        this.recordingTime.set(`${mins}:${secs}`);
      }, 1000);
    } catch {
      this.store.dispatch(ScreenRecorderActions.processingFailure({ errorCode: 'PERMISSION_DENIED', message: 'Screen capture permission was denied.' }));
    }
  }

  stopRecording() {
    this.mediaRecorder?.stop();
  }

  ngOnDestroy() {
    this.stopRecording();
    if (this.timer) clearInterval(this.timer);
    this.store.dispatch(ScreenRecorderActions.resetState());
  }
}
