'use client';

import { useSettingsStore } from '@/store/useSettingsStore';
import { useEffect } from 'react';

/**
 * 13. ClientSettingsProvider
 * Mount this component inside the root `layout.tsx` body.
 * It enforces that the Omni-Store "Brain" hydrates on application boot.
 * Note: Actual CSS DOM mutations are handled via `SettingsEventBridge` + Feature Registry.
 */
export function ClientSettingsProvider({ children }: { children: React.ReactNode }) {
  const { fetchSettings } = useSettingsStore();

  // Hydrate settings from local API / OPFS on root mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return <>{children}</>;
}
