import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PluginStore } from '../../store/plugin.store';
import { PluginPermissionService } from '../../services/plugin-permission.service';
import { PluginPermission } from '../../types/plugin.types';

@Component({
  selector: 'app-plugin-installer',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Drop Zone -->
      @if (!store.pendingInstall()) {
        <div class="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-white/20 hover:border-accent-cyan/50 transition-colors cursor-pointer group"
             role="button" tabindex="0"
             (click)="fileInput.click()"
             (keydown.enter)="fileInput.click()"
             (keydown.space)="fileInput.click()"
             (dragover)="$event.preventDefault()"
             (drop)="onDrop($event)">
          <input type="file" #fileInput class="hidden" accept=".omniplug,.zip" (change)="onFileSelected($event)" />
          <div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span class="text-4xl">🔌</span>
          </div>
          <h3 class="text-xl font-bold mb-2">Install Plugin</h3>
          <p class="text-text-secondary text-center">
            Drag & drop an <strong>.omniplug</strong> file here<br/>
            or click to browse
          </p>
        </div>
      }

      <!-- Loading State -->
      @if (store.loading()) {
        <div class="glass-panel p-8 rounded-2xl text-center">
          <div class="w-12 h-12 border-4 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-text-secondary">Reading plugin package...</p>
        </div>
      }

      <!-- Error State -->
      @if (store.error()) {
        <div class="glass-panel p-6 rounded-2xl border border-status-error/30 space-y-3">
          <h3 class="text-status-error font-bold flex items-center gap-2">⚠️ Installation Failed</h3>
          <p class="text-text-secondary text-sm">{{ store.error() }}</p>
          <button (click)="store.cancelInstall()" class="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-sm">
            Dismiss
          </button>
        </div>
      }

      <!-- Permission Confirmation Dialog -->
      @if (store.pendingInstall(); as pending) {
        <div class="glass-panel p-8 rounded-2xl space-y-6 border border-accent-cyan/30 animate-fade-in-up">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl bg-accent-cyan/10 flex items-center justify-center">
              <span class="text-2xl">🔌</span>
            </div>
            <div>
              <h3 class="text-xl font-bold">{{ pending.manifest.name }}</h3>
              <p class="text-text-secondary text-sm">v{{ pending.manifest.version }}</p>
            </div>
          </div>

          @if (pending.manifest.description) {
            <p class="text-text-secondary">{{ pending.manifest.description }}</p>
          }

          <!-- Permissions Table -->
          <div class="space-y-2">
            <h4 class="font-semibold text-sm uppercase tracking-wider text-text-secondary">Requested Permissions</h4>
            <div class="space-y-1">
              @for (perm of getPermissionDetails(pending.manifest.permissions); track perm.permission) {
                <div class="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-2.5">
                  <span class="text-accent-cyan">✓</span>
                  <div>
                    <p class="font-mono text-sm">{{ perm.permission }}</p>
                    <p class="text-xs text-text-secondary">{{ perm.description }}</p>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-2">
            <button (click)="store.cancelInstall()"
                    class="flex-1 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl font-semibold transition-colors">
              Cancel
            </button>
            <button (click)="store.confirmInstall(); store.loadPlugins()"
                    class="flex-1 bg-gradient-to-r from-accent-cyan to-accent-purple px-4 py-3 rounded-xl font-bold hover:scale-[1.02] transition-transform">
              Install & Grant
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class PluginInstallerComponent {
  readonly store = inject(PluginStore);
  private permissionService = inject(PluginPermissionService);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.store.stagePlugin(input.files[0]);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.store.stagePlugin(event.dataTransfer.files[0]);
    }
  }

  getPermissionDetails(permissions: string[]): { permission: string; description: string }[] {
    return this.permissionService.getPermissionSummary(permissions as PluginPermission[]);
  }
}
