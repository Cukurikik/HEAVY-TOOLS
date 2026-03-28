'use client';

import { useSettingsEventBridge } from '@/modules/settings-engine/bridge/SettingsEventBridge';

/**
 * EngineProvider
 * 
 * Client component that mounts the Settings → Engine event bridge.
 * Place this in the root layout so all engine listeners are active
 * across the entire application lifecycle.
 * 
 * On boot: Reads settings from the ZUSTAND STORE (populated by ClientSettingsProvider)
 * and applies ONLY configuration values to onAfterChange engine hooks.
 */
import { useEffect, useRef } from 'react';
import { SettingsRegistry } from '@/modules/settings-engine/registry';
import { CoreEngineManager } from '@/modules/settings-engine/engines/CoreEngineManager';
import { useSettingsStore } from '@/store/useSettingsStore';

export function EngineProvider({ children }: { children: React.ReactNode }) {
  useSettingsEventBridge();
  const booted = useRef(false);
  const settings = useSettingsStore(s => s.settings);
  const isLoading = useSettingsStore(s => s.isLoading);

  // 1. Mount the heavy lifting backend manager once
  useEffect(() => {
    CoreEngineManager.init();
  }, []);

  // 2. Apply engine hooks whenever settings are loaded/changed
  useEffect(() => {
    // Don't apply while settings haven't been fetched yet
    if (isLoading) return;
    // Don't apply if settings are empty (store hasn't hydrated yet)
    if (!settings || Object.keys(settings).length === 0) return;
    // Only boot once per mount cycle
    if (booted.current) return;
    booted.current = true;

    console.log('🚀 [EngineBootloader] Applying saved enterprise settings from Zustand store...');
    const allFeatures = SettingsRegistry.getAll();
    let applied = 0;
    
    for (const feature of allFeatures) {
      if (!feature.onAfterChange) continue;

      try {
        const isEnabledKey = `${feature.slug}_enabled`;
        const isEnabled = settings[isEnabledKey];

        if (feature.inputType === 'toggle') {
          // For toggle features: fire onAfterChange with the boolean value
          if (isEnabled === true) {
            feature.onAfterChange(true);
            applied++;
            console.log(`  ✅ Toggle: ${feature.slug} = ON`);
          }
        } else {
          // For config features: only apply if the feature is enabled
          if (isEnabled) {
            const configValue = settings[feature.slug] ?? feature.defaultValue;
            feature.onAfterChange(configValue);
            applied++;
            console.log(`  ✅ Config: ${feature.slug} = ${JSON.stringify(configValue).substring(0, 50)}`);
          }
        }
      } catch (e) {
        console.warn(`  ⚠️ Failed: ${feature.slug}:`, e);
      }
    }
    
    console.log(`🏁 [EngineBootloader] Applied ${applied} engine settings successfully.`);
  }, [settings, isLoading]);

  return <>{children}</>;
}
