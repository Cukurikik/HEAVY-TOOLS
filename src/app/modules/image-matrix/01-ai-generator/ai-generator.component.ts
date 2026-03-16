import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NvidiaAiService, NvidiaAiConfig } from './services/nvidia-ai.service';

@Component({
  selector: 'app-ai-image-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen p-6 md:p-12 animate-fade-in">
      <div class="max-w-5xl mx-auto space-y-8">
        
        <!-- Header Section -->
        <header class="text-center space-y-4 mb-8">
          <div class="inline-flex items-center justify-center p-3 sm:p-4 rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-900/40 border border-green-500/30 mb-2 shadow-[0_0_40px_rgba(34,197,94,0.15)]">
            <svg class="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
            </svg>
          </div>
          <h1 class="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 tracking-tight">
            NVIDIA Cloud AI Generator
          </h1>
          <p class="text-text-secondary max-w-2xl mx-auto text-sm md:text-base">
            Powered by <strong>Stable Diffusion 3.5 Large</strong> on NVIDIA H100 Tensor Core GPUs. Generate enterprise-grade masterpieces in seconds without using local hardware.
          </p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- LEFT CONTROLS PANEL -->
          <div class="lg:col-span-5 space-y-6">
            
            <div class="glass-panel p-6 rounded-3xl space-y-6 border border-white/5 relative overflow-hidden group">
              <!-- Animated Background Glow -->
              <div class="absolute -inset-20 bg-gradient-to-b from-green-500/5 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10 pointer-events-none"></div>

              <!-- Error Alert -->
              @if (aiState().error) {
                <div class="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-3">
                  <span class="mt-0.5">⚠️</span>
                  <p class="text-sm font-medium">{{ aiState().error }}</p>
                </div>
              }

              <!-- Prompt Input -->
              <div class="space-y-3">
                <label for="prompt-input" class="font-bold text-white/90 flex justify-between items-center text-sm">
                  <span>Creative Prompt D-3.5</span>
                  <span class="text-xs text-white/40 font-mono">{{ config().prompt.length }}/1000</span>
                </label>
                <div class="relative">
                  <textarea 
                    id="prompt-input"
                    [(ngModel)]="config().prompt" 
                    [disabled]="aiState().isGenerating"
                    (input)="updateConfig('prompt', $any($event.target).value)"
                    placeholder="E.g., A sprawling cyberpunk metropolis in the year 2077, cinematic lighting, neon reflections on wet asphalt, volumetric fog, Unreal Engine 5 render, 8k resolution, masterpiece..."
                    rows="4"
                    class="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder-white/20 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all resize-none shadow-inner"
                  ></textarea>
                </div>
                <div class="flex flex-wrap gap-2 mt-2">
                   <button (click)="applyPromptPreset('Cinematic Portait')" class="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors border border-white/5">Portrait</button>
                   <button (click)="applyPromptPreset('Sci-Fi Landscape')" class="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors border border-white/5">Sci-Fi</button>
                   <button (click)="applyPromptPreset('Anime Masterpiece')" class="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors border border-white/5">Anime</button>
                   <button (click)="applyPromptPreset('Photorealistic Macro')" class="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors border border-white/5">Macro</button>
                </div>
              </div>

              <!-- Aspect Ratio Selection -->
              <div class="space-y-3 pt-2">
                <h3 class="font-bold text-white/90 text-sm">Aspect Ratio</h3>
                <div class="grid grid-cols-3 gap-3">
                  <button (click)="updateConfig('aspectRatio', '1:1')" [disabled]="aiState().isGenerating"
                          class="py-3 px-2 rounded-xl border transition-all flex flex-col items-center justify-center gap-2"
                          [class]="config().aspectRatio === '1:1' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-black/30 border-white/10 text-white/50 hover:bg-white/5'">
                    <div class="w-6 h-6 border-2 border-current rounded-sm"></div>
                    <span class="text-xs font-bold">Square (1:1)</span>
                  </button>
                  <button (click)="updateConfig('aspectRatio', '16:9')" [disabled]="aiState().isGenerating"
                          class="py-3 px-2 rounded-xl border transition-all flex flex-col items-center justify-center gap-2"
                          [class]="config().aspectRatio === '16:9' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-black/30 border-white/10 text-white/50 hover:bg-white/5'">
                    <div class="w-8 h-5 border-2 border-current rounded-sm"></div>
                    <span class="text-xs font-bold">Landscape (16:9)</span>
                  </button>
                  <button (click)="updateConfig('aspectRatio', '9:16')" [disabled]="aiState().isGenerating"
                          class="py-3 px-2 rounded-xl border transition-all flex flex-col items-center justify-center gap-2"
                          [class]="config().aspectRatio === '9:16' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-black/30 border-white/10 text-white/50 hover:bg-white/5'">
                    <div class="w-5 h-8 border-2 border-current rounded-sm"></div>
                    <span class="text-xs font-bold">Portrait (9:16)</span>
                  </button>
                </div>
              </div>
              
              <hr class="border-white/5" />

              <!-- Generate Button -->
              <button 
                [disabled]="aiState().isGenerating || !config().prompt.trim()"
                (click)="generateImage()"
                class="w-full py-4 rounded-xl font-bold text-white transition-all overflow-hidden relative group"
                [class]="(aiState().isGenerating || !config().prompt.trim()) ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.02] shadow-[0_0_20px_rgba(34,197,94,0.3)]'">
                
                @if (aiState().isGenerating) {
                  <div class="absolute inset-0 bg-green-500/20 animate-pulse"></div>
                  <!-- Progress Bar via CSS width -->
                  <div class="absolute left-0 top-0 bottom-0 bg-green-500/30 transition-all duration-300" [style.width.%]="aiState().progress"></div>
                  
                  <span class="relative z-10 flex items-center justify-center gap-3">
                    <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {{ aiState().message }}
                  </span>
                } @else {
                  <span class="relative z-10 flex items-center justify-center gap-2 text-lg">
                    ✨ Generate Masterpiece
                  </span>
                }
              </button>

            </div>
          </div>

          <!-- RIGHT PREVIEW PANEL -->
          <div class="lg:col-span-7">
            <div class="glass-panel p-2 rounded-3xl h-full min-h-[400px] flex flex-col relative border border-white/5 
                        shadow-2xl overflow-hidden transition-all duration-700 decoration-clone"
                 [class]="aiState().resultUrl ? 'border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.15)] bg-black/60' : 'bg-black/20'">
              
              <!-- Blank State -->
              @if (!aiState().resultUrl && !aiState().isGenerating) {
                <div class="m-auto flex flex-col items-center justify-center text-white/20 p-12 text-center opacity-70">
                   <svg class="w-24 h-24 mb-6 stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                   </svg>
                   <h3 class="text-xl font-bold text-white/40 mb-2">Canvas Ready</h3>
                   <p class="text-sm max-w-sm">Enter a prompt and unleash the power of NVIDIA Cloud GPUs to generate stunning visuals.</p>
                </div>
              }

              <!-- Loading State -->
              @if (aiState().isGenerating) {
                <div class="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div class="flex flex-col items-center gap-6 animate-fade-in">
                    
                    <!-- Futuristic Spinner -->
                    <div class="relative w-24 h-24">
                      <div class="absolute inset-0 border-4 border-green-500/20 rounded-full"></div>
                      <div class="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
                      <div class="absolute inset-2 border-4 border-emerald-400/30 rounded-full border-b-transparent animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>
                      <div class="absolute inset-0 flex items-center justify-center">
                         <span class="text-green-400 font-bold font-mono text-sm">{{ aiState().progress }}%</span>
                      </div>
                    </div>
                    
                    <div class="text-center space-y-1">
                      <p class="text-green-400 font-bold font-mono text-sm tracking-widest uppercase">NVIDIA H100 GPU CLUSTER</p>
                      <p class="text-text-secondary text-sm animate-pulse">{{ aiState().message }}</p>
                    </div>

                  </div>
                </div>
              }

              <!-- Result State -->
              @if (aiState().resultUrl) {
                <div class="relative flex-1 rounded-2xl overflow-hidden bg-black/50 group animate-fade-in-up">
                  <img [src]="aiState().resultUrl" 
                       class="absolute inset-0 w-full h-full object-contain transition-transform duration-[2s] group-hover:scale-[1.02]" 
                       alt="NVIDIA Generated Image" />
                  
                  <!-- Hover Overlay Info -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-end p-6">
                    <p class="text-white text-sm line-clamp-2 italic font-serif">"{{ config().prompt }}"</p>
                    <p class="text-green-400 text-xs mt-1 font-mono uppercase tracking-wider">SD 3.5 LARGE • {{ config().aspectRatio }}</p>
                  </div>
                </div>

                <!-- Action Bar -->
                <div class="p-3 bg-black/40 backdrop-blur-md rounded-2xl mx-3 mb-3 mt-3 flex items-center justify-between border border-white/5 shadow-lg animate-fade-in-up">
                  <div class="flex items-center gap-3">
                     <div class="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                       <svg class="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                       </svg>
                     </div>
                     <span class="text-white font-bold text-sm">Generation Successful</span>
                  </div>
                  
                  <a [href]="aiState().resultUrl"
                     download="Omni-Nvidia-Gen.png"
                     class="px-6 py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(34,197,94,0.4)] flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Download HQ
                  </a>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AiImageGeneratorComponent {
  private readonly nvidiaService = inject(NvidiaAiService);

  readonly aiState = this.nvidiaService.state;

  readonly config = signal<NvidiaAiConfig>({
    prompt: '',
    aspectRatio: '16:9'
  });

  updateConfig(key: keyof NvidiaAiConfig, value: string) {
    this.config.update(c => ({ ...c, [key]: value }));
  }

  applyPromptPreset(presetName: string) {
    let suffix = "";
    if (presetName === 'Cinematic Portait') {
      suffix = "cinematic portrait photography, 85mm lens, rim lighting, 8k, photorealistic masterpiece, dramatic shadows";
    } else if (presetName === 'Sci-Fi Landscape') {
      suffix = "epic sci-fi landscape, massive structures, nebula sky, glowing neon, concept art by Greg Rutkowski, trending on ArtStation";
    } else if (presetName === 'Anime Masterpiece') {
      suffix = "Studio Ghibli style anime illustration, vibrant colors, magical lighting, sharp focus, masterpiece character design";
    } else if (presetName === 'Photorealistic Macro') {
      suffix = "extreme macro photography, ultra detailed, depth of field, 4k, National Geographic style";
    }

    const currentPrompt = this.config().prompt.trim();
    const newPrompt = currentPrompt ? `${currentPrompt}, ${suffix}` : suffix;
    this.updateConfig('prompt', newPrompt);
  }

  generateImage() {
    this.nvidiaService.generateImage(this.config());
  }
}
