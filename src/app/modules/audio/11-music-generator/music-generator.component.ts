import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProceduralMusicService, MusicGenerationConfig } from './services/procedural-music.service';

@Component({
  selector: 'app-music-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <header>
        <h2 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-cyan tracking-tight mb-2 flex items-center gap-3">
          🎹 Synthetic Music Generator
        </h2>
        <p class="text-text-secondary">
          Generates algorithmic music 100% offline using the browser's native Web Audio API.
          No servers, no AI models, just pure mathematics and synthesizers.
        </p>
      </header>

      <!-- Controls -->
      <div class="glass-panel p-6 rounded-3xl space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Genre -->
          <div class="space-y-2">
            <span id="genre-label" class="text-sm font-semibold text-text-secondary block mb-1">Genre / Sound Font</span>
            <div class="flex gap-2">
              @for (g of genres; track g.value) {
                <button (click)="updateConfig('genre', g.value)"
                        class="flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all"
                        [class]="config().genre === g.value ? 'bg-accent-purple/20 border-accent-purple text-accent-purple' : 'border-transparent bg-white/5 hover:bg-white/10 text-text-secondary'">
                  {{ g.label }}
                </button>
              }
            </div>
          </div>

          <!-- Mood -->
          <div class="space-y-2">
            <span id="mood-label" class="text-sm font-semibold text-text-secondary block mb-1">Mood (Scale & Chord Progression)</span>
            <div class="grid grid-cols-2 gap-2">
              @for (m of moods; track m.value) {
                <button (click)="updateConfig('mood', m.value)"
                        class="px-4 py-2 rounded-xl text-sm transition-all border border-transparent"
                        [class]="config().mood === m.value ? 'bg-white/20 text-white font-bold border-white/30' : 'bg-white/5 hover:bg-white/10 text-text-secondary'">
                  {{ m.icon }} {{ m.label }}
                </button>
              }
            </div>
          </div>

          <!-- Tempo (BPM) -->
          <div class="space-y-2">
            <label for="bpm-input" class="text-sm font-semibold text-text-secondary flex justify-between">
              <span>Tempo (BPM)</span>
              <span class="text-accent-cyan">{{ config().bpm }}</span>
            </label>
            <input id="bpm-input" type="range" 
                   [ngModel]="config().bpm" 
                   (ngModelChange)="updateConfig('bpm', $event)"
                   min="60" max="180" step="5"
                   class="w-full accent-accent-cyan" />
          </div>

          <!-- Duration -->
          <div class="space-y-2">
            <label for="duration-input" class="text-sm font-semibold text-text-secondary flex justify-between">
              <span>Duration (Seconds)</span>
              <span class="text-accent-purple">{{ config().durationSeconds }}s</span>
            </label>
            <input id="duration-input" type="range" 
                   [ngModel]="config().durationSeconds" 
                   (ngModelChange)="updateConfig('durationSeconds', $event)"
                   min="10" max="120" step="10"
                   class="w-full accent-accent-purple" />
          </div>

        </div>

        <hr class="border-white/10" />

        <!-- Generate Button -->
        <button [disabled]="isGenerating()"
                (click)="generate()"
                class="w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 relative overflow-hidden group"
                [class]="isGenerating() ? 'bg-white/10 text-text-secondary cursor-not-allowed' : 'bg-gradient-to-r from-accent-purple to-accent-cyan hover:scale-[1.02] shadow-lg shadow-accent-purple/20'">
          @if (isGenerating()) {
            <span class="relative z-10 flex items-center justify-center gap-3">
              <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Synthesizing Audio... {{ progress() }}%
            </span>
          } @else {
            <span class="relative z-10 flex items-center justify-center gap-2">
              ⚡ Generate Music ⚡
            </span>
          }
        </button>
      </div>

      <!-- Result Player -->
      @if (audioUrl()) {
        <div class="glass-panel p-6 rounded-3xl space-y-4 animate-fade-in-up border border-accent-cyan/30">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-bold text-lg text-accent-cyan">Render Complete</h3>
              <p class="text-sm text-text-secondary">WAV / {{ config().bpm }} BPM / {{ config().mood | titlecase }}</p>
            </div>
            <a [href]="audioUrl()" 
               download="Omni_Generated_Music.wav"
               class="px-5 py-2.5 rounded-xl bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan font-bold transition-colors flex items-center gap-2">
              ⬇ Download WAV
            </a>
          </div>
          
          <div class="p-4 bg-black/40 rounded-2xl">
            <audio [src]="audioUrl()" controls class="w-full h-10 outline-none"></audio>
          </div>
        </div>
      }
    </div>
  `
})
export class MusicGeneratorComponent {
  private musicService = inject(ProceduralMusicService);

  readonly config = signal<MusicGenerationConfig>({
    genre: 'synthwave',
    mood: 'epic',
    bpm: 120,
    durationSeconds: 30
  });

  readonly isGenerating = signal(false);
  readonly progress = signal(0);
  readonly audioUrl = signal<string | null>(null);

  readonly genres: { value: MusicGenerationConfig['genre'], label: string }[] = [
    { value: '8bit', label: '👾 8-Bit (Chiptune)' },
    { value: 'synthwave', label: '🌆 Synthwave' },
    { value: 'ambient', label: '🌌 Ambient' },
    { value: 'lofi', label: '☕ Lo-Fi Hip Hop' }
  ];

  readonly moods: { value: MusicGenerationConfig['mood'], label: string, icon: string }[] = [
    { value: 'happy', label: 'Happy', icon: '☀️' },
    { value: 'epic', label: 'Epic', icon: '🔥' },
    { value: 'chill', label: 'Chill', icon: '🧊' },
    { value: 'sad', label: 'Sad', icon: '🌧️' }
  ];

  updateConfig<K extends keyof MusicGenerationConfig>(key: K, value: MusicGenerationConfig[K]): void {
    const current = this.config();
    this.config.set({ ...current, [key]: value });
  }

  async generate(): Promise<void> {
    if (this.isGenerating()) return;

    // Clean up previous URL to prevent memory leaks
    if (this.audioUrl()) {
      URL.revokeObjectURL(this.audioUrl()!);
      this.audioUrl.set(null);
    }

    this.isGenerating.set(true);
    this.progress.set(0);

    try {
      // Small timeout to allow UI update before heavy processing
      await new Promise(r => setTimeout(r, 50));

      const buffer = await this.musicService.generateMusic(this.config(), (p) => {
        this.progress.set(p);
      });

      const blob = this.musicService.audioBufferToWavBlob(buffer);
      const url = URL.createObjectURL(blob);
      
      this.audioUrl.set(url);
    } catch (error) {
      console.error('Music rendering failed:', error);
      alert('Failed to generate music. Check console for details.');
    } finally {
      this.isGenerating.set(false);
      this.progress.set(100);
    }
  }
}
