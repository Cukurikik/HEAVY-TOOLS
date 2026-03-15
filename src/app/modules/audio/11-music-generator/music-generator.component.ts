import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiMusicService, AiMusicConfig } from './services/ai-music.service';

@Component({
  selector: 'app-music-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <header>
        <h2 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-cyan tracking-tight mb-2 flex items-center gap-3">
          🧠 Omni AI Music Engine
        </h2>
        <p class="text-text-secondary">
          Enterprise-grade Deep Learning Audio Generation. Powered by PyTorch, Diffusion Models, and DSP Vocoders running on your GPU cluster.
        </p>
      </header>

      <!-- Connection Status -->
      @if (aiState().error) {
        <div class="p-4 rounded-xl bg-red-500/20 border border-red-500 text-red-100 flex items-center gap-3 animate-fade-in">
          <span>⚠️</span>
          <span>{{ aiState().error }}</span>
        </div>
      }

      <!-- Controls -->
      <div class="glass-panel p-6 rounded-3xl space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Model Type -->
          <div class="space-y-2 lg:col-span-2">
            <span id="model-label" class="text-sm font-semibold text-text-secondary block mb-1">AI Architecture (GPU Engine)</span>
            <div class="flex gap-2">
              @for (m of models; track m.value) {
                <button (click)="updateConfig('modelType', m.value)"
                        class="flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all"
                        [class]="config().modelType === m.value ? 'bg-accent-purple/20 border-accent-purple text-accent-purple' : 'border-transparent bg-white/5 hover:bg-white/10 text-text-secondary'">
                  {{ m.label }}
                </button>
              }
            </div>
          </div>

          <!-- Prompt Input -->
          <div class="space-y-2 lg:col-span-2">
            <label for="prompt-input" class="text-sm font-semibold text-text-secondary">Music Prompt (Describe the song)</label>
            <textarea id="prompt-input" rows="3"
                      [ngModel]="config().prompt"
                      (ngModelChange)="updateConfig('prompt', $event)"
                      placeholder="E.g., A high quality acoustic piano melody, 120 bpm, happy uplifting mood with dynamic drums..."
                      class="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:border-accent-cyan outline-none transition-colors resize-none"></textarea>
          </div>


          <!-- Duration -->
          <div class="space-y-2">
            <label for="duration-input" class="text-sm font-semibold text-text-secondary flex justify-between">
              <span>Duration (Seconds - Requires More VRAM)</span>
              <span class="text-accent-purple">{{ config().duration }}s</span>
            </label>
            <input id="duration-input" type="range" 
                   [ngModel]="config().duration" 
                   (ngModelChange)="updateConfig('duration', $event)"
                   min="5" max="30" step="5"
                   class="w-full accent-accent-purple" />
          </div>

        </div>

        <hr class="border-white/10" />

        <!-- Generate Button -->
        <!-- Generate Button -->
        <button [disabled]="aiState().isGenerating || !config().prompt"
                (click)="generate()"
                class="w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 relative overflow-hidden group"
                [class]="(aiState().isGenerating || !config().prompt) ? 'bg-white/10 text-text-secondary cursor-not-allowed' : 'bg-gradient-to-r from-accent-purple to-accent-cyan hover:scale-[1.02] shadow-lg shadow-accent-purple/20'">
          @if (aiState().isGenerating) {
            <span class="relative z-10 flex flex-col items-center justify-center gap-1">
              <div class="flex items-center gap-3">
                 <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 Generating via Deep Learning... {{ aiState().progress }}%
              </div>
              <span class="text-xs font-normal opacity-80">{{ aiState().message }}</span>
            </span>
          } @else {
            <span class="relative z-10 flex items-center justify-center gap-2">
              ⚡ Generate AI Music ⚡
            </span>
          }
        </button>
      </div>

      <!-- Result Player -->
      <!-- Result Player -->
      @if (aiState().resultUrl) {
        <div class="glass-panel p-6 rounded-3xl space-y-4 animate-fade-in-up border border-accent-cyan/30">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-bold text-lg text-accent-cyan">Render Complete (HiFi-GAN Vocoder)</h3>
              <p class="text-sm text-text-secondary truncate max-w-md">Prompt: {{ config().prompt }}</p>
            </div>
            <a [href]="'http://localhost:8000' + aiState().resultUrl" 
               target="_blank"
               download="Omni_AI_Generated.wav"
               class="px-5 py-2.5 rounded-xl bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan font-bold transition-colors flex items-center gap-2 shrink-0">
              ⬇ Download WAV
            </a>
          </div>
          
          <div class="p-4 bg-black/40 rounded-2xl">
            <!-- Note: Audio src hits the FastAPI Download endpoint -->
             <div class="text-center text-accent-purple text-sm animate-pulse">
                [Audio playback simulation. Ensure FastAPI is serving static files at output directory]
             </div>
          </div>
        </div>
      }
    </div>
  `
})
export class MusicGeneratorComponent {
  private aiService = inject(AiMusicService);

  readonly config = signal<AiMusicConfig>({
    prompt: '',
    duration: 10,
    modelType: 'musicgen'
  });

  // Wire UI to the WebSocket service state
  readonly aiState = this.aiService.state;

  readonly models: { value: AiMusicConfig['modelType'], label: string }[] = [
    { value: 'musicgen', label: 'Meta MusicGen (Transformer)' },
    { value: 'ace-step', label: 'ACE-Step v1.5 (DiT)' },
    { value: 'audioldm', label: 'AudioLDM 2 (Latent Diffusion)' }
  ];

  updateConfig<K extends keyof AiMusicConfig>(key: K, value: AiMusicConfig[K]): void {
    const current = this.config();
    this.config.set({ ...current, [key]: value });
  }

  generate(): void {
    if (this.aiState().isGenerating || !this.config().prompt) return;
    this.aiService.generate(this.config());
  }
}
