// ============================================================
// FEATURE 16 — TIMEZONE CONVERTER — Component (FULLY FUNCTIONAL)
// Route: /converter/timezone-converter
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TimezoneConverterActions, selectTimezoneConverterState } from './timezone-converter.store';

interface FormatOption {
  value: string;
  label: string;
  icon: string;
}

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'UTC', label: 'UTC', icon: '🌐' },
  { value: 'America/New_York', label: 'EST / EDT (NY)', icon: '🗽' },
  { value: 'America/Los_Angeles', label: 'PST / PDT (LA)', icon: '🌴' },
  { value: 'Europe/London', label: 'GMT / BST (London)', icon: '💂' },
  { value: 'Europe/Paris', label: 'CET / CEST (Paris)', icon: '🥐' },
  { value: 'Asia/Tokyo', label: 'JST (Tokyo)', icon: '🗼' },
  { value: 'Asia/Kolkata', label: 'IST (India)', icon: '🪷' },
  { value: 'Asia/Jakarta', label: 'WIB (Jakarta)', icon: '🌋' },
  { value: 'Australia/Sydney', label: 'AEST / AEDT (Sydney)', icon: '🦘' },
];

@Component({
  selector: 'app-timezone-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          🕐 Global Timezone Converter
        </h1>
        <p class="text-white/50 text-sm">Instantly parse and convert ISO timestamps, Unix epoch, or local dates to any world timezone</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- LEFT: Input -->
        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
             <div class="flex items-center justify-between">
                <span class="text-xs text-white/40 uppercase tracking-wider font-semibold block">Source Time</span>
                <button (click)="setCurrentTime()" class="text-xs px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30">Set to Now</button>
             </div>
             
             <!-- Unified Text Input -->
             <div class="space-y-2">
               <span class="text-[10px] text-white/30 uppercase">Timestamp (ISO 8601, Epoch ms/sec, or Date String)</span>
               <input type="text" [value]="inputText()" (input)="onInputChange(($any($event.target)).value)"
                 placeholder="e.g., 2026-03-31T12:00:00Z or 1711886400000"
                 class="w-full px-3 py-3 text-sm font-mono bg-[#12121a] border border-white/15 rounded-xl text-white focus:outline-none focus:border-cyan-400" />
             </div>
             
             <!-- Visual Date Picker Sync -->
             <div class="grid grid-cols-2 gap-3 pt-2">
                 <div class="space-y-1">
                    <span class="text-[10px] text-white/30 uppercase">Date (Local)</span>
                    <input type="date" [value]="localDate()" (input)="onLocalPickerChange($event)" class="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white" />
                 </div>
                 <div class="space-y-1">
                    <span class="text-[10px] text-white/30 uppercase">Time (Local)</span>
                    <input type="time" step="1" [value]="localTime()" (input)="onLocalPickerChange($event)" class="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white" />
                 </div>
             </div>
             
             <div class="p-3 bg-white/5 rounded-lg border border-white/5 text-xs text-white/50 break-all h-20">
               <strong>Detected UTC:</strong><br/>
               <span class="font-mono text-cyan-400">{{ parsedDate() ? parsedDate()!.toISOString() : 'Invalid format' }}</span><br/>
               <strong>Unix Timestamp:</strong><br/>
               <span class="font-mono text-cyan-400">{{ parsedDate() ? parsedDate()!.getTime() : 'Invalid format' }}</span>
             </div>
          </div>

          @if (errorMessage()) {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400 flex items-center gap-2">
              <span class="text-xl">⚠️</span> {{ errorMessage() }}
            </div>
          }
        </div>

        <!-- RIGHT: Live Output Cards -->
        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4 max-h-[750px] overflow-y-auto">
             <span class="text-xs text-white/40 uppercase tracking-wider font-semibold block sticky top-0 bg-[#0a0a0f]/80 p-2 backdrop-blur-md rounded z-10">Timezone Results</span>
             
             @for (fmt of outputFormats; track fmt.value) {
                <div class="p-4 rounded-xl border border-white/5 bg-[#12121a] hover:border-cyan-500/30 transition-all flex justify-between items-center group relative overflow-hidden">
                  <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500/50 hidden group-hover:block transition-all"></div>
                  
                  <div class="space-y-1 z-10 relative">
                    <div class="text-xs text-white/50 flex items-center gap-2 font-bold tracking-wider">
                      {{ fmt.icon }} {{ fmt.label }}
                    </div>
                    <div class="text-lg text-white font-mono tracking-tight font-bold">
                       {{ formatTimezone(fmt.value, 'time') }}
                    </div>
                    <div class="text-[10px] text-cyan-400 tracking-widest uppercase">
                       {{ formatTimezone(fmt.value, 'date') }}
                    </div>
                  </div>
                  
                  <div class="flex flex-col gap-1 items-end z-10 relative">
                    <div class="text-xs text-white/30 font-mono text-right max-w-[120px] truncate">{{ getOffset(fmt.value) }}</div>
                    <button (click)="onCopy(formatTimezone(fmt.value, 'full'))" class="opacity-0 group-hover:opacity-100 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded text-[10px] uppercase font-bold hover:bg-cyan-500/30 transition-all">Copy</button>
                  </div>
                </div>
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
export class TimezoneConverterComponent implements OnDestroy {
  private store = inject(Store);
  state$ = this.store.select(selectTimezoneConverterState);
  outputFormats = OUTPUT_FORMATS;

  readonly inputText = signal(new Date().toISOString());
  readonly parsedDate = signal<Date | null>(new Date());
  
  readonly localDate = signal('');
  readonly localTime = signal('');

  readonly errorMessage = signal('');
  readonly showCopied = signal(false);

  constructor() {
    this.syncLocalPickers(new Date());
  }

  setCurrentTime(): void {
    const d = new Date();
    this.inputText.set(d.toISOString());
    this.process();
  }

  onInputChange(val: string): void {
    this.inputText.set(val);
    this.process();
  }

  onLocalPickerChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const type = target.type; // 'date' or 'time'
    const val = target.value;
    
    if (type === 'date') this.localDate.set(val);
    if (type === 'time') this.localTime.set(val);

    try {
      const d = new Date(`${this.localDate()}T${this.localTime() || '00:00:00'}`);
      if (!isNaN(d.getTime())) {
        this.inputText.set(d.toISOString());
        this.parsedDate.set(d);
        this.errorMessage.set('');
      }
    } catch {
       // Ignore invalid mid-typing states
    }
  }

  process(): void {
    let input = this.inputText().trim();
    if (!input) {
      this.parsedDate.set(null);
      return;
    }

    try {
      this.errorMessage.set('');
      
      // Auto-detect Epoch (number only string)
      if (/^\d+$/.test(input)) {
        const num = parseInt(input, 10);
        // If it's short (like 1700000000), it's probably seconds. Multiply to ms.
        if (input.length <= 10) {
          input = (num * 1000).toString();
        }
        const d = new Date(parseInt(input, 10));
        if (isNaN(d.getTime())) throw new Error();
        this.parsedDate.set(d);
        this.syncLocalPickers(d);
        return;
      }

      // Standard parse
      const d = new Date(input);
      if (isNaN(d.getTime())) throw new Error();
      
      this.parsedDate.set(d);
      this.syncLocalPickers(d);

    } catch {
      this.parsedDate.set(null);
      this.errorMessage.set('Invalid date format. Use ISO8601, Epoch millis, or standard English date strings.');
    }
  }

  private syncLocalPickers(d: Date): void {
    // Format to yyyy-mm-dd
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    this.localDate.set(`${yyyy}-${mm}-${dd}`);

    // Format to hh:mm:ss
    const hh = String(d.getHours()).padStart(2, '0');
    const mn = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    this.localTime.set(`${hh}:${mn}:${ss}`);
  }

  formatTimezone(tz: string, part: 'time' | 'date' | 'full'): string {
    const d = this.parsedDate();
    if (!d) return '--';

    try {
       const optsFull: Intl.DateTimeFormatOptions = { timeZone: tz, year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
       const optsTime: Intl.DateTimeFormatOptions = { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
       const optsDate: Intl.DateTimeFormatOptions = { timeZone: tz, weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' };
       
       if (part === 'full') return new Intl.DateTimeFormat('en-US', optsFull).format(d);
       if (part === 'time') return new Intl.DateTimeFormat('en-US', optsTime).format(d);
       if (part === 'date') return new Intl.DateTimeFormat('en-US', optsDate).format(d);
       
       return '';
    } catch {
       return 'Unsupported TZ';
    }
  }

  getOffset(tz: string): string {
    const d = this.parsedDate() || new Date();
    try {
      const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' }).formatToParts(d);
      const offset = parts.find(p => p.type === 'timeZoneName')?.value;
      return offset ? offset.replace('GMT', 'UTC ') : tz;
    } catch {
      return tz;
    }
  }

  async onCopy(text: string): Promise<void> {
    if (!text || text === '--') return;
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
    this.store.dispatch(TimezoneConverterActions.resetState());
  }
}
