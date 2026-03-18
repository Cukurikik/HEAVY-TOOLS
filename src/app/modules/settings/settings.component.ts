import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
      <header class="mb-8">
        <h1 class="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple mb-2">
          ⚙️ Settings & Governance
        </h1>
        <p class="text-text-secondary">Manage workspace, themes, security, storage, and hardware tuning.</p>
      </header>

      <!-- ═══ APPEARANCE ═══ -->
      <section class="glass-panel rounded-2xl p-6 space-y-5">
        <h2 class="text-xl font-semibold flex items-center gap-2">
          <mat-icon class="text-accent-cyan">palette</mat-icon> Appearance
        </h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 transition-colors">
            <div>
              <div class="font-medium">Theme</div>
              <div class="text-sm text-text-secondary">Choose your visual preference</div>
            </div>
            <div class="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
              <button (click)="setTheme('dark')" [class.bg-accent-cyan/20]="theme() === 'dark'" [class.text-accent-cyan]="theme() === 'dark'" class="px-3 py-1.5 rounded-lg text-sm font-medium text-text-secondary hover:text-white transition-colors">
                <mat-icon class="text-base align-middle mr-1">dark_mode</mat-icon> Dark
              </button>
              <button (click)="setTheme('light')" [class.bg-accent-cyan/20]="theme() === 'light'" [class.text-accent-cyan]="theme() === 'light'" class="px-3 py-1.5 rounded-lg text-sm font-medium text-text-secondary hover:text-white transition-colors">
                <mat-icon class="text-base align-middle mr-1">light_mode</mat-icon> Light
              </button>
              <button (click)="setTheme('system')" [class.bg-accent-cyan/20]="theme() === 'system'" [class.text-accent-cyan]="theme() === 'system'" class="px-3 py-1.5 rounded-lg text-sm font-medium text-text-secondary hover:text-white transition-colors">
                <mat-icon class="text-base align-middle mr-1">computer</mat-icon> System
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 transition-colors">
            <div>
              <div class="font-medium">Accent Color</div>
              <div class="text-sm text-text-secondary">Primary accent color for the UI</div>
            </div>
            <div class="flex items-center gap-2">
              <button (click)="setAccent('cyan')" class="w-7 h-7 rounded-full bg-[#00f5ff] border-2 transition-all" [class.border-white]="accent() === 'cyan'" [class.border-transparent]="accent() !== 'cyan'" [class.scale-110]="accent() === 'cyan'"></button>
              <button (click)="setAccent('purple')" class="w-7 h-7 rounded-full bg-[#7c3aed] border-2 transition-all" [class.border-white]="accent() === 'purple'" [class.border-transparent]="accent() !== 'purple'" [class.scale-110]="accent() === 'purple'"></button>
              <button (click)="setAccent('amber')" class="w-7 h-7 rounded-full bg-[#f59e0b] border-2 transition-all" [class.border-white]="accent() === 'amber'" [class.border-transparent]="accent() !== 'amber'" [class.scale-110]="accent() === 'amber'"></button>
              <button (click)="setAccent('green')" class="w-7 h-7 rounded-full bg-[#10b981] border-2 transition-all" [class.border-white]="accent() === 'green'" [class.border-transparent]="accent() !== 'green'" [class.scale-110]="accent() === 'green'"></button>
              <button (click)="setAccent('red')" class="w-7 h-7 rounded-full bg-[#ef4444] border-2 transition-all" [class.border-white]="accent() === 'red'" [class.border-transparent]="accent() !== 'red'" [class.scale-110]="accent() === 'red'"></button>
            </div>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 transition-colors">
            <div>
              <div class="font-medium">Language</div>
              <div class="text-sm text-text-secondary">Interface display language</div>
            </div>
            <select class="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent-cyan">
              <option value="en" selected>English</option>
              <option value="id">Bahasa Indonesia</option>
              <option value="ja">日本語</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
            </select>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 transition-colors">
            <div>
              <div class="font-medium">Sidebar Collapsed</div>
              <div class="text-sm text-text-secondary">Start with sidebar minimized</div>
            </div>
            <button (click)="sidebarCollapsed.set(!sidebarCollapsed())" class="w-12 h-6 rounded-full relative transition-colors" [class.bg-status-success]="sidebarCollapsed()" [class.bg-white/20]="!sidebarCollapsed()">
              <span class="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all" [class.right-1]="sidebarCollapsed()" [class.left-1]="!sidebarCollapsed()"></span>
            </button>
          </div>
        </div>
      </section>

      <!-- ═══ SECURITY ═══ -->
      <section class="glass-panel rounded-2xl p-6 space-y-5">
        <h2 class="text-xl font-semibold flex items-center gap-2">
          <mat-icon class="text-accent-red">security</mat-icon> Security & Privacy
        </h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 transition-colors">
            <div>
              <div class="font-medium">Network Killswitch</div>
              <div class="text-sm text-text-secondary">Air-Gap mode — block all external requests via Service Worker</div>
            </div>
            <button (click)="killswitch.set(!killswitch())" class="w-12 h-6 rounded-full relative transition-colors" [class.bg-status-success]="killswitch()" [class.bg-white/20]="!killswitch()">
              <span class="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all" [class.right-1]="killswitch()" [class.left-1]="!killswitch()"></span>
            </button>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 transition-colors">
            <div>
              <div class="font-medium">COOP/COEP Headers</div>
              <div class="text-sm text-text-secondary">Required for SharedArrayBuffer (FFmpeg WASM)</div>
            </div>
            <span class="flex items-center gap-2 text-sm font-medium text-status-success">
              <span class="w-2 h-2 rounded-full bg-status-success animate-pulse"></span> Active
            </span>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 transition-colors">
            <div>
              <div class="font-medium">Auto-Encrypt File Cache</div>
              <div class="text-sm text-text-secondary">Encrypt temp files in OPFS with AES-256</div>
            </div>
            <button (click)="autoEncrypt.set(!autoEncrypt())" class="w-12 h-6 rounded-full relative transition-colors" [class.bg-status-success]="autoEncrypt()" [class.bg-white/20]="!autoEncrypt()">
              <span class="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all" [class.right-1]="autoEncrypt()" [class.left-1]="!autoEncrypt()"></span>
            </button>
          </div>
        </div>
      </section>

      <!-- ═══ STORAGE ═══ -->
      <section class="glass-panel rounded-2xl p-6 space-y-5">
        <h2 class="text-xl font-semibold flex items-center gap-2">
          <mat-icon class="text-accent-amber">storage</mat-icon> Storage Management
        </h2>
        <div class="space-y-4">
          <div class="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-text-secondary">OPFS Usage</span>
              <span class="text-text-primary font-mono">{{ storageUsed }} / {{ storageTotal }}</span>
            </div>
            <div class="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div class="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple transition-all duration-500" [style.width.%]="storagePercent"></div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <button class="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 transition-all text-center group">
              <mat-icon class="text-accent-cyan mb-2 group-hover:scale-110 transition-transform">cleaning_services</mat-icon>
              <div class="text-sm font-medium">Clear Temp Files</div>
              <div class="text-xs text-text-muted mt-1">Free up OPFS cache</div>
            </button>
            <button class="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 transition-all text-center group">
              <mat-icon class="text-accent-amber mb-2 group-hover:scale-110 transition-transform">delete_sweep</mat-icon>
              <div class="text-sm font-medium">Clear All Data</div>
              <div class="text-xs text-text-muted mt-1">Reset everything</div>
            </button>
          </div>
        </div>
      </section>

      <!-- ═══ PROJECT MANAGEMENT ═══ -->
      <section class="glass-panel rounded-2xl p-6 space-y-5">
        <h2 class="text-xl font-semibold flex items-center gap-2">
          <mat-icon class="text-accent-purple">save</mat-icon> Project & Workspace
        </h2>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button class="p-5 rounded-xl bg-white/5 border border-white/5 hover:border-accent-purple/30 transition-all text-left group space-y-2">
              <div class="flex items-center gap-3">
                <mat-icon class="text-accent-purple group-hover:scale-110 transition-transform">file_download</mat-icon>
                <div>
                  <div class="font-medium">Export Workspace</div>
                  <div class="text-xs text-text-muted">Save as AES-256 encrypted .OMNI file</div>
                </div>
              </div>
            </button>
            <button class="p-5 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 transition-all text-left group space-y-2">
              <div class="flex items-center gap-3">
                <mat-icon class="text-accent-cyan group-hover:scale-110 transition-transform">file_upload</mat-icon>
                <div>
                  <div class="font-medium">Import Workspace</div>
                  <div class="text-xs text-text-muted">Load from .OMNI backup file</div>
                </div>
              </div>
            </button>
            <button class="p-5 rounded-xl bg-white/5 border border-white/5 hover:border-accent-green/30 transition-all text-left group space-y-2">
              <div class="flex items-center gap-3">
                <mat-icon class="text-accent-green group-hover:scale-110 transition-transform">cloud_upload</mat-icon>
                <div>
                  <div class="font-medium">Cloud Sync</div>
                  <div class="text-xs text-text-muted">Sync settings across devices</div>
                </div>
              </div>
            </button>
            <button class="p-5 rounded-xl bg-white/5 border border-white/5 hover:border-accent-amber/30 transition-all text-left group space-y-2">
              <div class="flex items-center gap-3">
                <mat-icon class="text-accent-amber group-hover:scale-110 transition-transform">history</mat-icon>
                <div>
                  <div class="font-medium">Version History</div>
                  <div class="text-xs text-text-muted">View workspace snapshots</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      <!-- ═══ HARDWARE ═══ -->
      <section class="glass-panel rounded-2xl p-6 space-y-5">
        <h2 class="text-xl font-semibold flex items-center gap-2">
          <mat-icon class="text-accent-blue">memory</mat-icon> Hardware Tuning
        </h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 transition-colors">
            <div>
              <div class="font-medium">WebGPU Acceleration</div>
              <div class="text-sm text-text-secondary">Use GPU for AI and image processing</div>
            </div>
            <button (click)="webgpu.set(!webgpu())" class="w-12 h-6 rounded-full relative transition-colors" [class.bg-status-success]="webgpu()" [class.bg-white/20]="!webgpu()">
              <span class="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all" [class.right-1]="webgpu()" [class.left-1]="!webgpu()"></span>
            </button>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 transition-colors">
            <div>
              <div class="font-medium">Worker Thread Count</div>
              <div class="text-sm text-text-secondary">Number of Web Workers for parallel processing</div>
            </div>
            <select class="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent-cyan">
              <option value="auto" selected>Auto ({{ navigatorCores }} cores)</option>
              <option value="1">1 Worker</option>
              <option value="2">2 Workers</option>
              <option value="4">4 Workers</option>
              <option value="8">8 Workers</option>
            </select>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 transition-colors">
            <div>
              <div class="font-medium">Thermal Throttling Monitor</div>
              <div class="text-sm text-text-secondary">Pause heavy tasks when device overheats</div>
            </div>
            <button (click)="thermalMonitor.set(!thermalMonitor())" class="w-12 h-6 rounded-full relative transition-colors" [class.bg-status-success]="thermalMonitor()" [class.bg-white/20]="!thermalMonitor()">
              <span class="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all" [class.right-1]="thermalMonitor()" [class.left-1]="!thermalMonitor()"></span>
            </button>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 transition-colors">
            <div>
              <div class="font-medium">Memory Limit (FFmpeg)</div>
              <div class="text-sm text-text-secondary">Max WASM memory allocation</div>
            </div>
            <select class="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent-cyan">
              <option value="512">512 MB</option>
              <option value="1024" selected>1 GB</option>
              <option value="2048">2 GB</option>
              <option value="4096">4 GB</option>
            </select>
          </div>
        </div>
      </section>

      <!-- ═══ KEYBOARD SHORTCUTS ═══ -->
      <section class="glass-panel rounded-2xl p-6 space-y-5">
        <h2 class="text-xl font-semibold flex items-center gap-2">
          <mat-icon class="text-accent-green">keyboard</mat-icon> Keyboard Shortcuts
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          @for (shortcut of shortcuts; track shortcut.keys) {
            <div class="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
              <span class="text-sm text-text-secondary">{{ shortcut.action }}</span>
              <kbd class="px-2 py-1 rounded-md bg-white/10 border border-white/15 text-xs font-mono text-accent-cyan">{{ shortcut.keys }}</kbd>
            </div>
          }
        </div>
      </section>

      <!-- ═══ ABOUT ═══ -->
      <section class="glass-panel rounded-2xl p-6 space-y-4">
        <h2 class="text-xl font-semibold flex items-center gap-2">
          <mat-icon class="text-text-secondary">info</mat-icon> About
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
            <div class="text-xs text-text-muted mb-1">Version</div>
            <div class="text-sm font-mono text-accent-cyan">1.0.0</div>
          </div>
          <div class="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
            <div class="text-xs text-text-muted mb-1">Framework</div>
            <div class="text-sm font-mono text-white">Angular 21+</div>
          </div>
          <div class="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
            <div class="text-xs text-text-muted mb-1">FFmpeg</div>
            <div class="text-sm font-mono text-white">WASM 0.12.15</div>
          </div>
          <div class="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
            <div class="text-xs text-text-muted mb-1">Phase</div>
            <div class="text-sm font-mono text-accent-purple">19</div>
          </div>
        </div>
        <p class="text-xs text-text-disabled text-center mt-4">
          Omni-Tool — Enterprise Hybrid Suite. Built with Local-First, Cloud-Optional philosophy. © 2026.
        </p>
      </section>
    </div>
  `
})
export class SettingsComponent {
  // Appearance
  theme = signal<'dark' | 'light' | 'system'>('dark');
  accent = signal<string>('cyan');
  sidebarCollapsed = signal(false);

  // Security
  killswitch = signal(false);
  autoEncrypt = signal(false);

  // Hardware
  webgpu = signal(true);
  thermalMonitor = signal(false);
  navigatorCores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;

  // Storage
  storageUsed = '1.8 GB';
  storageTotal = '10 GB';
  storagePercent = 18;

  // Keyboard shortcuts
  shortcuts = [
    { action: 'Search Tools', keys: 'Ctrl + K' },
    { action: 'Toggle Sidebar', keys: 'Ctrl + B' },
    { action: 'Quick Export', keys: 'Ctrl + Shift + E' },
    { action: 'Open Settings', keys: 'Ctrl + ,' },
    { action: 'Go to Dashboard', keys: 'Ctrl + D' },
    { action: 'Cancel Processing', keys: 'Escape' },
    { action: 'Undo', keys: 'Ctrl + Z' },
    { action: 'Redo', keys: 'Ctrl + Shift + Z' },
  ];

  setTheme(t: 'dark' | 'light' | 'system') { this.theme.set(t); }
  setAccent(a: string) { this.accent.set(a); }
}
