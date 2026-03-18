import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ai-generator',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple">
          🎨 AI Image Generator
        </h1>
        <p class="text-text-secondary text-sm">Generate stunning images from text prompts using AI models powered by WebGPU.</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Input Section -->
        <div class="space-y-4">
          <div class="glass-panel rounded-2xl p-6 space-y-4">
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <mat-icon class="text-accent-cyan">edit</mat-icon> Prompt
            </h3>
            <textarea
              rows="5"
              placeholder="Describe the image you want to generate..."
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent-cyan resize-none"></textarea>

            <div class="glass-panel rounded-xl p-4 space-y-3">
              <h4 class="text-sm font-medium text-text-secondary">Settings</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-xs text-text-muted block mb-1">Width</label>
                  <select class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent-cyan">
                    <option value="512">512px</option>
                    <option value="768">768px</option>
                    <option value="1024" selected>1024px</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs text-text-muted block mb-1">Height</label>
                  <select class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent-cyan">
                    <option value="512">512px</option>
                    <option value="768">768px</option>
                    <option value="1024" selected>1024px</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs text-text-muted block mb-1">Steps</label>
                  <input type="number" value="20" min="1" max="100" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent-cyan">
                </div>
                <div>
                  <label class="text-xs text-text-muted block mb-1">Guidance</label>
                  <input type="number" value="7.5" min="1" max="20" step="0.5" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent-cyan">
                </div>
              </div>
            </div>

            <button class="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-accent-cyan to-accent-purple text-black hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2">
              <mat-icon>auto_awesome</mat-icon> Generate Image
            </button>
          </div>
        </div>

        <!-- Preview Section -->
        <div class="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center min-h-[400px]">
          <div class="text-center space-y-4">
            <mat-icon class="text-6xl text-text-disabled">image</mat-icon>
            <p class="text-text-muted">Your generated image will appear here</p>
            <p class="text-xs text-text-disabled">Powered by Stable Diffusion WASM / WebGPU</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AiGeneratorComponent {}
