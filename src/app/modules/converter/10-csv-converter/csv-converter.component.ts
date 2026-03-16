// ============================================================
// FEATURE 10 — CSV CONVERTER — Component (FULLY FUNCTIONAL)
// Route: /converter/csv-converter
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConverterFileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { CsvConverterActions, selectCsvConverterState } from './csv-converter.store';

import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'json', label: 'JSON', icon: '📄' },
  { value: 'xlsx', label: 'Excel (XLSX)', icon: '📊' },
  { value: 'xml', label: 'XML', icon: '📰' },
  { value: 'html', label: 'HTML Table', icon: '🌐' },
  { value: 'markdown', label: 'Markdown', icon: '📝' },
  { value: 'sql', label: 'SQL Insert', icon: '🗄️' },
];

@Component({
  selector: 'app-csv-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, ConverterFileDropZoneComponent, ConverterFormatSelectorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          📊 CSV & Data Converter
        </h1>
        <p class="text-white/50 text-sm">Lightning fast, client-side conversion of CSV/TSV to JSON, Excel, XML, HTML, Markdown, and SQL</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- LEFT: Input & Controls -->
        <div class="space-y-4">
          <app-converter-file-drop-zone
            accept=".csv,.tsv,.txt"
            [multiple]="false"
            [maxSizeMB]="100"
            label="Drop CSV/TSV file here or click to browse"
            (filesSelected)="onFileSelected($event)" />

          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs text-white/40 uppercase tracking-wider font-semibold">Input CSV Data</span>
              <button (click)="inputText.set('')" class="text-xs text-red-400 hover:text-red-300">Clear</button>
            </div>
            
            <textarea rows="16" [value]="inputText()"
              (input)="onInputEvent($event)"
              placeholder="id,name,email&#10;1,John,john@example.com&#10;2,Jane,jane@example.com"
              class="w-full px-3 py-3 text-sm bg-[#12121a] border border-white/15 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-400 resize-none font-mono tracking-tight whitespace-pre"></textarea>
          </div>

          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
             <div class="space-y-2">
                 <span class="text-xs text-white/40 uppercase tracking-wider font-semibold block">Delimiter Auto-Detect</span>
                 <div class="text-xs text-cyan-400">Engine automatically detects commas, tabs, and semicolons.</div>
             </div>
             
             <div class="space-y-2 border-t border-white/10 pt-4">
                 <span class="text-xs text-white/40 uppercase tracking-wider font-semibold block">Convert To</span>
                 <app-converter-format-selector
                   [formats]="outputFormats"
                   [selected]="outputFormat()"
                   (formatChange)="outputFormat.set($event); process()" />
             </div>
          </div>
          
          @if (errorMessage()) {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400 flex items-center gap-2">
              <span class="text-xl">⚠️</span> {{ errorMessage() }}
            </div>
          }
        </div>

        <!-- RIGHT: Live Output & Export -->
        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 h-[780px] flex flex-col">
            <div class="flex items-center justify-between shrink-0 mb-2 border-b border-white/10 pb-3">
              <span class="text-xs text-cyan-400 font-bold uppercase tracking-wider">Generated {{ outputFormat() }}</span>

              <div class="flex gap-2">
                @if (outputFormat() !== 'xlsx') {
                  <button (click)="onCopy()" class="px-3 py-1.5 bg-white/5 text-white/70 rounded-lg text-xs hover:bg-white/10 border border-white/10 font-bold">📋 COPY DATA</button>
                }
                <button (click)="onDownload()" class="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-500 text-black rounded-lg text-xs hover:scale-105 font-bold shadow-lg">📥 DOWNLOAD FILE</button>
              </div>
            </div>
            
            @if (outputFormat() === 'xlsx') {
               <div class="w-full flex-1 flex flex-col items-center justify-center text-white/40 border border-white/5 rounded-xl bg-[#12121a] p-8 text-center space-y-4">
                  <span class="text-6xl">📊</span>
                  <span class="text-sm">Excel binary generated.<br/>Click <strong>Download File</strong> to save the .xlsx workbook.</span>
               </div>
            } @else {
              <textarea readonly [value]="outputText()" 
                class="w-full flex-1 px-3 py-3 text-sm bg-[#12121a] border border-white/10 rounded-xl text-white focus:outline-none resize-none font-mono tracking-tight leading-relaxed select-all whitespace-pre"
                placeholder="Converted data will appear here..."></textarea>
            }
          </div>
          
          @if (showCopied()) {
            <div class="fixed bottom-6 right-6 p-4 rounded-xl bg-green-500/90 backdrop-blur-md border border-green-400/50 shadow-2xl text-white font-bold text-sm animate-bounce z-50 flex items-center gap-2">
              <span class="text-xl">✅</span> Copied to clipboard!
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class CsvConverterComponent implements OnDestroy {
  private store = inject(Store);
  state$ = this.store.select(selectCsvConverterState);
  outputFormats = OUTPUT_FORMATS;

  readonly inputText = signal('');
  readonly outputText = signal('');
  readonly outputFormat = signal('json');
  readonly errorMessage = signal('');
  readonly showCopied = signal(false);

  private debounceTimer: ReturnType<typeof setTimeout> | undefined;
  private currentParsedData: Record<string, unknown>[] = [];
  private currentHeaders: string[] = [];

  // Temporary blob for XLSX
  private binaryOutputBlob: Blob | null = null;

  async onFileSelected(files: File[]): Promise<void> {
    const file = files[0];
    if (!file) return;

    try {
      const text = await file.text();
      this.inputText.set(text);
      this.process();
    } catch {
      this.errorMessage.set('Could not process document format.');
    }
  }

  onInputEvent(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    if (target) {
      this.onInputChange(target.value);
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
      this.binaryOutputBlob = null;
      return;
    }

    try {
      this.errorMessage.set('');
      
      // Parse CSV
      const parseResult = Papa.parse(input, { header: true, skipEmptyLines: true });
      if (parseResult.errors && parseResult.errors.length > 0 && input.includes('\n')) {
         // Silently ignore minor parsing errors unless the whole thing fails
      }

      this.currentParsedData = parseResult.data as Record<string, unknown>[];
      this.currentHeaders = parseResult.meta.fields || [];

      if (this.currentParsedData.length === 0) {
        this.outputText.set('');
        return;
      }

      const format = this.outputFormat();
      let output = '';
      this.binaryOutputBlob = null;

      if (format === 'json') {
        output = JSON.stringify(this.currentParsedData, null, 2);
      } 
      else if (format === 'xml') {
        output = this.generateXml(this.currentParsedData);
      }
      else if (format === 'html') {
        output = this.generateHtml(this.currentParsedData, this.currentHeaders);
      }
      else if (format === 'markdown') {
        output = this.generateMarkdown(this.currentParsedData, this.currentHeaders);
      }
      else if (format === 'sql') {
        output = this.generateSql(this.currentParsedData, this.currentHeaders);
      }
      else if (format === 'xlsx') {
        this.generateXlsx(this.currentParsedData);
        output = 'Binary generated.'; // Placeholder text since UI hides textarea for xlsx
      }

      this.outputText.set(output);

      // Save to store logic can go here
      const finalBlob = this.binaryOutputBlob || new Blob([output], { type: 'text/plain' });
      this.store.dispatch(CsvConverterActions.processingSuccess({ outputBlob: finalBlob, outputText: output, outputSizeMB: finalBlob.size / 1024 / 1024 }));

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      this.errorMessage.set('Invalid CSV data. ' + msg);
    }
  }

  private generateXml(data: Record<string, unknown>[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<Root>\n';
    data.forEach((row, i) => {
      xml += `  <Row index="${i}">\n`;
      for (const [key, val] of Object.entries(row)) {
        const safeKey = String(key || 'Field').replace(/[^a-zA-Z0-9_]/g, '');
        const safeVal = String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        xml += `    <${safeKey || 'Field'}>${safeVal}</${safeKey || 'Field'}>\n`;
      }
      xml += `  </Row>\n`;
    });
    xml += '</Root>';
    return xml;
  }

  private generateHtml(data: Record<string, unknown>[], headers: string[]): string {
    let html = '<table>\n  <thead>\n    <tr>\n';
    headers.forEach(h => html += `      <th>${this.escapeHtml(h)}</th>\n`);
    html += '    </tr>\n  </thead>\n  <tbody>\n';
    
    data.forEach(row => {
      html += '    <tr>\n';
      headers.forEach(h => html += `      <td>${this.escapeHtml(row[h])}</td>\n`);
      html += '    </tr>\n';
    });
    
    html += '  </tbody>\n</table>';
    return html;
  }

  private generateMarkdown(data: Record<string, unknown>[], headers: string[]): string {
    let md = '| ' + headers.join(' | ') + ' |\n';
    md += '|' + headers.map(() => '---').join('|') + '|\n';
    
    data.forEach(row => {
      md += '| ' + headers.map(h => String(row[h] || '').replace(/\|/g, '\\|')).join(' | ') + ' |\n';
    });
    return md;
  }

  private generateSql(data: Record<string, unknown>[], headers: string[]): string {
    const tableName = 'imported_data';
    const cols = headers.map(h => `\`${h.replace(/`/g, '')}\``).join(', ');
    
    let sql = `-- SQL INSERT Script\n`;
    data.forEach(row => {
      const vals = headers.map(h => {
        const v = row[h];
        if (v === null || v === undefined || v === '') return 'NULL';
        if (!isNaN(Number(v))) return v;
        return `'${String(v).replace(/'/g, "''")}'`;
      }).join(', ');
      sql += `INSERT INTO \`${tableName}\` (${cols}) VALUES (${vals});\n`;
    });
    return sql;
  }

  private generateXlsx(data: Record<string, unknown>[]): void {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    // Generate buffer
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.binaryOutputBlob = new Blob([wbout], { type: 'application/octet-stream' });
  }

  private escapeHtml(unsafe: unknown): string {
    return String(unsafe || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  async onCopy(): Promise<void> {
    if (this.outputFormat() === 'xlsx' || !this.outputText()) return;
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
    if (!this.inputText()) return;
    
    let ext = this.outputFormat();
    let url = '';
    
    if (ext === 'xlsx' && this.binaryOutputBlob) {
      url = URL.createObjectURL(this.binaryOutputBlob);
    } else {
      const out = this.outputText();
      if (!out) return;
      
      let mime = 'text/plain';
      if (ext === 'html') mime = 'text/html';
      if (ext === 'xml') mime = 'application/xml';
      if (ext === 'json') mime = 'application/json';
      if (ext === 'markdown') mime = 'text/markdown';
      if (ext === 'sql') mime = 'application/sql';

      const blob = new Blob([out], { type: mime });
      url = URL.createObjectURL(blob);
    }

    const a = document.createElement('a');
    a.href = url;
    // .markdown is .md
    if (ext === 'markdown') ext = 'md';
    a.download = `data_${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 200);
  }

  ngOnDestroy(): void {
    clearTimeout(this.debounceTimer);
    this.store.dispatch(CsvConverterActions.resetState());
  }
}
