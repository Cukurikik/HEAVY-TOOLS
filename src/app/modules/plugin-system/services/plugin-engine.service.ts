import { Injectable, inject } from '@angular/core';
import { OmniPlugin, PluginManifest, PluginManifestSchema, PluginMessage, PluginPermission } from '../types/plugin.types';
import { PluginPermissionService } from './plugin-permission.service';

const STORAGE_KEY = 'omni_plugins';

/**
 * OMNI PLUGIN ENGINE SERVICE
 * 
 * Core engine that handles the full lifecycle of .omniplug plugins:
 * - Loading and parsing .omniplug (ZIP) files
 * - Installing/uninstalling plugins to localStorage
 * - Spawning isolated Web Worker sandboxes per plugin
 * - Managing plugin state (active/inactive/error)
 */
@Injectable({ providedIn: 'root' })
export class PluginEngineService {
  private permissionService = inject(PluginPermissionService);
  private activeWorkers = new Map<string, Worker>();
  private idCounter = 0;

  // ============================================================
  //  ID GENERATOR (no uuid dependency needed)
  // ============================================================

  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    this.idCounter++;
    return `plg_${timestamp}_${random}_${this.idCounter}`;
  }

  // ============================================================
  //  REGISTRY (localStorage persistence)
  // ============================================================

  /** Get all installed plugins from localStorage */
  getInstalledPlugins(): OmniPlugin[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /** Save plugins array to localStorage */
  private savePlugins(plugins: OmniPlugin[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plugins));
  }

  // ============================================================
  //  LOADER (.omniplug ZIP parser)
  // ============================================================

  /**
   * Reads an .omniplug file (which is a ZIP), extracts manifest.json and plugin.js.
   * Returns a parsed OmniPlugin object ready for installation.
   */
  async loadOmniPlugFile(file: File): Promise<{ manifest: PluginManifest; code: string; iconDataUrl?: string }> {
    // Dynamic import fflate for ZIP reading (already in project from Phase 15)
    const { unzip } = await import('fflate');

    const buffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(buffer);

    return new Promise((resolve, reject) => {
      unzip(uint8, (err: Error | null, data: Record<string, Uint8Array>) => {
        if (err) {
          reject(new Error(`Plugin ZIP corrupted: ${err.message}`));
          return;
        }

        // Parse manifest.json
        const manifestBytes = data['manifest.json'];
        if (!manifestBytes) {
          reject(new Error('manifest.json not found inside .omniplug package'));
          return;
        }

        let manifest: PluginManifest;
        try {
          const manifestText = new TextDecoder().decode(manifestBytes);
          const parsed = JSON.parse(manifestText);
          manifest = PluginManifestSchema.parse(parsed);
        } catch (e) {
          reject(new Error(`manifest.json invalid: ${e instanceof Error ? e.message : e}`));
          return;
        }

        // Extract plugin entry JS
        const entryFile = manifest.entry || 'plugin.js';
        const codeBytes = data[entryFile];
        if (!codeBytes) {
          reject(new Error(`Entry file "${entryFile}" not found inside .omniplug package`));
          return;
        }
        const code = new TextDecoder().decode(codeBytes);

        // Extract icon (optional)
        let iconDataUrl: string | undefined;
        const iconFile = manifest.icon;
        if (iconFile && data[iconFile]) {
          const iconBytes = data[iconFile];
          const base64 = btoa(String.fromCharCode(...iconBytes));
          iconDataUrl = `data:image/png;base64,${base64}`;
        }

        resolve({ manifest, code, iconDataUrl });
      });
    });
  }

  // ============================================================
  //  INSTALLATION
  // ============================================================

  /** Install a plugin after user confirms permissions */
  installPlugin(manifest: PluginManifest, code: string, iconDataUrl?: string): OmniPlugin {
    const plugins = this.getInstalledPlugins();

    // Check for duplicates by name
    const existing = plugins.find(p => p.manifest.name === manifest.name);
    if (existing) {
      // Update existing plugin
      existing.manifest = manifest;
      existing.code = code;
      existing.iconDataUrl = iconDataUrl;
      existing.status = 'installed';
      existing.error = undefined;
      this.savePlugins(plugins);
      return existing;
    }

    const plugin: OmniPlugin = {
      id: this.generateId(),
      manifest,
      status: 'installed',
      code,
      iconDataUrl,
      installedAt: new Date().toISOString(),
    };

    plugins.push(plugin);
    this.savePlugins(plugins);
    return plugin;
  }

  /** Uninstall plugin by ID */
  uninstallPlugin(pluginId: string): void {
    this.deactivatePlugin(pluginId);
    const plugins = this.getInstalledPlugins().filter(p => p.id !== pluginId);
    this.savePlugins(plugins);
  }

  // ============================================================
  //  ACTIVATION (Web Worker Sandbox)
  // ============================================================

  /** Activate a plugin: spawn its sandbox worker */
  activatePlugin(pluginId: string): void {
    const plugins = this.getInstalledPlugins();
    const plugin = plugins.find(p => p.id === pluginId);
    if (!plugin) return;

    // Kill existing worker if any
    this.killWorker(pluginId);

    try {
      const worker = new Worker(
        new URL('../workers/plugin-sandbox.worker.ts', import.meta.url),
        { type: 'module' }
      );

      worker.onmessage = (event: MessageEvent<PluginMessage>) => {
        this.handleWorkerMessage(pluginId, event.data);
      };

      worker.onerror = (err) => {
        console.error(`[PLUGIN:${plugin.manifest.name}] Worker crashed:`, err.message);
        this.updatePluginStatus(pluginId, 'error', err.message);
      };

      // Send INIT with plugin code and permissions
      worker.postMessage({
        type: 'INIT',
        pluginName: plugin.manifest.name,
        permissions: plugin.manifest.permissions,
        code: plugin.code,
      });

      this.activeWorkers.set(pluginId, worker);
      this.updatePluginStatus(pluginId, 'active');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.updatePluginStatus(pluginId, 'error', msg);
    }
  }

  /** Deactivate a plugin: kill its worker */
  deactivatePlugin(pluginId: string): void {
    this.killWorker(pluginId);
    this.updatePluginStatus(pluginId, 'inactive');
  }

  /** Toggle plugin active/inactive */
  togglePlugin(pluginId: string): void {
    const plugins = this.getInstalledPlugins();
    const plugin = plugins.find(p => p.id === pluginId);
    if (!plugin) return;

    if (plugin.status === 'active') {
      this.deactivatePlugin(pluginId);
    } else {
      this.activatePlugin(pluginId);
    }
  }

  // ============================================================
  //  INTERNAL HELPERS
  // ============================================================

  private killWorker(pluginId: string): void {
    const worker = this.activeWorkers.get(pluginId);
    if (worker) {
      worker.postMessage({ type: 'SHUTDOWN' });
      worker.terminate();
      this.activeWorkers.delete(pluginId);
    }
  }

  private updatePluginStatus(pluginId: string, status: OmniPlugin['status'], error?: string): void {
    const plugins = this.getInstalledPlugins();
    const plugin = plugins.find(p => p.id === pluginId);
    if (plugin) {
      plugin.status = status;
      plugin.error = error;
      this.savePlugins(plugins);
    }
  }

  private handleWorkerMessage(pluginId: string, msg: PluginMessage): void {
    const plugins = this.getInstalledPlugins();
    const plugin = plugins.find(p => p.id === pluginId);

    switch (msg.type) {
      case 'LOG':
        console.log(`[PLUGIN:${plugin?.manifest.name}]`, ...(msg.args || []));
        break;

      case 'ERROR':
        console.error(`[PLUGIN:${plugin?.manifest.name}] ERROR:`, msg.error);
        break;

      case 'API_CALL':
        if (plugin && msg.method) {
          const allowed = this.permissionService.isApiCallAllowed(
            msg.method,
            plugin.manifest.permissions as PluginPermission[]
          );
          if (allowed) {
            this.executeApiCall(pluginId, msg.method, msg.args || []);
          } else {
            console.warn(`[PLUGIN:${plugin.manifest.name}] BLOCKED API call: ${msg.method} (no permission)`);
          }
        }
        break;
    }
  }

  private executeApiCall(pluginId: string, method: string, args: unknown[]): void {
    switch (method) {
      case 'ui.toast': {
        console.log(`[PLUGIN TOAST]`, ...args);
        break;
      }
      case 'ui.showPanel': {
        console.log(`[PLUGIN PANEL]`, ...args);
        break;
      }
      case 'media.convert': {
        console.log(`[PLUGIN MEDIA.CONVERT]`, ...args);
        break;
      }
      case 'storage.read': {
        const key = args[0] as string;
        const value = localStorage.getItem(`plugin_${pluginId}_${key}`);
        const worker = this.activeWorkers.get(pluginId);
        if (worker) {
          worker.postMessage({ type: 'API_RESPONSE', method, result: value });
        }
        break;
      }
      case 'storage.write': {
        const writeKey = args[0] as string;
        const writeValue = args[1] as string;
        localStorage.setItem(`plugin_${pluginId}_${writeKey}`, writeValue);
        break;
      }
      default: {
        console.warn(`[PLUGIN ENGINE] Unknown API method: ${method}`);
      }
    }
  }
}
