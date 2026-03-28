import { get, set, del } from 'idb-keyval';
import { StateStorage } from 'zustand/middleware';

// ═══════════════════════════════════════════════════
// IDB-KeyVal Zustand Storage Wrapper
// ═══════════════════════════════════════════════════

/**
 * Creates a generic IndexedDB storage engine for Zustand `persist` middleware.
 * Uses `idb-keyval` for an extremely lightweight promise-based IDB wrapper.
 * Recommended specifically for Omni-Tool media processing cache persistence.
 */
export const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await get(name);
      return typeof value === 'string' ? value : null;
    } catch (error) {
      console.warn(`[IDB Storage] Failed to read ${name}:`, error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await set(name, value);
    } catch (error) {
      console.error(`[IDB Storage] Failed to write ${name}:`, error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await del(name);
    } catch (error) {
      console.error(`[IDB Storage] Failed to remove ${name}:`, error);
    }
  },
};
