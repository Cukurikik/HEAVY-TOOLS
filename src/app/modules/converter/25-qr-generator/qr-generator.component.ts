// ============================================================
// FEATURE 25 — QR CODE GENERATOR — Component (FULLY FUNCTIONAL)
// Route: /converter/qr-generator
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { QrGeneratorActions, selectQrGeneratorState } from './qr-generator.store';
import * as QRCode from 'qrcode';

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'png',  label: 'PNG',  icon: '🖼️' },
  { value: 'jpeg', label: 'JPEG', icon: '🖼️' },
  { value: 'webp', label: 'WEBP', icon: '🌐' },
  { value: 'svg',  label: 'SVG',  icon: '📐' },
  { value: 'txt',  label: 'TXT',  icon: '📄' },
  { value: 'terminal', label: 'Terminal', icon: '💻' },
];

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, ConverterFormatSelectorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          📱 QR Code Generator
        </h1>
        <p class="text-white/50 text-sm">Generate QR codes instantly from text, URLs, WiFi, or vCards</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- LEFT: Input & Controls -->
        <div class="space-y-4">
          <!-- Data Type Selector -->
          <div class="grid grid-cols-4 gap-2">
            @for (t of dataTypes; track t.key) {
              <button (click)="dataType.set(t.key); onInput()"
                [class]="dataType() === t.key ? 'py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium transition-all' : 'py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm hover:bg-white/10 transition-all'">
                {{ t.icon }} {{ t.label }}
              </button>
            }
          </div>

          <!-- Input Fields based on Data Type -->
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            @if (dataType() === 'text') {
              <div class="space-y-2">
                <span class="text-xs text-white/40 block">Text or Data</span>
                <textarea rows="4" [(ngModel)]="textData" (ngModelChange)="onInput()" placeholder="Enter any text to encode..."
                  class="w-full px-3 py-2 text-sm bg-[#12121a] border border-white/15 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-400 resize-none"></textarea>
              </div>
            }

            @if (dataType() === 'url') {
              <div class="space-y-2">
                <span class="text-xs text-white/40 block">Website URL</span>
                <input type="url" [(ngModel)]="urlData" (ngModelChange)="onInput()" placeholder="https://example.com"
                  class="w-full px-3 py-2 text-sm bg-[#12121a] border border-white/15 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-400" />
              </div>
            }

            @if (dataType() === 'wifi') {
              <div class="space-y-3">
                <div class="space-y-1">
                  <span class="text-xs text-white/40 block">Network Name (SSID)</span>
                  <input type="text" [(ngModel)]="wifiSsid" (ngModelChange)="onInput()" placeholder="My Home Network"
                    class="w-full px-3 py-2 text-sm bg-[#12121a] border border-white/15 rounded-xl text-white focus:outline-none focus:border-cyan-400" />
                </div>
                <div class="space-y-1">
                  <span class="text-xs text-white/40 block">Password</span>
                  <input type="text" [(ngModel)]="wifiPass" (ngModelChange)="onInput()" placeholder="Password123"
                    class="w-full px-3 py-2 text-sm bg-[#12121a] border border-white/15 rounded-xl text-white focus:outline-none focus:border-cyan-400" />
                </div>
                <div class="space-y-1">
                  <span class="text-xs text-white/40 block">Security Type</span>
                  <select [(ngModel)]="wifiType" (ngModelChange)="onInput()"
                    class="w-full px-3 py-2 text-sm bg-[#12121a] border border-white/15 rounded-xl text-white focus:outline-none focus:border-cyan-400">
                    <option value="WPA">WPA/WPA2/WPA3</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None (Open)</option>
                  </select>
                </div>
              </div>
            }

            @if (dataType() === 'email') {
              <div class="space-y-3">
                <div class="space-y-1">
                  <span class="text-xs text-white/40 block">Email Address</span>
                  <input type="email" [(ngModel)]="emailTo" (ngModelChange)="onInput()" placeholder="hello@example.com"
                    class="w-full px-3 py-2 text-sm bg-[#12121a] border border-white/15 rounded-xl text-white focus:outline-none focus:border-cyan-400" />
                </div>
                <div class="space-y-1">
                  <span class="text-xs text-white/40 block">Subject (Optional)</span>
                  <input type="text" [(ngModel)]="emailSubject" (ngModelChange)="onInput()" placeholder="Meeting Inquiry"
                    class="w-full px-3 py-2 text-sm bg-[#12121a] border border-white/15 rounded-xl text-white focus:outline-none focus:border-cyan-400" />
                </div>
                <div class="space-y-1">
                  <span class="text-xs text-white/40 block">Message Body (Optional)</span>
                  <textarea rows="2" [(ngModel)]="emailBody" (ngModelChange)="onInput()" placeholder="Hi there..."
                    class="w-full px-3 py-2 text-sm bg-[#12121a] border border-white/15 rounded-xl text-white focus:outline-none focus:border-cyan-400 resize-none"></textarea>
                </div>
              </div>
            }
          </div>

          <!-- Styling & Colors -->
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div class="flex items-center gap-6">
              <div class="space-y-2 flex-1">
                <span class="text-xs text-white/40 block">Foreground Color</span>
                <div class="flex items-center gap-3">
                  <input type="color" [(ngModel)]="colorDark" (ngModelChange)="onInput()" class="w-10 h-10 rounded cursor-pointer bg-transparent border-0" />
                  <span class="text-white font-mono text-sm">{{ colorDark.toUpperCase() }}</span>
                </div>
              </div>
              <div class="space-y-2 flex-1">
                <span class="text-xs text-white/40 block">Background Color</span>
                <div class="flex items-center gap-3">
                  <input type="color" [(ngModel)]="colorLight" (ngModelChange)="onInput()" class="w-10 h-10 rounded cursor-pointer bg-transparent border-0" />
                  <span class="text-white font-mono text-sm">{{ colorLight.toUpperCase() }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <span class="text-xs text-white/40 block">Error Correction Level</span>
              <div class="flex gap-2">
                @for (ec of ecLevels; track ec) {
                  <button (click)="errorCorrection.set(ec); onInput()"
                    [class]="errorCorrection() === ec ? 'flex-1 py-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs' : 'flex-1 py-1 rounded bg-white/5 text-white/50 hover:bg-white/10 text-xs'">
                    {{ ec }} {{ ec === 'L' ? '(7%)' : ec === 'M' ? '(15%)' : ec === 'Q' ? '(25%)' : '(30%)' }}
                  </button>
                }
              </div>
            </div>
            
            <div class="space-y-2 border-t border-white/10 pt-4 mt-2">
               <app-converter-format-selector
                 [formats]="outputFormats"
                 [selected]="outputFormat()"
                 (formatChange)="outputFormat.set($event); onInput()" />
            </div>
          </div>
        </div>

        <!-- RIGHT: Live Preview & EXPORT -->
        <div class="space-y-4">
          <div class="rounded-2xl border border-white/10 bg-[#12121a] p-8 flex flex-col items-center justify-center min-h-[400px]">
            @if (errorMessage()) {
              <div class="text-red-400 text-sm flex flex-col items-center gap-2">
                <span class="text-3xl">⚠️</span>
                <span>{{ errorMessage() }}</span>
              </div>
            } @else if (!qrUrl() && !qrSvg() && !outputText()) {
              <div class="text-white/20 text-sm flex flex-col items-center gap-3">
                <span class="text-6xl">📱</span>
                <span>Enter data to generate QR Code</span>
              </div>
            } @else if (outputText()) {
              <pre class="text-white text-xs bg-black p-4 rounded-lg overflow-auto max-h-80">{{ outputText() }}</pre>
            } @else {
              <!-- QR Display Box (with solid white background for contrast if user chose white background) -->
              <div class="bg-white p-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 duration-300">
                @if (outputFormat() === 'svg' && qrSvg()) {
                  <div [innerHTML]="qrSvg()" class="w-64 h-64"></div>
                } @else if (qrUrl()) {
                  <img [src]="qrUrl()" alt="QR Code" class="w-64 h-64 object-contain" />
                }
              </div>
              
              <div class="mt-8 text-center space-y-2">
                <span class="text-white/40 text-xs uppercase tracking-widest font-semibold block">Scan Context</span>
                <span class="text-white text-sm font-mono max-w-[280px] truncate block">{{ getRawData() }}</span>
              </div>
            }
          </div>

          @if (qrUrl() || qrSvg() || outputText()) {
            <button (click)="onDownload()"
              class="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-black shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform">
              📥 Download QR Code ({{ outputFormat().toUpperCase() }})
            </button>
          }
        </div>
      </div>
    </div>
  `
})
export class QrGeneratorComponent implements OnDestroy {
  private store = inject(Store);
  state$ = this.store.select(selectQrGeneratorState);
  outputFormats = OUTPUT_FORMATS;
  readonly ecLevels: QRCode.QRCodeErrorCorrectionLevel[] = ['L', 'M', 'Q', 'H'];

  readonly dataTypes = [
    { key: 'text', icon: '📝', label: 'Text' },
    { key: 'url',  icon: '🌐', label: 'URL' },
    { key: 'wifi', icon: '📡', label: 'WiFi' },
    { key: 'email',icon: '✉️', label: 'Email' },
  ];

  // Logic bindings
  readonly dataType = signal('url');
  textData = '';
  urlData = '';
  wifiSsid = '';
  wifiPass = '';
  wifiType = 'WPA';
  emailTo = '';
  emailSubject = '';
  emailBody = '';

  colorDark = '#000000';
  colorLight = '#FFFFFF';
  readonly errorCorrection = signal<QRCode.QRCodeErrorCorrectionLevel>('M'); // Explicitly type
  readonly outputFormat = signal('png');

  readonly qrUrl = signal<string | null>(null);
  readonly qrSvg = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly outputText = signal<string | null>(null); // Added for text/terminal output

  private tempUrl: string | null = null;
  private debounceTimer: ReturnType<typeof setTimeout> | undefined;

  // Compile the data segment
  getRawData(): string {
    switch (this.dataType()) {
      case 'url': {
        let url = this.urlData.trim();
        if (url && !/^https?:\/\//i.test(url)) url = 'https://' + url;
        return url;
      }
      case 'wifi': {
        if (!this.wifiSsid.trim()) return '';
        const escape = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/:/g, '\\:');
        return `WIFI:T:${this.wifiType};S:${escape(this.wifiSsid)};P:${escape(this.wifiPass)};;`;
      }
      case 'email': {
        if (!this.emailTo.trim()) return '';
        let mailto = `mailto:${this.emailTo}`;
        const params = [];
        if (this.emailSubject) params.push(`subject=${encodeURIComponent(this.emailSubject)}`);
        if (this.emailBody) params.push(`body=${encodeURIComponent(this.emailBody)}`);
        if (params.length > 0) mailto += `?${params.join('&')}`;
        return mailto;
      }
      case 'text':
      default:
        return this.textData;
    }
  }

  // Real-time generator
  onInput(): void {
    const data = this.getRawData();
    if (!data) {
      this.qrUrl.set(null);
      this.qrSvg.set(null);
      this.errorMessage.set(null);
      this.outputText.set(null); // Clear text output
      return;
    }

    if (data.length > 2000) {
      this.errorMessage.set('Data too long for QR code (max ~2000 characters).');
      return;
    }

    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.generateQR(data);
    }, 200);
  }

  private async generateQR(data: string): Promise<void> {
    this.errorMessage.set(null);
    try {
      const opts: QRCode.QRCodeToDataURLOptions & QRCode.QRCodeToStringOptions = {
        errorCorrectionLevel: this.errorCorrection(), // Type is now QRCode.QRCodeErrorCorrectionLevel
        margin: 2,
        color: {
          dark: this.colorDark,
          light: this.colorLight
        }
      };

      const format = this.outputFormat();
      switch (format) {
        case 'svg': {
          const svgData = await QRCode.toString(data, { ...opts, type: 'svg' });
          this.qrSvg.set(svgData);
          this.qrUrl.set(null);
          this.outputText.set(null);
          break;
        }
        case 'txt': {
          const txtData = await QRCode.toString(data, { ...opts, type: 'utf8' });
          this.outputText.set(txtData);
          this.qrUrl.set(null);
          this.qrSvg.set(null);
          break;
        }
        case 'terminal': {
          const termData = await QRCode.toString(data, { ...opts, type: 'terminal' });
          this.outputText.set(termData);
          this.qrUrl.set(null);
          this.qrSvg.set(null);
          break;
        }
        default: {
          // Image generation
          let mimeType = 'image/png';
          if (format === 'jpeg') mimeType = 'image/jpeg';
          else if (format === 'webp') mimeType = 'image/webp';

          const dataUrl = await QRCode.toDataURL(data, { ...opts, type: mimeType as unknown as QRCode.QRCodeToDataURLOptions['type'] });
          
          if (this.tempUrl) {
            URL.revokeObjectURL(this.tempUrl);
            this.tempUrl = null;
          }

          // Convert base64 DataURL to Blob URL to be lightweight
          const blob = this.dataURLToBlob(dataUrl);
          this.tempUrl = URL.createObjectURL(blob);
          
          this.qrUrl.set(this.tempUrl);
          this.qrSvg.set(null);
          this.outputText.set(null);

          // Update Store
          this.store.dispatch(QrGeneratorActions.processingSuccess({ outputBlob: blob, outputText: '', outputSizeMB: blob.size / 1024 / 1024 }));
          break;
        }
      }
    } catch {
      this.errorMessage.set('Failed to generate QR Code. Data might be too large for this error correction level.');
    }
  }

  async onDownload(): Promise<void> {
    const format = this.outputFormat();
    let url = '';
    
    if (format === 'svg' && this.qrSvg()) {
      const blob = new Blob([this.qrSvg()!], { type: 'image/svg+xml' });
      url = URL.createObjectURL(blob);
    } else if (this.tempUrl) {
      url = this.tempUrl;
    }

    if (!url) return;

    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode_${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (format === 'svg') {
      setTimeout(() => URL.revokeObjectURL(url), 200);
    }
  }

  private dataURLToBlob(dataURL: string): Blob {
    const parts = dataURL.split(',');
    const match = parts[0].match(/:(.*?);/);
    const mime = match ? match[1] : 'image/png';
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  ngOnDestroy(): void {
    clearTimeout(this.debounceTimer);
    if (this.tempUrl) URL.revokeObjectURL(this.tempUrl);
    this.store.dispatch(QrGeneratorActions.resetState());
  }
}
