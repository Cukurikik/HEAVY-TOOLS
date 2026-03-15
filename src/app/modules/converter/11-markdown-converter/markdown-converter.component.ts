// ============================================================
// FEATURE 11 — MARKDOWN CONVERTER — Component (FULLY FUNCTIONAL)
// Route: /converter/markdown-converter
// Converts Markdown to HTML, TXT natively
// Converts HTML to Markdown natively
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConverterFileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { MarkdownConverterActions, selectMarkdownConverterState } from './markdown-converter.store';

import { marked } from 'marked';
import TurndownService from 'turndown';

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'html', label: 'HTML', icon: '🌐' },
  { value: 'md',   label: 'Markdown', icon: '📝' },
  { value: 'txt',  label: 'Plain Text', icon: '📄' },
];

@Component({
  selector: 'app-markdown-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, ConverterFileDropZoneComponent, ConverterFormatSelectorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          📝 Markdown & HTML Converter
        </h1>
        <p class="text-white/50 text-sm">Convert Markdown to HTML/TXT, or reverse HTML to Markdown — live preview included</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- LEFT: Input & Controls -->
        <div class="space-y-4">
          <app-converter-file-drop-zone
            accept=".md,.markdown,.html,.htm,.txt"
            [multiple]="false"
            [maxSizeMB]="10"
            label="Drop Markdown/HTML file or click to browse"
            (filesSelected)="onFileSelected($event)" />

          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs text-white/40 uppercase tracking-wider font-semibold">Input Content</span>
              <button (click)="inputText.set('')" class="text-xs text-red-400 hover:text-red-300">Clear</button>
            </div>
            
            <textarea rows="16" [value]="inputText()"
              (input)="onInputChange(($any($event.target)).value)"
              placeholder="# Hello World&#10;&#10;Try typing Markdown or HTML here..."
              class="w-full px-3 py-3 text-sm bg-[#12121a] border border-white/15 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-400 resize-none font-mono"></textarea>
          </div>

          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
             <span class="text-xs text-white/40 uppercase tracking-wider font-semibold">Convert To</span>
             <app-converter-format-selector
               [formats]="outputFormats"
               [selected]="outputFormat()"
               (formatChange)="outputFormat.set($event); process()" />
          </div>
          
          @if (errorMessage()) {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              ⚠️ {{ errorMessage() }}
            </div>
          }
        </div>

        <!-- RIGHT: Output / Preview -->
        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 h-[700px] flex flex-col">
            <div class="flex items-center justify-between shrink-0 mb-2 border-b border-white/10 pb-3">
              <!-- Mode Toggle for Output -->
              <div class="flex gap-2">
                <button (click)="viewMode.set('code')" [class]="viewMode() === 'code' ? 'px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm' : 'px-3 py-1.5 rounded-lg text-white/50 text-sm hover:text-white'">Code View</button>
                <button (click)="viewMode.set('preview')" [class]="viewMode() === 'preview' ? 'px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm' : 'px-3 py-1.5 rounded-lg text-white/50 text-sm hover:text-white'">Rich Preview</button>
              </div>

              <div class="flex gap-2">
                <button (click)="onCopy()" class="px-3 py-1.5 bg-white/5 text-white/70 rounded-lg text-xs hover:bg-white/10 border border-white/10 font-bold">📋 COPT {{ outputFormat().toUpperCase() }}</button>
                <button (click)="onDownload()" class="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-500 text-black rounded-lg text-xs hover:scale-105 font-bold shadow-lg">📥 DOWNLOAD FILE</button>
              </div>
            </div>
            
            @if (viewMode() === 'code') {
              <textarea readonly [value]="outputText()" 
                class="w-full flex-1 px-3 py-3 text-sm bg-[#12121a] border border-white/10 rounded-xl text-white focus:outline-none resize-none font-mono tracking-tight leading-relaxed select-all"
                placeholder="Converted source code will appear here..."></textarea>
            } @else {
              <!-- Safari/Webkit requires Tailwind config for prose. For now we use basic styles -->
              <div class="w-full flex-1 p-4 bg-white text-black rounded-xl overflow-y-auto font-sans article-preview"
                   [innerHtml]="previewHtml()">
              </div>
            }
          </div>
          
          @if (showCopied()) {
            <div class="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center animate-pulse">
              ✅ Copied to clipboard!
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class MarkdownConverterComponent implements OnDestroy {
  private store = inject(Store);
  state$ = this.store.select(selectMarkdownConverterState);
  outputFormats = OUTPUT_FORMATS;

  readonly inputText = signal('');
  readonly outputText = signal('');
  readonly previewHtml = signal('');
  readonly outputFormat = signal('html');
  readonly errorMessage = signal('');
  readonly showCopied = signal(false);
  readonly viewMode = signal<'code'|'preview'>('code');

  private debounceTimer: any;
  private turndownService = new TurndownService({ headingStyle: 'atx' });

  async onFileSelected(files: File[]): Promise<void> {
    const file = files[0];
    if (!file) return;

    try {
      const text = await file.text();
      this.inputText.set(text);
      
      // Auto-detect direction
      if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        this.outputFormat.set('md');
      } else {
        this.outputFormat.set('html');
      }
      
      this.process();
    } catch {
      this.errorMessage.set('Failed to read file.');
    }
  }

  onInputChange(val: string): void {
    this.inputText.set(val);
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.process(), 300);
  }

  async process(): Promise<void> {
    const input = this.inputText().trim();
    if (!input) {
      this.outputText.set('');
      this.previewHtml.set('');
      this.errorMessage.set('');
      return;
    }

    try {
      this.errorMessage.set('');
      const format = this.outputFormat();
      
      let htmlRendered = '';
      let markdownSource = '';
      
      // We parse the input as Markdown AND HTML depending on what it looks like
      const isHtmlLike = input.trim().startsWith('<') && input.trim().endsWith('>');
      
      if (isHtmlLike) {
        htmlRendered = input;
        markdownSource = this.turndownService.turndown(input);
      } else {
        markdownSource = input;
        htmlRendered = await marked.parse(input);
      }

      // Format selection
      if (format === 'html') {
        this.outputText.set(htmlRendered);
      } else if (format === 'md') {
        this.outputText.set(markdownSource);
      } else if (format === 'txt') {
        // Strip HTML tags
        const temp = document.createElement('div');
        temp.innerHTML = htmlRendered;
        this.outputText.set(temp.textContent || temp.innerText || '');
      }

      this.previewHtml.set(htmlRendered);

      // Save to store
      const output = this.outputText();
      const blob = new Blob([output], { type: 'text/plain' });
      this.store.dispatch(MarkdownConverterActions.processingSuccess({ outputBlob: , outputText: '', outputSizeMB:  }));

    } catch (err) {
      this.errorMessage.set('Could not process document format.');
    }
  }

  async onCopy(): Promise<void> {
    if (!this.outputText()) return;
    try {
      await navigator.clipboard.writeText(this.outputText());
    } catch {
      const ta = document.createElement('textarea');
      ta.value = this.outputText();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    this.showCopied.set(true);
    setTimeout(() => this.showCopied.set(false), 2000);
  }

  onDownload(): void {
    const out = this.outputText();
    if (!out) return;
    
    let ext = this.outputFormat();
    let mime = 'text/plain';
    if (ext === 'html') mime = 'text/html';
    if (ext === 'md') mime = 'text/markdown';

    const blob = new Blob([out], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document_${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 200);
  }

  ngOnDestroy(): void {
    clearTimeout(this.debounceTimer);
    this.store.dispatch(MarkdownConverterActions.resetState());
  }
}
