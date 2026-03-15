import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PluginStore } from '../../store/plugin.store';
import { PluginInstallerComponent } from '../plugin-installer/plugin-installer.component';
import { PluginCardComponent } from '../plugin-card/plugin-card.component';

@Component({
  selector: 'app-plugin-manager',
  standalone: true,
  imports: [CommonModule, PluginInstallerComponent, PluginCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <!-- Header -->
      <header>
        <h2 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple tracking-tight mb-2 flex items-center gap-3">
          🔌 Plugin Manager
        </h2>
        <p class="text-text-secondary">
          Install, manage, and configure .omniplug extensions for your Omni-Tool.
          Plugins run in isolated sandboxes with controlled API access.
        </p>
      </header>

      <!-- Installer Section -->
      <app-plugin-installer />

      <!-- Installed Plugins List -->
      @if (store.plugins().length > 0) {
        <section class="space-y-4">
          <h3 class="text-lg font-semibold flex items-center gap-2">
            <span class="text-accent-cyan">▸</span>
            Installed Plugins
            <span class="text-xs bg-white/10 px-2 py-0.5 rounded-full">{{ store.plugins().length }}</span>
          </h3>
          <div class="space-y-3">
            @for (plugin of store.plugins(); track plugin.id) {
              <app-plugin-card
                [plugin]="plugin"
                (pluginToggle)="store.togglePlugin($event)"
                (pluginRemove)="store.removePlugin($event); store.loadPlugins()" />
            }
          </div>
        </section>
      } @else if (!store.loading()) {
        <div class="glass-panel p-8 rounded-2xl text-center space-y-3">
          <span class="text-4xl block mb-2">📦</span>
          <h3 class="text-xl font-bold">No Plugins Installed</h3>
          <p class="text-text-secondary">
            Drop an .omniplug file above to get started.
          </p>
        </div>
      }
    </div>
  `
})
export class PluginManagerComponent implements OnInit {
  readonly store = inject(PluginStore);

  ngOnInit(): void {
    this.store.loadPlugins();
  }
}
