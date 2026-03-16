// ============================================================
// FEATURE 15 — CURRENCY CONVERTER — Component (FULLY FUNCTIONAL)
// Route: /converter/currency-converter
// Uses ExchangeRate-API for Free Live Rates
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CurrencyConverterActions } from './currency-converter.store';

export type CurrencyRateMap = Record<string, number>;

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          💱 Global Currency Converter
        </h1>
        <p class="text-white/50 text-sm">Convert between 161 world currencies with real-time hybrid-online exchange rates</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- LEFT: Converter Controls -->
        <div class="space-y-4">
          <div class="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
            
            <!-- Connection Status -->
            <div class="flex items-center justify-between p-3 rounded-lg border border-white/10"
                 [ngClass]="ratesLoaded() ? 'bg-cyan-500/10' : 'bg-white/5'">
               <span class="text-xs uppercase font-bold tracking-wider" [ngClass]="ratesLoaded() ? 'text-cyan-400' : 'text-white/40'">
                 {{ ratesLoaded() ? '🟢 LIVE RATES ACTIVE' : loadingRates() ? '🔄 FETCHING RATES...' : '🔴 OFFLINE' }}
               </span>
               @if (lastUpdated()) {
                 <span class="text-[10px] text-white/30 font-mono">Updated: {{ lastUpdated() | date:'mediumTime' }}</span>
               }
            </div>

            <!-- Amount -->
            <div class="space-y-2">
              <span class="text-xs text-white/40 uppercase tracking-wider font-semibold block">Amount</span>
              <input type="number" [value]="amount()" 
                (input)="onAmountChange($event)"
                class="w-full px-4 py-4 text-3xl font-bold font-mono bg-[#12121a] border border-white/15 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-400 transition-all" />
            </div>

            <div class="flex items-center gap-4 relative">
              <!-- Source Currency -->
              <div class="flex-1 space-y-2">
                <span class="text-xs text-white/40 uppercase tracking-wider font-semibold block">From Currency</span>
                <select [value]="sourceCurrency()" (change)="sourceCurrency.set(($any($event.target)).value); calculate()"
                   class="w-full px-3 py-3 text-lg font-bold bg-[#12121a] border border-white/15 rounded-xl text-white focus:outline-none focus:border-cyan-400 cursor-pointer">
                   @for (code of availableCurrencies(); track code) {
                     <option [value]="code">{{ getFlag(code) }} {{ code }}</option>
                   }
                </select>
              </div>

              <!-- Swap Button -->
              <button (click)="swapCurrencies()" class="w-12 h-12 mt-6 shrink-0 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center hover:bg-cyan-500/30 hover:scale-110 transition-all z-10">
                <span class="text-xl">⇆</span>
              </button>

              <!-- Target Currency -->
              <div class="flex-1 space-y-2">
                <span class="text-xs text-white/40 uppercase tracking-wider font-semibold block">To Currency</span>
                <select [value]="targetCurrency()" (change)="targetCurrency.set(($any($event.target)).value); calculate()"
                   class="w-full px-3 py-3 text-lg font-bold bg-[#12121a] border border-white/15 rounded-xl text-white focus:outline-none focus:border-cyan-400 cursor-pointer">
                   @for (code of availableCurrencies(); track code) {
                     <option [value]="code">{{ getFlag(code) }} {{ code }}</option>
                   }
                </select>
              </div>
            </div>
          </div>

          @if (errorMessage()) {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400 flex items-center gap-2">
              <span class="text-xl">⚠️</span> {{ errorMessage() }}
            </div>
          }
        </div>

        <!-- RIGHT: Display Result -->
        <div class="space-y-4">
          <div class="p-8 rounded-2xl bg-gradient-to-br from-[#12121a] to-[#1a1a2e] border border-white/10 space-y-8 h-full flex flex-col justify-center relative overflow-hidden group">
            
            <!-- Background Decoration -->
            <div class="absolute -right-10 -top-10 text-[200px] opacity-5 select-none transition-transform group-hover:scale-110 duration-700">
              {{ getFlag(targetCurrency()) }}
            </div>

            <!-- Conversion Logic -->
            <div class="space-y-2 z-10">
              <span class="text-lg text-white/50 font-medium block">
                 {{ amount() }} {{ sourceCurrency() }} equals
              </span>
              <span class="text-5xl lg:text-6xl font-black text-transparent bg-clip-text"
                    [ngClass]="ratesLoaded() ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' : 'bg-gradient-to-r from-white/40 to-white/20'">
                 {{ resultAmount() }} {{ targetCurrency() }}
              </span>
            </div>

            <div class="pt-8 border-t border-white/10 z-10 grid grid-cols-2 gap-4">
              <div class="space-y-1">
                 <span class="text-[10px] text-white/30 uppercase tracking-widest font-bold">Exchange Rate</span>
                 <div class="text-sm text-cyan-400 font-mono">1 {{ sourceCurrency() }} = {{ formatRate(getConversionRate(sourceCurrency(), targetCurrency())) }} {{ targetCurrency() }}</div>
              </div>
              <div class="space-y-1">
                 <span class="text-[10px] text-white/30 uppercase tracking-widest font-bold">Inverse Rate</span>
                 <div class="text-sm text-white/40 font-mono">1 {{ targetCurrency() }} = {{ formatRate(getConversionRate(targetCurrency(), sourceCurrency())) }} {{ sourceCurrency() }}</div>
              </div>
            </div>

            <button (click)="onCopy()" 
              class="absolute bottom-6 right-6 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all z-20">
              📋 Copy Result
            </button>
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
export class CurrencyConverterComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  
  // Base State
  readonly amount = signal<number>(1);
  readonly sourceCurrency = signal<string>('USD');
  readonly targetCurrency = signal<string>('EUR');
  readonly resultAmount = signal<string>('0.00');
  
  // API State
  readonly availableCurrencies = signal<string[]>(['USD', 'EUR', 'GBP', 'JPY', 'IDR']);
  readonly rates = signal<CurrencyRateMap>({}); // Normalised to USD base
  readonly ratesLoaded = signal<boolean>(false);
  readonly loadingRates = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly lastUpdated = signal<Date | null>(null);
  
  readonly showCopied = signal(false);

  // Common Currency Flags Mapper
  private readonly flags: Record<string, string> = {
    'USD':'🇺🇸', 'EUR':'🇪🇺', 'GBP':'🇬🇧', 'JPY':'🇯🇵', 'CNY':'🇨🇳', 'KRW':'🇰🇷', 'IDR':'🇮🇩',
    'AUD':'🇦🇺', 'CAD':'🇨🇦', 'CHF':'🇨🇭', 'HKD':'🇭🇰', 'SGD':'🇸🇬', 'INR':'🇮🇳', 'RUB':'🇷🇺',
    'BRL':'🇧🇷', 'ZAR':'🇿🇦', 'TRY':'🇹🇷', 'MXN':'🇲🇽', 'MYR':'🇲🇾', 'PHP':'🇵🇭', 'THB':'🇹🇭'
  };

  ngOnInit() {
    this.fetchLiveRates();
  }

  getFlag(code: string): string {
    return this.flags[code] || '💵';
  }

  async fetchLiveRates() {
    this.loadingRates.set(true);
    this.errorMessage.set('');
    try {
      // Free public Exchange Rate API (ExchangeRate-API)
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!res.ok) throw new Error('Network response was not OK');
      
      const data = await res.json();
      const mappedRates: CurrencyRateMap = data.rates;
      
      this.rates.set(mappedRates);
      
      // Extract available currencies and sort them
      const curList = Object.keys(mappedRates).sort();
      this.availableCurrencies.set(curList);
      
      this.ratesLoaded.set(true);
      this.lastUpdated.set(new Date());
      this.calculate();
      
    } catch {
      this.errorMessage.set('Failed to connect to live rates API. Working offline is unavailable for currencies.');
      this.ratesLoaded.set(false);
    } finally {
      this.loadingRates.set(false);
    }
  }

  onAmountChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const val = parseFloat(target.value);
    this.amount.set(isNaN(val) ? 0 : val);
    this.calculate();
  }

  swapCurrencies(): void {
    const s = this.sourceCurrency();
    const t = this.targetCurrency();
    this.sourceCurrency.set(t);
    this.targetCurrency.set(s);
    this.calculate();
  }

  getConversionRate(from: string, to: string): number {
    const r = this.rates();
    if (!r[from] || !r[to]) return 0;
    
    // Convert from -> USD -> to
    // Since rates are based on USD (1 USD = X Currency)
    const usdAmount = 1 / r[from];
    return usdAmount * r[to];
  }

  calculate(): void {
    if (!this.ratesLoaded()) return;
    
    const rate = this.getConversionRate(this.sourceCurrency(), this.targetCurrency());
    const finalVal = this.amount() * rate;
    
    // Smart formatting
    let formatted = '0.00';
    if (finalVal === 0) formatted = '0.00';
    else if (finalVal < 0.01) formatted = finalVal.toPrecision(4);
    else formatted = finalVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    
    this.resultAmount.set(formatted);
  }

  formatRate(rate: number): string {
    if (!rate) return '0.00';
    if (rate < 0.01) return rate.toPrecision(4);
    return rate.toFixed(4);
  }

  async onCopy(): Promise<void> {
    const text = `${this.amount()} ${this.sourceCurrency()} = ${this.resultAmount()} ${this.targetCurrency()}`;
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
    this.store.dispatch(CurrencyConverterActions.resetState());
  }
}
