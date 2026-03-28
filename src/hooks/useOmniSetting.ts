import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';

/**
 * ⚡ useOmniSetting Hook
 * Connects standard UI components directly to the massive Settings Engine dictionary.
 * Prevents hydration mismatch by defaulting to `fallback` on the server and syncing on mount.
 */
export function useOmniSetting<T>(key: string, fallback: T): T {
  const settings = useSettingsStore((state) => state.settings);
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    if (settings && settings[key] !== undefined) {
      setValue(settings[key] as T);
    }
  }, [settings, key]);

  return value;
}
