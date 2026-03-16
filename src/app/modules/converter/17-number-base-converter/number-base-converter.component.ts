// ============================================================
// FEATURE 17 — NUMBER BASE CONVERTER — Component (FULLY FUNCTIONAL)
// Route: /converter/number-base-converter
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { NumberBaseConverterActions, selectNumberBaseConverterState } from './number-base-converter.store';

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'binary',  label: 'BINARY',  icon: '0️⃣' },
  { value: 'octal',   label: 'OCTAL',   icon: '8️⃣' },
  { value: 'decimal', label: 'DECIMAL', icon: '🔟' },
  { value: 'hex',     label: 'HEX',     icon: '#️⃣' },
  { value: 'base32',  label: 'BASE32',  icon: '🔠' },
  { value: 'base64',  label: 'BASE64',  icon: '🧩' },
  { value: 'text',    label: 'TEXT (UTF8)', icon: '📝' },
];

@Component({
  selector: 'app-number-base-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, ConverterFormatSelectorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          🔢 Universal Base Converter
        </h1>
        <p class="text-white/50 text-sm">Real-time conversion for Binary, Octal, Decimal, Hex, Base32, Base64, and Text (UTF-8)</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- LEFT: Input & Format selection -->
        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
             <span class="text-xs text-white/40 uppercase tracking-wider font-semibold block">Input Format</span>
             <app-converter-format-selector
               [formats]="outputFormats"
               [selected]="inputFormat()"
               (formatChange)="inputFormat.set($event); process()" />
          </div>
          
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs text-white/40 uppercase tracking-wider font-semibold">Input Data</span>
              <button (click)="inputText.set(''); process()" class="text-xs text-red-400 hover:text-red-300">Clear</button>
            </div>
            <textarea
              rows="8"
              [value]="inputText()"
              (input)="onInputChange(($any($event.target)).value)"
              placeholder="Enter value (e.g. 101101, Hello World, 4F2C...)"
              class="w-full px-3 py-3 font-mono text-sm bg-[#12121a] border border-white/15 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-400 resize-none break-all"></textarea>
          </div>

          @if (errorMessage()) {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400 flex items-center gap-2">
              <span class="text-xl">⚠️</span> {{ errorMessage() }}
            </div>
          }
        </div>

        <!-- RIGHT: Live Output Cards -->
        <div class="space-y-4">
          @for (fmt of outputFormats; track fmt.value) {
            <div [class]="fmt.value === inputFormat() ? 'opacity-50 pointer-events-none' : ''">
              <div class="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors relative group">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
                    {{ fmt.icon }} {{ fmt.label }}
                  </span>
                  @if (results()[fmt.value]) {
                    <button (click)="onCopy(results()[fmt.value])" class="opacity-0 group-hover:opacity-100 px-3 py-1 bg-white/10 hover:bg-white/20 text-white/80 rounded border border-white/10 text-[10px] uppercase font-bold transition-all">📋 Copy</button>
                  }
                </div>
                
                <div class="text-sm text-white/90 font-mono break-all max-h-[120px] overflow-y-auto w-full select-all">
                  @if (results()[fmt.value]) {
                    {{ results()[fmt.value] }}
                  } @else {
                    <span class="text-white/20 italic">Waiting for valid input...</span>
                  }
                </div>
              </div>
            </div>
          }
          
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
export class NumberBaseConverterComponent implements OnDestroy {
  private store = inject(Store);
  state$ = this.store.select(selectNumberBaseConverterState);
  outputFormats = OUTPUT_FORMATS;

  readonly inputFormat = signal('text');
  readonly inputText = signal('');
  readonly errorMessage = signal('');
  readonly showCopied = signal(false);
  
  // Stored results by format key
  readonly results = signal<Record<string, string>>({});

  private debounceTimer: ReturnType<typeof setTimeout> | undefined;

  // Base32 Character Set RFC 4648
  private readonly BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  onInputChange(val: string): void {
    this.inputText.set(val);
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.process(), 100);
  }

  process(): void {
    const input = this.inputText().trim();
    if (!input) {
      this.results.set({});
      this.errorMessage.set('');
      return;
    }

    try {
      this.errorMessage.set('');
      const format = this.inputFormat();
      
      // 1. Convert Input to ByteArray (Uint8Array)
      let bytes: Uint8Array;

      switch (format) {
        case 'text':
          bytes = new TextEncoder().encode(input);
          break;
        case 'base64':
           bytes = Uint8Array.from(atob(input), c => c.charCodeAt(0));
          break;
        case 'base32':
          bytes = this.decodeBase32(input.toUpperCase());
          break;
        case 'hex': {
          const cleanHex = input.replace(/[^0-9A-Fa-f]/g, '');
          if (cleanHex.length % 2 !== 0) throw new Error('Hex length must be even');
          bytes = new Uint8Array(cleanHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
          break;
        }
        default: {
          // Binary, Octal, Decimal handled as BigInt for precision
          let radix = 10;
          if (format === 'binary') { radix = 2; if (/[^01\s]/.test(input)) throw new Error('Invalid Binary format'); }
          if (format === 'octal') { radix = 8; if (/[^0-7\s]/.test(input)) throw new Error('Invalid Octal format'); }
          if (format === 'decimal') { radix = 10; if (/[^0-9\s]/.test(input)) throw new Error('Invalid Decimal format'); }
          
          const cleanInput = input.replace(/\s+/g, '');
          const bigNumVal = this.parseBigInt(cleanInput, radix);
          bytes = this.bigIntToBytes(bigNumVal);
          break;
        }
      }

      // 2. Compute all outputs from the standard ByteArray, and BigInt representation
      const bigNum = this.bytesToBigInt(bytes);
      
      this.results.set({
        text: this.safeDecodeText(bytes),
        base64: btoa(String.fromCharCode(...Array.from(bytes))),
        base32: this.encodeBase32(bytes),
        hex: Array.from(bytes).map((b: number) => b.toString(16).padStart(2, '0')).join('').toUpperCase(),
        decimal: bigNum.toString(10),
        octal: bigNum.toString(8),
        binary: bigNum.toString(2)
      });
      
    } catch (err: unknown) {
      this.results.set({});
      const msg = err instanceof Error ? err.message : 'Invalid input for the selected format.';
      this.errorMessage.set(msg);
    }
  }

  private parseBigInt(str: string, radix: number): bigint {
    str = str.toLowerCase();
    const size = 10;
    const factor = BigInt(radix ** size);
    let i = str.length % size || size;
    const parts: string[] = [str.slice(0, i)];
    while (i < str.length) {
      parts.push(str.slice(i, i += size));
    }
    return parts.reduce((r, v) => r * factor + BigInt(parseInt(v, radix)), 0n);
  }

  private bigIntToBytes(num: bigint): Uint8Array {
    let hex = num.toString(16);
    if (hex.length % 2) hex = '0' + hex;
    const len = hex.length / 2;
    const u8 = new Uint8Array(len);
    for (let i = 0, j = 0; i < len; i++, j += 2) {
      u8[i] = parseInt(hex.slice(j, j + 2), 16);
    }
    return u8;
  }

  private bytesToBigInt(bytes: Uint8Array): bigint {
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return hex ? BigInt('0x' + hex) : 0n;
  }

  private safeDecodeText(bytes: Uint8Array): string {
    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    } catch {
      return ' [Non-printable characters]';
    }
  }

  // Base32 RFC 4648 Encoding
  private encodeBase32(data: Uint8Array): string {
    let bits = 0;
    let value = 0;
    let output = '';
    for (const byte of data) {
        value = (value << 8) | byte;
        bits += 8;
        while (bits >= 5) {
            output += this.BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }
    if (bits > 0) {
        output += this.BASE32_ALPHABET[(value << (5 - bits)) & 31];
    }
    while ((output.length % 8) !== 0) output += '=';
    return output;
  }

  private decodeBase32(input: string): Uint8Array {
    let bits = 0;
    let value = 0;
    const output: number[] = [];
    input = input.replace(/=+$/, '');
    for (const char of input) {
        const val = this.BASE32_ALPHABET.indexOf(char);
        if (val === -1) throw new Error('Invalid Base32 characters');
        value = (value << 5) | val;
        bits += 5;
        if (bits >= 8) {
            output.push((value >>> (bits - 8)) & 255);
            bits -= 8;
        }
    }
    return new Uint8Array(output);
  }

  async onCopy(text: string): Promise<void> {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    this.showCopied.set(true);
    setTimeout(() => this.showCopied.set(false), 2000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.debounceTimer);
    this.store.dispatch(NumberBaseConverterActions.resetState());
  }
}
