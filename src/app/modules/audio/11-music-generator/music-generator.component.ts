import { Component, ChangeDetectionStrategy, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiMusicService, AiMusicConfig } from './services/ai-music.service';
import { ProceduralMusicService } from './services/procedural-music.service';
import {
  MusicTheoryService,
  GENRE_CONFIGS,
  NOTE_NAMES,
  INSTRUMENT_OPTIONS,
  NoteEvent,
  CompositionRequest,
} from './services/music-theory.service';
import { StyleParserService, AudioAnalysisResult } from './services/style-parser.service';

/**
 * MUSIC GENERATOR COMPONENT
 *
 * 4 Generation Modes:
 *   🎲 Auto   — AI decides everything autonomously
 *   🎛️ Manual — User controls genre, key, BPM, instrument, bars, temperature
 *   ✏️ Text   — User types a free-text style description
 *   🎧 Upload — User uploads audio, AI creates ~50% similar music
 */

type GenerationMode = 'auto' | 'manual' | 'text' | 'upload';

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
          <!-- Engine Switcher: Local vs Cloud -->
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
      </header>

      <!-- ═══════════════════════════════════════════════════════ -->
      <!-- LOCAL AI BRAIN ENGINE                                   -->
      <!-- ═══════════════════════════════════════════════════════ -->
      <div [class.hidden]="activeEngine() !== 'local'">

        <!-- ─── 4 Mode Tabs ─────────────────────────────────── -->
        <div class="flex flex-wrap gap-2 mb-6">
          @for (m of modeTabs; track m.id) {
            <button (click)="genMode.set(m.id)"
                    class="py-2.5 px-5 rounded-xl border-2 font-bold transition-all text-sm"
                    [class]="genMode() === m.id
                      ? 'bg-accent-purple/20 border-accent-purple text-accent-purple scale-105'
                      : 'border-transparent bg-white/5 hover:bg-white/10 text-text-secondary'">
              {{ m.icon }} {{ m.label }}
            </button>
          }
        </div>

        <!-- ═════════════════════════════════════════════════ -->
        <!-- MODE: AUTO                                        -->
        <!-- ═════════════════════════════════════════════════ -->
        @if (genMode() === 'auto') {
          <div class="glass-panel p-6 rounded-3xl space-y-5">
            <p class="text-text-secondary text-sm">
              AI autonomously chooses genre, key, BPM, instruments, and more.
            </p>
            <!-- Optional Style Hint -->
            <div class="flex flex-wrap gap-2">
              <button (click)="styleHint.set(null)"
                      class="py-2 px-4 rounded-xl border-2 font-bold transition-all text-xs"
                      [class]="!styleHint() ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan' : 'border-transparent bg-white/5 text-text-secondary'">
                🎲 Random
              </button>
              @for (g of genreList; track g.name) {
                <button (click)="styleHint.set(g.name)"
                        class="py-2 px-4 rounded-xl border-2 font-bold transition-all text-xs"
                        [class]="styleHint() === g.name ? 'bg-accent-purple/20 border-accent-purple text-accent-purple' : 'border-transparent bg-white/5 text-text-secondary'">
                  {{ g.icon }}
                </button>
              }
            </div>
          </div>
        }

        <!-- ═════════════════════════════════════════════════ -->
        <!-- MODE: MANUAL                                      -->
        <!-- ═════════════════════════════════════════════════ -->
        @if (genMode() === 'manual') {
          <div class="glass-panel p-6 rounded-3xl space-y-5">
            <p class="text-text-secondary text-sm">
              Full control over every musical parameter.
            </p>

            <!-- Genre -->
            <div class="space-y-2">
              <span class="text-xs font-semibold text-text-secondary block">Genre</span>
              <div class="flex flex-wrap gap-2">
                @for (g of genreList; track g.name) {
                  <button (click)="updateManualConfig('genre', g.name)"
                          class="py-2 px-4 rounded-xl border-2 font-bold transition-all text-xs"
                          [class]="manualConfig().genre === g.name ? 'bg-accent-purple/20 border-accent-purple text-accent-purple' : 'border-transparent bg-white/5 text-text-secondary'">
                    {{ g.icon }} {{ g.label.split(' ')[1] }}
                  </button>
                }
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <!-- Key -->
              <div class="space-y-1">
                <label for="manual-key" class="text-xs font-semibold text-text-secondary">Key</label>
                <select id="manual-key"
                        [ngModel]="manualConfig().key"
                        (ngModelChange)="updateManualConfig('key', $event)"
                        class="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white text-sm focus:border-accent-cyan outline-none">
                  @for (k of noteNames; track k) {
                    <option [value]="k">{{ k }}</option>
                  }
                </select>
              </div>

              <!-- BPM -->
              <div class="space-y-1">
                <label for="manual-bpm" class="text-xs font-semibold text-text-secondary">BPM: {{ manualConfig().bpm }}</label>
                <input id="manual-bpm" type="range" min="40" max="200" step="1"
                       [ngModel]="manualConfig().bpm"
                       (ngModelChange)="updateManualConfig('bpm', $event)"
                       class="w-full accent-accent-purple" />
              </div>

              <!-- Instrument -->
              <div class="space-y-1">
                <label for="manual-inst" class="text-xs font-semibold text-text-secondary">Lead Instrument</label>
                <select id="manual-inst"
                        [ngModel]="manualConfig().instrument"
                        (ngModelChange)="updateManualConfig('instrument', $event)"
                        class="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white text-sm focus:border-accent-cyan outline-none">
                  @for (i of instrumentOptions; track i.value) {
                    <option [value]="i.value">{{ i.label }}</option>
                  }
                </select>
              </div>

              <!-- Bars -->
              <div class="space-y-1">
                <label for="manual-bars" class="text-xs font-semibold text-text-secondary">Bars: {{ manualConfig().numBars }}</label>
                <input id="manual-bars" type="range" min="4" max="64" step="4"
                       [ngModel]="manualConfig().numBars"
                       (ngModelChange)="updateManualConfig('numBars', $event)"
                       class="w-full accent-accent-cyan" />
              </div>

              <!-- Temperature -->
              <div class="space-y-1">
                <label for="manual-temp" class="text-xs font-semibold text-text-secondary">Creativity: {{ manualConfig().temperature.toFixed(2) }}</label>
                <input id="manual-temp" type="range" min="0.1" max="1.5" step="0.05"
                       [ngModel]="manualConfig().temperature"
                       (ngModelChange)="updateManualConfig('temperature', +$event)"
                       class="w-full accent-accent-purple" />
              </div>

              <!-- Effects Toggle -->
              <div class="flex items-end gap-2 pb-1">
                <label for="manual-fx" class="flex items-center gap-2 cursor-pointer text-xs text-text-secondary">
                  <input id="manual-fx" type="checkbox"
                         [ngModel]="manualConfig().addEffects"
                         (ngModelChange)="updateManualConfig('addEffects', $event)"
                         class="accent-accent-cyan w-4 h-4" />
                  🎛️ Add Effects
                </label>
              </div>
            </div>
          </div>
        }

        <!-- ═════════════════════════════════════════════════ -->
        <!-- MODE: TEXT                                        -->
        <!-- ═════════════════════════════════════════════════ -->
        @if (genMode() === 'text') {
          <div class="glass-panel p-6 rounded-3xl space-y-5">
            <p class="text-text-secondary text-sm">
              Describe the music you want and the AI will interpret your words.
            </p>
            <textarea id="style-text-input" rows="3"
                      [ngModel]="styleText()"
                      (ngModelChange)="styleText.set($event)"
                      placeholder="e.g. chill lofi piano with rain vibes, 80 bpm, key of D, 16 bars"
                      class="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:border-accent-cyan outline-none resize-none text-sm"></textarea>
            @if (parsedPreview()) {
              <div class="flex flex-wrap gap-2 text-xs">
                <span class="px-2 py-1 bg-accent-purple/10 rounded-full text-accent-purple border border-accent-purple/20">Genre: {{ parsedPreview()!.genre }}</span>
                <span class="px-2 py-1 bg-accent-cyan/10 rounded-full text-accent-cyan border border-accent-cyan/20">Key: {{ parsedPreview()!.key }}</span>
                <span class="px-2 py-1 bg-yellow-500/10 rounded-full text-yellow-400 border border-yellow-500/20">BPM: {{ parsedPreview()!.bpm }}</span>
                <span class="px-2 py-1 bg-green-500/10 rounded-full text-green-400 border border-green-500/20">Instrument: {{ parsedPreview()!.instrument }}</span>
              </div>
            }
          </div>
        }

        <!-- ═════════════════════════════════════════════════ -->
        <!-- MODE: UPLOAD AUDIO                                -->
        <!-- ═════════════════════════════════════════════════ -->
        @if (genMode() === 'upload') {
          <div class="glass-panel p-6 rounded-3xl space-y-5">
            <p class="text-text-secondary text-sm">
              Upload a reference track and the AI will analyze it, then generate something ~50% similar — same key/BPM but fresh composition.
            </p>
            <div class="border-2 border-dashed border-white/15 rounded-2xl p-8 text-center cursor-pointer hover:border-accent-cyan/40 transition-colors"
                 (click)="fileInput.click()"
                 role="button"
                 tabindex="0"
                 (keydown.enter)="fileInput.click()"
                 (keydown.space)="fileInput.click()">
              <input #fileInput type="file" accept="audio/*" class="hidden"
                     (change)="onFileUpload($event)" />
              @if (uploadedFileName()) {
                <div class="space-y-2">
                  <div class="text-4xl">🎧</div>
                  <div class="text-white font-bold">{{ uploadedFileName() }}</div>
                  <div class="text-text-secondary text-xs">Click to change file</div>
                </div>
              } @else {
                <div class="space-y-2">
                  <div class="text-5xl opacity-30">📂</div>
                  <div class="text-text-secondary text-sm">Click or drag audio file here</div>
                  <div class="text-text-secondary text-xs">Supports MP3, WAV, OGG, FLAC</div>
                </div>
              }
            </div>

            @if (audioAnalysis()) {
              <div class="grid grid-cols-3 md:grid-cols-5 gap-3 text-center">
                <div class="bg-black/30 rounded-xl p-3">
                  <div class="text-lg font-bold text-accent-purple">{{ audioAnalysis()!.detectedBpm }}</div>
                  <div class="text-xs text-text-secondary">BPM</div>
                </div>
                <div class="bg-black/30 rounded-xl p-3">
                  <div class="text-lg font-bold text-accent-cyan">{{ audioAnalysis()!.detectedKey }}</div>
                  <div class="text-xs text-text-secondary">Key</div>
                </div>
                <div class="bg-black/30 rounded-xl p-3">
                  <div class="text-lg font-bold text-yellow-400">{{ (audioAnalysis()!.energy * 100).toFixed(0) }}%</div>
                  <div class="text-xs text-text-secondary">Energy</div>
                </div>
                <div class="bg-black/30 rounded-xl p-3">
                  <div class="text-lg font-bold text-green-400">{{ audioAnalysis()!.suggestedGenre }}</div>
                  <div class="text-xs text-text-secondary">Genre</div>
                </div>
                <div class="bg-black/30 rounded-xl p-3">
                  <div class="text-lg font-bold text-pink-400">{{ audioAnalysis()!.suggestedInstrument }}</div>
                  <div class="text-xs text-text-secondary">Instrument</div>
                </div>
              </div>
            }
          </div>
        }

        <!-- ═══════════════════════════════════════════════════ -->
        <!-- GENERATE BUTTON (Universal)                         -->
        <!-- ═══════════════════════════════════════════════════ -->
        <button [disabled]="isGenerating() || (genMode() === 'text' && !styleText()) || (genMode() === 'upload' && !uploadedFile())"
                (click)="generateLocal()"
                class="w-full py-5 rounded-2xl font-black text-lg transition-all duration-300 relative overflow-hidden group mt-6"
                [class]="isGenerating() ? 'bg-white/10 text-text-secondary cursor-not-allowed' : 'bg-gradient-to-r from-accent-purple to-accent-cyan hover:scale-[1.02] shadow-lg shadow-accent-purple/20'">
          @if (isGenerating()) {
            <span class="relative z-10 flex items-center justify-center gap-3">
              <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              {{ progressMsg() }} — {{ progress() }}%
            </span>
          } @else {
            <span class="relative z-10 flex items-center justify-center gap-2 text-xl">
              @switch (genMode()) {
                @case ('auto') { 🎲 Let AI Compose }
                @case ('manual') { 🎛️ Generate Music }
                @case ('text') { ✏️ Create from Description }
                @case ('upload') { 🎧 Generate Similar }
              }
            </span>
          }
        </button>

        <!-- ═══════════════════════════════════════════════════ -->
        <!-- OUTPUT: Result + Audio Player                       -->
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
  private readonly styleParser = inject(StyleParserService);

  @ViewChild('pianoRollCanvas') pianoRollCanvas!: ElementRef<HTMLCanvasElement>;

  readonly activeEngine = signal<'local' | 'cloud'>('local');
  readonly genMode = signal<GenerationMode>('auto');

  // ─── Mode Tabs ─────────────────────────────────────────
  readonly modeTabs: { id: GenerationMode; icon: string; label: string }[] = [
    { id: 'auto', icon: '🎲', label: 'Auto (AI Decides)' },
    { id: 'manual', icon: '🎛️', label: 'Manual' },
    { id: 'text', icon: '✏️', label: 'Text Style' },
    { id: 'upload', icon: '🎧', label: 'Upload Audio' },
  ];

  // ─── Shared State ──────────────────────────────────────
  readonly isGenerating = signal(false);
  readonly progress = signal(0);
  readonly progressMsg = signal('');
  readonly audioUrl = signal<string | null>(null);
  readonly aiDecision = signal<CompositionRequest | null>(null);

  readonly genreList = Object.entries(GENRE_CONFIGS).map(([key, config]) => ({
    name: key,
    label: config.display_name,
    icon: config.display_name.split(' ')[0],
    ...config
  }));
  readonly noteNames = [...NOTE_NAMES];
  readonly instrumentOptions = INSTRUMENT_OPTIONS;

  private lastNoteEvents: NoteEvent[] = [];

  // ─── Auto Mode State ───────────────────────────────────
  readonly styleHint = signal<string | null>(null);

  // ─── Manual Mode State ─────────────────────────────────
  readonly manualConfig = signal<CompositionRequest>({
    genre: 'pop',
    key: 'C',
    bpm: 120,
    numBars: 16,
    instrument: 'piano',
    temperature: 0.8,
    addEffects: true,
  });

  // ─── Text Mode State ───────────────────────────────────
  readonly styleText = signal('');
  readonly parsedPreview = signal<CompositionRequest | null>(null);

  // ─── Upload Mode State ─────────────────────────────────
  readonly uploadedFile = signal<File | null>(null);
  readonly uploadedFileName = signal('');
  readonly audioAnalysis = signal<AudioAnalysisResult | null>(null);
  private uploadConfig: CompositionRequest | null = null;

  /**
   * Update manual config field
   */
  updateManualConfig<K extends keyof CompositionRequest>(key: K, value: CompositionRequest[K]): void {
    this.manualConfig.set({ ...this.manualConfig(), [key]: value });
  }

  /**
   * Handle file upload for similarity mode
   */
  async onFileUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadedFile.set(file);
    this.uploadedFileName.set(file.name);
    this.audioAnalysis.set(null);

    try {
      const result = await this.styleParser.analyzeUploadedAudio(file);
      this.audioAnalysis.set(result.analysis);
      this.uploadConfig = result.config;
    } catch (err) {
      console.error('Audio analysis failed:', err);
    }
  }

  /**
   * GENERATE MUSIC — dispatches to the correct mode
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

    try {
      let config: CompositionRequest;

      switch (this.genMode()) {
        case 'auto': {
          this.progressMsg.set('AI choosing genre, key, BPM...');
          await this.yieldToUI();
          const result = this.theoryService.autoCompose(this.styleHint() ?? undefined);
          config = result.config;
          this.lastNoteEvents = [...result.melody, ...result.chords, ...result.bass];
          break;
        }
        case 'manual': {
          config = { ...this.manualConfig() };
          this.progressMsg.set('Composing with your settings...');
          await this.yieldToUI();
          const comp = this.theoryService.compose(config);
          this.lastNoteEvents = [...comp.melody, ...comp.chords, ...comp.bass];
          break;
        }
        case 'text': {
          this.progressMsg.set('Parsing your description...');
          await this.yieldToUI();
          config = this.styleParser.parseStyleText(this.styleText());
          this.parsedPreview.set(config);
          const compText = this.theoryService.compose(config);
          this.lastNoteEvents = [...compText.melody, ...compText.chords, ...compText.bass];
          break;
        }
        case 'upload': {
          if (!this.uploadConfig) return;
          config = this.uploadConfig;
          this.progressMsg.set('Generating music similar to your upload...');
          await this.yieldToUI();
          const compUp = this.theoryService.compose(config);
          this.lastNoteEvents = [...compUp.melody, ...compUp.chords, ...compUp.bass];
          break;
        }
      }

      this.aiDecision.set(config);

      // Synthesize audio
      const buffer = await this.proceduralService.generateMusic(
        config,
        (p: number, msg?: string) => {
          this.progress.set(p);
          if (msg) this.progressMsg.set(msg);
        }
      );

      const blob = this.proceduralService.audioBufferToWavBlob(buffer);
      this.audioUrl.set(URL.createObjectURL(blob));

      setTimeout(() => this.drawPianoRoll(), 100);
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      this.isGenerating.set(false);
    }
  }

  private yieldToUI(): Promise<void> {
    return new Promise(r => setTimeout(r, 30));
  }

  // ─── Piano Roll Canvas Drawing ─────────────────────────
  private drawPianoRoll(): void {
    if (!this.pianoRollCanvas) return;

    const canvas = this.pianoRollCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const noteEvents = this.lastNoteEvents;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    ctx.fillStyle = '#0d0d24';
    ctx.fillRect(0, 0, width, height);

    if (noteEvents.length === 0) {
      ctx.fillStyle = '#555';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No notes to display', width / 2, height / 2);
      return;
    }

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

    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let beat = 0; beat <= maxTime; beat += 4) {
      const x = leftPad + beat * timeScale;
      ctx.beginPath();
      ctx.moveTo(x, 8);
      ctx.lineTo(x, 8 + plotH);
      ctx.stroke();
    }

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

    const colors = [
      '#6c63ff', '#e91e63', '#4caf50', '#ff9800',
      '#00bcd4', '#9c27b0', '#ffeb3b', '#ff5722',
      '#2196f3', '#8bc34a', '#ff4081', '#00e676',
    ];

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
