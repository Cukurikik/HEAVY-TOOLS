import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OmniPlugin } from '../../types/plugin.types';

@Component({
  selector: 'app-plugin-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="glass-panel rounded-2xl p-5 flex items-center gap-5 group hover:border-accent-cyan/50 transition-all duration-300"
         [class.border-status-success]="plugin.status === 'active'"
         [class.border-status-error]="plugin.status === 'error'">

      <!-- Icon -->
      <div class="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
        @if (plugin.iconDataUrl) {
          <img [src]="plugin.iconDataUrl" alt="Plugin Icon" class="w-10 h-10 object-contain" />
        } @else {
          <span class="text-2xl">🔌</span>
        }
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <h3 class="font-bold text-lg truncate">{{ plugin.manifest.name }}</h3>
        <p class="text-sm text-text-secondary truncate">
          v{{ plugin.manifest.version }}
          @if (plugin.manifest.author) {
            · by {{ plugin.manifest.author }}
          }
        </p>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-xs px-2 py-0.5 rounded-full"
                [class]="statusClass">
            {{ statusLabel }}
          </span>
          <span class="text-xs text-text-secondary">
            {{ plugin.manifest.permissions.length }} permissions
          </span>
        </div>
        @if (plugin.error) {
          <p class="text-xs text-status-error mt-1 truncate">{{ plugin.error }}</p>
        }
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 shrink-0">
        <button (click)="pluginToggle.emit(plugin.id)"
                class="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                [class]="plugin.status === 'active'
                  ? 'bg-status-error/20 text-status-error hover:bg-status-error/30'
                  : 'bg-status-success/20 text-status-success hover:bg-status-success/30'">
          {{ plugin.status === 'active' ? 'Stop' : 'Start' }}
        </button>
        <button (click)="pluginRemove.emit(plugin.id)"
                class="px-3 py-2 rounded-lg text-sm bg-white/5 hover:bg-status-error/20 text-text-secondary hover:text-status-error transition-all duration-200">
          ✕
        </button>
      </div>
    </div>
  `
})
export class PluginCardComponent {
  @Input({ required: true }) plugin!: OmniPlugin;
  @Output() pluginToggle = new EventEmitter<string>();
  @Output() pluginRemove = new EventEmitter<string>();

  get statusClass(): string {
    switch (this.plugin.status) {
      case 'active': return 'bg-status-success/20 text-status-success';
      case 'error': return 'bg-status-error/20 text-status-error';
      case 'inactive': return 'bg-white/10 text-text-secondary';
      default: return 'bg-accent-cyan/20 text-accent-cyan';
    }
  }

  get statusLabel(): string {
    switch (this.plugin.status) {
      case 'active': return 'Running';
      case 'error': return 'Error';
      case 'inactive': return 'Stopped';
      default: return 'Installed';
    }
  }
}
