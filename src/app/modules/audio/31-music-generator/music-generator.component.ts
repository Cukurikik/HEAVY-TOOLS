import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AudioPlayerComponent } from '../shared/components/audio-player/audio-player.component';
import { AudioExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { AudioProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { musicGeneratorFeature, musicGeneratorActions } from './music-generator.store';

@Component({
  selector: 'app-31-music-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, AudioPlayerComponent, AudioExportPanelComponent, AudioProgressRingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6">
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Header -->
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 flex items-center justify-center border border-white/10">
            <span class="text-2xl">🎹</span>
          </div>
          <div>
            <h1 class="text-xl font-bold text-white">Music AI Generator</h1>
            <p class="text-sm text-white/40">Generate high-quality music from text prompts</p>
          </div>
        </div>

        <!-- Inputs -->
        <div class="bg-[#12121a] rounded-2xl p-6 border border-white/5 space-y-6">

            <div class="space-y-2">
                <label class="text-sm text-white/70 font-medium" for="prompt-input">Prompt</label>
                <textarea id="prompt-input"
                    rows="3"
                    class="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="E.g., A fast-paced electronic dance track with heavy bass"
                    [ngModel]="(state$ | async)?.prompt?.trim()"
                    (ngModelChange)="onPromptChange($event)"
                ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label class="text-sm text-white/70 font-medium" for="genre-select">Genre</label>
                    <select id="genre-select"
                        class="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                        [ngModel]="(state$ | async)?.genre" (change)="onGenreChange($any($event.target).value)"
                    >
                        <option value="electronic">Electronic / Dance</option>
                        <option value="lofi">Lo-Fi / Chill</option>
                        <option value="ambient">Ambient / Cinematic</option>
                        <option value="rock">Rock / Metal</option>
                    </select>
                </div>

                <div class="space-y-2">
                    <label class="text-sm text-white/70 font-medium" for="duration-input">Duration (seconds)</label>
                    <div class="flex items-center gap-4">
                        <input type="range" id="duration-input" class="w-full accent-indigo-400" min="5" max="60" step="5"
                            [ngModel]="(state$ | async)?.duration" (input)="onDurationChange($any($event.target).valueAsNumber)">
                        <span class="text-sm text-white min-w-[3ch]">{{ (state$ | async)?.duration }}s</span>
                    </div>
                </div>
            </div>

            <!-- Generate Button -->
            <div class="pt-4 border-t border-white/10 flex items-center gap-4">
                @if ((state$ | async)?.status === 'processing') {
                    <app-audio-progress-ring [progress]="(state$ | async)?.progress ?? 0" [size]="48"></app-audio-progress-ring>
                    <span class="text-sm text-indigo-400 animate-pulse">Generating...</span>
                } @else {
                    <button class="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                            [disabled]="!(state$ | async)?.prompt?.trim() || (state$ | async)?.status === 'processing'" (click)="onGenerate()">
                        ✨ Generate Music
                    </button>
                }
            </div>

            <!-- Error -->
            @if ((state$ | async)?.status === 'error') {
                <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm mt-4">
                {{ (state$ | async)?.errorMessage }}
                @if ((state$ | async)?.retryable) {
                    <button class="ml-3 underline" (click)="onGenerate()">Retry</button>
                }
                </div>
            }
        </div>

        <!-- Results -->
        @if ((state$ | async)?.outputBlob) {
            <div class="bg-[#12121a] rounded-2xl p-6 border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.1)] space-y-4">
                <h3 class="text-sm font-medium text-white/70">Generated Result</h3>
                <app-audio-player [audioBlob]="(state$ | async)?.outputBlob ?? null"></app-audio-player>
                <app-audio-export-panel [disabled]="!(state$ | async)?.outputBlob"
                    [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
                    (download)="onDownload()"></app-audio-export-panel>
            </div>
        }
      </div>
    </div>
  `
})
export class MusicGeneratorComponent implements OnDestroy {
  private store = inject(Store);
  state$ = this.store.select(musicGeneratorFeature.selectMusicGeneratorState);

  onPromptChange(prompt: string): void {
    this.store.dispatch(musicGeneratorActions.setPrompt({ prompt }));
  }

  onDurationChange(duration: number): void {
      this.store.dispatch(musicGeneratorActions.setDuration({ duration }));
  }

  onGenreChange(genre: string): void {
      this.store.dispatch(musicGeneratorActions.setGenre({ genre }));
  }

  onGenerate(): void {
    this.store.dispatch(musicGeneratorActions.startGeneration());
  }

  onDownload(): void {
    this.store.dispatch(musicGeneratorActions.downloadOutput());
  }

  ngOnDestroy(): void {
    this.store.dispatch(musicGeneratorActions.resetState());
  }
}
