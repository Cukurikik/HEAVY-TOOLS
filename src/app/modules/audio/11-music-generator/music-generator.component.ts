import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiMusicService, AiMusicConfig } from './services/ai-music.service';
import { ProceduralMusicService, MusicGenerationConfig } from './services/procedural-music.service';

@Component({
  selector: 'app-music-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <header>
        <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <h2 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-cyan tracking-tight mb-2 flex items-center gap-3">
            🎹 Omni Music Studio
          </h2>
          <!-- Engine Switcher -->
          <div class="flex bg-black/40 rounded-xl p-1 border border-white/10 shrink-0">
            <button (click)="activeEngine.set('procedural')"
                    [class]="activeEngine() === 'procedural' ? 'bg-white/20 shadow-md text-white' : 'text-white/50 hover:text-white/80'"
                    class="px-4 py-2 rounded-lg text-sm font-bold transition-all">
              Algorithmic Engine (Local)
            </button>
            <button (click)="activeEngine.set('ai')"
                    [class]="activeEngine() === 'ai' ? 'bg-gradient-to-r from-accent-purple to-accent-cyan shadow-md text-white' : 'text-white/50 hover:text-white/80'"
                    class="px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
              Deep Learning (Cloud) <span class="text-xs bg-accent-purple/50 px-1.5 py-0.5 rounded text-white">BETA</span>
            </button>
          </div>
        </div>
        
        <p class="text-text-secondary" [class.hidden]="activeEngine() !== 'procedural'">
          Generates algorithmic music 100% offline using the browser's native Web Audio API and General MIDI CDNs.
          No servers required.
        </p>
        <p class="text-text-secondary" [class.hidden]="activeEngine() !== 'ai'">
          Enterprise-grade Deep Learning Audio Generation. Connects directly to Hugging Face free-tier Cloud Inference API. <b>Requires no local server!</b>
        </p>
      </header>

      <!-- PROCEDURAL ENGINE UI -->
      <div [class.hidden]="activeEngine() !== 'procedural'">
        <div class="glass-panel p-6 rounded-3xl space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div class="space-y-2">
              <span id="genre-label" class="text-sm font-semibold text-text-secondary block mb-1">Genre / Sound Font</span>
              <div class="flex gap-2">
                @for (g of proceduralGenres; track g.value) {
                  <button (click)="updateProceduralConfig('genre', g.value)"
                          class="flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all text-xs"
                          [class]="proceduralConfig().genre === g.value ? 'bg-accent-purple/20 border-accent-purple text-accent-purple' : 'border-transparent bg-white/5 hover:bg-white/10 text-text-secondary'">
                    {{ g.label }}
                  </button>
                }
              </div>
            </div>

            <div class="space-y-2">
              <span id="mood-label" class="text-sm font-semibold text-text-secondary block mb-1">Mood</span>
              <div class="grid grid-cols-2 gap-2">
                @for (m of proceduralMoods; track m.value) {
                  <button (click)="updateProceduralConfig('mood', m.value)"
                          class="px-4 py-2 rounded-xl text-sm transition-all border border-transparent"
                          [class]="proceduralConfig().mood === m.value ? 'bg-white/20 text-white font-bold border-white/30' : 'bg-white/5 hover:bg-white/10 text-text-secondary'">
                    {{ m.icon }} {{ m.label }}
                  </button>
                }
              </div>
            </div>

            <div class="space-y-2">
              <label for="bpm-input" class="text-sm font-semibold text-text-secondary flex justify-between">
                <span>Tempo (BPM)</span>
                <span class="text-accent-cyan">{{ proceduralConfig().bpm }}</span>
              </label>
              <input id="bpm-input" type="range" 
                     [ngModel]="proceduralConfig().bpm" 
                     (ngModelChange)="updateProceduralConfig('bpm', $event)"
                     min="60" max="180" step="5"
                     class="w-full accent-accent-cyan" />
            </div>

            <div class="space-y-2">
              <label for="p-duration-input" class="text-sm font-semibold text-text-secondary flex justify-between">
                <span>Duration (Seconds)</span>
                <span class="text-accent-purple">{{ proceduralConfig().durationSeconds }}s</span>
              </label>
              <input id="p-duration-input" type="range" 
                     [ngModel]="proceduralConfig().durationSeconds" 
                     (ngModelChange)="updateProceduralConfig('durationSeconds', $event)"
                     min="10" max="120" step="10"
                     class="w-full accent-accent-purple" />
            </div>

          </div>

          <hr class="border-white/10" />

          <button [disabled]="isProceduralGenerating()"
                  (click)="generateProcedural()"
                  class="w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 relative overflow-hidden group"
                  [class]="isProceduralGenerating() ? 'bg-white/10 text-text-secondary cursor-not-allowed' : 'bg-gradient-to-r from-accent-purple to-accent-cyan hover:scale-[1.02] shadow-lg shadow-accent-purple/20'">
            @if (isProceduralGenerating()) {
              <span class="relative z-10 flex items-center justify-center gap-3">
                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Arranging Music... {{ proceduralProgress() }}%
              </span>
            } @else {
              <span class="relative z-10 flex items-center justify-center gap-2">
                ⚡ Generate Algorithmic Music ⚡
              </span>
            }
          </button>
        </div>

        @if (proceduralAudioUrl()) {
          <div class="glass-panel p-6 rounded-3xl space-y-4 animate-fade-in-up border border-accent-cyan/30 mt-8">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-bold text-lg text-accent-cyan">Render Complete</h3>
                <p class="text-sm text-text-secondary">WAV / {{ proceduralConfig().bpm }} BPM / {{ proceduralConfig().mood | titlecase }}</p>
              </div>
              <a [href]="proceduralAudioUrl()" 
                 download="Omni_Generated_Music.wav"
                 class="px-5 py-2.5 rounded-xl bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan font-bold transition-colors flex items-center gap-2">
                ⬇ Download WAV
              </a>
            </div>
            
            <div class="p-4 bg-black/40 rounded-2xl">
              <audio [src]="proceduralAudioUrl()" controls class="w-full h-10 outline-none"></audio>
            </div>
          </div>
        }
      </div>

      <!-- AI CLOUD ENGINE UI -->
      <div [class.hidden]="activeEngine() !== 'ai'">
        <!-- Connection Status -->
        @if (aiState().error) {
          <div class="p-4 rounded-xl bg-red-500/20 border border-red-500 text-red-100 flex items-center gap-3 animate-fade-in mb-6">
            <span>⚠️</span>
            <span>{{ aiState().error }}</span>
          </div>
        }

        <div class="glass-panel p-6 rounded-3xl space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Model Type -->
            <div class="space-y-2 lg:col-span-2">
              <span id="model-label" class="text-sm font-semibold text-text-secondary block mb-1">Hugging Face Cloud Models</span>
              <div class="flex flex-col sm:flex-row gap-2">
                @for (m of aiModels; track m.value) {
                  <button (click)="updateAiConfig('modelType', m.value)"
                          class="flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all"
                          [class]="aiConfig().modelType === m.value ? 'bg-accent-purple/20 border-accent-purple text-accent-purple' : 'border-transparent bg-white/5 hover:bg-white/10 text-text-secondary'">
                    {{ m.label }}
                  </button>
                }
              </div>
            </div>

            <!-- Optional HF Token -->
            <div class="space-y-2 lg:col-span-2">
              <label for="hf-token-input" class="text-sm font-semibold text-text-secondary">Hugging Face API Token (Optional - Bypasses Free Tier constraints)</label>
              <input id="hf-token-input" type="password" 
                     [ngModel]="aiConfig().hfToken" 
                     (ngModelChange)="updateAiConfig('hfToken', $event)"
                     placeholder="hf_xxxxxxxxxxxxxxxxxxx"
                     class="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white placeholder-white/30 focus:border-accent-cyan outline-none transition-colors" />
            </div>

            <!-- Prompt Input -->
            <div class="space-y-2 lg:col-span-2">
              <label for="prompt-input" class="text-sm font-semibold text-text-secondary">Music Prompt (Describe the song)</label>
              <textarea id="prompt-input" rows="3"
                        [ngModel]="aiConfig().prompt"
                        (ngModelChange)="updateAiConfig('prompt', $event)"
                        placeholder="E.g., An 80s driving pop song with heavy drums and synth pads in the background..."
                        class="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:border-accent-cyan outline-none transition-colors resize-none"></textarea>
            </div>
            
            <div class="space-y-2 lg:col-span-2">
              <p class="text-xs text-yellow-500/80 italic flex items-center gap-2">
                <span>⚠️</span> The free Hugging Face API limits audio output to roughly 10 seconds per request, regardless of prompt. Initial generation might take up to 30 seconds to wake the model instance.
              </p>
            </div>
          </div>

          <hr class="border-white/10" />

          <!-- AI Generate Button -->
          <button [disabled]="aiState().isGenerating || !aiConfig().prompt"
                  (click)="generateAi()"
                  class="w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 relative overflow-hidden group"
                  [class]="(aiState().isGenerating || !aiConfig().prompt) ? 'bg-white/10 text-text-secondary cursor-not-allowed' : 'bg-gradient-to-r from-accent-purple to-accent-cyan hover:scale-[1.02] shadow-lg shadow-accent-purple/20'">
            @if (aiState().isGenerating) {
              <span class="relative z-10 flex flex-col items-center justify-center gap-1">
                <div class="flex items-center gap-3">
                   <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   Cloud GPU Request... {{ aiState().progress }}%
                </div>
                <span class="text-xs font-normal opacity-80">{{ aiState().message }}</span>
              </span>
            } @else {
              <span class="relative z-10 flex items-center justify-center gap-2">
                ⚡ Generate Cloud Deep Learning Audio ⚡
              </span>
            }
          </button>
        </div>

        <!-- AI Result Player -->
        @if (aiState().resultUrl) {
          <div class="glass-panel p-6 rounded-3xl space-y-4 animate-fade-in-up border border-accent-purple/30 mt-8">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-bold text-lg text-accent-purple">Cloud Audio Received</h3>
                <p class="text-sm text-text-secondary truncate max-w-md">Prompt: {{ aiConfig().prompt }}</p>
              </div>
              <a [href]="aiState().resultUrl" 
                 download="Omni_Cloud_AI.wav"
                 class="px-5 py-2.5 rounded-xl bg-accent-purple/10 hover:bg-accent-purple/20 text-accent-purple font-bold transition-colors flex items-center gap-2 shrink-0">
                ⬇ Download Result
              </a>
            </div>
            
            <div class="p-4 bg-black/40 rounded-2xl">
               <audio [src]="aiState().resultUrl" controls class="w-full h-10 outline-none"></audio>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class MusicGeneratorComponent {
  private aiService = inject(AiMusicService);
  private proceduralService = inject(ProceduralMusicService);

  readonly activeEngine = signal<'procedural' | 'ai'>('procedural');

  // --- Procedural Engine State ---
  readonly proceduralConfig = signal<MusicGenerationConfig>({
    genre: 'synthwave',
    mood: 'epic',
    bpm: 120,
    durationSeconds: 30
  });
  readonly isProceduralGenerating = signal(false);
  readonly proceduralProgress = signal(0);
  readonly proceduralAudioUrl = signal<string | null>(null);

  readonly proceduralGenres: { value: MusicGenerationConfig['genre'], label: string }[] = [
    { value: '8bit', label: '👾 8-Bit' },
    { value: 'synthwave', label: '🌆 Synthwave' },
    { value: 'ambient', label: '🌌 Ambient' },
    { value: 'lofi', label: '☕ Lo-Fi' }
  ];

  readonly proceduralMoods: { value: MusicGenerationConfig['mood'], label: string, icon: string }[] = [
    { value: 'happy', label: 'Happy', icon: '☀️' },
    { value: 'epic', label: 'Epic', icon: '🔥' },
    { value: 'chill', label: 'Chill', icon: '🧊' },
    { value: 'sad', label: 'Sad', icon: '🌧️' }
  ];

  updateProceduralConfig<K extends keyof MusicGenerationConfig>(key: K, value: MusicGenerationConfig[K]): void {
    const current = this.proceduralConfig();
    this.proceduralConfig.set({ ...current, [key]: value });
  }

  async generateProcedural(): Promise<void> {
    if (this.isProceduralGenerating()) return;

    if (this.proceduralAudioUrl()) {
      URL.revokeObjectURL(this.proceduralAudioUrl()!);
      this.proceduralAudioUrl.set(null);
    }

    this.isProceduralGenerating.set(true);
    this.proceduralProgress.set(0);

    try {
      await new Promise(r => setTimeout(r, 50));
      const buffer = await this.proceduralService.generateMusic(this.proceduralConfig(), (p) => {
        this.proceduralProgress.set(p);
      });
      const blob = this.proceduralService.audioBufferToWavBlob(buffer);
      this.proceduralAudioUrl.set(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Procedural generation failed:', error);
      alert('Failed to generate algorithmic music.');
    } finally {
      this.isProceduralGenerating.set(false);
    }
  }

  // --- AI Cloud Engine State ---
  readonly aiConfig = signal<AiMusicConfig>({
    prompt: '',
    duration: 10,
    modelType: 'facebook/musicgen-small',
    hfToken: ''
  });

  readonly aiState = this.aiService.state;

  readonly aiModels: { value: AiMusicConfig['modelType'], label: string }[] = [
    { value: 'facebook/musicgen-small', label: 'Meta MusicGen (Stable)' },
    { value: 'cvssp/audioldm-s-full-v2', label: 'AudioLDM 2 (Experimental)' }
  ];

  updateAiConfig<K extends keyof AiMusicConfig>(key: K, value: AiMusicConfig[K]): void {
    const current = this.aiConfig();
    this.aiConfig.set({ ...current, [key]: value });
  }

  generateAi(): void {
    if (this.aiState().isGenerating || !this.aiConfig().prompt) return;
    this.aiService.generate(this.aiConfig());
  }
}
