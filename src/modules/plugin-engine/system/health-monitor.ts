import { existsSync, readdirSync, statSync, rmSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { validateManifest } from '@/lib/validators/plugin';
import { readFileSync } from 'fs';

// Fase 1: Task 01 & Task 08 - Plugin Directory Setup & Health Monitor
export const PLUGINS_DIR = resolve(process.cwd(), 'omni-plugins');

export const initializePluginDirectory = () => {
  if (!existsSync(PLUGINS_DIR)) {
    mkdirSync(PLUGINS_DIR, { recursive: true });
    console.log(`✅ Custom Plugin Directory dibuat di: ${PLUGINS_DIR}`);
  }
};

export const runPluginHealthMonitor = (): { total: number; healthy: number; corrupted: string[] } => {
  initializePluginDirectory(); // Memastikan folder selalu ada

  const plugins = readdirSync(PLUGINS_DIR).filter(file => {
    return statSync(join(PLUGINS_DIR, file)).isDirectory();
  });

  const report = { total: plugins.length, healthy: 0, corrupted: [] as string[] };

  for (const pluginId of plugins) {
    const pluginPath = join(PLUGINS_DIR, pluginId);
    const manifestPath = join(pluginPath, 'plugin.json');
    
    try {
      if (!existsSync(manifestPath)) {
        throw new Error('plugin.json hilang');
      }

      const manifestText = readFileSync(manifestPath, 'utf8');
      const manifest = validateManifest(manifestText);
      
      const mainPath = join(pluginPath, manifest.main || 'index.js');
      if (!existsSync(mainPath)) {
        throw new Error(`Entry file '${manifest.main}' hilang`);
      }

      report.healthy++;
    } catch (error: any) {
      console.error(`❌ Plugin '${pluginId}' corrupt: ${error.message}`);
      report.corrupted.push(pluginId);
    }
  }

  return report;
};
