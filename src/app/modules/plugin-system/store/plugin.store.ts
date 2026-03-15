import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { OmniPlugin, PluginManifest } from '../types/plugin.types';
import { PluginEngineService } from '../services/plugin-engine.service';

export interface PluginState {
  plugins: OmniPlugin[];
  loading: boolean;
  error: string | null;
  pendingInstall: {
    manifest: PluginManifest;
    code: string;
    iconDataUrl?: string;
  } | null;
}

const initialState: PluginState = {
  plugins: [],
  loading: false,
  error: null,
  pendingInstall: null,
};

export const PluginStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const engine = inject(PluginEngineService);

    return {
      /** Load all installed plugins from localStorage */
      loadPlugins(): void {
        patchState(store, { loading: true });
        const plugins = engine.getInstalledPlugins();
        patchState(store, { plugins, loading: false });
      },

      /** Parse an .omniplug file and stage for permission confirmation */
      async stagePlugin(file: File): Promise<void> {
        patchState(store, { loading: true, error: null });
        try {
          const result = await engine.loadOmniPlugFile(file);
          patchState(store, {
            pendingInstall: result,
            loading: false,
          });
        } catch (e) {
          patchState(store, {
            error: e instanceof Error ? e.message : 'Failed to read .omniplug file',
            loading: false,
          });
        }
      },

      /** Confirm and install the staged plugin */
      confirmInstall(): void {
        const pending = store.pendingInstall();
        if (!pending) return;

        engine.installPlugin(pending.manifest, pending.code, pending.iconDataUrl);
        const plugins = engine.getInstalledPlugins();
        patchState(store, { plugins, pendingInstall: null });
      },

      /** Cancel the pending installation */
      cancelInstall(): void {
        patchState(store, { pendingInstall: null });
      },

      /** Toggle plugin active/inactive */
      togglePlugin(pluginId: string): void {
        engine.togglePlugin(pluginId);
        const plugins = engine.getInstalledPlugins();
        patchState(store, { plugins });
      },

      /** Remove a plugin entirely */
      removePlugin(pluginId: string): void {
        engine.uninstallPlugin(pluginId);
        const plugins = engine.getInstalledPlugins();
        patchState(store, { plugins });
      },
    };
  })
);
