import { Component, ChangeDetectionStrategy, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiMusicService, AiMusicConfig } from './services/ai-music.service';
import { ProceduralMusicService } from './services/procedural-music.service';
import {
  MusicTheoryService,
  GENRE_CONFIGS,
  NoteEvent,
} from './services/music-theory.service';

/**
 * MUSIC GENERATOR COMPONENT
 *
 * Minimal routing placeholder — the AI decides everything autonomously.
 * Full UI will be built in Phase 19.
 *
 * The AI auto-selects: genre, key, BPM, instruments, temperature, bar count.
 * User only presses "Generate" and optionally picks a style hint.
 */
@Component({
  selector: 'app-music-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <header>
        <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-4">
          <h2 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-cyan tracking-tight flex items-center gap-3">
            🎵 AI Music Generator
          </h2>
          <!-- Engine Switcher -->
          <div class="flex bg-black/40 rounded-xl p-1 border border-white/10 shrink-0">
            <button (click)="activeEngine.set('local')"
                    [class]="activeEngine() === 'local' ? 'bg-white/20 shadow-md text-white' : 'text-white/50 hover:text-white/80'"
                    class="px-4 py-2 rounded-lg text-sm font-bold transition-all">
              🧠 Local AI Brain
            </button>
            <button (click)="activeEngine.set('cloud')"
                    [class]="activeEngine() === 'cloud' ? 'bg-gradient-to-r from-accent-purple to-accent-cyan shadow-md text-white' : 'text-white/50 hover:text-white/80'"
                    class="px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
              ☁️ Cloud AI <span class="text-xs bg-accent-purple/50 px-1.5 py-0.5 rounded text-white">BETA</span>
            </button>
          </div>
        </div>
        <p class="text-text-secondary text-sm">
          The AI autonomously composes music — it decides genre, key, BPM, instruments, mixing, and mastering all by itself.
        </p>
      </header>

      <!-- ═══════════════════════════════════════════════════════ -->
      <!-- LOCAL AI BRAIN ENGINE                                   -->
      <!-- ═══════════════════════════════════════════════════════ -->
      <div [class.hidden]="activeEngine() !== 'local'">
        <div class="glass-panel p-6 rounded-3xl space-y-6">

          <!-- Optional Style Hint -->
          <div class="space-y-3">
            <span class="text-sm font-semibold text-text-secondary block">🎛️ Style Hint (optional — AI decides if left empty)</span>
            <div class="flex flex-wrap gap-2">
              <button (click)="styleHint.set(null)"
                      class="py-2.5 px-4 rounded-xl border-2 font-bold transition-all text-sm"
                      [class]="!styleHint() ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan scale-105' : 'border-transparent bg-white/5 hover:bg-white/10 text-text-secondary'">
                🎲 Random (AI Decides)
              </button>
              @for (g of genreList; track g.name) {
                <button (click)="styleHint.set(g.name)"
                        class="py-2.5 px-4 rounded-xl border-2 font-bold transition-all text-sm"
                        [class]="styleHint() === g.name ? 'bg-accent-purple/20 border-accent-purple text-accent-purple scale-105' : 'border-transparent bg-white/5 hover:bg-white/10 text-text-secondary'">
                  {{ g.icon }} {{ g.label.split(' ')[1] }}
                </button>
              }
            </div>
          </div>

          <hr class="border-white/10" />

          <!-- Generate Button -->
          <button [disabled]="isGenerating()"
                  (click)="generateLocal()"
                  class="w-full py-5 rounded-2xl font-black text-lg transition-all duration-300 relative overflow-hidden group"
                  [class]="isGenerating() ? 'bg-white/10 text-text-secondary cursor-not-allowed' : 'bg-gradient-to-r from-accent-purple to-accent-cyan hover:scale-[1.02] shadow-lg shadow-accent-purple/20'">
            @if (isGenerating()) {
              <span class="relative z-10 flex items-center justify-center gap-3">
                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {{ progressMsg() }} — {{ progress() }}%
              </span>
            } @else {
              <span class="relative z-10 flex items-center justify-center gap-2 text-xl">
                🧠 Let AI Compose Music 🧠
              </span>
            }
          </button>
        </div>

        <!-- ═══════════════════════════════════════════════════ -->
        <!-- OUTPUT: Result + Audio Player                      -->
        <!-- ═══════════════════════════════════════════════════ -->
        @if (audioUrl()) {
          <div class="glass-panel p-6 rounded-3xl space-y-5 animate-fade-in-up border border-accent-cyan/30 mt-6">
            <div class="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 class="font-bold text-lg text-accent-cyan">🎧 AI Composition Complete</h3>
                <div class="flex flex-wrap gap-2 mt-2">
                  @if (aiDecision(); as d) {
                    <span class="px-3 py-1 bg-accent-purple/10 rounded-full text-xs text-accent-purple border border-accent-purple/20">
                      Genre: {{ d.genre }}
                    </span>
                    <span class="px-3 py-1 bg-accent-cyan/10 rounded-full text-xs text-accent-cyan border border-accent-cyan/20">
                      Key: {{ d.key }}
                    </span>
                    <span class="px-3 py-1 bg-yellow-500/10 rounded-full text-xs text-yellow-400 border border-yellow-500/20">
                      BPM: {{ d.bpm }}
                    </span>
                    <span class="px-3 py-1 bg-green-500/10 rounded-full text-xs text-green-400 border border-green-500/20">
                      Lead: {{ d.instrument }}
                    </span>
                    <span class="px-3 py-1 bg-white/5 rounded-full text-xs text-text-secondary border border-white/10">
                      {{ d.numBars }} bars
                    </span>
                  }
                </div>
              </div>
              <a [href]="audioUrl()"
                 download="AI_Music.wav"
                 class="px-5 py-2.5 rounded-xl bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan font-bold transition-colors flex items-center gap-2 shrink-0">
                📥 Download WAV
              </a>
            </div>

            <!-- Piano Roll Canvas -->
            <div class="space-y-2">
              <h4 class="text-sm font-semibold text-text-secondary">🎹 Piano Roll</h4>
              <canvas #pianoRollCanvas
                      class="w-full rounded-xl border border-white/10"
                      style="height: 200px; background: #0d0d24;"></canvas>
            </div>

            <!-- Audio Player -->
            <div class="p-4 bg-black/40 rounded-2xl">
              <audio [src]="audioUrl()" controls class="w-full h-10 outline-none"></audio>
            </div>
          </div>
        }
      </div>

      <!-- ═══════════════════════════════════════════════════════ -->
      <!-- CLOUD AI ENGINE (unchanged)                             -->
      <!-- ═══════════════════════════════════════════════════════ -->
      <div [class.hidden]="activeEngine() !== 'cloud'">
        @if (aiState().error) {
          <div class="p-4 rounded-xl bg-red-500/20 border border-red-500 text-red-100 flex items-center gap-3 animate-fade-in mb-6">
            <span>⚠️</span>
            <span>{{ aiState().error }}</span>
          </div>
        }

        <div class="glass-panel p-6 rounded-3xl space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2 lg:col-span-2">
              <span class="text-sm font-semibold text-text-secondary block mb-1">Hugging Face Cloud Models</span>
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

            <div class="space-y-2 lg:col-span-2">
              <label for="hf-token-input" class="text-sm font-semibold text-text-secondary">HF API Token (Optional)</label>
              <input id="hf-token-input" type="password"
                     [ngModel]="aiConfig().hfToken"
                     (ngModelChange)="updateAiConfig('hfToken', $event)"
                     placeholder="hf_xxxxxxxxxxxxxxxxxxx"
                     class="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white placeholder-white/30 focus:border-accent-cyan outline-none transition-colors" />
            </div>

            <div class="space-y-2 lg:col-span-2">
              <label for="prompt-input" class="text-sm font-semibold text-text-secondary">Music Prompt</label>
              <textarea id="prompt-input" rows="3"
                        [ngModel]="aiConfig().prompt"
                        (ngModelChange)="updateAiConfig('prompt', $event)"
                        placeholder="An 80s driving pop song with heavy drums and synth pads..."
                        class="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:border-accent-cyan outline-none transition-colors resize-none"></textarea>
            </div>
          </div>

          <hr class="border-white/10" />

          <button [disabled]="aiState().isGenerating || !aiConfig().prompt"
                  (click)="generateCloud()"
                  class="w-full py-4 rounded-2xl font-black text-lg transition-all duration-300"
                  [class]="(aiState().isGenerating || !aiConfig().prompt) ? 'bg-white/10 text-text-secondary cursor-not-allowed' : 'bg-gradient-to-r from-accent-purple to-accent-cyan hover:scale-[1.02] shadow-lg shadow-accent-purple/20'">
            @if (aiState().isGenerating) {
              <span class="flex items-center justify-center gap-3">
                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Cloud GPU Request... {{ aiState().progress }}%
              </span>
            } @else {
              ⚡ Generate Cloud AI Audio ⚡
            }
          </button>
        </div>

        @if (aiState().resultUrl) {
          <div class="glass-panel p-6 rounded-3xl space-y-4 animate-fade-in-up border border-accent-purple/30 mt-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-bold text-lg text-accent-purple">Cloud Audio Received</h3>
                <p class="text-sm text-text-secondary truncate max-w-md">Prompt: {{ aiConfig().prompt }}</p>
              </div>
              <a [href]="aiState().resultUrl"
                 download="Omni_Cloud_AI.wav"
                 class="px-5 py-2.5 rounded-xl bg-accent-purple/10 hover:bg-accent-purple/20 text-accent-purple font-bold transition-colors flex items-center gap-2 shrink-0">
                ⬇ Download
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
  private readonly aiService = inject(AiMusicService);
  private readonly proceduralService = inject(ProceduralMusicService);
  private readonly theoryService = inject(MusicTheoryService);

  @ViewChild('pianoRollCanvas') pianoRollCanvas!: ElementRef<HTMLCanvasElement>;

  readonly activeEngine = signal<'local' | 'cloud'>('local');

  // ─── Local AI Brain State ──────────────────────────────
  readonly styleHint = signal<string | null>(null);
  readonly isGenerating = signal(false);
  readonly progress = signal(0);
  readonly progressMsg = signal('');
  readonly audioUrl = signal<string | null>(null);
  readonly aiDecision = signal<{
    genre: string; key: string; bpm: number; instrument: string; numBars: number;
  } | null>(null);

  readonly genreList = Object.values(GENRE_CONFIGS);

  // Store note events for piano roll
  private lastNoteEvents: NoteEvent[] = [];

  /**
   * LOCAL AI BRAIN: Generate music autonomously.
   * The AI picks genre, key, BPM, instruments, etc.
   */
  async generateLocal(): Promise<void> {
    if (this.isGenerating()) return;

    // Revoke old URL
    if (this.audioUrl()) {
      URL.revokeObjectURL(this.audioUrl()!);
      this.audioUrl.set(null);
    }
    this.aiDecision.set(null);

    this.isGenerating.set(true);
    this.progress.set(0);
    this.progressMsg.set('AI is choosing genre, key, BPM...');

    try {
      await new Promise(r => setTimeout(r, 50)); // Let UI update

      // AI composes autonomously
      this.progress.set(10);
      this.progressMsg.set('AI composing melody, chords, bass, drums...');

      const result = this.theoryService.autoCompose(this.styleHint() ?? undefined);

      // Store decision for display
      this.aiDecision.set({
        genre: result.config.genre,
        key: result.config.key,
        bpm: result.config.bpm,
        instrument: result.instruments.lead,
        numBars: result.config.numBars,
      });

      // Store note events for piano roll
      this.lastNoteEvents = [
        ...result.melody,
        ...result.chords,
        ...result.bass,
      ];

      // Synthesize audio
      const buffer = await this.proceduralService.generateMusic(
        result.config,
        (p: number, msg?: string) => {
          this.progress.set(p);
          if (msg) this.progressMsg.set(msg);
        }
      );

      const blob = this.proceduralService.audioBufferToWavBlob(buffer);
      this.audioUrl.set(URL.createObjectURL(blob));

      // Draw piano roll after render
      setTimeout(() => this.drawPianoRoll(), 100);

    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      this.isGenerating.set(false);
    }
  }

  // ─── Piano Roll Canvas Drawing ─────────────────────────
  private drawPianoRoll(): void {
    if (!this.pianoRollCanvas) return;

    const canvas = this.pianoRollCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const noteEvents = this.lastNoteEvents;

    // Set pixel dimensions for retina
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Clear
    ctx.fillStyle = '#0d0d24';
    ctx.fillRect(0, 0, width, height);

    if (noteEvents.length === 0) {
      ctx.fillStyle = '#555';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No notes to display', width / 2, height / 2);
      return;
    }

    // Find ranges
    let minNote = 127, maxNote = 0, maxTime = 0;
    for (const e of noteEvents) {
      if (e.note < minNote) minNote = e.note;
      if (e.note > maxNote) maxNote = e.note;
      const end = e.startBeat + e.durationBeats;
      if (end > maxTime) maxTime = end;
    }

    minNote = Math.max(0, minNote - 2);
    maxNote = Math.min(127, maxNote + 2);
    maxTime = Math.max(maxTime, 1);

    const noteRange = maxNote - minNote + 1;
    const leftPad = 36;
    const plotW = width - leftPad - 8;
    const plotH = height - 24;
    const noteH = plotH / noteRange;
    const timeScale = plotW / maxTime;

    // Grid: beat lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let beat = 0; beat <= maxTime; beat += 4) {
      const x = leftPad + beat * timeScale;
      ctx.beginPath();
      ctx.moveTo(x, 8);
      ctx.lineTo(x, 8 + plotH);
      ctx.stroke();
    }

    // Grid: octave lines
    for (let n = minNote; n <= maxNote; n++) {
      if (n % 12 === 0) {
        const y = 8 + plotH - (n - minNote) * noteH;
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.beginPath();
        ctx.moveTo(leftPad, y);
        ctx.lineTo(leftPad + plotW, y);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.font = '8px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`C${Math.floor(n / 12) - 1}`, leftPad - 4, y + 3);
      }
    }

    // Color palette per pitch class
    const colors = [
      '#6c63ff', '#e91e63', '#4caf50', '#ff9800',
      '#00bcd4', '#9c27b0', '#ffeb3b', '#ff5722',
      '#2196f3', '#8bc34a', '#ff4081', '#00e676',
    ];

    // Draw notes
    for (const e of noteEvents) {
      const x = leftPad + e.startBeat * timeScale;
      const y = 8 + plotH - (e.note - minNote + 1) * noteH;
      const w = Math.max(e.durationBeats * timeScale, 2);
      const h = Math.max(noteH - 1, 2);

      const color = colors[e.note % 12];
      const alpha = Math.min(1, (e.velocity / 127) * 0.8 + 0.2);

      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 2);
      ctx.fill();

      ctx.shadowColor = color;
      ctx.shadowBlur = 3;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
  }

  // ─── Cloud AI Engine State ─────────────────────────────
  readonly aiConfig = signal<AiMusicConfig>({
    prompt: '',
    duration: 10,
    modelType: 'facebook/musicgen-small',
    hfToken: ''
  });

  readonly aiState = this.aiService.state;

  readonly aiModels: { value: AiMusicConfig['modelType']; label: string }[] = [
    { value: 'facebook/musicgen-small', label: 'Meta MusicGen (Stable)' },
    { value: 'cvssp/audioldm-s-full-v2', label: 'AudioLDM 2 (Experimental)' },
  ];

  updateAiConfig<K extends keyof AiMusicConfig>(key: K, value: AiMusicConfig[K]): void {
    this.aiConfig.set({ ...this.aiConfig(), [key]: value });
  }

  generateCloud(): void {
    if (this.aiState().isGenerating || !this.aiConfig().prompt) return;
    this.aiService.generate(this.aiConfig());
  }
}
