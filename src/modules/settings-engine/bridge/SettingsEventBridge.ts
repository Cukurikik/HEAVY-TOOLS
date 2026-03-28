'use client';

/**
 * SettingsEventBridge — LIVE Engine Activation
 * 
 * This bridge listens for CustomEvents from settings changes and calls
 * the ACTUAL onAfterChange hooks from the feature definitions.
 * These hooks contain REAL DOM mutations, CSS changes, and engine reconfigurations.
 * 
 * Architecture:
 * 1. User toggles setting → handleChange dispatches CustomEvent('omni:setting-changed')
 * 2. This bridge catches it → finds the feature definition in the registry
 * 3. Calls feature.onAfterChange(value) → REAL DOM mutation happens
 */

import { useEffect } from 'react';
import { SettingsRegistry } from '@/modules/settings-engine/registry';

function handleSettingChanged(e: CustomEvent<{ slug: string; value: any; category: string }>) {
  const { slug, value } = e.detail;

  // Strip _enabled suffix if present — the registry uses clean slugs
  const cleanSlug = slug.replace('_enabled', '');

  // Find the REAL feature definition with its onAfterChange hook
  const allFeatures = SettingsRegistry.getAll();
  const feature = allFeatures.find(f => f.slug === cleanSlug);

  if (!feature) {
    // Not every key maps to a feature (e.g. meta keys). Silently skip.
    return;
  }

  // Call the REAL onAfterChange hook — this produces ACTUAL DOM/CSS changes
  if (feature.onAfterChange) {
    try {
      feature.onAfterChange(value);
      console.log(`⚡ [Engine] Applied "${feature.label}" → ${JSON.stringify(value).substring(0, 80)}`);
    } catch (err) {
      console.error(`❌ [Engine] Error in "${cleanSlug}":`, err);
    }
  }

  // Also persist to sessionStorage for non-UI engines to read later
  try {
    sessionStorage.setItem(`omni:${cleanSlug}`, JSON.stringify(value));
  } catch {}
}

/**
 * React hook — mount in root layout via EngineProvider.
 * Listens for the unified 'omni:setting-changed' event and initializes settings on boot.
 */
export function useSettingsEventBridge() {
  useEffect(() => {
    const handler = handleSettingChanged as EventListener;
    window.addEventListener('omni:setting-changed', handler);
    
    const featureCount = SettingsRegistry.getAll().length;
    console.log(`🔌 [SettingsEventBridge] ACTIVE — ${featureCount} features with live onAfterChange hooks`);

    // NOTE: Boot initialization is handled by EngineProvider.
    // This bridge ONLY listens for live setting changes dispatched from the Settings UI.

    return () => {
      window.removeEventListener('omni:setting-changed', handler);
    };
  }, []);
}
