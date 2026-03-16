// ============================================================
// FEATURE 09 — JSON CONVERTER — Component (FULLY FUNCTIONAL)
// Route: /converter/json-converter
// Converts JSON to CSV, XML, YAML natively
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConverterFileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { JsonConverterActions, selectJsonConverterState } from './json-converter.store';

import * as yaml from 'js-yaml';
import * as xmljs from 'xml-js';

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'json', label: 'Beautify JSON', icon: '✨' },
  { value: 'csv',  label: 'CSV',  icon: '📊' },
  { value: 'xml',  label: 'XML',  icon: '📰' },
  { value: 'yaml', label: 'YAML', icon: '📝' },
];

function flattenJSON(data: any): any[] {
  const result: any[] = [];
  function recurse(cur: any, prop: string) {
    if (Object(cur) !== cur) {
      result.push({ path: prop, value: cur });
    } else if (Array.isArray(cur)) {
      for (let i = 0, l = cur.length; i < l; i++) recurse(cur[i], prop ? prop + '.' + i : '' + i);
      if (cur.length === 0) result.push({ path: prop, value: [] });
    } else {
      let isEmpty = true;
      for (const p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + '.' + p : p);
      }
      if (isEmpty && prop) result.push({ path: prop, value: {} });
    }
  }
  
  // If it's an array of objects, treat it specially for CSV
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
    return data; // Keep as array of objects for better CSV
  }
  
  recurse(data, '');
  return result;
}

function jsonToCsv(objArray: any[]): string {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  if (!Array.isArray(array) || array.length === 0) return 'Invalid data for CSV. Expected array of objects.';

  // Gather all unique keys
  const keys = new Set<string>();
  array.forEach(item => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach(k => keys.add(k));
    }
  });

  const header = Array.from(keys);
  let csv = header.join(',') + '\n';

  array.forEach(item => {
    let row = '';
    header.forEach((key, index) => {
      let val = item[key];
      if (val === null || val === undefined) val = '';
      else if (typeof val === 'object') val = JSON.stringify(val);
      
      let strVal = String(val);
      if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
        strVal = '"' + strVal.replace(/"/g, '""') + '"';
      }
      row += strVal;
      if (index < header.length - 1) row += ',';
    });
    csv += row + '\n';
  });
  return csv;
}

@Component({
  selector: 'app-json-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, ConverterFileDropZoneComponent, ConverterFormatSelectorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          📋 JSON Converter
        </h1>
        <p class="text-white/50 text-sm">Convert JSON to CSV, XML, YAML and beautify JSON files — 100% offline</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- LEFT: Input & Controls -->
        <div class="space-y-4">
          <app-converter-file-drop-zone
            accept=".json,.txt"
            [multiple]="false"
            [maxSizeMB]="10"
            label="Drop JSON or click to browse"
            (filesSelected)="onFileSelected($event)" />

          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs text-white/40 uppercase tracking-wider font-semibold">Input JSON</span>
              <button (click)="inputText.set('')" class="text-xs text-red-400 hover:text-red-300">Clear</button>
            </div>
            <textarea rows="12" [value]="inputText()"
              (input)="onInputChange(($any($event.target)).value)"
              placeholder='{"key": "value"}'
              class="w-full px-3 py-3 text-sm bg-[#12121a] border border-white/15 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-400 resize-none font-mono"></textarea>
          </div>

          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
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

        <!-- RIGHT: Output -->
        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 h-[600px] flex flex-col">
            <div class="flex items-center justify-between shrink-0">
              <span class="text-xs text-white/40 uppercase tracking-wider font-semibold">Converted Output ({{ outputFormat().toUpperCase() }})</span>
              <div class="flex gap-2">
                <button (click)="onCopy()" class="px-3 py-1 bg-white/5 rounded text-xs text-cyan-400 hover:bg-white/10 border border-white/10">📋 Copy</button>
                <button (click)="onDownload()" class="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs hover:bg-cyan-500/30 border border-cyan-500/30">📥 Download</button>
              </div>
            </div>
            
            <textarea readonly [value]="outputText()" 
               class="w-full flex-1 px-3 py-3 text-sm bg-[#12121a] border border-white/10 rounded-xl text-white focus:outline-none resize-none font-mono tracking-tight leading-relaxed select-all"
               placeholder="Output will appear here..."></textarea>
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
export class JsonConverterComponent implements OnDestroy {
  private store = inject(Store);
  state$ = this.store.select(selectJsonConverterState);
  outputFormats = OUTPUT_FORMATS;

  readonly inputText = signal('');
  readonly outputText = signal('');
  readonly outputFormat = signal('yaml');
  readonly errorMessage = signal('');
  readonly showCopied = signal(false);

  private debounceTimer: any;

  async onFileSelected(files: File[]): Promise<void> {
    const file = files[0];
    if (!file) return;

    try {
      const text = await file.text();
      this.inputText.set(text);
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

  process(): void {
    const input = this.inputText().trim();
    if (!input) {
      this.outputText.set('');
      this.errorMessage.set('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      this.errorMessage.set('');
      
      const format = this.outputFormat();
      let output = '';

      if (format === 'json') {
        output = JSON.stringify(parsed, null, 2);
      } 
      else if (format === 'yaml') {
        output = yaml.dump(parsed, { indent: 2 });
      }
      else if (format === 'xml') {
        // Need a wrapper root element
        const wrapped = { root: parsed };
        output = xmljs.js2xml(wrapped, { compact: true, spaces: 4 });
      }
      else if (format === 'csv') {
        let arr = parsed;
        if (!Array.isArray(parsed)) {
          arr = flattenJSON(parsed);
        }
        output = jsonToCsv(arr);
      }

      this.outputText.set(output);

      // Save to store
      const blob = new Blob([output], { type: 'text/plain' });
      this.store.dispatch(JsonConverterActions.processingSuccess({ outputBlob: blob, outputText: output, outputSizeMB: blob.size / 1024 / 1024 }));

    } catch (err) {
      this.errorMessage.set('Invalid JSON format. Please check syntax.');
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
    if (ext === 'csv') mime = 'text/csv';
    if (ext === 'xml') mime = 'application/xml';
    if (ext === 'json') mime = 'application/json';

    const blob = new Blob([out], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted_${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 200);
  }

  ngOnDestroy(): void {
    clearTimeout(this.debounceTimer);
    this.store.dispatch(JsonConverterActions.resetState());
  }
}
