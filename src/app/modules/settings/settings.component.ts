import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 space-y-8 max-w-4xl mx-auto">
      <header class="mb-12">
        <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg tracking-tight text-4xl font-bold tracking-tight text-text-primary mb-2">
          Settings & Governance
        </h1>
        <p class="text-text-secondary">Manage workspace, security, and hardware tuning.</p>
      </header>

      <section class="glass-panel rounded-2xl p-8 space-y-6">
        <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg tracking-tight text-2xl font-semibold flex items-center gap-2">
          <mat-icon class="text-accent-cyan">security</mat-icon> Security
        </h1>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <div class="font-medium">Network Killswitch</div>
              <div class="text-sm text-text-secondary">Air-Gap mode via Service Worker</div>
            </div>
            <button class="relative flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300 transform hover:-translate-y-1 group disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden">
        <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <span class="relative z-10 flex items-center gap-2">
              <span class="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></span>
            </span>
      </button>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <div class="font-medium">Workspace Backup</div>
              <div class="text-sm text-text-secondary">AES-256 encrypted .OMNI snapshot</div>
            </div>
            <button class="relative flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300 transform hover:-translate-y-1 group disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden">
        <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <span class="relative z-10 flex items-center gap-2">Backup Now</span>
      </button>
          </div>
        </div>
      </section>

      <section class="glass-panel rounded-2xl p-8 space-y-6">
        <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg tracking-tight text-2xl font-semibold flex items-center gap-2">
          <mat-icon class="text-accent-purple">memory</mat-icon> Hardware Tuning
        </h1>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <div class="font-medium">WebGPU Acceleration</div>
              <div class="text-sm text-text-secondary">Use GPU for AI and Image processing</div>
            </div>
            <button class="relative flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300 transform hover:-translate-y-1 group disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden">
        <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <span class="relative z-10 flex items-center gap-2">
              <span class="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></span>
            </span>
      </button>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <div class="font-medium">Thermal Throttling Monitor</div>
              <div class="text-sm text-text-secondary">Pause heavy tasks if device overheats</div>
            </div>
            <button class="relative flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300 transform hover:-translate-y-1 group disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden">
        <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <span class="relative z-10 flex items-center gap-2">
              <span class="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></span>
            </span>
      </button>
          </div>
        </div>
      </section>
    </div>
  `
})
export class SettingsComponent {}
