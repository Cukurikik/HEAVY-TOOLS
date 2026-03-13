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
        <h1 class="text-4xl font-bold tracking-tight text-text-primary mb-2">
          Settings & Governance
        </h1>
        <p class="text-text-secondary">Manage workspace, security, and hardware tuning.</p>
      </header>

      <section class="glass-panel rounded-2xl p-8 space-y-6">
        <h2 class="text-2xl font-semibold flex items-center gap-2">
          <mat-icon class="text-accent-cyan">security</mat-icon> Security
        </h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <div class="font-medium">Network Killswitch</div>
              <div class="text-sm text-text-secondary">Air-Gap mode via Service Worker</div>
            </div>
            <button class="w-12 h-6 rounded-full bg-status-success relative transition-colors">
              <span class="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></span>
            </button>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <div class="font-medium">Workspace Backup</div>
              <div class="text-sm text-text-secondary">AES-256 encrypted .OMNI snapshot</div>
            </div>
            <button class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">Backup Now</button>
          </div>
        </div>
      </section>

      <section class="glass-panel rounded-2xl p-8 space-y-6">
        <h2 class="text-2xl font-semibold flex items-center gap-2">
          <mat-icon class="text-accent-purple">memory</mat-icon> Hardware Tuning
        </h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <div class="font-medium">WebGPU Acceleration</div>
              <div class="text-sm text-text-secondary">Use GPU for AI and Image processing</div>
            </div>
            <button class="w-12 h-6 rounded-full bg-status-success relative transition-colors">
              <span class="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></span>
            </button>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <div class="font-medium">Thermal Throttling Monitor</div>
              <div class="text-sm text-text-secondary">Pause heavy tasks if device overheats</div>
            </div>
            <button class="w-12 h-6 rounded-full bg-white/20 relative transition-colors">
              <span class="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></span>
            </button>
          </div>
        </div>
      </section>
    </div>
  `
})
export class SettingsComponent {}
